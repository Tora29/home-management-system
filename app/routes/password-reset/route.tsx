// React・ライブラリ
import { data, Link, useActionData } from "react-router";

// 型定義
import type { Route } from "./+types/route";

// サービス
import * as passwordResetService from "./service/password-reset.service";

// ローカルコンポーネント
import { PasswordResetForm } from "./components/PasswordResetForm";
import { SuccessMessage } from "./components/SuccessMessage";

// メタ情報
export function meta(_args: Route.MetaArgs) {
  return [
    { title: "PASSWORD RESET - Home Management System" },
    {
      name: "description",
      content: "パスワードリセット用のリンクをメールで送信します",
    },
  ];
}

// action - リセットリンク送信
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const baseUrl = new URL(request.url).origin;

  const result = await passwordResetService.requestPasswordReset(
    { email: formData.get("email") },
    baseUrl
  );

  if (!result.success) {
    return data({ errors: result.errors }, { status: 400 });
  }

  return { success: true, resetUrl: result.data.resetUrl };
}

// パスワードリセット要求ページコンポーネント
export default function PasswordResetRequestPage(_props: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();

  const errors =
    actionData && "errors" in actionData ? actionData.errors : null;
  const success = actionData && "success" in actionData && actionData.success;
  const resetUrl =
    actionData && "resetUrl" in actionData ? actionData.resetUrl : null;

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
          className="absolute w-32 h-32 rounded-full bg-[#00f0ff] blur-[80px] cyberpunk-flicker-1"
          style={{ top: "10%", left: "15%" }}
        />
        <div
          className="absolute w-24 h-24 rounded-full bg-[#00f0ff] blur-[60px] cyberpunk-flicker-2"
          style={{ top: "60%", right: "10%" }}
        />

        {/* マゼンタ系ライト */}
        <div
          className="absolute w-28 h-28 rounded-full bg-[#ff00ff] blur-[70px] cyberpunk-flicker-3"
          style={{ top: "25%", right: "20%" }}
        />
        <div
          className="absolute w-20 h-20 rounded-full bg-[#ff00ff] blur-[50px] cyberpunk-flicker-5"
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
          bg-[#10101a]
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
            className="cyberpunk-glow-1 w-6 h-6 rounded-full bg-[#00f0ff]/40 blur-[10px]"
            style={{
              boxShadow:
                "0 0 20px rgba(0,240,255,0.3), 0 0 40px rgba(0,240,255,0.15)",
            }}
          />
          <div className="cyberpunk-glow-1 absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-[#00f0ff]/08 blur-[25px]" />
        </div>

        {/* シアン系 - パーティクル2 */}
        <div className="cyberpunk-float-2 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-3 w-5 h-5 rounded-full bg-[#00f0ff]/35 blur-[8px]"
            style={{
              boxShadow:
                "0 0 15px rgba(0,240,255,0.25), 0 0 30px rgba(0,240,255,0.12)",
            }}
          />
          <div className="cyberpunk-glow-3 absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-[#00f0ff]/06 blur-[20px]" />
        </div>

        {/* シアン系 - パーティクル3 */}
        <div className="cyberpunk-float-3 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-2 w-4 h-4 rounded-full bg-[#00f0ff]/30 blur-[7px]"
            style={{
              boxShadow:
                "0 0 12px rgba(0,240,255,0.2), 0 0 25px rgba(0,240,255,0.1)",
            }}
          />
          <div className="cyberpunk-glow-2 absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-[#00f0ff]/05 blur-[18px]" />
        </div>

        {/* マゼンタ系 - パーティクル4 */}
        <div className="cyberpunk-float-4 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-4 w-5 h-5 rounded-full bg-[#ff00ff]/38 blur-[9px]"
            style={{
              boxShadow:
                "0 0 18px rgba(255,0,255,0.28), 0 0 35px rgba(255,0,255,0.14)",
            }}
          />
          <div className="cyberpunk-glow-4 absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-[#ff00ff]/07 blur-[22px]" />
        </div>

        {/* マゼンタ系 - パーティクル5 */}
        <div className="cyberpunk-float-5 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-1 w-4 h-4 rounded-full bg-[#ff00ff]/32 blur-[7px]"
            style={{
              boxShadow:
                "0 0 14px rgba(255,0,255,0.22), 0 0 28px rgba(255,0,255,0.11)",
            }}
          />
          <div className="cyberpunk-glow-1 absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-[#ff00ff]/05 blur-[18px]" />
        </div>

        {/* マゼンタ系 - パーティクル6 */}
        <div className="cyberpunk-float-6 absolute pointer-events-none z-20">
          <div
            className="cyberpunk-glow-3 w-3 h-3 rounded-full bg-[#ff00ff]/28 blur-[6px]"
            style={{
              boxShadow:
                "0 0 10px rgba(255,0,255,0.18), 0 0 22px rgba(255,0,255,0.09)",
            }}
          />
          <div className="cyberpunk-glow-3 absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-[#ff00ff]/04 blur-[15px]" />
        </div>

        {/* グラデーションボーダー効果 */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/20 via-transparent to-[#ff00ff]/20"
          style={{
            clipPath:
              "polygon(20px 0%, calc(100% - 20px) 0%, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0% calc(100% - 20px), 0% 20px)",
          }}
        />

        {/* 上部ボーダーライン */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />

        {/* 左上コーナーブラケット + 回路ライン */}
        <div className="absolute top-4 left-4">
          <div className="w-6 h-6 border-t-2 border-l-2 border-[#00f0ff]" />
          <div className="absolute top-0 left-6 w-12 h-[2px] bg-gradient-to-r from-[#00f0ff] to-transparent" />
          <div className="absolute top-[-3px] left-[72px] w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.6)] animate-pulse" />
        </div>

        {/* 右上コーナーブラケット */}
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 border-t-2 border-r-2 border-[#00f0ff]" />
        </div>

        {/* 右上識別子 */}
        <div className="absolute top-6 right-12 flex items-center gap-2">
          <span className="text-[#606080] text-[10px] font-mono tracking-widest">
            RST-PW
          </span>
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]/40"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>

        {/* 左下コーナーブラケット */}
        <div className="absolute bottom-4 left-4">
          <div className="w-6 h-6 border-b-2 border-l-2 border-[#ff00ff]" />
        </div>

        {/* 右下コーナーブラケット + 回路ライン */}
        <div className="absolute bottom-4 right-4">
          <div className="w-6 h-6 border-b-2 border-r-2 border-[#ff00ff]" />
          <div className="absolute bottom-0 right-6 w-16 h-[2px] bg-gradient-to-l from-[#ff00ff] to-transparent" />
          <div className="absolute bottom-[-3px] right-[88px] w-2 h-2 rounded-full bg-[#ff00ff] shadow-[0_0_10px_rgba(255,0,255,0.6)] animate-pulse" />
        </div>

        {/* メインコンテンツ */}
        <div className="relative p-8 pt-12">
          {/* ヘッダー */}
          <header className="text-center mb-8">
            <h1 className="text-2xl font-mono font-bold tracking-wider text-[#00f0ff] uppercase">
              PASSWORD RESET
            </h1>
            <p className="mt-2 text-sm text-[#606080] font-mono tracking-wide">
              ENTER YOUR REGISTERED EMAIL
            </p>
          </header>

          {/* 成功メッセージ */}
          {success && <SuccessMessage resetUrl={resetUrl} />}

          {/* リセット要求フォーム */}
          {!success && <PasswordResetForm errors={errors} />}

          {/* フッター */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="
                text-sm font-mono text-[#606080]
                hover:text-[#00f0ff]
                transition-colors
              "
            >
              BACK TO LOGIN
            </Link>
          </div>
        </div>

        {/* 下部ボーダーライン */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff00ff] via-transparent to-[#00f0ff]" />
      </div>

      {/* フッター識別子 */}
      <div className="mt-8 flex items-center gap-3 relative z-10">
        <div className="flex gap-1">
          <div className="w-3 h-1 rounded-full bg-[#00f0ff] animate-pulse" />
          <div className="w-2 h-1 rounded-full bg-[#00f0ff]/50" />
          <div className="w-1 h-1 rounded-full bg-[#00f0ff]/30" />
        </div>
        <span className="text-[10px] font-mono text-[#606080] tracking-widest">
          HOME.MGMT.SYS v2.0
        </span>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-[#ff00ff]/30" />
          <div className="w-2 h-1 rounded-full bg-[#ff00ff]/50" />
          <div className="w-3 h-1 rounded-full bg-[#ff00ff] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ErrorBoundary
export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
