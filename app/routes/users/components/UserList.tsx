import type { User } from "../schema";
import { UserListItem } from "./UserListItem";

type UserListProps = {
  users: User[];
  editingId: string | null;
  isSubmitting: boolean;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
};

export function UserList({
  users,
  editingId,
  isSubmitting,
  onEdit,
  onCancelEdit,
}: UserListProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          ユーザー一覧 ({users.length}件)
        </h2>
      </div>

      {users.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-500">
          ユーザーがいません。上のフォームから作成してください。
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="px-6 py-4">
              <UserListItem
                user={user}
                isEditing={editingId === user.id}
                isSubmitting={isSubmitting}
                onEdit={() => onEdit(user.id)}
                onCancelEdit={onCancelEdit}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
