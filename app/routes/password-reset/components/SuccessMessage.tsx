type SuccessMessageProps = {
  resetUrl: string | null;
};

/**
 * パスワードリセットリンク送信成功メッセージ
 */
export function SuccessMessage({ resetUrl }: SuccessMessageProps) {
  return (
    <div
      role="alert"
      className="mb-6 p-4 bg-hig-green/10 rounded-lg text-sm text-hig-green"
    >
      <p className="font-medium text-center">リセットリンクを生成しました</p>
      {resetUrl && (
        <a
          href={resetUrl}
          className="mt-3 block p-3 bg-white rounded border border-hig-separator text-hig-blue text-center break-all hover:underline"
        >
          {resetUrl}
        </a>
      )}
      {!resetUrl && (
        <p className="mt-1 text-hig-secondary-label text-center">
          該当するユーザーが見つかりませんでした
        </p>
      )}
    </div>
  );
}
