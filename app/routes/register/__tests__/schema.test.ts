// 登録スキーマのテスト
import { describe, it, expect } from "vitest";

// テスト対象
import { registerSchema } from "../schema";

// エラーメッセージ
import { AUTH_ERROR_MESSAGES } from "~/shared/errorMessage/auth";
import { ERROR_MESSAGES } from "../errorMessage";

describe("registerSchema", () => {
  // 有効な入力データ
  const validInput = {
    email: "test@example.com",
    password: "password123",
    passwordConfirm: "password123",
    name: "テストユーザー",
  };

  describe("正常系", () => {
    it("有効な入力データでパースに成功する", () => {
      const result = registerSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validInput);
      }
    });

    it("名前が省略されてもパースに成功する", () => {
      const input = {
        email: "test@example.com",
        password: "password123",
        passwordConfirm: "password123",
      };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it("名前が空文字でもパースに成功する", () => {
      const input = {
        ...validInput,
        name: "",
      };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it("パスワードが8文字ちょうどでもパースに成功する", () => {
      const input = {
        ...validInput,
        password: "12345678",
        passwordConfirm: "12345678",
      };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(true);
    });
  });

  describe("email のバリデーション", () => {
    it("空文字列の場合、必須エラーを返す", () => {
      const input = { ...validInput, email: "" };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailErrors = result.error.flatten().fieldErrors.email;
        expect(emailErrors).toContain(AUTH_ERROR_MESSAGES.email.required);
      }
    });

    it("不正な形式の場合、形式エラーを返す", () => {
      const input = { ...validInput, email: "invalid-email" };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailErrors = result.error.flatten().fieldErrors.email;
        expect(emailErrors).toContain(AUTH_ERROR_MESSAGES.email.invalid);
      }
    });
  });

  describe("password のバリデーション", () => {
    it("空文字列の場合、必須エラーを返す", () => {
      const input = { ...validInput, password: "", passwordConfirm: "" };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordErrors = result.error.flatten().fieldErrors.password;
        expect(passwordErrors).toContain(AUTH_ERROR_MESSAGES.password.required);
      }
    });

    it("8文字未満の場合、最小文字数エラーを返す", () => {
      const input = {
        ...validInput,
        password: "short",
        passwordConfirm: "short",
      };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordErrors = result.error.flatten().fieldErrors.password;
        expect(passwordErrors).toContain(
          AUTH_ERROR_MESSAGES.password.minLength
        );
      }
    });
  });

  describe("passwordConfirm のバリデーション", () => {
    it("空文字列の場合、必須エラーを返す", () => {
      const input = { ...validInput, passwordConfirm: "" };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors.passwordConfirm;
        expect(errors).toContain(AUTH_ERROR_MESSAGES.passwordConfirm.required);
      }
    });

    it("パスワードと一致しない場合、不一致エラーを返す", () => {
      const input = { ...validInput, passwordConfirm: "differentPassword" };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors.passwordConfirm;
        expect(errors).toContain(AUTH_ERROR_MESSAGES.passwordConfirm.mismatch);
      }
    });
  });

  describe("name のバリデーション", () => {
    it("50文字を超える場合、最大文字数エラーを返す", () => {
      const input = { ...validInput, name: "あ".repeat(51) };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameErrors = result.error.flatten().fieldErrors.name;
        expect(nameErrors).toContain(ERROR_MESSAGES.name.maxLength);
      }
    });

    it("50文字ちょうどの場合、パースに成功する", () => {
      const input = { ...validInput, name: "あ".repeat(50) };

      const result = registerSchema.safeParse(input);

      expect(result.success).toBe(true);
    });
  });
});
