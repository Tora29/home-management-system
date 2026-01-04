// パスワードリセット確認フォームのコンポーネントテスト
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";

import { PasswordResetConfirmForm } from "../../components/PasswordResetConfirmForm";

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

describe("PasswordResetConfirmForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常系: フォームが正しくレンダリングされる", () => {
    renderWithRouter(<PasswordResetConfirmForm errors={null} />);

    // パスワード入力フィールドの存在確認
    expect(screen.getByLabelText("新しいパスワード")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("8文字以上")).toBeInTheDocument();

    // パスワード確認入力フィールドの存在確認
    expect(screen.getByLabelText("パスワード（確認）")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("もう一度入力")).toBeInTheDocument();

    // 送信ボタンの存在確認
    expect(
      screen.getByRole("button", { name: "パスワードを変更" })
    ).toBeInTheDocument();
  });

  it("正常系: パスワード入力フィールドの属性が正しく設定されている", () => {
    renderWithRouter(<PasswordResetConfirmForm errors={null} />);

    const passwordInput = screen.getByLabelText("新しいパスワード");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("name", "password");
    expect(passwordInput).toHaveAttribute("autocomplete", "new-password");
  });

  it("正常系: パスワード確認入力フィールドの属性が正しく設定されている", () => {
    renderWithRouter(<PasswordResetConfirmForm errors={null} />);

    const passwordConfirmInput = screen.getByLabelText("パスワード（確認）");
    expect(passwordConfirmInput).toHaveAttribute("type", "password");
    expect(passwordConfirmInput).toHaveAttribute("name", "passwordConfirm");
    expect(passwordConfirmInput).toHaveAttribute(
      "autocomplete",
      "new-password"
    );
  });

  it("正常系: フォームがPOSTメソッドを使用している", () => {
    renderWithRouter(<PasswordResetConfirmForm errors={null} />);

    const form = document.querySelector("form");
    expect(form).toHaveAttribute("method", "post");
  });

  it("異常系: パスワードエラーがある場合にエラーメッセージを表示", () => {
    const errors = {
      password: ["パスワードは8文字以上で入力してください"],
    };

    renderWithRouter(<PasswordResetConfirmForm errors={errors} />);

    expect(
      screen.getByText("パスワードは8文字以上で入力してください")
    ).toBeInTheDocument();
  });

  it("異常系: パスワード確認エラーがある場合にエラーメッセージを表示", () => {
    const errors = {
      passwordConfirm: ["パスワードが一致しません"],
    };

    renderWithRouter(<PasswordResetConfirmForm errors={errors} />);

    expect(screen.getByText("パスワードが一致しません")).toBeInTheDocument();
  });

  it("異常系: 複数のエラーがある場合に両方表示", () => {
    const errors = {
      password: ["パスワードを入力してください"],
      passwordConfirm: ["確認用パスワードを入力してください"],
    };

    renderWithRouter(<PasswordResetConfirmForm errors={errors} />);

    expect(
      screen.getByText("パスワードを入力してください")
    ).toBeInTheDocument();
    expect(
      screen.getByText("確認用パスワードを入力してください")
    ).toBeInTheDocument();
  });

  it("正常系: エラーがnullの場合はエラーメッセージを表示しない", () => {
    renderWithRouter(<PasswordResetConfirmForm errors={null} />);

    // role="alert" を持つ要素が存在しないことを確認
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("正常系: エラーの配列が空の場合はエラーメッセージを表示しない", () => {
    const errors = {
      password: [],
      passwordConfirm: [],
    };

    renderWithRouter(<PasswordResetConfirmForm errors={errors} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
