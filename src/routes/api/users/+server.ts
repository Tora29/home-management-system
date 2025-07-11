import { json } from '@sveltejs/kit';
import { prisma } from '$shared/utils/prisma';
import { ERROR_MESSAGES } from '$shared/constants/messages';
import type { RequestHandler } from './$types';

/**
 * 全てのユーザーを取得するAPIエンドポイント
 * @returns 作成日時の降順でソートされたユーザー一覧
 */
export const GET: RequestHandler = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return json({ error: ERROR_MESSAGES.USER_NOT_FOUND }, { status: 500 });
  }
};

/**
 * 新しいユーザーを作成するAPIエンドポイント
 * @param request - リクエストオブジェクト（email, nameを含む）
 * @returns 作成されたユーザー情報
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, name }: { email: string; name?: string } = await request.json();
    
    if (!email) {
      return json({ error: ERROR_MESSAGES.EMAIL_REQUIRED }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name
      }
    });
    
    return json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return json({ error: ERROR_MESSAGES.USER_CREATE_FAILED }, { status: 500 });
  }
};