import { pgTable, serial, text, varchar, integer, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(), // Auto-incrementing ID
  name: varchar('name', { length: 256 }).notNull(), // Name with max length 256
  mobile_number:  varchar('phone'), // Unique mobile number
  address: text('address').notNull(), // Address field
  post_count: integer('post_count').default(0).notNull(), // Post count, default is 0
},
(table) => {
  return {
    mobileNumberIdx: uniqueIndex('mobile_number_idx').on(table.mobile_number), // Unique index on mobile number
  };
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserTable = typeof users;