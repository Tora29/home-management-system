// 登録ルートのテスト
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
vi.mock("../service/register.service", () => ({
  registerUser: vi.fn(),
}));

// セッションのモック
vi.mock("~/shared/lib/session.server", () => ({
  createUserSession: vi.fn(),
}));

// モックをインポート
import { registerUser } from "../service/register.service";
import { createUserSession } from "~/shared/lib/session.server";

// 型定義
import type { Route } from "../+types/route";

// テスト対象
import RegisterPage, { action, meta } from "../route";

describe("register route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("meta", () => {
    it("正しいタイトルと説明を返す", () => {
      const metaResult = meta({} as Parameters<typeof meta>[0]);

      expect(metaResult).toEqual([
        { title: "新規登録 - Home Management System" },
        { name: "description", content: "Home Management System に新規登録" },
      ]);
    });
  });

  describe("action", () => {
    it("バリデーションエラー時にエラーを含むレスポンスを返す", async () => {
      expect.assertions(2);

      vi.mocked(registerUser).mockResolvedValue({
        success: false,
        type: "validation",
        errors: { email: ["メールアドレスを入力してください"] },
      });

      const formData = createFormData({
        email: "",
        password: "",
        passwordConfirm: "",
        name: "",
      });
      const request = createPostRequest("http://localhost/register", formData);

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

    it("重複エラー時にエラーを含むレスポンスを返す", async () => {
      expect.assertions(1);

      vi.mocked(registerUser).mockResolvedValue({
        success: false,
        type: "duplicate",
        errors: { email: ["このメールアドレスは既に登録されています"] },
      });

      const formData = createFormData({
        email: "existing@example.com",
        password: "password123",
        passwordConfirm: "password123",
        name: "",
      });
      const request = createPostRequest("http://localhost/register", formData);

      const result = asDataResponse<{ errors: { email: string[] } }>(
        await action(
          createActionArgs({ request, params: {} }) as Parameters<
            typeof action
          >[0]
        )
      );

      expect(result.init.status).toBe(400);
    });

    it("登録成功時にセッションを作成する", async () => {
      expect.assertions(2);

      vi.mocked(registerUser).mockResolvedValue({
        success: true,
        data: { userId: "user-123" },
      });

      const mockRedirectResponse = new Response(null, {
        status: 302,
        headers: { Location: "/" },
      });
      vi.mocked(createUserSession).mockResolvedValue(mockRedirectResponse);

      const formData = createFormData({
        email: "test@example.com",
        password: "password123",
        passwordConfirm: "password123",
        name: "Test User",
      });
      const request = createPostRequest("http://localhost/register", formData);

      const result = await action(
        createActionArgs({ request, params: {} }) as Parameters<
          typeof action
        >[0]
      );

      expect(createUserSession).toHaveBeenCalledWith("user-123", "/");
      expect((result as Response).status).toBe(302);
    });
  });

  // RegisterPage は useActionData() を使用するため、
  // Router コンテキストが必要。createMemoryRouter でテストする。
  describe("RegisterPage コンポーネント", () => {
    function renderWithRouter(initialEntries: string[] = ["/register"]) {
      const routes = [
        {
          path: "/register",
          element: (
            <RegisterPage {...({} as unknown as Route.ComponentProps)} />
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
        await screen.findByRole("heading", { name: "新規登録", level: 1 })
      ).toBeInTheDocument();
    });

    it("説明文が表示される", async () => {
      expect.assertions(1);

      renderWithRouter();

      expect(
        await screen.findByText("アカウントを作成してください")
      ).toBeInTheDocument();
    });

    it("ログインリンクが表示される", async () => {
      expect.assertions(2);

      renderWithRouter();

      const loginLink = await screen.findByRole("link", {
        name: "ログイン",
      });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute("href", "/login");
    });

    it("RegisterForm コンポーネントが表示される", async () => {
      expect.assertions(3);

      renderWithRouter();

      expect(
        await screen.findByLabelText("メールアドレス")
      ).toBeInTheDocument();
      expect(await screen.findByLabelText("パスワード")).toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: "登録する" })
      ).toBeInTheDocument();
    });
  });
});
