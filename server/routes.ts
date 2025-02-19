import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPostSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Get all posts with user info
  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.getAllPosts();
    res.json(posts);
  });

  // Get trending posts
  app.get("/api/posts/trending", async (_req, res) => {
    const posts = await storage.getTrendingPosts();
    res.json(posts);
  });

  // Create a new post
  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const parsed = insertPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).send(parsed.error.message);
    }

    const post = await storage.createPost({
      ...parsed.data,
      userId: req.user.id,
    });
    res.status(201).json(post);
  });

  // Like a post
  app.post("/api/posts/:id/like", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const postId = parseInt(req.params.id);
    await storage.likePost(postId);
    res.sendStatus(200);
  });

  // Get leaderboard
  app.get("/api/users/leaderboard", async (_req, res) => {
    const users = await storage.getLeaderboard();
    res.json(users);
  });

  const httpServer = createServer(app);
  return httpServer;
}
