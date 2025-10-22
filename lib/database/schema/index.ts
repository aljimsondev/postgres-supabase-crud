import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const todo = pgTable('todo', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  todo: text().notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

export type Todo = typeof todo.$inferSelect;
