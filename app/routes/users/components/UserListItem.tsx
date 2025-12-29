import { Form } from "react-router";
import type { User } from "../schema";

type UserListItemProps = {
  user: User;
  isEditing: boolean;
  isSubmitting: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
};

export function UserListItem({
  user,
  isEditing,
  isSubmitting,
  onEdit,
  onCancelEdit,
}: UserListItemProps) {
  if (isEditing) {
    return (
      <Form
        method="post"
        className="flex flex-wrap items-center gap-4"
        onSubmit={onCancelEdit}
      >
        <input type="hidden" name="intent" value="update" />
        <input type="hidden" name="id" value={user.id} />
        <input
          type="email"
          name="email"
          defaultValue={user.email}
          required
          className="flex-1 min-w-[200px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="text"
          name="name"
          defaultValue={user.name ?? ""}
          placeholder="名前"
          className="flex-1 min-w-[150px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            保存
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
        </div>
      </Form>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900">{user.name || "(名前なし)"}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-xs text-gray-400">
          作成日: {new Date(user.createdAt).toLocaleDateString("ja-JP")}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          編集
        </button>
        <Form method="post">
          <input type="hidden" name="intent" value="delete" />
          <input type="hidden" name="id" value={user.id} />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            削除
          </button>
        </Form>
      </div>
    </div>
  );
}
