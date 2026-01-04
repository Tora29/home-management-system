// LoginForm コンポーネントのテスト
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";

// テスト対象
import { LoginForm } from "../../components/LoginForm";

// createMemoryRouter でラップするヘルパー関数
function renderWithRouter(ui: React.ReactElement) {
  const router = createMemoryRouter([{ path: "/", element: ui }], {
    initialEntries: ["/"],
  });
  return render(<RouterProvider router={router} />);
}

describe("LoginForm", () => {
  describe("レンダリング", () => {
    it("メールアドレス入力フィールドが表示される", () => {
      renderWithRouter(<LoginForm errors={null} />);

      expect(
        screen.getByRole("textbox", { name: "メールアドレス" })
      ).toBeInTheDocument();
    });

    it("パスワード入力フィールドが表示される", () => {
      renderWithRouter(<LoginForm errors={null} />);

      // パスワードフィールドは role="textbox" ではないので、labelText で検索
      expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    });

    it("ログインボタンが表示される", () => {
      renderWithRouter(<LoginForm errors={null} />);

      expect(
        screen.getByRole("button", { name: "ログイン" })
      ).toBeInTheDocument();
    });

    it("プレースホルダーが表示される", () => {
      renderWithRouter(<LoginForm errors={null} />);

      expect(
        screen.getByPlaceholderText("example@email.com")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("8文字以上")).toBeInTheDocument();
    });
  });

  describe("エラー表示", () => {
    it("メールアドレスのエラーが表示される", () => {
      const errors = {
        email: ["メールアドレスを入力してください"],
      };

      renderWithRouter(<LoginForm errors={errors} />);

      expect(
        screen.getByText("メールアドレスを入力してください")
      ).toBeInTheDocument();
    });

    it("パスワードのエラーが表示される", () => {
      const errors = {
        password: ["パスワードを入力してください"],
      };

      renderWithRouter(<LoginForm errors={errors} />);

      expect(
        screen.getByText("パスワードを入力してください")
      ).toBeInTheDocument();
    });

    it("複数のエラーが同時に表示される", () => {
      const errors = {
        email: ["メールアドレスを入力してください"],
        password: ["パスワードを入力してください"],
      };

      renderWithRouter(<LoginForm errors={errors} />);

      expect(
        screen.getByText("メールアドレスを入力してください")
      ).toBeInTheDocument();
      expect(
        screen.getByText("パスワードを入力してください")
      ).toBeInTheDocument();
    });

    it("errors が null の場合、エラーメッセージは表示されない", () => {
      renderWithRouter(<LoginForm errors={null} />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("入力操作", () => {
    it("メールアドレスを入力できる", async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginForm errors={null} />);

      const emailInput = screen.getByRole("textbox", {
        name: "メールアドレス",
      });
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("パスワードを入力できる", async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginForm errors={null} />);

      const passwordInput = screen.getByLabelText("パスワード");
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });
  });

  describe("パスワード表示/非表示", () => {
    it("初期状態ではパスワードが非表示（type=password）", () => {
      renderWithRouter(<LoginForm errors={null} />);

      const passwordInput = screen.getByLabelText("パスワード");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("表示ボタンをクリックするとパスワードが表示される", async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginForm errors={null} />);

      const toggleButton = screen.getByRole("button", {
        name: "パスワードを表示",
      });
      await user.click(toggleButton);

      const passwordInput = screen.getByLabelText("パスワード");
      expect(passwordInput).toHaveAttribute("type", "text");
    });

    it("表示中にもう一度クリックするとパスワードが非表示になる", async () => {
      const user = userEvent.setup();
      renderWithRouter(<LoginForm errors={null} />);

      const toggleButton = screen.getByRole("button", {
        name: "パスワードを表示",
      });
      await user.click(toggleButton);

      // aria-label が変わっているので、新しいラベルで取得
      const hideButton = screen.getByRole("button", {
        name: "パスワードを隠す",
      });
      await user.click(hideButton);

      const passwordInput = screen.getByLabelText("パスワード");
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("フォームのアクセシビリティ", () => {
    it("エラーメッセージは role=alert を持つ", () => {
      const errors = {
        email: ["メールアドレスを入力してください"],
      };

      renderWithRouter(<LoginForm errors={errors} />);

      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThan(0);
    });

    it("入力フィールドに適切な autocomplete 属性がある", () => {
      renderWithRouter(<LoginForm errors={null} />);

      const emailInput = screen.getByRole("textbox", {
        name: "メールアドレス",
      });
      const passwordInput = screen.getByLabelText("パスワード");

      expect(emailInput).toHaveAttribute("autocomplete", "email");
      expect(passwordInput).toHaveAttribute("autocomplete", "current-password");
    });
  });
});
