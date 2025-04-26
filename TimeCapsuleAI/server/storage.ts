import { 
  users, type User, type InsertUser,
  timeCapsuleConversations, type TimeCapsuleConversation, type InsertTimeCapsuleConversation
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Time Capsule Conversation methods
  createConversation(conversation: InsertTimeCapsuleConversation): Promise<TimeCapsuleConversation>;
  getConversation(id: number): Promise<TimeCapsuleConversation | undefined>;
  getConversationsByUserId(userId: number): Promise<TimeCapsuleConversation[]>;
  updateConversation(id: number, updates: Partial<InsertTimeCapsuleConversation>): Promise<TimeCapsuleConversation | undefined>;
  deleteConversation(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, TimeCapsuleConversation>;
  private currentUserId: number;
  private currentConversationId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.currentUserId = 1;
    this.currentConversationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createConversation(insertConversation: InsertTimeCapsuleConversation): Promise<TimeCapsuleConversation> {
    const id = this.currentConversationId++;
    const conversation: TimeCapsuleConversation = { 
      ...insertConversation, 
      id, 
      createdAt: new Date() 
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: number): Promise<TimeCapsuleConversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversationsByUserId(userId: number): Promise<TimeCapsuleConversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conversation) => conversation.userId === userId
    );
  }

  async updateConversation(id: number, updates: Partial<InsertTimeCapsuleConversation>): Promise<TimeCapsuleConversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;

    const updatedConversation = {
      ...conversation,
      ...updates,
    };

    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }

  async deleteConversation(id: number): Promise<boolean> {
    return this.conversations.delete(id);
  }
}

export const storage = new MemStorage();
