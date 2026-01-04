// ログインスキーマのテスト
import { describe, it, expect } from "vitest";

// テスト対象
import { loginSchema, userSchema } from "../schema";

// エラーメッセージ
import { AUTH_ERROR_MESSAGES } from "~/shared/errorMessage/auth";

describe("loginSchema", () => {
  describe("正常系", () => {
    it("有効なメールアドレスとパスワードでパースに成功する", () => {
      const input = {
        email: "test@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(input);
      }
    });

    it("パスワードが8文字ちょうどでもパースに成功する", () => {
      const input = {
        email: "test@example.com",
        password: "12345678",
      };

      const result = loginSchema.safeParse(input);

      expect(result.success).toBe(true);
    });
  });

  describe("email のバリデーション", () => {
    it("空文字列の場合、必須エラーを返す", () => {
      const input = {
        email: "",
        password: "password123",
      };

      const result = loginSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailErrors = result.error.flatten().fieldErrors.email;
        expect(emailErrors).toContain(AUTH_ERROR_MESSAGES.email.required);
      }
    });

    it("不正な形式の場合、形式エラーを返す", () => {
      const input = {
        email: "invalid-email",
        password: "password123",
      };

      const result = loginSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailErrors = result.error.flatten().fieldErrors.email;
        expect(emailErrors).toContain(AUTH_ERROR_MESSAGES.email.invalid);
      }
    });

    it("@がない場合、形式エラーを返す", () => {
      const input = {
        email: "testexample.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(input);

      expect(result.success).toBe(false);
    });
  });

  describe("password のバリデーション", () => {
    it("空文字列の場合、必須エラーを返す", () => {
      const input = {
        email: "test@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordErrors = result.error.flatten().fieldErrors.password;
        expect(passwordErrors).toContain(AUTH_ERROR_MESSAGES.password.required);
      }
    });

    it("8文字未満の場合、最小文字数エラーを返す", () => {
      const input = {
        email: "test@example.com",
        password: "short",
      };

      const result = loginSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordErrors = result.error.flatten().fieldErrors.password;
        expect(passwordErrors).toContain(
          AUTH_ERROR_MESSAGES.password.minLength
        );
      }
    });

    it("7文字の場合、最小文字数エラーを返す", () => {
      const input = {
        email: "test@example.com",
        password: "1234567",
      };

      const result = loginSchema.safeParse(input);

      expect(result.success).toBe(false);
    });
  });
});

describe("userSchema", () => {
  describe("正常系", () => {
    it("有効なユーザーデータでパースに成功する", () => {
      const input = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: "hashedPassword",
        name: "Test User",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      };

      const result = userSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(input);
      }
    });

    it("name が null でもパースに成功する", () => {
      const input = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: "hashedPassword",
        name: null,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      };

      const result = userSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBeNull();
      }
    });
  });

  describe("異常系", () => {
    it("id が欠けている場合、パースに失敗する", () => {
      const input = {
        email: "test@example.com",
        passwordHash: "hashedPassword",
        name: "Test User",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      };

      const result = userSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it("email が不正な形式の場合、パースに失敗する", () => {
      const input = {
        id: "user-123",
        email: "invalid-email",
        passwordHash: "hashedPassword",
        name: "Test User",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      };

      const result = userSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it("createdAt が Date でない場合、パースに失敗する", () => {
      const input = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: "hashedPassword",
        name: "Test User",
        createdAt: "2025-01-01", // 文字列
        updatedAt: new Date("2025-01-01"),
      };

      const result = userSchema.safeParse(input);

      expect(result.success).toBe(false);
    });
  });
});
