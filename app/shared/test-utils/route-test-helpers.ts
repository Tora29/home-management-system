/**
 * React Router v7 の action/loader をテストするためのヘルパー関数
 *
 * React Router v7 では Route.ActionArgs / Route.LoaderArgs の内部型が
 * unstable_pattern などの追加プロパティを要求するため、
 * 直接 { request, params, context } を渡すと型エラーになる。
 * このヘルパーを使用して型の問題を回避する。
 */

/**
 * action/loader に渡す引数を作成する
 * React Router v7 の内部型との互換性を保つため unknown にキャストする
 */
export function createActionArgs<TParams = Record<string, string>>(args: {
  request: Request;
  params: TParams;
  context?: Record<string, unknown>;
}): unknown {
  return {
    request: args.request,
    params: args.params,
    context: args.context ?? {},
  };
}

export function createLoaderArgs<TParams = Record<string, string>>(args: {
  request: Request;
  params: TParams;
  context?: Record<string, unknown>;
}): unknown {
  return {
    request: args.request,
    params: args.params,
    context: args.context ?? {},
  };
}

/**
 * action/loader の戻り値から data と init を取得する型
 */
export type DataResponse<T> = {
  data: T;
  init: { status: number };
};

/**
 * action/loader の戻り値を DataResponse 型に変換する
 * 型安全性を維持しつつ、テスト内で結果を扱いやすくする
 */
export function asDataResponse<T>(result: unknown): DataResponse<T> {
  return result as DataResponse<T>;
}

/**
 * FormData を作成するヘルパー
 */
export function createFormData(data: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

/**
 * POST リクエストを作成するヘルパー
 */
export function createPostRequest(url: string, formData: FormData): Request {
  return new Request(url, {
    method: "POST",
    body: formData,
  });
}

/**
 * GET リクエストを作成するヘルパー
 */
export function createGetRequest(url: string): Request {
  return new Request(url, {
    method: "GET",
  });
}
