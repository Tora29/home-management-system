// React・ライブラリ
import { data, Link, useActionData, useSearchParams } from "react-router";

// 型定義
import type { Route } from "./+types/route";

// サービス
import * as authService from "./service/auth.service";

// 共有コンポーネント
import { CyberpunkBackground } from "~/shared/components/CyberpunkBackground";
import { createUserSession } from "~/shared/lib/session.server";

// ローカルコンポーネント
import { LoginForm } from "./components/LoginForm";

// メタ情報
export function meta(_args: Route.MetaArgs) {
  return [
    { title: "LOGIN - Home Management System" },
    { name: "description", content: "Home Management System へログイン" },
  ];
}

// action
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = await authService.login({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    switch (result.type) {
      case "validation":
        return data({ errors: result.errors }, { status: 400 });
      case "auth":
        return data({ authError: result.message }, { status: 401 });
    }
  }

  // セッションを作成してダッシュボードへリダイレクト
  return createUserSession(result.data.user.id, "/dashboard");
}

// ログインページコンポーネント
export default function LoginPage(_props: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  const errors =
    actionData && "errors" in actionData ? actionData.errors : null;
  const authError =
    actionData && "authError" in actionData ? actionData.authError : null;
  const resetSuccess = searchParams.get("reset") === "success";

  // アラートの決定
  const alert = resetSuccess
    ? {
        type: "success" as const,
        message:
          "パスワードが変更されました。新しいパスワードでログインしてください。",
      }
    : authError
      ? { type: "error" as const, message: authError }
      : undefined;

  return (
    <div
      className="
        min-h-screen cyberpunk-bg
        flex flex-col items-center justify-center px-4
        relative
        overflow-hidden
      "
    >
      <CyberpunkBackground />

      {/* HUDパネル */}
      <div
        className="
          relative
          w-full max-w-md
          bg-cyber-surface
          overflow-hidden
        "
        style={{
          clipPath:
            "polygon(20px 0%, calc(100% - 20px) 0%, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0% calc(100% - 20px), 0% 20px)",
        }}
      >
        {/* ボックス内を浮遊する発光体群 */}

        {/* シアン系 - パーティクル1 */}
        <div className="cyberpunk-float-1 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-1 w-6 h-6 rounded-full bg-cyber-cyan/40 blur-[10px]"
            style={{
              boxShadow:
                "0 0 20px rgba(0,240,255,0.3), 0 0 40px rgba(0,240,255,0.15)",
            }}
          />
          <div className="cyberpunk-glow-1 absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-cyber-cyan/08 blur-[25px]" />
        </div>

        {/* シアン系 - パーティクル2 */}
        <div className="cyberpunk-float-2 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-3 w-5 h-5 rounded-full bg-cyber-cyan/35 blur"
            style={{
              boxShadow:
                "0 0 15px rgba(0,240,255,0.25), 0 0 30px rgba(0,240,255,0.12)",
            }}
          />
          <div className="cyberpunk-glow-3 absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-cyber-cyan/06 blur-[20px]" />
        </div>

        {/* シアン系 - パーティクル3 */}
        <div className="cyberpunk-float-3 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-2 w-4 h-4 rounded-full bg-cyber-cyan/30 blur-[7px]"
            style={{
              boxShadow:
                "0 0 12px rgba(0,240,255,0.2), 0 0 25px rgba(0,240,255,0.1)",
            }}
          />
          <div className="cyberpunk-glow-2 absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-cyber-cyan/05 blur-[18px]" />
        </div>

        {/* マゼンタ系 - パーティクル4 */}
        <div className="cyberpunk-float-4 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-4 w-5 h-5 rounded-full bg-cyber-magenta/38 blur-[9px]"
            style={{
              boxShadow:
                "0 0 18px rgba(255,0,255,0.28), 0 0 35px rgba(255,0,255,0.14)",
            }}
          />
          <div className="cyberpunk-glow-4 absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-cyber-magenta/07 blur-[22px]" />
        </div>

        {/* マゼンタ系 - パーティクル5 */}
        <div className="cyberpunk-float-5 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-1 w-4 h-4 rounded-full bg-cyber-magenta/32 blur-[7px]"
            style={{
              boxShadow:
                "0 0 14px rgba(255,0,255,0.22), 0 0 28px rgba(255,0,255,0.11)",
            }}
          />
          <div className="cyberpunk-glow-1 absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-cyber-magenta/05 blur-[18px]" />
        </div>

        {/* マゼンタ系 - パーティクル6 */}
        <div className="cyberpunk-float-6 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-3 w-3 h-3 rounded-full bg-cyber-magenta/28 blur-[6px]"
            style={{
              boxShadow:
                "0 0 10px rgba(255,0,255,0.18), 0 0 22px rgba(255,0,255,0.09)",
            }}
          />
          <div className="cyberpunk-glow-3 absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-cyber-magenta/04 blur-[15px]" />
        </div>

        {/* グラデーションボーダー効果 */}
        <div
          className="absolute inset-0 bg-linear-to-br from-cyber-cyan/20 via-transparent to-cyber-magenta/20"
          style={{
            clipPath:
              "polygon(20px 0%, calc(100% - 20px) 0%, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0% calc(100% - 20px), 0% 20px)",
          }}
        />

        {/* 上部ボーダーライン */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-cyber-cyan to-transparent" />

        {/* 左上コーナーブラケット + 回路ライン */}
        <div className="absolute top-4 left-4">
          <div className="w-6 h-6 border-t-2 border-l-2 border-cyber-cyan" />
          <div className="absolute top-0 left-6 w-12 h-0.5 bg-linear-to-r from-cyber-cyan to-transparent" />
          <div className="absolute top-[-3px] left-[72px] w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.6)] animate-pulse" />
        </div>

        {/* 右上コーナーブラケット */}
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 border-t-2 border-r-2 border-cyber-cyan" />
        </div>

        {/* 右上識別子 */}
        <div className="absolute top-6 right-12 flex items-center gap-2">
          <span className="text-cyber-text-dim text-[10px] font-mono tracking-widest">
            AUTH-7X
          </span>
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
            <div
              className="w-1.5 h-1.5 rounded-full bg-cyber-cyan/40"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full bg-cyber-cyan/40"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>

        {/* 左下コーナーブラケット */}
        <div className="absolute bottom-4 left-4">
          <div className="w-6 h-6 border-b-2 border-l-2 border-cyber-magenta" />
        </div>

        {/* 右下コーナーブラケット + 回路ライン */}
        <div className="absolute bottom-4 right-4">
          <div className="w-6 h-6 border-b-2 border-r-2 border-cyber-magenta" />
          <div className="absolute bottom-0 right-6 w-16 h-0.5 bg-linear-to-l from-cyber-magenta to-transparent" />
          <div className="absolute bottom-[-3px] right-[88px] w-2 h-2 rounded-full bg-cyber-magenta shadow-[0_0_10px_rgba(255,0,255,0.6)] animate-pulse" />
        </div>

        {/* メインコンテンツ */}
        <div className="relative p-8 pt-12">
          {/* ヘッダー */}
          <header className="text-center mb-8">
            <h1 className="text-2xl font-mono font-bold tracking-wider text-cyber-cyan uppercase">
              LOGIN
            </h1>
            <p className="mt-2 text-sm text-cyber-text-dim font-mono tracking-wide">
              SYSTEM AUTHENTICATION REQUIRED
            </p>
          </header>

          {/* アラート */}
          {alert && (
            <div
              role="alert"
              className={`
                relative mb-6 p-4 text-sm font-mono
                ${
                  alert.type === "success"
                    ? "border-l-4 border-cyber-green bg-cyber-green/10 text-cyber-green"
                    : "border-l-4 border-cyber-red bg-cyber-red/10 text-cyber-red"
                }
              `}
            >
              {/* ステータスドット */}
              <div className="absolute top-4 right-4">
                <div
                  className={`w-2 h-2 rounded-full ${alert.type === "success" ? "bg-cyber-green" : "bg-cyber-red"} animate-pulse`}
                />
              </div>
              <span className="text-[10px] uppercase tracking-widest block mb-1">
                {alert.type === "success" ? "SUCCESS" : "ERROR"}
              </span>
              {alert.message}
            </div>
          )}

          {/* フォーム */}
          <LoginForm errors={errors} />

          {/* フッター */}
          <div className="mt-8 space-y-4 text-center">
            {/* パスワードリセット */}
            <div>
              <Link
                to="/password-reset"
                className="
                  text-sm font-mono text-cyber-text-dim
                  hover:text-cyber-cyan
                  transition-colors
                "
              >
                FORGOT PASSWORD?
              </Link>
            </div>

            {/* セパレーター */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-linear-to-r from-transparent to-cyber-border" />
              <span className="text-[10px] font-mono text-cyber-text-dim tracking-widest">
                OR
              </span>
              <div className="flex-1 h-px bg-linear-to-l from-transparent to-cyber-border" />
            </div>

            {/* 新規登録リンク */}
            <p className="text-sm font-mono text-cyber-text-dim">
              NO ACCOUNT?{" "}
              <Link
                to="/register"
                className="text-cyber-magenta hover:text-cyber-pink transition-colors"
              >
                REGISTER
              </Link>
            </p>
          </div>
        </div>

        {/* 下部ボーダーライン */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-cyber-magenta via-transparent to-cyber-cyan" />
      </div>

      {/* フッター識別子 */}
      <div className="mt-8 flex items-center gap-3 relative z-10">
        <div className="flex gap-1">
          <div className="w-3 h-1 rounded-full bg-cyber-cyan animate-pulse" />
          <div
            className="w-2 h-1 rounded-full bg-cyber-cyan/50"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="w-1 h-1 rounded-full bg-cyber-cyan/30"
            style={{ animationDelay: "0.6s" }}
          />
        </div>
        <span className="text-[10px] font-mono text-cyber-text-dim tracking-widest">
          HOME.MGMT.SYS v2.0
        </span>
        <div className="flex gap-1">
          <div
            className="w-1 h-1 rounded-full bg-cyber-magenta/30"
            style={{ animationDelay: "0.6s" }}
          />
          <div
            className="w-2 h-1 rounded-full bg-cyber-magenta/50"
            style={{ animationDelay: "0.3s" }}
          />
          <div className="w-3 h-1 rounded-full bg-cyber-magenta animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ErrorBoundary
export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
