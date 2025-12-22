export function SsrDescription() {
  return (
    <section className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h3 className="mb-2 text-base font-medium text-blue-900">
        SSR の仕組み
      </h3>
      <ul className="space-y-2 text-sm text-blue-800">
        <li>
          <strong>loader:</strong> ページ表示前にサーバーでデータを取得
        </li>
        <li>
          <strong>action:</strong> フォーム送信を処理し、データを更新
        </li>
        <li>
          <strong>自動再取得:</strong> action
          完了後、loaderが自動で再実行されUIが更新
        </li>
        <li>
          <strong>プログレッシブエンハンスメント:</strong> JSなしでも動作する
        </li>
      </ul>
    </section>
  );
}
