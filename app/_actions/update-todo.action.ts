'use server';

import { db } from '@/lib/database';
import { todo } from '@/lib/database/schema';
import { eq, SQLWrapper } from 'drizzle-orm';

export const updateTodo = async (
  id: number | SQLWrapper,
  updatedTodo: string,
) => {
  try {
    // const targetTodo = await db.select().from(todo).where(eq(todo.id,id));

    // if(targetTodo.)

    const result = await db.transaction(async (txs) => {
      const targetTodo = await txs.select().from(todo).where(eq(todo.id, id));

      if (!targetTodo) throw new Error('Todo not found!');

      return await db
        .update(todo)
        .set({ todo: updatedTodo })
        .where(eq(todo.id, id))
        .returning({
          id: todo.id,
          updated_at: todo.updated_at,
        });
    });

    return result;
  } catch (e) {
    throw e;
  }
};
