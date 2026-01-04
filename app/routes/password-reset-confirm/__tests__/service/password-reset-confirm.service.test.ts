// パスワードリセット確認サービスのテスト
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// モック変数を hoisted で定義
const {
  mockFindByTokenWithUser,
  mockFindByToken,
  mockUpdatePasswordAndMarkTokenUsed,
  mockHashPassword,
} = vi.hoisted(() => ({
  mockFindByTokenWithUser: vi.fn(),
  mockFindByToken: vi.fn(),
  mockUpdatePasswordAndMarkTokenUsed: vi.fn(),
  mockHashPassword: vi.fn(),
}));

// リポジトリをモック
vi.mock("../../repository/password-reset-token.repository", () => ({
  findByTokenWithUser: mockFindByTokenWithUser,
  findByToken: mockFindByToken,
  updatePasswordAndMarkTokenUsed: mockUpdatePasswordAndMarkTokenUsed,
}));

// パスワードハッシュをモック
vi.mock("~/shared/lib/password.server", () => ({
  hashPassword: mockHashPassword,
}));

// テスト対象
import {
  validateToken,
  resetPassword,
} from "../../service/password-reset-confirm.service";

// エラーメッセージ
import { ERROR_MESSAGES } from "../../errorMessage";

describe("password-reset-confirm.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 日時を固定
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("validateToken", () => {
    const mockToken = {
      id: "token-123",
      token: "valid-token",
      userId: "user-123",
      expiresAt: new Date("2025-01-01T01:00:00.000Z"), // 1時間後
      usedAt: null,
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      user: { email: "test@example.com" },
    };

    it("正常系: 有効なトークンで success: true と email を返す", async () => {
      mockFindByTokenWithUser.mockResolvedValue(mockToken);

      const result = await validateToken("valid-token");

      expect(result).toEqual({
        success: true,
        data: { email: "test@example.com" },
      });
      expect(mockFindByTokenWithUser).toHaveBeenCalledWith("valid-token");
    });

    it("異常系: トークンが undefined の場合、エラーを返す", async () => {
      const result = await validateToken(undefined);

      expect(result).toEqual({
        success: false,
        type: "token",
        message: ERROR_MESSAGES.token.invalid,
      });
      expect(mockFindByTokenWithUser).not.toHaveBeenCalled();
    });

    it("異常系: トークンが見つからない場合、エラーを返す", async () => {
      mockFindByTokenWithUser.mockResolvedValue(null);

      const result = await validateToken("unknown-token");

      expect(result).toEqual({
        success: false,
        type: "token",
        message: ERROR_MESSAGES.token.invalid,
      });
    });

    it("異常系: トークンが既に使用済みの場合、エラーを返す", async () => {
      mockFindByTokenWithUser.mockResolvedValue({
        ...mockToken,
        usedAt: new Date("2024-12-31T23:00:00.000Z"),
      });

      const result = await validateToken("used-token");

      expect(result).toEqual({
        success: false,
        type: "token",
        message: ERROR_MESSAGES.token.used,
      });
    });

    it("異常系: トークンの有効期限が切れている場合、エラーを返す", async () => {
      mockFindByTokenWithUser.mockResolvedValue({
        ...mockToken,
        expiresAt: new Date("2024-12-31T23:00:00.000Z"), // 過去
      });

      const result = await validateToken("expired-token");

      expect(result).toEqual({
        success: false,
        type: "token",
        message: ERROR_MESSAGES.token.expired,
      });
    });
  });

  describe("resetPassword", () => {
    const validInput = {
      password: "newPassword123",
      passwordConfirm: "newPassword123",
    };

    const mockToken = {
      id: "token-123",
      token: "valid-token",
      userId: "user-123",
      expiresAt: new Date("2025-01-01T01:00:00.000Z"),
      usedAt: null,
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    };

    // バリデーションの詳細テストは schema.test.ts で行う
    describe("バリデーションエラー", () => {
      it("不正な入力の場合、validation タイプのエラーを返す", async () => {
        const result = await resetPassword("valid-token", {
          password: "",
          passwordConfirm: "",
        });

        expect(result.success).toBe(false);
        if (!result.success && result.type === "validation") {
          expect(result.errors).toBeDefined();
        }
        expect(mockFindByToken).not.toHaveBeenCalled();
      });
    });

    describe("トークンエラー", () => {
      it("異常系: トークンが undefined の場合、token エラーを返す", async () => {
        const result = await resetPassword(undefined, validInput);

        expect(result).toEqual({
          success: false,
          type: "token",
          message: ERROR_MESSAGES.token.invalid,
        });
      });

      it("異常系: トークンが見つからない場合、token エラーを返す", async () => {
        mockFindByToken.mockResolvedValue(null);

        const result = await resetPassword("unknown-token", validInput);

        expect(result).toEqual({
          success: false,
          type: "token",
          message: ERROR_MESSAGES.token.invalid,
        });
      });

      it("異常系: トークンが既に使用済みの場合、token エラーを返す", async () => {
        mockFindByToken.mockResolvedValue({
          ...mockToken,
          usedAt: new Date("2024-12-31T23:00:00.000Z"),
        });

        const result = await resetPassword("used-token", validInput);

        expect(result).toEqual({
          success: false,
          type: "token",
          message: ERROR_MESSAGES.token.invalid,
        });
      });

      it("異常系: トークンの有効期限が切れている場合、token エラーを返す", async () => {
        mockFindByToken.mockResolvedValue({
          ...mockToken,
          expiresAt: new Date("2024-12-31T23:00:00.000Z"),
        });

        const result = await resetPassword("expired-token", validInput);

        expect(result).toEqual({
          success: false,
          type: "token",
          message: ERROR_MESSAGES.token.invalid,
        });
      });
    });

    describe("正常系", () => {
      it("有効な入力でパスワードをリセットする", async () => {
        mockFindByToken.mockResolvedValue(mockToken);
        mockHashPassword.mockResolvedValue("hashed-new-password");
        mockUpdatePasswordAndMarkTokenUsed.mockResolvedValue(undefined);

        const result = await resetPassword("valid-token", validInput);

        expect(result).toEqual({
          success: true,
          data: null,
        });
        expect(mockHashPassword).toHaveBeenCalledWith(validInput.password);
        expect(mockUpdatePasswordAndMarkTokenUsed).toHaveBeenCalledWith(
          mockToken.userId,
          mockToken.id,
          "hashed-new-password"
        );
      });
    });
  });
});
