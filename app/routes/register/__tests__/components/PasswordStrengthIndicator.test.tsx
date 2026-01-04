import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { PasswordStrengthIndicator } from "../../components/PasswordStrengthIndicator";

import type { PasswordStrength } from "../../schema";

describe("PasswordStrengthIndicator", () => {
  describe("強度バーの表示", () => {
    it("スコア0の場合、すべてのバーがグレーで表示される", () => {
      const strength: PasswordStrength = {
        score: 0,
        label: "非常に弱い",
        color: "bg-hig-red",
      };

      const { container } = render(
        <PasswordStrengthIndicator strength={strength} />
      );

      // 4つのバーがすべてグレー（強度色が適用されていない）
      const bars = container.querySelectorAll(".rounded-full");
      expect(bars).toHaveLength(4);
      bars.forEach((bar) => {
        expect(bar).toHaveClass("bg-hig-gray4");
        expect(bar).not.toHaveClass("bg-hig-red");
      });
    });

    it("スコア2の場合、最初の2つのバーに強度色が適用される", () => {
      const strength: PasswordStrength = {
        score: 2,
        label: "普通",
        color: "bg-hig-yellow",
      };

      const { container } = render(
        <PasswordStrengthIndicator strength={strength} />
      );

      const bars = container.querySelectorAll(".rounded-full");
      expect(bars).toHaveLength(4);

      // 最初の2つは強度色
      expect(bars[0]).toHaveClass("bg-hig-yellow");
      expect(bars[1]).toHaveClass("bg-hig-yellow");

      // 残り2つはグレー
      expect(bars[2]).toHaveClass("bg-hig-gray4");
      expect(bars[3]).toHaveClass("bg-hig-gray4");
    });

    it("スコア4の場合、すべてのバーに強度色が適用される", () => {
      const strength: PasswordStrength = {
        score: 4,
        label: "非常に強い",
        color: "bg-hig-green",
      };

      const { container } = render(
        <PasswordStrengthIndicator strength={strength} />
      );

      const bars = container.querySelectorAll(".rounded-full");
      expect(bars).toHaveLength(4);
      bars.forEach((bar) => {
        expect(bar).toHaveClass("bg-hig-green");
      });
    });
  });

  describe("ラベル表示", () => {
    it("「非常に弱い」ラベルが正しく表示される", () => {
      const strength: PasswordStrength = {
        score: 0,
        label: "非常に弱い",
        color: "bg-hig-red",
      };

      render(<PasswordStrengthIndicator strength={strength} />);

      expect(
        screen.getByText("パスワード強度: 非常に弱い")
      ).toBeInTheDocument();
    });

    it("「弱い」ラベルが正しく表示される", () => {
      const strength: PasswordStrength = {
        score: 1,
        label: "弱い",
        color: "bg-hig-orange",
      };

      render(<PasswordStrengthIndicator strength={strength} />);

      expect(screen.getByText("パスワード強度: 弱い")).toBeInTheDocument();
    });

    it("「普通」ラベルが正しく表示される", () => {
      const strength: PasswordStrength = {
        score: 2,
        label: "普通",
        color: "bg-hig-yellow",
      };

      render(<PasswordStrengthIndicator strength={strength} />);

      expect(screen.getByText("パスワード強度: 普通")).toBeInTheDocument();
    });

    it("「強い」ラベルが正しく表示される", () => {
      const strength: PasswordStrength = {
        score: 3,
        label: "強い",
        color: "bg-hig-green",
      };

      render(<PasswordStrengthIndicator strength={strength} />);

      expect(screen.getByText("パスワード強度: 強い")).toBeInTheDocument();
    });

    it("「非常に強い」ラベルが正しく表示される", () => {
      const strength: PasswordStrength = {
        score: 4,
        label: "非常に強い",
        color: "bg-hig-green",
      };

      render(<PasswordStrengthIndicator strength={strength} />);

      expect(
        screen.getByText("パスワード強度: 非常に強い")
      ).toBeInTheDocument();
    });

    it("空ラベルの場合、「パスワード強度: 」のみ表示される", () => {
      const strength: PasswordStrength = {
        score: 0,
        label: "",
        color: "bg-hig-gray4",
      };

      render(<PasswordStrengthIndicator strength={strength} />);

      expect(screen.getByText("パスワード強度:")).toBeInTheDocument();
    });
  });
});
