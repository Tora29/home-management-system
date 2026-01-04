import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// createResetToken の引数の型
type CreateResetTokenInput = {
  token: string;
  userId: string;
  expiresAt: Date;
};

// モック変数を hoisted で定義
const { mockFindByEmail, mockRemoveUnusedByUserId, mockCreate } = vi.hoisted(
  () => ({
    mockFindByEmail: vi.fn(),
    mockRemoveUnusedByUserId: vi.fn(),
    mockCreate: vi.fn(),
  })
);

// リポジトリをモック
vi.mock("~/shared/repository/user.repository", () => ({
  findByEmail: mockFindByEmail,
}));

vi.mock("../../repository/password-reset-token.repository", () => ({
  removeUnusedByUserId: mockRemoveUnusedByUserId,
  create: mockCreate,
}));

// テスト対象
import { requestPasswordReset } from "../../service/password-reset.service";

describe("requestPasswordReset", () => {
  const baseUrl = "https://example.com";

  beforeEach(() => {
    vi.clearAllMocks();
    // 日時を固定
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // バリデーションの詳細テストは schema.test.ts で行う
  describe("バリデーション", () => {
    it("異常系: 不正な入力の場合、validation タイプのエラーを返す", async () => {
      const input = { email: "" };

      const result = await requestPasswordReset(input, baseUrl);

      expect(result.success).toBe(false);
      if (!result.success && result.type === "validation") {
        expect(result.errors).toBeDefined();
      }
    });
  });

  describe("ユーザーが存在しない場合", () => {
    it("正常系: ユーザーが存在しなくても成功を返す（セキュリティ対策）", async () => {
      const input = { email: "nonexistent@example.com" };
      mockFindByEmail.mockResolvedValue(null);

      const result = await requestPasswordReset(input, baseUrl);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.resetUrl).toBeNull();
      }
      // トークン作成処理は呼ばれない
      expect(mockRemoveUnusedByUserId).not.toHaveBeenCalled();
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("ユーザーが存在する場合", () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      passwordHash: "hashed-password",
      name: "Test User",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    };

    it("正常系: リセットURLを生成して返す", async () => {
      const input = { email: "test@example.com" };
      mockFindByEmail.mockResolvedValue(mockUser);
      mockRemoveUnusedByUserId.mockResolvedValue({ count: 0 });
      // mockCreate は create に渡された引数をそのまま返すように設定
      mockCreate.mockImplementation((data: CreateResetTokenInput) => ({
        id: "token-id",
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
        usedAt: null,
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
      }));

      const result = await requestPasswordReset(input, baseUrl);

      expect(result.success).toBe(true);
      if (result.success) {
        // URLが正しいベースURLで始まることを確認
        expect(result.data.resetUrl).toMatch(
          /^https:\/\/example\.com\/password-reset\/.+$/
        );
        // URLのトークン部分とcreateに渡されたトークンが一致することを確認
        const createCall = mockCreate.mock
          .calls[0]?.[0] as CreateResetTokenInput;
        expect(result.data.resetUrl).toBe(
          `${baseUrl}/password-reset/${createCall.token}`
        );
      }
    });

    it("正常系: 既存の未使用トークンを削除する", async () => {
      const input = { email: "test@example.com" };
      mockFindByEmail.mockResolvedValue(mockUser);
      mockRemoveUnusedByUserId.mockResolvedValue({ count: 2 });
      mockCreate.mockResolvedValue({
        id: "token-id",
        token: "generated-token",
        userId: mockUser.id,
        expiresAt: new Date("2025-01-01T01:00:00.000Z"),
        usedAt: null,
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
      });

      await requestPasswordReset(input, baseUrl);

      expect(mockRemoveUnusedByUserId).toHaveBeenCalledWith(mockUser.id);
    });

    it("正常系: トークンの有効期限は1時間後に設定される", async () => {
      const input = { email: "test@example.com" };
      mockFindByEmail.mockResolvedValue(mockUser);
      mockRemoveUnusedByUserId.mockResolvedValue({ count: 0 });
      mockCreate.mockResolvedValue({
        id: "token-id",
        token: "generated-token",
        userId: mockUser.id,
        expiresAt: new Date("2025-01-01T01:00:00.000Z"),
        usedAt: null,
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
      });

      await requestPasswordReset(input, baseUrl);

      // create が呼ばれたことを確認
      expect(mockCreate).toHaveBeenCalledWith({
        token: expect.any(String) as string,
        userId: mockUser.id,
        // 1時間後 = 2025-01-01T01:00:00.000Z
        expiresAt: new Date("2025-01-01T01:00:00.000Z"),
      });
    });

    it("正常系: 生成されたトークンは64文字のhex文字列", async () => {
      const input = { email: "test@example.com" };
      mockFindByEmail.mockResolvedValue(mockUser);
      mockRemoveUnusedByUserId.mockResolvedValue({ count: 0 });
      mockCreate.mockResolvedValue({
        id: "token-id",
        token: "generated-token",
        userId: mockUser.id,
        expiresAt: new Date("2025-01-01T01:00:00.000Z"),
        usedAt: null,
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
      });

      await requestPasswordReset(input, baseUrl);

      const createCall = mockCreate.mock.calls[0]?.[0] as CreateResetTokenInput;
      // randomBytes(32).toString('hex') は64文字のhex文字列を生成
      expect(createCall.token).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});
