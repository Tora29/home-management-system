import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";

import { PasswordResetForm } from "../../components/PasswordResetForm";

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

describe("PasswordResetForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常系: フォームが正しくレンダリングされる", () => {
    renderWithRouter(<PasswordResetForm errors={null} />);

    // メールアドレス入力フィールドの存在確認
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("example@email.com")
    ).toBeInTheDocument();

    // 送信ボタンの存在確認
    expect(
      screen.getByRole("button", { name: "リセットリンクを送信" })
    ).toBeInTheDocument();
  });

  it("正常系: メール入力フィールドの属性が正しく設定されている", () => {
    renderWithRouter(<PasswordResetForm errors={null} />);

    const emailInput = screen.getByLabelText("メールアドレス");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");
    expect(emailInput).toHaveAttribute("autocomplete", "email");
  });

  it("正常系: フォームがPOSTメソッドを使用している", () => {
    renderWithRouter(<PasswordResetForm errors={null} />);

    const form = document.querySelector("form");
    expect(form).toHaveAttribute("method", "post");
  });

  it("異常系: エラーがある場合にエラーメッセージを表示", () => {
    const errors = {
      email: ["メールアドレスを入力してください"],
    };

    renderWithRouter(<PasswordResetForm errors={errors} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "メールアドレスを入力してください"
    );
  });

  it("正常系: エラーがnullの場合はエラーメッセージを表示しない", () => {
    renderWithRouter(<PasswordResetForm errors={null} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("正常系: エラーの配列が空の場合はエラーメッセージを表示しない", () => {
    const errors = {
      email: [],
    };

    renderWithRouter(<PasswordResetForm errors={errors} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
