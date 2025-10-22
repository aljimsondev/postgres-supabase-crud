'use server';

import { db } from '@/lib/database';
import { todo } from '@/lib/database/schema';
import { eq, SQLWrapper } from 'drizzle-orm';

export const deleteTodo = async (id: number | SQLWrapper) => {
  const todoToDelete = await db.select().from(todo).where(eq(todo.id, id));

  if (!todoToDelete) throw new Error('No todo found with this id!');

  return await db
    .delete(todo)
    .where(eq(todo.id, id))
    .returning({ id: todo.id });
};
