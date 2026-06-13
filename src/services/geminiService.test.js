import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeJournalWithGemini, chatWithMentor } from './geminiService';

describe('Gemini Service', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn();
    import.meta.env.VITE_GEMINI_API_KEY = 'test_key';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.clearAllMocks();
  });

  describe('analyzeJournalWithGemini', () => {
    it('returns parsed JSON when fetch is successful', async () => {
      const mockResponse = {
        candidates: [{
          content: { parts: [{ text: '```json\n{"sentiment":"Positive","stressLevel":"Low"}\n```' }] }
        }]
      };
      
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await analyzeJournalWithGemini("Great day");
      expect(result.sentiment).toBe("Positive");
    });

    it('returns mock data when fetch fails', async () => {
      globalThis.fetch.mockRejectedValueOnce(new Error("API Error"));

      const result = await analyzeJournalWithGemini("Great day");
      expect(result.sentiment).toBe("Neutral"); // Mock fallback
      expect(result.summary).toContain("Mock summary");
    });
  });

  describe('chatWithMentor', () => {
    it('returns text response on success', async () => {
      const mockResponse = {
        candidates: [{
          content: { parts: [{ text: "Here is your response." }] }
        }]
      };
      
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await chatWithMentor([{role: 'user', content: 'hello'}]);
      expect(result).toBe("Here is your response.");
    });
  });
});
