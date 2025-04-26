import { apiRequest } from "./queryClient";

export interface GenerateResponseRequest {
  mode: string;
  timeFrame: string;
  context: string;
  currentSituation: string;
  message: string;
  previousMessages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}

export interface GenerateResponseResult {
  response: string;
  timestamp: string;
}

export async function generateResponse(
  requestData: GenerateResponseRequest
): Promise<GenerateResponseResult> {
  const response = await apiRequest(
    "POST",
    "/api/conversations/generate",
    requestData
  );
  return await response.json();
}

export interface GenerateInsightsRequest {
  mode: string;
  timeFrame: string;
  context: string;
  currentSituation: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}

export interface Insights {
  keyDifferences: string[];
  successfulPredictions: string[];
  missedOpportunities: string[];
}

export async function generateInsights(
  requestData: GenerateInsightsRequest
): Promise<Insights> {
  const response = await apiRequest(
    "POST",
    "/api/conversations/insights",
    requestData
  );
  return await response.json();
}

export interface SaveConversationRequest {
  mode: string;
  timeFrame: string;
  context: string;
  currentSituation: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  insights?: Insights;
}

export interface SavedConversation extends SaveConversationRequest {
  id: number;
  createdAt: string;
}

export async function saveConversation(
  requestData: SaveConversationRequest
): Promise<SavedConversation> {
  const response = await apiRequest(
    "POST",
    "/api/conversations",
    requestData
  );
  return await response.json();
}

export async function getConversation(
  id: number
): Promise<SavedConversation> {
  const response = await apiRequest(
    "GET",
    `/api/conversations/${id}`,
    undefined
  );
  return await response.json();
}
