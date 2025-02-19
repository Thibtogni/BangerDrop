import { users, type User, type InsertUser, type Post, type InsertPost } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllPosts(): Promise<(Post & { user: User })[]>;
  getTrendingPosts(): Promise<(Post & { user: User })[]>;
  createPost(post: InsertPost & { userId: number }): Promise<Post & { user: User }>;
  likePost(postId: number): Promise<void>;
  getLeaderboard(): Promise<User[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
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
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      points: 0,
      avatarUrl: null,
    };
    this.users.set(id, user);
    return user;
  }

  async getAllPosts(): Promise<(Post & { user: User })[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(post => ({
        ...post,
        user: this.users.get(post.userId)!
      }));
  }

  async getTrendingPosts(): Promise<(Post & { user: User })[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10)
      .map(post => ({
        ...post,
        user: this.users.get(post.userId)!
      }));
  }

  async createPost(data: InsertPost & { userId: number }): Promise<Post & { user: User }> {
    const id = this.currentId++;
    const post: Post = {
      ...data,
      id,
      likes: 0,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return {
      ...post,
      user: this.users.get(data.userId)!
    };
  }

  async likePost(postId: number): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.likes += 1;
      // Update user points
      const user = this.users.get(post.userId);
      if (user) {
        user.points += 1;
      }
    }
  }

  async getLeaderboard(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  }
}

export const storage = new MemStorage();