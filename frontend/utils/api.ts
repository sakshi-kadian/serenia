/**
 * API Functions - All backend API interactions
 * Chat, Journal, and Insights endpoints
 */

import { httpClient } from './http';

// ============================================================================
// TYPES
// ============================================================================

// Chat Types
export interface ChatMessage {
    user_id: string;
    message: string;
    conversation_id?: string;
}

export interface ChatResponse {
    conversation_id: string;
    response: string;
    emotion: {
        label: string;
        confidence: number;
        all_emotions: { [key: string]: number };
    };
    anxiety: {
        detected: boolean;
        severity: string;
        confidence: number;
    };
    crisis: {
        detected: boolean;
        severity: string;
        resources?: any;
    };
    timestamp: string;
}

export interface ConversationHistory {
    conversation_id: string;
    user_id: string;
    messages: Array<{
        role: 'user' | 'assistant';
        content: string;
        timestamp: string;
        emotion?: string;
        anxiety_detected?: boolean;
        crisis_detected?: boolean;
    }>;
    created_at: string;
    updated_at: string;
}

// Journal Types
export interface GenerateReflectionRequest {
    user_id: string;
    conversation_id: string;
}

export interface Reflection {
    id: string;
    ai_generated_text: string;
    user_edited_text: string | null;
    final_text: string;
    emotions_detected: string[];
    key_insights: string[];
    topics: string[];
    user_approved: boolean;
    is_edited: boolean;
    created_at: string;
    approved_at: string | null;
}

// Insights Types
export interface MoodTrends {
    period_days: number;
    message_count: number;
    daily_moods: Array<{
        date: string;
        mood_score: number;
        emotion_count: number;
        dominant_emotion: string;
    }>;
    dominant_emotions: Array<{
        emotion: string;
        count: number;
    }>;
    average_sentiment: string;
    average_score: number;
    trend: string;
}

export interface AnxietyPatterns {
    period_days: number;
    anxiety_detected: boolean;
    anxiety_episodes: number;
    severity_distribution: { [key: string]: number };
    triggers: Array<{
        trigger: string;
        count: number;
    }>;
    patterns: string[];
    anxiety_scores: Array<{
        date: string;
        time: string;
        severity: string;
        score: number;
    }>;
}

export interface Insights {
    period: string;
    period_days: number;
    insights: string[];
    recommendations: string[];
    mood_summary: {
        average_sentiment: string;
        trend: string;
    };
    anxiety_summary: {
        detected: boolean;
        episodes: number;
    };
}

// ============================================================================
// CHAT API
// ============================================================================

/**
 * Send a message to Whiz Chat
 */
export async function sendChatMessage(request: ChatMessage, token?: string | null): Promise<ChatResponse> {
    return httpClient.post<ChatResponse>('/api/chat', request, token);
}

/**
 * Get conversation history
 */
export async function getConversationHistory(conversationId: string, token?: string | null): Promise<ConversationHistory> {
    return httpClient.get<ConversationHistory>(`/api/chat/history/${conversationId}`, token);
}

// ============================================================================
// JOURNAL API
// ============================================================================

/**
 * Generate AI reflection from conversation
 */
export async function generateReflection(request: GenerateReflectionRequest, token?: string | null): Promise<Reflection> {
    return httpClient.post<Reflection>('/api/journal/generate', request, token);
}

/**
 * Approve a reflection
 */
export async function approveReflection(
    reflectionId: string,
    editedText?: string,
    token?: string | null
): Promise<{ message: string; reflection_id: string; is_edited: boolean }> {
    return httpClient.post('/api/journal/approve', {
        reflection_id: reflectionId,
        edited_text: editedText,
    }, token);
}

/**
 * Edit a reflection
 */
export async function editReflection(
    reflectionId: string,
    editedText: string,
    token?: string | null
): Promise<{ message: string; reflection_id: string; final_text: string }> {
    return httpClient.put(`/api/journal/${reflectionId}/edit`, {
        edited_text: editedText,
    }, token);
}

/**
 * Delete a reflection
 */
export async function deleteReflection(
    reflectionId: string,
    token?: string | null
): Promise<{ message: string; reflection_id: string }> {
    return httpClient.delete(`/api/journal/${reflectionId}`, token);
}

/**
 * Get all reflections for a user
 */
export async function getUserReflections(
    userId: string,
    limit: number = 50,
    token?: string | null
): Promise<Reflection[]> {
    return httpClient.get<Reflection[]>(`/api/journal/${userId}?limit=${limit}`, token);
}

// ============================================================================
// INSIGHTS API
// ============================================================================

/**
 * Get mood trends
 */
export async function getMoodTrends(
    userId: string,
    days: number = 7,
    token?: string | null
): Promise<MoodTrends> {
    return httpClient.get<MoodTrends>(`/api/insights/${userId}/mood-trends?days=${days}`, token);
}

/**
 * Get anxiety patterns
 */
export async function getAnxietyPatterns(
    userId: string,
    days: number = 30,
    token?: string | null
): Promise<AnxietyPatterns> {
    return httpClient.get<AnxietyPatterns>(`/api/insights/${userId}/anxiety-patterns?days=${days}`, token);
}

/**
 * Get AI insights
 */
export async function getInsights(
    userId: string,
    period: 'weekly' | 'monthly' = 'weekly',
    token?: string | null
): Promise<Insights> {
    return httpClient.get<Insights>(`/api/insights/${userId}/insights?period=${period}`, token);
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(userId: string, token?: string | null): Promise<any> {
    return httpClient.get(`/api/insights/${userId}/summary`, token);
}

/**
 * Get progress indicators
 */
export async function getProgress(userId: string, token?: string | null): Promise<any> {
    return httpClient.get(`/api/insights/${userId}/progress`, token);
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Backend health check
 */
export async function healthCheck(): Promise<{ status: string; message: string }> {
    return httpClient.get<{ status: string; message: string }>('/health');
}
