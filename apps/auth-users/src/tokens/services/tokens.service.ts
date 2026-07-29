import type { TAuthUsersRpcAuthResponse } from "@common/types/response/auth";
import type { Transaction } from "sequelize";

import { createHash, randomBytes } from "crypto";

import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";

import { REFRESH_TOKEN_TTL_MS } from "../../config/jwt.config";
import { toAuthorizedUserResponse } from "../../users/mappers";
import { User } from "../../users/models";
import { RefreshToken } from "../models";

const REFRESH_TOKEN_BYTES = 64;

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(RefreshToken)
    private readonly refreshTokenRepository: typeof RefreshToken,
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly jwtService: JwtService
  ) {}

  async createTokenPair(user: User): Promise<TAuthUsersRpcAuthResponse> {
    const accessToken = await this.signAccessToken(user);
    const refreshToken = this.generateRefreshToken();
    await this.storeRefreshToken(user.id, refreshToken);
    return {
      user: toAuthorizedUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(rawRefreshToken: string): Promise<TAuthUsersRpcAuthResponse> {
    const tokenHash = this.hashToken(rawRefreshToken);
    const sequelize = this.refreshTokenRepository.sequelize;

    if (!sequelize) {
      throw new UnauthorizedException({
        message: "Недействительный refresh token",
      });
    }

    return sequelize.transaction(async (transaction) => {
      const stored = await this.refreshTokenRepository.findOne({
        where: { tokenHash },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!stored) {
        throw new UnauthorizedException({
          message: "Недействительный refresh token",
        });
      }

      if (stored.revokedAt) {
        await this.revokeAllUserTokens(stored.userId, transaction);
        throw new UnauthorizedException({
          message: "Обнаружено повторное использование refresh token",
        });
      }

      if (stored.expiresAt.getTime() < Date.now()) {
        throw new UnauthorizedException({
          message: "Refresh token истёк",
        });
      }

      const user = await this.userRepository.findOne({
        where: { id: stored.userId },
        include: { all: true },
        transaction,
      });

      if (!user) {
        throw new UnauthorizedException({
          message: "Пользователь не найден",
        });
      }

      const newRefreshToken = this.generateRefreshToken();
      const newHash = this.hashToken(newRefreshToken);

      await stored.update(
        {
          revokedAt: new Date(),
          replacedByHash: newHash,
        },
        { transaction }
      );

      await this.refreshTokenRepository.create(
        {
          userId: user.id,
          tokenHash: newHash,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
        { transaction }
      );

      const accessToken = await this.signAccessToken(user);

      return {
        user: toAuthorizedUserResponse(user),
        accessToken,
        refreshToken: newRefreshToken,
      };
    });
  }

  async revoke(rawRefreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
    });
    if (!stored || stored.revokedAt) {
      return;
    }
    await stored.update({ revokedAt: new Date() });
  }

  private async signAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }

  private generateRefreshToken(): string {
    return randomBytes(REFRESH_TOKEN_BYTES).toString("base64url");
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private async storeRefreshToken(
    userId: number,
    rawToken: string
  ): Promise<void> {
    await this.refreshTokenRepository.create({
      userId,
      tokenHash: this.hashToken(rawToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });
  }

  private async revokeAllUserTokens(
    userId: number,
    transaction?: Transaction
  ): Promise<void> {
    await this.refreshTokenRepository.update(
      { revokedAt: new Date() },
      { where: { userId, revokedAt: null }, transaction }
    );
  }
}
