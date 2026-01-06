// React・ライブラリ
import { Form, Link } from "react-router";
import { LogOut, Package, Plus } from "lucide-react";

// アプリケーションヘッダー（認証済みページ用）
export function AppHeader() {
  return (
    <header className="relative bg-cyber-dark/95 backdrop-blur-sm border-b border-cyber-border">
      {/* 上部ライン */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyber-cyan to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-cyber-surface border border-cyber-cyan flex items-center justify-center"
              style={{
                clipPath:
                  "polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)",
              }}
            >
              <Package
                size={20}
                className="text-cyber-cyan"
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="text-cyber-text font-mono text-sm tracking-wider block">
                HOME MANAGEMENT SYSTEM
              </span>
              {/* オンラインステータス */}
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <div className="w-1.5 h-1.5 bg-cyber-green rounded-full" />
                  <div className="absolute inset-0 w-1.5 h-1.5 bg-cyber-green rounded-full animate-ping opacity-50" />
                </div>
                <span className="text-cyber-green text-[10px] font-mono uppercase tracking-widest">
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="flex items-center gap-4">
            {/* 入荷登録ボタン */}
            <Link
              to="/stock/add"
              className="
                flex items-center gap-2
                bg-cyber-cyan/10
                border border-cyber-cyan
                text-cyber-cyan
                px-4 py-2
                font-mono text-sm uppercase tracking-wider
                transition-all duration-200
                hover:bg-cyber-cyan hover:text-cyber-dark
                hover:shadow-neon-cyan
              "
              style={{
                clipPath:
                  "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
              }}
            >
              <Plus size={16} aria-hidden="true" />
              <span>入荷登録</span>
            </Link>

            {/* ログアウトボタン */}
            <Form method="post">
              <button
                type="submit"
                className="
                  flex items-center gap-2
                  bg-cyber-red/10
                  border border-cyber-red
                  text-cyber-red
                  px-3 py-2
                  font-mono text-sm uppercase tracking-wider
                  transition-all duration-200
                  hover:bg-cyber-red hover:text-white
                  hover:shadow-[0_0_20px_rgba(255,0,68,0.5)]
                "
                style={{
                  clipPath:
                    "polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)",
                }}
              >
                <LogOut size={16} aria-hidden="true" />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            </Form>
          </div>
        </div>
      </div>

      {/* 下部ライン */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-cyber-border" />
    </header>
  );
}
