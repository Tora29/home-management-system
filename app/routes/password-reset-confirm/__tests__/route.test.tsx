// パスワードリセット確認ルートのテスト
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";

// テスト用ヘルパー
import {
  createActionArgs,
  createLoaderArgs,
  createFormData,
  createPostRequest,
  createGetRequest,
  asDataResponse,
} from "~/shared/test-utils/route-test-helpers";

// サービスのモック
vi.mock("../service/password-reset-confirm.service", () => ({
  validateToken: vi.fn(),
  resetPassword: vi.fn(),
}));

// モックをインポート
import * as passwordResetConfirmService from "../service/password-reset-confirm.service";

// 型定義
import type { Route } from "../+types/route";

// テスト対象
import PasswordResetConfirmPage, { action, loader, meta } from "../route";

describe("password-reset-confirm route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("meta", () => {
    it("正しいタイトルと説明を返す", () => {
      const metaResult = meta({} as Parameters<typeof meta>[0]);

      expect(metaResult).toEqual([
        { title: "新しいパスワードを設定 - Home Management System" },
        { name: "description", content: "新しいパスワードを設定します" },
      ]);
    });
  });

  describe("loader", () => {
    it("トークンが有効な場合、valid と email を返す", async () => {
      expect.assertions(2);

      vi.mocked(passwordResetConfirmService.validateToken).mockResolvedValue({
        success: true,
        data: { email: "test@example.com" },
      });

      const request = createGetRequest(
        "http://localhost/password-reset/token123"
      );

      const result = await loader(
        createLoaderArgs({
          request,
          params: { token: "token123" },
        }) as Parameters<typeof loader>[0]
      );

      expect(passwordResetConfirmService.validateToken).toHaveBeenCalledWith(
        "token123"
      );
      expect(result).toEqual({
        success: true,
        data: { email: "test@example.com" },
      });
    });

    it("トークンが無効な場合、success: false とエラーメッセージを返す", async () => {
      expect.assertions(1);

      vi.mocked(passwordResetConfirmService.validateToken).mockResolvedValue({
        success: false,
        type: "token",
        message: "トークンが無効または期限切れです",
      });

      const request = createGetRequest(
        "http://localhost/password-reset/invalid-token"
      );

      const result = await loader(
        createLoaderArgs({
          request,
          params: { token: "invalid-token" },
        }) as Parameters<typeof loader>[0]
      );

      expect(result).toEqual({
        success: false,
        type: "token",
        message: "トークンが無効または期限切れです",
      });
    });
  });

  describe("action", () => {
    it("バリデーションエラー時にエラーを含むレスポンスを返す", async () => {
      expect.assertions(2);

      vi.mocked(passwordResetConfirmService.resetPassword).mockResolvedValue({
        success: false,
        type: "validation",
        errors: { password: ["パスワードを入力してください"] },
      });

      const formData = createFormData({
        password: "",
        passwordConfirm: "",
      });
      const request = createPostRequest(
        "http://localhost/password-reset/token123",
        formData
      );

      const result = asDataResponse<{ errors: { password: string[] } }>(
        await action(
          createActionArgs({
            request,
            params: { token: "token123" },
          }) as Parameters<typeof action>[0]
        )
      );

      expect(result.init.status).toBe(400);
      expect(result.data.errors.password).toContain(
        "パスワードを入力してください"
      );
    });

    it("トークンエラー時にトークンエラーメッセージを返す", async () => {
      expect.assertions(2);

      vi.mocked(passwordResetConfirmService.resetPassword).mockResolvedValue({
        success: false,
        type: "token",
        message: "トークンが無効または期限切れです",
      });

      const formData = createFormData({
        password: "newpassword123",
        passwordConfirm: "newpassword123",
      });
      const request = createPostRequest(
        "http://localhost/password-reset/expired-token",
        formData
      );

      const result = asDataResponse<{ tokenError: string }>(
        await action(
          createActionArgs({
            request,
            params: { token: "expired-token" },
          }) as Parameters<typeof action>[0]
        )
      );

      expect(result.init.status).toBe(400);
      expect(result.data.tokenError).toBe("トークンが無効または期限切れです");
    });

    it("成功時にログインページへリダイレクトする", async () => {
      expect.assertions(3);

      vi.mocked(passwordResetConfirmService.resetPassword).mockResolvedValue({
        success: true,
        data: null,
      });

      const formData = createFormData({
        password: "newpassword123",
        passwordConfirm: "newpassword123",
      });
      const request = createPostRequest(
        "http://localhost/password-reset/valid-token",
        formData
      );

      const result = await action(
        createActionArgs({
          request,
          params: { token: "valid-token" },
        }) as Parameters<typeof action>[0]
      );

      expect(result).toBeDefined();
      if (result instanceof Response) {
        expect(result.status).toBe(302);
        expect(result.headers.get("Location")).toBe("/login?reset=success");
      }
    });
  });

  // PasswordResetConfirmPage は loaderData と useActionData() を使用するため、
  // Router コンテキストが必要。createMemoryRouter でテストする。
  describe("PasswordResetConfirmPage コンポーネント", () => {
    type LoaderData =
      | { success: true; data: { email: string } }
      | { success: false; type: "token"; message: string };

    function renderWithRouter(
      loaderData: LoaderData,
      initialEntries: string[] = ["/password-reset/token123"]
    ) {
      const routes = [
        {
          path: "/password-reset/:token",
          element: (
            <PasswordResetConfirmPage
              {...({ loaderData } as unknown as Route.ComponentProps)}
            />
          ),
          loader: () => loaderData,
        },
        {
          path: "/login",
          element: <div>Login Page</div>,
        },
        {
          path: "/password-reset",
          element: <div>Password Reset Page</div>,
        },
      ];

      const router = createMemoryRouter(routes, {
        initialEntries,
      });

      return render(<RouterProvider router={router} />);
    }

    describe("トークンが有効な場合", () => {
      it("タイトルが表示される", async () => {
        expect.assertions(1);

        renderWithRouter({
          success: true,
          data: { email: "test@example.com" },
        });

        expect(
          await screen.findByRole("heading", {
            name: "新しいパスワードを設定",
            level: 1,
          })
        ).toBeInTheDocument();
      });

      it("メールアドレスを含む説明文が表示される", async () => {
        expect.assertions(1);

        renderWithRouter({
          success: true,
          data: { email: "test@example.com" },
        });

        expect(
          await screen.findByText("test@example.com のパスワードを再設定します")
        ).toBeInTheDocument();
      });

      it("パスワード入力フォームが表示される", async () => {
        expect.assertions(3);

        renderWithRouter({
          success: true,
          data: { email: "test@example.com" },
        });

        expect(
          await screen.findByLabelText("新しいパスワード")
        ).toBeInTheDocument();
        expect(
          await screen.findByLabelText("パスワード（確認）")
        ).toBeInTheDocument();
        expect(
          await screen.findByRole("button", { name: "パスワードを変更" })
        ).toBeInTheDocument();
      });
    });

    describe("トークンが無効な場合", () => {
      it("エラータイトルが表示される", async () => {
        expect.assertions(1);

        renderWithRouter({
          success: false,
          type: "token",
          message: "トークンが無効または期限切れです",
        });

        expect(
          await screen.findByRole("heading", { name: "エラー", level: 1 })
        ).toBeInTheDocument();
      });

      it("エラーメッセージが表示される", async () => {
        expect.assertions(1);

        renderWithRouter({
          success: false,
          type: "token",
          message: "トークンが無効または期限切れです",
        });

        expect(
          await screen.findByText("トークンが無効または期限切れです")
        ).toBeInTheDocument();
      });

      it("再度リセットを申請リンクが表示される", async () => {
        expect.assertions(2);

        renderWithRouter({
          success: false,
          type: "token",
          message: "トークンが無効または期限切れです",
        });

        const resetLink = await screen.findByRole("link", {
          name: "再度リセットを申請",
        });
        expect(resetLink).toBeInTheDocument();
        expect(resetLink).toHaveAttribute("href", "/password-reset");
      });
    });
  });
});
