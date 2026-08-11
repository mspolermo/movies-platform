import {
  RABBITMQ_DX_PASS,
  RABBITMQ_DX_USER,
  RABBITMQ_URL,
} from "@common/services/rmq/rmq.constants";
import {
  assertRmqCredentialsForProduction,
  resolveRmqUrl,
  selectRmqUrlOrDxDefault,
} from "@common/services/rmq/rmq.factory";

describe("rmq.factory", () => {
  describe("resolveRmqUrl", () => {
    it("uses URL with userinfo as-is", () => {
      expect(
        resolveRmqUrl({ url: "amqp://prod:secret@broker:5672" })
      ).toBe("amqp://prod:secret@broker:5672");
    });

    it("injects USER/PASS into URL without userinfo", () => {
      expect(
        resolveRmqUrl({
          url: "amqp://rabbitmq:5672",
          user: "u",
          pass: "p@ss",
        })
      ).toBe("amqp://u:p%40ss@rabbitmq:5672");
    });

    it("builds URL from USER/PASS only", () => {
      expect(resolveRmqUrl({ user: "u", pass: "p", host: "rmq:5672" })).toBe(
        "amqp://u:p@rmq:5672"
      );
    });

    it("throws when nothing configured", () => {
      expect(() => resolveRmqUrl({})).toThrow(/required/);
    });
  });

  describe("selectRmqUrlOrDxDefault", () => {
    it("prefers configured URL", () => {
      expect(
        selectRmqUrlOrDxDefault({
          configuredUrl: "amqp://a:b@h:5672",
          nodeEnv: "development",
        })
      ).toBe("amqp://a:b@h:5672");
    });

    it("returns undefined when USER+PASS set (build later)", () => {
      expect(
        selectRmqUrlOrDxDefault({
          configuredUrl: "",
          user: "u",
          pass: "p",
          nodeEnv: "development",
        })
      ).toBeUndefined();
    });

    it("uses DX default outside production when empty", () => {
      expect(
        selectRmqUrlOrDxDefault({
          configuredUrl: "",
          nodeEnv: "development",
        })
      ).toBe(RABBITMQ_URL);
    });

    it("does not fall back to DX in production", () => {
      expect(
        selectRmqUrlOrDxDefault({
          configuredUrl: "",
          nodeEnv: "production",
        })
      ).toBeUndefined();
    });
  });

  describe("assertRmqCredentialsForProduction", () => {
    it("no-ops outside production", () => {
      expect(() =>
        assertRmqCredentialsForProduction(RABBITMQ_URL, "development")
      ).not.toThrow();
    });

    it("forbids guest in production", () => {
      expect(() =>
        assertRmqCredentialsForProduction(
          "amqp://guest:guest@localhost:5672",
          "production"
        )
      ).toThrow(/guest/);
    });

    it("forbids DX credentials in production", () => {
      expect(() =>
        assertRmqCredentialsForProduction(RABBITMQ_URL, "production")
      ).toThrow(/DX/);

      expect(() =>
        assertRmqCredentialsForProduction(
          `amqp://${RABBITMQ_DX_USER}:${RABBITMQ_DX_PASS}@rabbitmq:5672`,
          "production"
        )
      ).toThrow(/DX/);
    });

    it("allows non-DX credentials in production", () => {
      expect(() =>
        assertRmqCredentialsForProduction(
          "amqp://prod_user:strong_password_ok@rabbitmq:5672",
          "production"
        )
      ).not.toThrow();
    });

    it("forbids short password in production", () => {
      expect(() =>
        assertRmqCredentialsForProduction(
          "amqp://prod_user:short_pass@rabbitmq:5672",
          "production"
        )
      ).toThrow(/at least 16/);
    });

    it("forbids password equal to user in production", () => {
      expect(() =>
        assertRmqCredentialsForProduction(
          "amqp://same_user_and_pass:same_user_and_pass@rabbitmq:5672",
          "production"
        )
      ).toThrow(/must not equal username/);
    });

    it("requires credentials in production", () => {
      expect(() =>
        assertRmqCredentialsForProduction("amqp://rabbitmq:5672", "production")
      ).toThrow(/requires credentials/);
    });
  });
});
