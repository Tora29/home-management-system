type UserFormProps = {
  isSubmitting: boolean;
};

export function UserForm({ isSubmitting }: UserFormProps) {
  return (
    <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">ユーザー作成</h2>
      <form method="post" className="flex flex-wrap gap-4">
        <input type="hidden" name="intent" value="create" />
        <input
          type="email"
          name="email"
          placeholder="メールアドレス"
          required
          className="flex-1 min-w-[200px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="text"
          name="name"
          placeholder="名前（任意）"
          className="flex-1 min-w-[150px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "作成中..." : "作成"}
        </button>
      </form>
    </section>
  );
}
