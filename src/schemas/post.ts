import { pgTable, serial, text, integer,json } from 'drizzle-orm/pg-core';
import { users } from './user';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey().notNull(), // Auto-incrementing ID
  title: text('title').notNull(), // Title field
  description: text('description').notNull(), // Description field
  user_id: integer('user_id').references(() => users.id).notNull(), // Foreign key to users table
  images:json('images').$type<string[]>().default([]), // JSON array of strings for images
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostTable = typeof posts;