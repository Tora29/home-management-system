import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";

import { RegisterForm } from "../../components/RegisterForm";

import type { PasswordStrength } from "../../schema";

// テスト用のルーター設定を作成するヘルパー
function renderWithRouter(ui: React.ReactElement) {
  const routes = [
    {
      path: "/",
      element: ui,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/"],
  });

  return render(<RouterProvider router={router} />);
}

// パスワード強度インジケーターのモックレンダラー
function mockRenderPasswordStrength(strength: PasswordStrength) {
  return (
    <div data-testid="password-strength-indicator">
      <span data-testid="strength-label">{strength.label}</span>
      <span data-testid="strength-score">{strength.score}</span>
    </div>
  );
}

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("フォームレンダリング", () => {
    it("すべての入力フィールドが正しくレンダリングされる", () => {
      renderWithRouter(
        <RegisterForm
          errors={null}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      // メールアドレス
      expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("example@email.com")
      ).toBeInTheDocument();

      // 名前（任意）
      expect(screen.getByLabelText("名前（任意）")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("山田 太郎")).toBeInTheDocument();

      // パスワード
      expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("8文字以上")).toBeInTheDocument();

      // パスワード確認
      expect(screen.getByLabelText("パスワード（確認）")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("パスワードを再入力")
      ).toBeInTheDocument();

      // 登録ボタン
      expect(
        screen.getByRole("button", { name: "登録する" })
      ).toBeInTheDocument();
    });

    it("フォームがPOSTメソッドを使用している", () => {
      renderWithRouter(
        <RegisterForm
          errors={null}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      const form = document.querySelector("form");
      expect(form).toHaveAttribute("method", "post");
    });

    it("メール入力フィールドの属性が正しく設定されている", () => {
      renderWithRouter(
        <RegisterForm
          errors={null}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      const emailInput = screen.getByLabelText("メールアドレス");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("name", "email");
      expect(emailInput).toHaveAttribute("autocomplete", "email");
    });

    it("パスワード入力フィールドの属性が正しく設定されている", () => {
      renderWithRouter(
        <RegisterForm
          errors={null}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      const passwordInput = screen.getByLabelText("パスワード");
      expect(passwordInput).toHaveAttribute("name", "password");
      expect(passwordInput).toHaveAttribute("autocomplete", "new-password");
    });
  });

  describe("パスワード強度インジケーター", () => {
    it("パスワード未入力時はインジケーターが表示されない", () => {
      renderWithRouter(
        <RegisterForm
          errors={null}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      expect(
        screen.queryByTestId("password-strength-indicator")
      ).not.toBeInTheDocument();
    });

    it("パスワード入力時にインジケーターが表示される", async () => {
      const user = userEvent.setup();

      renderWithRouter(
        <RegisterForm
          errors={null}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      const passwordInput = screen.getByLabelText("パスワード");
      await user.type(passwordInput, "test");

      expect(
        screen.getByTestId("password-strength-indicator")
      ).toBeInTheDocument();
    });

    it("パスワード入力に応じて強度が計算される", async () => {
      const user = userEvent.setup();

      renderWithRouter(
        <RegisterForm
          errors={null}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      const passwordInput = screen.getByLabelText("パスワード");

      // 弱いパスワード
      await user.type(passwordInput, "abc");
      expect(screen.getByTestId("strength-label")).toHaveTextContent(
        "非常に弱い"
      );

      // パスワードをクリアして強いパスワードを入力
      await user.clear(passwordInput);
      await user.type(passwordInput, "StrongPassword123!");
      expect(screen.getByTestId("strength-label")).toHaveTextContent(
        "非常に強い"
      );
    });
  });

  describe("エラー表示", () => {
    it("エラーがnullの場合はエラーメッセージを表示しない", () => {
      renderWithRouter(
        <RegisterForm
          errors={null}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("メールアドレスエラーが表示される", () => {
      const errors = {
        email: ["メールアドレスを入力してください"],
      };

      renderWithRouter(
        <RegisterForm
          errors={errors}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      expect(
        screen.getByText("メールアドレスを入力してください")
      ).toBeInTheDocument();
    });

    it("パスワードエラーが表示される", () => {
      const errors = {
        password: ["パスワードは8文字以上で入力してください"],
      };

      renderWithRouter(
        <RegisterForm
          errors={errors}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      expect(
        screen.getByText("パスワードは8文字以上で入力してください")
      ).toBeInTheDocument();
    });

    it("パスワード確認エラーが表示される", () => {
      const errors = {
        passwordConfirm: ["パスワードが一致しません"],
      };

      renderWithRouter(
        <RegisterForm
          errors={errors}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      expect(screen.getByText("パスワードが一致しません")).toBeInTheDocument();
    });

    it("名前エラーが表示される", () => {
      const errors = {
        name: ["名前は50文字以内で入力してください"],
      };

      renderWithRouter(
        <RegisterForm
          errors={errors}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      expect(
        screen.getByText("名前は50文字以内で入力してください")
      ).toBeInTheDocument();
    });

    it("複数のエラーが同時に表示される", () => {
      const errors = {
        email: ["メールアドレスを入力してください"],
        password: ["パスワードを入力してください"],
      };

      renderWithRouter(
        <RegisterForm
          errors={errors}
          renderPasswordStrength={mockRenderPasswordStrength}
        />
      );

      expect(
        screen.getByText("メールアドレスを入力してください")
      ).toBeInTheDocument();
      expect(
        screen.getByText("パスワードを入力してください")
      ).toBeInTheDocument();
    });
  });
});
