import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

/**
 * Supabaseクライアントのインスタンス
 * 環境変数から取得したURL・匿名キーを使用してクライアントを作成
 * 認証、データベース操作、リアルタイム機能などに使用
 */
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);