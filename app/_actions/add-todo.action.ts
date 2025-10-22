'use server';

import { db } from '@/lib/database';
import { todo } from '@/lib/database/schema';

export const addTodo = async (newTodo: string) => {
  return db
    .insert(todo)
    .values({ todo: newTodo })
    .returning({ id: todo.id, created_at: todo.created_at });
};
