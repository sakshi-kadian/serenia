# Serenia Master Implementation Plan

This document serves as the **Execution Roadmap** for transforming the current UI mockups into a fully functional application.

## 🏗️ Architecture Overview

The system uses a **Hybrid Architecture**:
1.  **Frontend (The Head):** Next.js 15 (App Router) - Handles UI, Auth, and Basic CRUD (Journal saving).
2.  **Backend (The Brain):** Python (FastAPI) - Handles AI Logic, Sentiment Analysis, and Spotify recommendations.
3.  **Database:** PostgreSQL (via Prisma ORM in Next.js) - Stores User Profiles and Journal Entries.

---

## 🚀 Feature 1: Whiz Chat ("The AI Companion")
**Status:** UI Complete (Mocked)
**Goal:** Make it a real, persistent AI chat.

### Implementation Steps:
1.  **Backend (Python/FastAPI):**
    *   **Install:** `fastapi`, `uvicorn`, `google-generativeai` (Gemini) or `openai`.
    *   **Endpoint:** Create `POST /api/chat` that accepts `{ box: "user_message", history: [...] }`.
    *   **Logic:**
        *   Initialize the LLM client (Gemini implementation recommended for cost/performance).
        *   Maintain a system prompt: *"You are Whiz, a compassionate, empathetic emotional support companion..."*
        *   Return the AI's response stream.
2.  **Frontend (Next.js):**
    *   **API Client:** Create a service utility `services/chatService.ts` to call the Python backend.
    *   **Streaming:** Implement `useChat` (Vercel AI SDK) or custom streaming hook to display the response character-by-character for that "alive" feel.
    *   **Persistence:** (Optional for V1) Save chat logs to Postgres via a Next.js Server Action (`saveChatSession`) so users can review past advice.

---

## 📝 Feature 2: Deep Journal ("The Sanctuary")
**Status:** UI Complete (`<textarea>`)
**Goal:** Rich text saving + Sentiment Analysis.

### Implementation Steps:
1.  **Database (Prisma + Postgres):**
    *   **Schema:** Define `JournalEntry` model:
        ```prisma
        model JournalEntry {
          id        String   @id @default(cuid())
          userId    String
          content   String   @db.Text
          mood      String?  // "Happy", "Anxious", etc.
          sentimentScore Float? // -1.0 to 1.0 (Analyzed by Python later)
          createdAt DateTime @default(now())
        }
        ```
    *   **Setup:** Run `npx prisma init`, configure connection, and `npx prisma db push`.
2.  **frontend (Next.js):**
    *   **Rich Text:** Upgrade the current simple `<textarea>` to **Tiptap** (already installed).
        *   Create component: `components/editor/TiptapEditor.tsx`.
    *   **Saving:** Implement "Auto-save" using a debounce hook (saves 1s after user stops typing).
    *   **Server Action:** Create `actions/journal.ts` -> `saveEntry(content)`.
3.  **AI Analysis (The Magic):**
    *   **Trigger:** When a user clicks "Save Entry", fire a background event to the Python Backend.
    *   **Python Endpoint:** `POST /api/analyze-sentiment`.
    *   **Result:** Python calculates a "sentiment score" and keywords, which are updated in the Postgres DB.

---

## 🎵 Feature 3: MoodTunes ("The Sonic Pharmacy")
**Status:** UI Complete (Visualizer Mockup)
**Goal:** Real Spotify Recommendations based on Mood.

### Implementation Steps:
1.  **Backend (Python/FastAPI):**
    *   **Install:** `spotipy` (Spotify Web API wrapper).
    *   **Auth:** Register a Spotify Developer App to get `CLIENT_ID` and `CLIENT_SECRET`.
    *   **Endpoint:** `POST /api/music/recommend`.
    *   **Logic:**
        *   Receive `mood` (e.g., "Anxious").
        *   Map mood to audio features:
            *   *Anxious* -> Low Energy (0.3), Acousticness (0.8), Valence (0.5).
            *   *Depressed* -> Energy (0.6) [Uplifting], Valence (0.7).
        *   Call Spotify Recommendations API.
        *   Return list of tracks (Album Art, Preview URL, Spotify Link).
2.  **Frontend (Next.js):**
    *   **State:** Create a global `MusicPlayerContext` to allow music to keep playing while navigating.
    *   **UI:** Map the real API response to the `MusicPage` grid. Replace the hardcoded "Weightless" tracks with dynamic results.

---

## 📊 Feature 4: Analytics ("Emotional Journey")
**Status:** UI Complete (CSS Chart Mocks)
**Goal:** Visualize real data from Journal Entries.

### Implementation Steps:
1.  **Data Source:**
    *   This page will consume data from the **JournalEntry** table in Postgres.
2.  **Backend (Next.js API Route):**
    *   **Endpoint:** `GET /api/user/stats`.
    *   **Logic:**
        *   Query Prisma: `db.journalEntry.findMany({ where: { userId: currentUserId } })`.
        *   Calculate:
            *   *Streak*: Consecutive days with an entry.
            *   *Mood Trend*: Average sentiment score over last 7 days.
            *   *Dominant Mood*: Most frequent mood tag.
3.  **Frontend (Next.js):**
    *   **Fetching:** Use `SWR` or `React Query` to fetch stats on load.
    *   **Rendering:** Map the fetched 7-day sentiment array to the CSS-based bar chart heights in `AnalyticsPage`.

---

## Master Development Checklist (Order of Operations)

1.  **[ ] Environment Setup:**
    *   Get API Keys: Clerk (Auth), Neon/Supabase (Postgres), Gemini (AI), Spotify (Music).
    *   Create `.env` files in both `frontend/` and `backend/`.

2.  **[ ] Backend Core (Python):**
    *   Initialize FastAPI app in `backend/main.py`.
    *   Get `POST /chat` working with Gemini.
    *   Get `POST /recommend` working with Spotipy.

3.  **[ ] Database Core (Next.js):**
    *   Initialize Prisma.
    *   Set up Auth (Clerk) so we have a valid `userId`.

4.  **[ ] Feature wiring (One by one):**
    *   Wire **Whiz Chat** to Python API.
    *   Wire **Journal** to Prisma (Save/Load).
    *   Wire **Music** to Python API.
    *   Wire **Analytics** to Prisma Data.
