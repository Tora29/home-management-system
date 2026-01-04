// 認証サービスのテスト
import { describe, it, expect, vi, beforeEach } from "vitest";

// モジュールのモック（vi.mock はファイル先頭に巻き上げられる）
vi.mock("~/shared/lib/password.server", () => ({
  verifyPassword: vi.fn(),
}));

vi.mock("~/shared/repository/user.repository", () => ({
  findByEmail: vi.fn(),
}));

// モックをインポート
import { verifyPassword } from "~/shared/lib/password.server";
import { findByEmail } from "~/shared/repository/user.repository";

// テスト対象
import { login } from "../../service/auth.service";

// エラーメッセージ
import { ERROR_MESSAGES } from "../../errorMessage";

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    // テスト用のモックユーザー
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      passwordHash: "hashedPassword123",
      name: "Test User",
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    };

    // バリデーションの詳細テストは schema.test.ts で行う
    describe("バリデーションエラー", () => {
      it("不正な入力の場合、validation タイプのエラーを返す", async () => {
        const result = await login({
          email: "",
          password: "",
        });

        expect(result.success).toBe(false);
        if (!result.success && result.type === "validation") {
          expect(result.errors).toBeDefined();
        }
      });
    });

    describe("認証エラー", () => {
      it("ユーザーが見つからない場合、認証エラーを返す", async () => {
        vi.mocked(findByEmail).mockResolvedValue(null);

        const result = await login({
          email: "notfound@example.com",
          password: "password123",
        });

        expect(result).toEqual({
          success: false,
          type: "auth",
          message: ERROR_MESSAGES.auth.invalidCredentials,
        });
        expect(findByEmail).toHaveBeenCalledWith("notfound@example.com");
      });

      it("パスワードが一致しない場合、認証エラーを返す", async () => {
        vi.mocked(findByEmail).mockResolvedValue(mockUser);
        vi.mocked(verifyPassword).mockResolvedValue(false);

        const result = await login({
          email: "test@example.com",
          password: "wrongpassword",
        });

        expect(result).toEqual({
          success: false,
          type: "auth",
          message: ERROR_MESSAGES.auth.invalidCredentials,
        });
        expect(verifyPassword).toHaveBeenCalledWith(
          "wrongpassword",
          mockUser.passwordHash
        );
      });
    });

    describe("正常系", () => {
      it("正しい認証情報でログインに成功する", async () => {
        vi.mocked(findByEmail).mockResolvedValue(mockUser);
        vi.mocked(verifyPassword).mockResolvedValue(true);

        const result = await login({
          email: "test@example.com",
          password: "password123",
        });

        expect(result).toEqual({
          success: true,
          data: {
            user: {
              id: mockUser.id,
              email: mockUser.email,
              passwordHash: mockUser.passwordHash,
              name: mockUser.name,
              createdAt: mockUser.createdAt,
              updatedAt: mockUser.updatedAt,
            },
          },
        });
      });

      it("name が null のユーザーでもログインに成功する", async () => {
        const userWithNullName = { ...mockUser, name: null };
        vi.mocked(findByEmail).mockResolvedValue(userWithNullName);
        vi.mocked(verifyPassword).mockResolvedValue(true);

        const result = await login({
          email: "test@example.com",
          password: "password123",
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.user.name).toBeNull();
        }
      });
    });

    describe("異常系", () => {
      it("DB から取得したユーザーデータが不正な場合、エラーをスローする", async () => {
        // 不正な形式のユーザーデータ（id が数値）
        const invalidUser = { ...mockUser, id: 123 };
        vi.mocked(findByEmail).mockResolvedValue(
          invalidUser as unknown as typeof mockUser
        );
        vi.mocked(verifyPassword).mockResolvedValue(true);

        // console.error の出力を抑制
        const consoleSpy = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});

        await expect(
          login({
            email: "test@example.com",
            password: "password123",
          })
        ).rejects.toThrow("データ形式が不正です");

        consoleSpy.mockRestore();
      });
    });
  });
});
