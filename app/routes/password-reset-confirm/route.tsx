// React・ライブラリ
import { data, Link, redirect, useActionData } from "react-router";

// 型定義
import type { Route } from "./+types/route";

// サービス
import * as passwordResetConfirmService from "./service/password-reset-confirm.service";

// ローカルコンポーネント
import { PasswordResetConfirmForm } from "./components/PasswordResetConfirmForm";

// メタ情報
export function meta(_args: Route.MetaArgs) {
  return [
    { title: "SET NEW PASSWORD - Home Management System" },
    { name: "description", content: "新しいパスワードを設定します" },
  ];
}

// loader - トークンの有効性を確認
export async function loader({ params }: Route.LoaderArgs) {
  return passwordResetConfirmService.validateToken(params.token);
}

// action - 新しいパスワードを設定
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = await passwordResetConfirmService.resetPassword(params.token, {
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!result.success) {
    switch (result.type) {
      case "validation":
        return data({ errors: result.errors }, { status: 400 });
      case "token":
        return data({ tokenError: result.message }, { status: 400 });
    }
  }

  // ログインページへリダイレクト（成功メッセージ付き）
  return redirect("/login?reset=success");
}

// 新パスワード設定ページコンポーネント
export default function PasswordResetConfirmPage({
  loaderData,
}: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();

  const errors =
    actionData && "errors" in actionData ? actionData.errors : null;
  const tokenError =
    actionData && "tokenError" in actionData ? actionData.tokenError : null;

  // トークンが無効な場合
  if (!loaderData.success) {
    return (
      <div
        className="
          min-h-screen cyberpunk-bg
          flex flex-col items-center justify-center px-4
          relative
          overflow-hidden
        "
      >
        {/* 背景の点滅ライト */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-32 h-32 rounded-full bg-cyber-red blur-[80px] cyberpunk-flicker-1"
            style={{ top: "10%", left: "15%" }}
          />
          <div
            className="absolute w-28 h-28 rounded-full bg-cyber-magenta blur-[70px] cyberpunk-flicker-3"
            style={{ top: "25%", right: "20%" }}
          />
        </div>

        {/* スキャンライン効果 */}
        <div className="pointer-events-none absolute inset-0 cyberpunk-scanlines" />

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
          {/* ボックス内を浮遊する発光体群（エラー時は赤系） */}

          {/* レッド系 - パーティクル1 */}
          <div className="cyberpunk-float-1 absolute pointer-events-none z-20">
            <div
              className="cyberpunk-glow-1 w-6 h-6 rounded-full bg-cyber-red/40 blur-[10px]"
              style={{
                boxShadow:
                  "0 0 20px rgba(255,0,68,0.3), 0 0 40px rgba(255,0,68,0.15)",
              }}
            />
            <div className="cyberpunk-glow-1 absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-cyber-red/08 blur-[25px]" />
          </div>

          {/* レッド系 - パーティクル2 */}
          <div className="cyberpunk-float-2 absolute pointer-events-none z-20">
            <div
              className="cyberpunk-glow-3 w-5 h-5 rounded-full bg-cyber-red/35 blur"
              style={{
                boxShadow:
                  "0 0 15px rgba(255,0,68,0.25), 0 0 30px rgba(255,0,68,0.12)",
              }}
            />
            <div className="cyberpunk-glow-3 absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-cyber-red/06 blur-[20px]" />
          </div>

          {/* レッド系 - パーティクル3 */}
          <div className="cyberpunk-float-3 absolute pointer-events-none z-20">
            <div
              className="cyberpunk-glow-2 w-4 h-4 rounded-full bg-cyber-red/30 blur-[7px]"
              style={{
                boxShadow:
                  "0 0 12px rgba(255,0,68,0.2), 0 0 25px rgba(255,0,68,0.1)",
              }}
            />
            <div className="cyberpunk-glow-2 absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-cyber-red/05 blur-[18px]" />
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

          {/* グラデーションボーダー効果（エラー時は赤系） */}
          <div
            className="absolute inset-0 bg-linear-to-br from-cyber-red/20 via-transparent to-cyber-magenta/20"
            style={{
              clipPath:
                "polygon(20px 0%, calc(100% - 20px) 0%, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0% calc(100% - 20px), 0% 20px)",
            }}
          />

          {/* 上部ボーダーライン（エラー時は赤） */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-cyber-red to-transparent" />

          {/* 左上コーナーブラケット */}
          <div className="absolute top-4 left-4">
            <div className="w-6 h-6 border-t-2 border-l-2 border-cyber-red" />
          </div>

          {/* 右上コーナーブラケット */}
          <div className="absolute top-4 right-4">
            <div className="w-6 h-6 border-t-2 border-r-2 border-cyber-red" />
          </div>

          {/* 右上識別子 */}
          <div className="absolute top-6 right-12 flex items-center gap-2">
            <span className="text-cyber-red text-[10px] font-mono tracking-widest">
              ERROR
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse" />
          </div>

          {/* 左下コーナーブラケット */}
          <div className="absolute bottom-4 left-4">
            <div className="w-6 h-6 border-b-2 border-l-2 border-cyber-magenta" />
          </div>

          {/* 右下コーナーブラケット */}
          <div className="absolute bottom-4 right-4">
            <div className="w-6 h-6 border-b-2 border-r-2 border-cyber-magenta" />
          </div>

          {/* メインコンテンツ */}
          <div className="relative p-8 pt-12">
            {/* ヘッダー */}
            <header className="text-center mb-8">
              <h1 className="text-2xl font-mono font-bold tracking-wider text-cyber-red uppercase">
                ERROR
              </h1>
            </header>

            {/* エラーメッセージ */}
            <div
              className="
                relative mb-6 p-4 text-sm font-mono
                border-l-4 border-cyber-red bg-cyber-red/10 text-cyber-red
              "
            >
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 rounded-full bg-cyber-red animate-pulse" />
              </div>
              <span className="text-[10px] uppercase tracking-widest block mb-1">
                INVALID TOKEN
              </span>
              {loaderData.message}
            </div>

            {/* 再申請ボタン */}
            <Link
              to="/password-reset"
              className="
                relative
                block w-full text-center
                bg-cyber-magenta/10
                border border-cyber-magenta
                text-cyber-magenta
                px-6 py-3
                font-mono text-sm uppercase tracking-wider
                transition-all duration-200
                hover:bg-cyber-magenta hover:text-cyber-surface
                hover:shadow-[0_0_20px_rgba(255,0,255,0.5)]
              "
              style={{
                clipPath:
                  "polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)",
              }}
            >
              REQUEST NEW RESET LINK
            </Link>

            {/* フッター */}
            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="
                  text-sm font-mono text-cyber-text-dim
                  hover:text-cyber-cyan
                  transition-colors
                "
              >
                BACK TO LOGIN
              </Link>
            </div>
          </div>

          {/* 下部ボーダーライン */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-cyber-magenta via-transparent to-cyber-red" />
        </div>

        {/* フッター識別子 */}
        <div className="mt-8 flex items-center gap-3 relative z-10">
          <div className="flex gap-1">
            <div className="w-3 h-1 rounded-full bg-cyber-red animate-pulse" />
            <div className="w-2 h-1 rounded-full bg-cyber-red/50" />
            <div className="w-1 h-1 rounded-full bg-cyber-red/30" />
          </div>
          <span className="text-[10px] font-mono text-cyber-text-dim tracking-widest">
            HOME.MGMT.SYS v2.0
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-cyber-magenta/30" />
            <div className="w-2 h-1 rounded-full bg-cyber-magenta/50" />
            <div className="w-3 h-1 rounded-full bg-cyber-magenta animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen cyberpunk-bg
        flex flex-col items-center justify-center px-4
        relative
        overflow-hidden
      "
    >
      {/* 背景の点滅ライト */}
      <div className="absolute inset-0 pointer-events-none">
        {/* シアン系ライト */}
        <div
          className="absolute w-32 h-32 rounded-full bg-cyber-cyan blur-[80px] cyberpunk-flicker-1"
          style={{ top: "10%", left: "15%" }}
        />
        <div
          className="absolute w-24 h-24 rounded-full bg-cyber-cyan blur-[60px] cyberpunk-flicker-2"
          style={{ top: "60%", right: "10%" }}
        />

        {/* マゼンタ系ライト */}
        <div
          className="absolute w-28 h-28 rounded-full bg-cyber-magenta blur-[70px] cyberpunk-flicker-3"
          style={{ top: "25%", right: "20%" }}
        />
        <div
          className="absolute w-20 h-20 rounded-full bg-cyber-magenta blur-[50px] cyberpunk-flicker-5"
          style={{ bottom: "30%", left: "15%" }}
        />
      </div>

      {/* スキャンライン効果 */}
      <div className="pointer-events-none absolute inset-0 cyberpunk-scanlines" />

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
            NEW-PW
          </span>
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
            <div
              className="w-1.5 h-1.5 rounded-full bg-cyber-cyan/40"
              style={{ animationDelay: "0.2s" }}
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
              SET NEW PASSWORD
            </h1>
            <p className="mt-2 text-sm text-cyber-text-dim font-mono tracking-wide">
              {loaderData.data.email}
            </p>
          </header>

          {/* トークンエラーアラート */}
          {tokenError && (
            <div
              className="
                relative mb-6 p-4 text-sm font-mono
                border-l-4 border-cyber-red bg-cyber-red/10 text-cyber-red
              "
            >
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 rounded-full bg-cyber-red animate-pulse" />
              </div>
              <span className="text-[10px] uppercase tracking-widest block mb-1">
                ERROR
              </span>
              {tokenError}
            </div>
          )}

          {/* パスワード再設定フォーム */}
          <PasswordResetConfirmForm errors={errors} />

          {/* フッター */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="
                text-sm font-mono text-cyber-text-dim
                hover:text-cyber-cyan
                transition-colors
              "
            >
              BACK TO LOGIN
            </Link>
          </div>
        </div>

        {/* 下部ボーダーライン */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-cyber-magenta via-transparent to-cyber-cyan" />
      </div>

      {/* フッター識別子 */}
      <div className="mt-8 flex items-center gap-3 relative z-10">
        <div className="flex gap-1">
          <div className="w-3 h-1 rounded-full bg-cyber-cyan animate-pulse" />
          <div className="w-2 h-1 rounded-full bg-cyber-cyan/50" />
          <div className="w-1 h-1 rounded-full bg-cyber-cyan/30" />
        </div>
        <span className="text-[10px] font-mono text-cyber-text-dim tracking-widest">
          HOME.MGMT.SYS v2.0
        </span>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-cyber-magenta/30" />
          <div className="w-2 h-1 rounded-full bg-cyber-magenta/50" />
          <div className="w-3 h-1 rounded-full bg-cyber-magenta animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ErrorBoundary
export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
