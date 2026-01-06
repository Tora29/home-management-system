// パスワードリセット確認のスキーマテスト
import { describe, it, expect } from "vitest";

// テスト対象
import { resetPasswordSchema } from "../schema";

// 共有スキーマ
import {
  passwordResetTokenSchema,
  passwordResetTokenWithUserSchema,
} from "~/shared/schema/password-reset-token.schema";

// エラーメッセージ
import { AUTH_ERROR_MESSAGES } from "~/shared/errorMessage/auth";

describe("resetPasswordSchema", () => {
  describe("正常系", () => {
    it("有効なパスワードと確認が一致する場合、成功する", () => {
      const result = resetPasswordSchema.safeParse({
        password: "validPassword123",
        passwordConfirm: "validPassword123",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.password).toBe("validPassword123");
        expect(result.data.passwordConfirm).toBe("validPassword123");
      }
    });

    it("8文字ちょうどのパスワードで成功する", () => {
      const result = resetPasswordSchema.safeParse({
        password: "12345678",
        passwordConfirm: "12345678",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("異常系: パスワード", () => {
    it("パスワードが空の場合、required エラーを返す", () => {
      const result = resetPasswordSchema.safeParse({
        password: "",
        passwordConfirm: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.password).toContain(
          AUTH_ERROR_MESSAGES.password.required
        );
      }
    });

    it("パスワードが7文字の場合、minLength エラーを返す", () => {
      const result = resetPasswordSchema.safeParse({
        password: "1234567",
        passwordConfirm: "1234567",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.password).toContain(
          AUTH_ERROR_MESSAGES.password.minLength
        );
      }
    });
  });

  describe("異常系: パスワード確認", () => {
    it("パスワード確認が空の場合、required エラーを返す", () => {
      const result = resetPasswordSchema.safeParse({
        password: "validPassword123",
        passwordConfirm: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.passwordConfirm).toContain(
          AUTH_ERROR_MESSAGES.passwordConfirm.required
        );
      }
    });

    it("パスワードと確認が一致しない場合、mismatch エラーを返す", () => {
      const result = resetPasswordSchema.safeParse({
        password: "validPassword123",
        passwordConfirm: "differentPassword123",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.passwordConfirm).toContain(
          AUTH_ERROR_MESSAGES.passwordConfirm.mismatch
        );
      }
    });
  });
});

describe("passwordResetTokenSchema", () => {
  it("有効なトークンデータで成功する", () => {
    const now = new Date();
    const result = passwordResetTokenSchema.safeParse({
      id: "token-id-123",
      token: "reset-token-abc",
      userId: "user-id-456",
      expiresAt: now,
      usedAt: null,
      createdAt: now,
    });

    expect(result.success).toBe(true);
  });

  it("usedAt が Date の場合も成功する", () => {
    const now = new Date();
    const result = passwordResetTokenSchema.safeParse({
      id: "token-id-123",
      token: "reset-token-abc",
      userId: "user-id-456",
      expiresAt: now,
      usedAt: now,
      createdAt: now,
    });

    expect(result.success).toBe(true);
  });

  it("user オブジェクトを含む場合、WithUser スキーマで成功する", () => {
    const now = new Date();
    const result = passwordResetTokenWithUserSchema.safeParse({
      id: "token-id-123",
      token: "reset-token-abc",
      userId: "user-id-456",
      expiresAt: now,
      usedAt: null,
      createdAt: now,
      user: { email: "test@example.com" },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.user.email).toBe("test@example.com");
    }
  });

  it("必須フィールドが欠けている場合、エラーを返す", () => {
    const result = passwordResetTokenSchema.safeParse({
      id: "token-id-123",
      // token が欠けている
      userId: "user-id-456",
    });

    expect(result.success).toBe(false);
  });
});
