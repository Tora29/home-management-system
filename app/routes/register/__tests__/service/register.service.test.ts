import { describe, it, expect, vi, beforeEach } from "vitest";

// モック対象のモジュール
vi.mock("../../repository/user.repository", () => ({
  create: vi.fn(),
}));

vi.mock("~/shared/repository/user.repository", () => ({
  findByEmail: vi.fn(),
}));

vi.mock("~/shared/lib/password.server", () => ({
  hashPassword: vi.fn(),
}));

// モックをインポート（vi.mock の後にインポート）
import * as userRepository from "../../repository/user.repository";
import { findByEmail } from "~/shared/repository/user.repository";
import { hashPassword } from "~/shared/lib/password.server";

// テスト対象
import { registerUser } from "../../service/register.service";

// エラーメッセージ
import { ERROR_MESSAGES } from "../../errorMessage";

describe("registerUser", () => {
  // 有効な入力データ
  const validInput = {
    email: "test@example.com",
    password: "password123",
    passwordConfirm: "password123",
    name: "テストユーザー",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("正常系", () => {
    // モック用のユーザーデータ
    const mockUser = {
      id: "user-123",
      email: validInput.email,
      passwordHash: "hashed-password",
      name: "テストユーザー",
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    };

    it("有効な入力でユーザーを作成し、userIdを返す", async () => {
      // Arrange
      vi.mocked(findByEmail).mockResolvedValue(null);
      vi.mocked(hashPassword).mockResolvedValue("hashed-password");
      vi.mocked(userRepository.create).mockResolvedValue(mockUser);

      // Act
      const result = await registerUser(validInput);

      // Assert
      expect(result).toEqual({
        success: true,
        data: { userId: "user-123" },
      });

      expect(findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(hashPassword).toHaveBeenCalledWith(validInput.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: validInput.email,
        passwordHash: "hashed-password",
        name: validInput.name,
      });
    });

    it("名前が空の場合、nullとして保存される", async () => {
      // Arrange
      const inputWithoutName = { ...validInput, name: "" };
      const mockUserWithNullName = { ...mockUser, name: null };
      vi.mocked(findByEmail).mockResolvedValue(null);
      vi.mocked(hashPassword).mockResolvedValue("hashed-password");
      vi.mocked(userRepository.create).mockResolvedValue(mockUserWithNullName);

      // Act
      await registerUser(inputWithoutName);

      // Assert
      expect(userRepository.create).toHaveBeenCalledWith({
        email: validInput.email,
        passwordHash: "hashed-password",
        name: null,
      });
    });
  });

  // バリデーションの詳細テストは schema.test.ts で行う
  describe("バリデーションエラー", () => {
    it("不正な入力の場合、validation タイプのエラーを返す", async () => {
      // Arrange
      const input = { ...validInput, email: "" };

      // Act
      const result = await registerUser(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success && result.type === "validation") {
        expect(result.errors).toBeDefined();
      }
      expect(findByEmail).not.toHaveBeenCalled();
    });
  });

  describe("重複エラー", () => {
    it("メールアドレスが既に登録されている場合、重複エラーを返す", async () => {
      // Arrange
      const existingUser = {
        id: "existing-user",
        email: validInput.email,
        passwordHash: "hash",
        name: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(findByEmail).mockResolvedValue(existingUser);

      // Act
      const result = await registerUser(validInput);

      // Assert
      expect(result).toEqual({
        success: false,
        type: "duplicate",
        errors: { email: [ERROR_MESSAGES.email.duplicate] },
      });
      expect(hashPassword).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("エッジケース", () => {
    it("入力値がundefinedの場合、バリデーションエラーを返す", async () => {
      // Arrange
      const input = {
        email: undefined,
        password: undefined,
        passwordConfirm: undefined,
        name: undefined,
      };

      // Act
      const result = await registerUser(input as unknown as typeof validInput);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.type).toBe("validation");
      }
    });
  });
});
