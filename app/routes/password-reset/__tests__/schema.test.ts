import { describe, it, expect } from "vitest";

import {
  requestResetSchema,
  userSchema,
  passwordResetTokenSchema,
} from "../schema";

describe("requestResetSchema", () => {
  it("正常系: 有効なメールアドレスでバリデーション成功", () => {
    const input = { email: "test@example.com" };

    const result = requestResetSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("異常系: 空のメールアドレスでバリデーション失敗", () => {
    const input = { email: "" };

    const result = requestResetSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("異常系: 無効なメールアドレス形式でバリデーション失敗", () => {
    const input = { email: "invalid-email" };

    const result = requestResetSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("異常系: メールアドレスが未定義でバリデーション失敗", () => {
    const input = {};

    const result = requestResetSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});

describe("userSchema", () => {
  it("正常系: 有効なユーザーデータでバリデーション成功", () => {
    const input = {
      id: "user-123",
      email: "test@example.com",
      passwordHash: "hashed-password",
      name: "Test User",
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    };

    const result = userSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("user-123");
      expect(result.data.email).toBe("test@example.com");
      expect(result.data.name).toBe("Test User");
    }
  });

  it("正常系: 名前がnullでもバリデーション成功", () => {
    const input = {
      id: "user-123",
      email: "test@example.com",
      passwordHash: "hashed-password",
      name: null,
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    };

    const result = userSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBeNull();
    }
  });

  it("異常系: 必須フィールドが欠けているとバリデーション失敗", () => {
    const input = {
      id: "user-123",
      // email 欠落
      passwordHash: "hashed-password",
      name: null,
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    };

    const result = userSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});

describe("passwordResetTokenSchema", () => {
  it("正常系: 有効なトークンデータでバリデーション成功", () => {
    const input = {
      id: "token-123",
      token: "abc123",
      userId: "user-123",
      expiresAt: new Date("2025-01-02"),
      usedAt: null,
      createdAt: new Date("2025-01-01"),
    };

    const result = passwordResetTokenSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.token).toBe("abc123");
      expect(result.data.usedAt).toBeNull();
    }
  });

  it("正常系: usedAtが日付でもバリデーション成功", () => {
    const usedDate = new Date("2025-01-01T12:00:00");
    const input = {
      id: "token-123",
      token: "abc123",
      userId: "user-123",
      expiresAt: new Date("2025-01-02"),
      usedAt: usedDate,
      createdAt: new Date("2025-01-01"),
    };

    const result = passwordResetTokenSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.usedAt).toEqual(usedDate);
    }
  });

  it("異常系: 必須フィールドが欠けているとバリデーション失敗", () => {
    const input = {
      id: "token-123",
      // token 欠落
      userId: "user-123",
      expiresAt: new Date("2025-01-02"),
      usedAt: null,
      createdAt: new Date("2025-01-01"),
    };

    const result = passwordResetTokenSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});
