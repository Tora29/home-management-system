import { describe, it, expect } from "vitest";

import { calculatePasswordStrength } from "../../service/password";

describe("calculatePasswordStrength", () => {
  describe("空・未入力のケース", () => {
    it("空文字の場合、スコア0で空ラベルを返す", () => {
      const result = calculatePasswordStrength("");

      expect(result).toEqual({
        score: 0,
        label: "",
        color: "bg-hig-gray4",
      });
    });
  });

  describe("弱いパスワード", () => {
    it("短いパスワード（8文字未満）は「非常に弱い」を返す", () => {
      const result = calculatePasswordStrength("abc");

      expect(result.score).toBe(0);
      expect(result.label).toBe("非常に弱い");
      expect(result.color).toBe("bg-hig-red");
    });

    it("小文字のみ8文字以上は「弱い」を返す", () => {
      const result = calculatePasswordStrength("abcdefgh");

      // 長さ8文字(+1) + 小文字(+1) = 2 * 0.7 = 1.4 → 1
      expect(result.score).toBe(1);
      expect(result.label).toBe("弱い");
      expect(result.color).toBe("bg-hig-orange");
    });
  });

  describe("普通のパスワード", () => {
    it("小文字と数字を含む8文字以上は「普通」を返す", () => {
      const result = calculatePasswordStrength("abcdefg1");

      // 長さ8文字(+1) + 小文字(+1) + 数字(+1) = 3 * 0.7 = 2.1 → 2
      expect(result.score).toBe(2);
      expect(result.label).toBe("普通");
      expect(result.color).toBe("bg-hig-yellow");
    });

    it("大文字・小文字を含む8文字以上は「普通」を返す", () => {
      const result = calculatePasswordStrength("Abcdefgh");

      // 長さ8文字(+1) + 小文字(+1) + 大文字(+1) = 3 * 0.7 = 2.1 → 2
      expect(result.score).toBe(2);
      expect(result.label).toBe("普通");
    });
  });

  describe("強いパスワード", () => {
    it("大文字・小文字・数字を含む12文字以上は「強い」を返す", () => {
      const result = calculatePasswordStrength("Abcdefgh1234");

      // 長さ8文字(+1) + 長さ12文字(+1) + 小文字(+1) + 大文字(+1) + 数字(+1) = 5 * 0.7 = 3.5 → 3
      expect(result.score).toBe(3);
      expect(result.label).toBe("強い");
      expect(result.color).toBe("bg-hig-green");
    });
  });

  describe("非常に強いパスワード", () => {
    it("大文字・小文字・数字・記号を含む12文字以上は「非常に強い」を返す", () => {
      const result = calculatePasswordStrength("Abcdefgh123!");

      // 長さ8文字(+1) + 長さ12文字(+1) + 小文字(+1) + 大文字(+1) + 数字(+1) + 記号(+1) = 6 * 0.7 = 4.2 → 4
      expect(result.score).toBe(4);
      expect(result.label).toBe("非常に強い");
      expect(result.color).toBe("bg-hig-green");
    });

    it("複雑なパスワードでもスコアは最大4を超えない", () => {
      const result = calculatePasswordStrength(
        "SuperComplexPassword123!@#$%^&*()"
      );

      expect(result.score).toBeLessThanOrEqual(4);
      expect(result.label).toBe("非常に強い");
    });
  });

  describe("エッジケース", () => {
    it("数字のみのパスワードは「弱い」を返す", () => {
      const result = calculatePasswordStrength("12345678");

      // 長さ8文字(+1) + 数字(+1) = 2 * 0.7 = 1.4 → 1
      expect(result.score).toBe(1);
      expect(result.label).toBe("弱い");
    });

    it("記号のみのパスワードは「弱い」を返す", () => {
      const result = calculatePasswordStrength("!@#$%^&*");

      // 長さ8文字(+1) + 記号(+1) = 2 * 0.7 = 1.4 → 1
      expect(result.score).toBe(1);
      expect(result.label).toBe("弱い");
    });

    it("スペースを含むパスワードは記号として扱われない", () => {
      // スペースは正規表現 /[^a-zA-Z0-9]/ にマッチするので記号扱い
      const result = calculatePasswordStrength("abc def gh");

      // 長さ8文字(+1) + 小文字(+1) + スペース記号(+1) = 3 * 0.7 = 2.1 → 2
      expect(result.score).toBe(2);
    });
  });
});
