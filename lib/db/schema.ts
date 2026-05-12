import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  tier: text("tier").notNull().default("free"), // free | pro | premium
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const readings = pgTable("readings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id),
  type: text("type").notNull(), // tarot | iching | astrology | dream
  question: text("question").notNull(),
  result: text("result").notNull(), // final AI output
  messagesJson: jsonb("messages_json"), // full conversation for follow-ups
  metadata: jsonb("metadata"), // cards drawn, hexagram, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Reading = typeof readings.$inferSelect;
export type NewReading = typeof readings.$inferInsert;
