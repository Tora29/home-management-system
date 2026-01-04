// 型定義
type AlertType = "success" | "error";

type AuthFormCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  alert?: { type: AlertType; message: string };
};

/**
 * 認証フォーム用のカードレイアウトコンポーネント
 * ヘッダー、アラート、フォーム、フッターを含むレイアウトを提供
 */
export function AuthFormCard({
  title,
  description,
  children,
  footer,
  alert,
}: AuthFormCardProps) {
  return (
    <div className="min-h-screen bg-hig-secondary-background flex flex-col items-center justify-center px-4">
      {/* カード */}
      <div className="w-full max-w-sm bg-hig-background rounded-2xl p-6 shadow-sm">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-hig-label">{title}</h1>
          <p className="mt-2 text-sm text-hig-secondary-label">{description}</p>
        </header>

        {/* アラート */}
        {alert && (
          <div
            role="alert"
            className={`
              mb-6 p-3 rounded-lg text-sm text-center
              ${alert.type === "success" ? "bg-hig-green/10 text-hig-green" : "bg-hig-red/10 text-hig-red"}
            `}
          >
            {alert.message}
          </div>
        )}

        {/* フォーム */}
        {children}

        {/* フッター */}
        {footer && <div className="mt-6 text-center">{footer}</div>}
      </div>

      {/* 著作権表示 */}
      <p className="mt-8 text-xs text-hig-secondary-label">
        Home Management System
      </p>
    </div>
  );
}
