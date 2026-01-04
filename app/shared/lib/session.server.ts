// セッション管理ユーティリティ
// サーバーサイドでのみ使用する

import { createCookieSessionStorage, redirect } from "react-router";

// セッションの型定義
type SessionData = {
  userId: string;
};

// フラッシュデータの型定義
type SessionFlashData = {
  error: string;
};

// セッションストレージの作成
const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1週間
    path: "/",
    sameSite: "lax",
    // 本番環境ではシークレットを環境変数から取得すること
    secrets: [process.env.SESSION_SECRET || "s3cr3t"],
    secure: process.env.NODE_ENV === "production",
  },
});

/**
 * リクエストからセッションを取得する
 */
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

/**
 * セッションをコミットする
 */
export async function commitSession(
  session: Awaited<ReturnType<typeof getSession>>
) {
  return sessionStorage.commitSession(session);
}

/**
 * セッションを破棄する
 */
export async function destroySession(
  session: Awaited<ReturnType<typeof getSession>>
) {
  return sessionStorage.destroySession(session);
}

/**
 * ユーザーIDをセッションに保存してリダイレクトする
 */
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

/**
 * セッションからユーザーIDを取得する
 */
export async function getUserIdFromSession(
  request: Request
): Promise<string | null> {
  const session = await getSession(request);
  const userId = session.get("userId");
  return userId || null;
}

/**
 * ログインが必要なページで使用する
 * ログインしていない場合はログインページにリダイレクト
 */
export async function requireUserId(request: Request): Promise<string> {
  const userId = await getUserIdFromSession(request);
  if (!userId) {
    // React Router では redirect を throw するのが有効なパターン
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect("/login");
  }
  return userId;
}

/**
 * ログアウト処理
 */
export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
