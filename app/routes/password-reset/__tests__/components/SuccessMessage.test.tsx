import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { SuccessMessage } from "../../components/SuccessMessage";

describe("SuccessMessage", () => {
  it("正常系: リセットURLがある場合、成功メッセージとリンクを表示", () => {
    const resetUrl = "https://example.com/password-reset/abc123";

    render(<SuccessMessage resetUrl={resetUrl} />);

    // 成功メッセージの確認
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("リセットリンクを生成しました")
    ).toBeInTheDocument();

    // リンクの確認
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", resetUrl);
    expect(link).toHaveTextContent(resetUrl);
  });

  it("正常系: リセットURLがnullの場合、ユーザー不在メッセージを表示", () => {
    render(<SuccessMessage resetUrl={null} />);

    // 成功メッセージの確認
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("リセットリンクを生成しました")
    ).toBeInTheDocument();

    // ユーザー不在メッセージの確認
    expect(
      screen.getByText("該当するユーザーが見つかりませんでした")
    ).toBeInTheDocument();

    // リンクは表示されない
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("正常系: alertロールが正しく設定されている", () => {
    render(<SuccessMessage resetUrl="https://example.com/reset" />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
  });

  it("正常系: 長いURLでも正しく表示される", () => {
    const longUrl =
      "https://example.com/password-reset/very-long-token-that-should-still-be-displayed-correctly-12345678901234567890";

    render(<SuccessMessage resetUrl={longUrl} />);

    const link = screen.getByRole("link");
    expect(link).toHaveTextContent(longUrl);
    // break-all クラスにより改行される
    expect(link).toHaveClass("break-all");
  });
});
