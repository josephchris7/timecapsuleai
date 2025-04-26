import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const timeCapsuleConversations = pgTable("time_capsule_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  mode: text("mode").notNull(), // 'past' or 'future'
  timeFrame: text("time_frame").notNull(), // '1m', '3m', '6m', '1y', '2y', '5y'
  context: text("context").notNull(), // 'product', 'team', 'revenue', 'strategy'
  currentSituation: text("current_situation").notNull(),
  messages: jsonb("messages").notNull().$type<Array<{
    role: string;
    content: string;
    timestamp: string;
  }>>(),
  insights: jsonb("insights").$type<{
    keyDifferences: string[];
    successfulPredictions: string[];
    missedOpportunities: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTimeCapsuleConversationSchema = createInsertSchema(timeCapsuleConversations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TimeCapsuleConversation = typeof timeCapsuleConversations.$inferSelect;
export type InsertTimeCapsuleConversation = z.infer<typeof insertTimeCapsuleConversationSchema>;

export const messageSchema = z.object({
  role: z.string(),
  content: z.string(),
  timestamp: z.string(),
});

export const insightsSchema = z.object({
  keyDifferences: z.array(z.string()),
  successfulPredictions: z.array(z.string()),
  missedOpportunities: z.array(z.string()),
});
