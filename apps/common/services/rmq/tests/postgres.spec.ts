import {
  POSTGRES_DX_PASS,
  POSTGRES_DX_USER,
  assertPostgresCredentialsForProduction,
  assertProdSecretStrength,
} from "@common/services/rmq/rmq.constants";

describe("postgres credentials", () => {
  describe("assertProdSecretStrength", () => {
    it("accepts long password different from user", () => {
      expect(() =>
        assertProdSecretStrength("strong_password_ok", "prod_user", "test")
      ).not.toThrow();
    });

    it("rejects short password", () => {
      expect(() =>
        assertProdSecretStrength("short", "prod_user", "test")
      ).toThrow(/at least 16/);
    });

    it("rejects password equal to user", () => {
      expect(() =>
        assertProdSecretStrength("same_user_and_pass", "same_user_and_pass", "test")
      ).toThrow(/must not equal username/);
    });
  });

  describe("assertPostgresCredentialsForProduction", () => {
    it("no-ops outside production", () => {
      expect(() =>
        assertPostgresCredentialsForProduction(
          POSTGRES_DX_USER,
          POSTGRES_DX_PASS,
          "development"
        )
      ).not.toThrow();
    });

    it("requires user and password in production", () => {
      expect(() =>
        assertPostgresCredentialsForProduction(undefined, undefined, "production")
      ).toThrow(/requires POSTGRES_USER/);
    });

    it("forbids root/root in production", () => {
      expect(() =>
        assertPostgresCredentialsForProduction("root", "root", "production")
      ).toThrow(/root/);
    });

    it("forbids DX credentials in production", () => {
      expect(() =>
        assertPostgresCredentialsForProduction(
          POSTGRES_DX_USER,
          POSTGRES_DX_PASS,
          "production"
        )
      ).toThrow(/DX/);
    });

    it("allows non-DX strong credentials in production", () => {
      expect(() =>
        assertPostgresCredentialsForProduction(
          "prod_user",
          "strong_password_ok",
          "production"
        )
      ).not.toThrow();
    });

    it("rejects short password in production", () => {
      expect(() =>
        assertPostgresCredentialsForProduction(
          "prod_user",
          "short_pass",
          "production"
        )
      ).toThrow(/at least 16/);
    });
  });
});
