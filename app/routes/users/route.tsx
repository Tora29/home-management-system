import { useState } from "react";
import { data, useNavigation } from "react-router";
import type { Route } from "./+types/route";
import * as userService from "./service/user.service";
import { ValidationError, DuplicateEmailError } from "./service/user.service";
import { ERROR_MESSAGES } from "./errorMessage";
import { UserForm } from "./components/UserForm";
import { UserList } from "./components/UserList";
import { SsrDescription } from "./components/SsrDescription";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Users - CRUD Sample" },
    { name: "description", content: "SSR CRUD サンプル（loader/action）" },
  ];
}

// データ取得（loader）
export async function loader(_args: Route.LoaderArgs) {
  const users = await userService.getUsers();
  return { users };
}

// データ更新（action）
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const rawData = Object.fromEntries(formData);

  try {
    switch (intent) {
      case "create": {
        await userService.createUser(rawData);
        return { success: true };
      }

      case "update": {
        await userService.updateUser(rawData);
        return { success: true };
      }

      case "delete": {
        await userService.deleteUser(rawData);
        return { success: true };
      }

      default:
        return data(
          { error: ERROR_MESSAGES.general.invalidRequest },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return data({ error: error.message, details: error.details }, { status: 400 });
    }
    if (error instanceof DuplicateEmailError) {
      return data({ error: error.message }, { status: 400 });
    }
    if (error instanceof Error) {
      return data({ error: error.message }, { status: 400 });
    }
    return data({ error: ERROR_MESSAGES.general.invalidRequest }, { status: 500 });
  }
}

export default function UsersPage({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Users CRUD Sample (SSR)
          </h1>
          <p className="mt-2 text-gray-600">
            loader/action を使ったサーバーサイドでのデータ操作サンプル
          </p>
          <a
            href="/"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            ← ホームに戻る
          </a>
        </header>

        <UserForm isSubmitting={isSubmitting} />

        <UserList
          users={users}
          editingId={editingId}
          isSubmitting={isSubmitting}
          onEdit={setEditingId}
          onCancelEdit={() => setEditingId(null)}
        />

        <SsrDescription />
      </div>
    </div>
  );
}

export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
