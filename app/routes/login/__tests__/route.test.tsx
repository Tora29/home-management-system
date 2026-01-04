// ログインルートのテスト
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
vi.mock("../service/auth.service", () => ({
  login: vi.fn(),
}));

// セッションのモック
vi.mock("~/shared/lib/session.server", () => ({
  createUserSession: vi.fn(),
}));

// モックをインポート
import * as authService from "../service/auth.service";
import { createUserSession } from "~/shared/lib/session.server";

// 型定義
import type { Route } from "../+types/route";

// テスト対象
import LoginPage, { action, meta } from "../route";

describe("login route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("meta", () => {
    it("正しいタイトルと説明を返す", () => {
      const metaResult = meta({} as Parameters<typeof meta>[0]);

      expect(metaResult).toEqual([
        { title: "ログイン - Home Management System" },
        { name: "description", content: "Home Management System へログイン" },
      ]);
    });
  });

  describe("action", () => {
    it("バリデーションエラー時にエラーを含むレスポンスを返す", async () => {
      expect.assertions(2);

      vi.mocked(authService.login).mockResolvedValue({
        success: false,
        type: "validation",
        errors: { email: ["メールアドレスを入力してください"] },
      });

      const formData = createFormData({ email: "", password: "" });
      const request = createPostRequest("http://localhost/login", formData);

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

    it("認証エラー時にエラーメッセージを含むレスポンスを返す", async () => {
      expect.assertions(2);

      vi.mocked(authService.login).mockResolvedValue({
        success: false,
        type: "auth",
        message: "メールアドレスまたはパスワードが正しくありません",
      });

      const formData = createFormData({
        email: "test@example.com",
        password: "wrongpassword",
      });
      const request = createPostRequest("http://localhost/login", formData);

      const result = asDataResponse<{ authError: string }>(
        await action(
          createActionArgs({ request, params: {} }) as Parameters<
            typeof action
          >[0]
        )
      );

      expect(result.init.status).toBe(401);
      expect(result.data.authError).toBe(
        "メールアドレスまたはパスワードが正しくありません"
      );
    });

    it("ログイン成功時にセッションを作成してリダイレクトする", async () => {
      expect.assertions(2);

      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: "hashedPassword",
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(authService.login).mockResolvedValue({
        success: true,
        data: { user: mockUser },
      });

      const mockRedirectResponse = new Response(null, {
        status: 302,
        headers: { Location: "/" },
      });
      vi.mocked(createUserSession).mockResolvedValue(mockRedirectResponse);

      const formData = createFormData({
        email: "test@example.com",
        password: "password123",
      });
      const request = createPostRequest("http://localhost/login", formData);

      const result = await action(
        createActionArgs({ request, params: {} }) as Parameters<
          typeof action
        >[0]
      );

      expect(createUserSession).toHaveBeenCalledWith("user-123", "/");
      expect((result as Response).status).toBe(302);
    });

    it("authService.login に正しい引数を渡す", async () => {
      expect.assertions(1);

      vi.mocked(authService.login).mockResolvedValue({
        success: false,
        type: "validation",
        errors: {},
      });

      const formData = createFormData({
        email: "test@example.com",
        password: "password123",
      });
      const request = createPostRequest("http://localhost/login", formData);

      await action(
        createActionArgs({ request, params: {} }) as Parameters<
          typeof action
        >[0]
      );

      expect(authService.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  // LoginPage は useActionData() と useSearchParams() を使用するため、
  // Router コンテキストが必要。createMemoryRouter でテストする。
  describe("LoginPage コンポーネント", () => {
    function renderWithRouter(
      initialEntries: string[] = ["/login"],
      actionData?: Record<string, unknown>
    ) {
      const routes = [
        {
          path: "/login",
          element: <LoginPage {...({} as unknown as Route.ComponentProps)} />,
          action: () => actionData ?? null,
        },
        {
          path: "/register",
          element: <div>Register Page</div>,
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

    it("ログインタイトルが表示される", async () => {
      expect.assertions(1);

      renderWithRouter();

      expect(
        await screen.findByRole("heading", { name: "ログイン", level: 1 })
      ).toBeInTheDocument();
    });

    it("説明文が表示される", async () => {
      expect.assertions(1);

      renderWithRouter();

      expect(
        await screen.findByText("アカウントにログインしてください")
      ).toBeInTheDocument();
    });

    it("新規登録リンクが表示される", async () => {
      expect.assertions(2);

      renderWithRouter();

      const registerLink = await screen.findByRole("link", {
        name: "新規登録",
      });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute("href", "/register");
    });

    it("パスワードを忘れた方リンクが表示される", async () => {
      expect.assertions(2);

      renderWithRouter();

      const resetLink = await screen.findByRole("link", {
        name: "パスワードを忘れた方",
      });
      expect(resetLink).toBeInTheDocument();
      expect(resetLink).toHaveAttribute("href", "/password-reset");
    });

    it("パスワードリセット成功メッセージが表示される", async () => {
      expect.assertions(1);

      renderWithRouter(["/login?reset=success"]);

      expect(
        await screen.findByText(
          "パスワードが変更されました。新しいパスワードでログインしてください。"
        )
      ).toBeInTheDocument();
    });

    it("LoginForm コンポーネントが表示される", async () => {
      expect.assertions(3);

      renderWithRouter();

      expect(
        await screen.findByRole("textbox", { name: "メールアドレス" })
      ).toBeInTheDocument();
      expect(await screen.findByLabelText("パスワード")).toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: "ログイン" })
      ).toBeInTheDocument();
    });
  });
});
