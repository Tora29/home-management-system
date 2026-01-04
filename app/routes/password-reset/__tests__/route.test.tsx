// パスワードリセットルートのテスト
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";

// テスト用ヘルパー
import {
  createActionArgs,
  createFormData,
  createPostRequest,
  asDataResponse,
} from "~/shared/test-utils/route-test-helpers";

// サービスのモック
vi.mock("../service/password-reset.service", () => ({
  requestPasswordReset: vi.fn(),
}));

// モックをインポート
import * as passwordResetService from "../service/password-reset.service";

// 型定義
import type { Route } from "../+types/route";

// テスト対象
import PasswordResetRequestPage, { action, meta } from "../route";

describe("password-reset route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("meta", () => {
    it("正しいタイトルと説明を返す", () => {
      const metaResult = meta({} as Parameters<typeof meta>[0]);

      expect(metaResult).toEqual([
        { title: "パスワードリセット - Home Management System" },
        {
          name: "description",
          content: "パスワードリセット用のリンクをメールで送信します",
        },
      ]);
    });
  });

  describe("action", () => {
    it("バリデーションエラー時にエラーを含むレスポンスを返す", async () => {
      expect.assertions(2);

      vi.mocked(passwordResetService.requestPasswordReset).mockResolvedValue({
        success: false,
        type: "validation",
        errors: { email: ["メールアドレスを入力してください"] },
      });

      const formData = createFormData({ email: "" });
      const request = createPostRequest(
        "http://localhost/password-reset",
        formData
      );

      const result = asDataResponse<{ errors: { email: string[] } }>(
        await action(
          createActionArgs({ request, params: {} }) as Parameters<
            typeof action
          >[0]
        )
      );

      expect(result.init.status).toBe(400);
      expect(result.data.errors.email).toContain(
        "メールアドレスを入力してください"
      );
    });

    it("成功時に success と resetUrl を返す", async () => {
      expect.assertions(1);

      vi.mocked(passwordResetService.requestPasswordReset).mockResolvedValue({
        success: true,
        data: { resetUrl: "http://localhost/password-reset/token123" },
      });

      const formData = createFormData({ email: "test@example.com" });
      const request = createPostRequest(
        "http://localhost/password-reset",
        formData
      );

      const result = await action(
        createActionArgs({ request, params: {} }) as Parameters<
          typeof action
        >[0]
      );

      expect(result).toEqual({
        success: true,
        resetUrl: "http://localhost/password-reset/token123",
      });
    });

    it("存在しないメールアドレスでも成功を返す（セキュリティ対策）", async () => {
      expect.assertions(1);

      vi.mocked(passwordResetService.requestPasswordReset).mockResolvedValue({
        success: true,
        data: { resetUrl: null },
      });

      const formData = createFormData({ email: "nonexistent@example.com" });
      const request = createPostRequest(
        "http://localhost/password-reset",
        formData
      );

      const result = await action(
        createActionArgs({ request, params: {} }) as Parameters<
          typeof action
        >[0]
      );

      expect(result).toEqual({
        success: true,
        resetUrl: null,
      });
    });
  });

  // PasswordResetRequestPage は useActionData() を使用するため、
  // Router コンテキストが必要。createMemoryRouter でテストする。
  describe("PasswordResetRequestPage コンポーネント", () => {
    function renderWithRouter(initialEntries: string[] = ["/password-reset"]) {
      const routes = [
        {
          path: "/password-reset",
          element: (
            <PasswordResetRequestPage
              {...({} as unknown as Route.ComponentProps)}
            />
          ),
        },
        {
          path: "/login",
          element: <div>Login Page</div>,
        },
      ];

      const router = createMemoryRouter(routes, {
        initialEntries,
      });

      return render(<RouterProvider router={router} />);
    }

    it("タイトルが表示される", async () => {
      expect.assertions(1);

      renderWithRouter();

      expect(
        await screen.findByRole("heading", {
          name: "パスワードリセット",
          level: 1,
        })
      ).toBeInTheDocument();
    });

    it("説明文が表示される", async () => {
      expect.assertions(1);

      renderWithRouter();

      expect(
        await screen.findByText("登録済みのメールアドレスを入力してください")
      ).toBeInTheDocument();
    });

    it("ログインに戻るリンクが表示される", async () => {
      expect.assertions(2);

      renderWithRouter();

      const loginLink = await screen.findByRole("link", {
        name: "ログインに戻る",
      });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute("href", "/login");
    });

    it("PasswordResetForm コンポーネントが表示される", async () => {
      expect.assertions(2);

      renderWithRouter();

      expect(
        await screen.findByLabelText("メールアドレス")
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: "リセットリンクを送信" })
      ).toBeInTheDocument();
    });
  });
});
