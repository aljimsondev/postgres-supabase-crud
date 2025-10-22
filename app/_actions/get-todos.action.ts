'use server';

import { db } from '@/lib/database';
import { todo } from '@/lib/database/schema';
import { asc } from 'drizzle-orm';

export const getTodos = async () => {
  const todos = await db.select().from(todo).orderBy(asc(todo.created_at));

  return todos;
};
