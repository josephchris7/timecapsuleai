import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";
import { messageSchema, insightsSchema } from "@shared/schema";

// Initialize OpenAI with API key from environment
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo_key" });

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to generate conversation response
  app.post("/api/conversations/generate", async (req: Request, res: Response) => {
    try {
      const { mode, timeFrame, context, currentSituation, message, previousMessages } = req.body;
      
      // Validate required fields
      if (!mode || !timeFrame || !context || !currentSituation || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const validatedPreviousMessages = previousMessages ? 
        z.array(messageSchema).parse(previousMessages) : [];
        
      // Build the prompt based on the chosen mode, timeframe, context and current situation
      const timeFrameMap: Record<string, string> = {
        "1m": "1 month",
        "3m": "3 months",
        "6m": "6 months",
        "1y": "1 year",
        "2y": "2 years",
        "5y": "5 years",
      };
      
      const formattedTimeFrame = timeFrameMap[timeFrame] || timeFrame;
      const tenseDirection = mode === "past" ? "ago" : "from now";
      
      // Create system prompt
      let systemPrompt = `You are a Time Capsule AI that simulates a conversation with the user's ${mode} self from ${formattedTimeFrame} ${tenseDirection}.`;
      systemPrompt += ` Focus on the "${context}" context.`;
      
      if (mode === "past") {
        systemPrompt += ` You will answer as if you are the user from ${formattedTimeFrame} ago, using knowledge that would have been available at that time.`;
        systemPrompt += ` The user's current situation is: "${currentSituation}".`;
      } else {
        systemPrompt += ` You will answer as if you are the user ${formattedTimeFrame} in the future, based on reasonable projections from the current situation.`;
        systemPrompt += ` The user's current situation is: "${currentSituation}".`;
      }
      
      // Prepare conversation history for the API
      const messages = [
        { role: "system", content: systemPrompt },
      ];
      
      // Add previous messages to the context
      validatedPreviousMessages.forEach(msg => {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content
        });
      });
      
      // Add the current message
      messages.push({ role: "user", content: message });
      
      // Call OpenAI API
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
      });
      
      const aiResponse = response.choices[0].message.content || "I'm not sure how to respond to that.";
      
      res.status(200).json({ 
        response: aiResponse,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error generating conversation:", error);
      res.status(500).json({ message: "Failed to generate conversation" });
    }
  });
  
  // API endpoint to generate insights
  app.post("/api/conversations/insights", async (req: Request, res: Response) => {
    try {
      const { mode, timeFrame, context, currentSituation, messages } = req.body;
      
      // Validate required fields
      if (!mode || !timeFrame || !context || !currentSituation || !messages) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const validatedMessages = z.array(messageSchema).parse(messages);
      
      // Create prompt for insights generation
      const timeFrameMap: Record<string, string> = {
        "1m": "1 month",
        "3m": "3 months",
        "6m": "6 months",
        "1y": "1 year",
        "2y": "2 years",
        "5y": "5 years",
      };
      
      const formattedTimeFrame = timeFrameMap[timeFrame] || timeFrame;
      const tenseDirection = mode === "past" ? "ago" : "from now";
      
      let prompt = `Based on the following conversation between a user and their ${mode} self from ${formattedTimeFrame} ${tenseDirection} in the "${context}" context, generate insights summary.`;
      prompt += ` Current situation: "${currentSituation}"\n\n`;
      
      // Add conversation to the prompt
      validatedMessages.forEach(msg => {
        prompt += `${msg.role === "user" ? "User" : "AI"}: ${msg.content}\n`;
      });
      
      prompt += `\nGenerate insights in JSON format with three categories:
1. keyDifferences: Array of strings describing key differences between past/present or present/future perspectives
2. successfulPredictions: Array of strings highlighting successful predictions or decisions
3. missedOpportunities: Array of strings noting missed opportunities or areas for improvement`;
      
      // Call OpenAI API
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });
      
      // Parse the response
      const insightsText = response.choices[0].message.content || "";
      try {
        const insights = JSON.parse(insightsText);
        const validatedInsights = insightsSchema.parse(insights);
        
        res.status(200).json(validatedInsights);
      } catch (err) {
        console.error("Error parsing insights:", err);
        res.status(500).json({ message: "Failed to parse insights" });
      }
      
    } catch (error) {
      console.error("Error generating insights:", error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });
  
  // API endpoint to save conversation
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { mode, timeFrame, context, currentSituation, messages, insights } = req.body;
      
      // For simplicity, we'll use null as userId since we don't have auth implementation
      const userId = null;
      
      const conversation = await storage.createConversation({
        userId,
        mode,
        timeFrame,
        context,
        currentSituation,
        messages,
        insights
      });
      
      res.status(201).json(conversation);
      
    } catch (error) {
      console.error("Error saving conversation:", error);
      res.status(500).json({ message: "Failed to save conversation" });
    }
  });
  
  // API endpoint to get conversation
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }
      
      const conversation = await storage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.status(200).json(conversation);
      
    } catch (error) {
      console.error("Error retrieving conversation:", error);
      res.status(500).json({ message: "Failed to retrieve conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
