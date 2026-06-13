const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const MENTOR_SYSTEM_PROMPT =
  'You are a compassionate student wellness mentor. Never diagnose medical conditions. Provide short, helpful, and empathetic responses.';

const JOURNAL_ANALYSIS_PROMPT = `Analyze the following journal entry for a student preparing for competitive exams. Provide a JSON response (without markdown formatting) with the following structure:
{
  "sentiment": "Positive/Neutral/Negative",
  "stressLevel": "Low/Medium/High",
  "burnoutRisk": "Low/Medium/High",
  "summary": "1-2 sentence summary",
  "recommendations": ["Tip 1", "Tip 2", "Tip 3"],
  "triggers": ["Trigger 1", "Trigger 2"]
}

Journal Entry:
`;

/** Maximum number of recent messages sent to the chat API. */
const CHAT_HISTORY_LIMIT = 10;

/**
 * Reads the Gemini API key from environment variables.
 * @returns {string|null} The API key, or null if not configured.
 */
const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === 'your_actual_key_here') {
    return null;
  }
  return key;
};

/**
 * Analyzes a journal entry using the Gemini API and returns structured
 * sentiment, stress, burnout risk, and recommendations.
 *
 * @param {string} journalText - The raw journal text written by the student.
 * @returns {Promise<Object>} Parsed analysis object with sentiment, stressLevel,
 *   burnoutRisk, summary, recommendations, and triggers.
 */
export const analyzeJournalWithGemini = async (journalText) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY is not set. Returning mock analysis.');
      return getMockAnalysis();
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${JOURNAL_ANALYSIS_PROMPT}"${journalText}"` }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error('Unexpected API response structure');
    }

    const cleanedText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return getMockAnalysis();
  }
};

/**
 * Sends a conversation history to the Gemini API and returns
 * the mentor's text response.
 *
 * @param {Array<{role: string, content: string}>} historyMessages -
 *   The full conversation history (user and model messages).
 * @returns {Promise<string>} The mentor's reply as plain text.
 */
export const chatWithMentor = async (historyMessages) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return 'Mock response: Please set VITE_GEMINI_API_KEY in .env to enable real AI responses. You\'re doing great with your studies!';
    }

    const historyForApi = historyMessages.slice(-CHAT_HISTORY_LIMIT).map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: MENTOR_SYSTEM_PROMPT }] },
        contents: historyForApi,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return resultText || "I'm sorry, I couldn't process that response.";
  } catch (err) {
    console.error('Gemini Chat Error:', err);
    return 'Sorry, I\'m having trouble connecting right now. Please try again later.';
  }
};

/**
 * Returns a mock analysis object used when the API key is missing
 * or when an API call fails.
 * @returns {Object} A fallback analysis result.
 */
const getMockAnalysis = () => ({
  sentiment: 'Neutral',
  stressLevel: 'Medium',
  burnoutRisk: 'Low',
  summary: 'Mock summary due to missing API key.',
  recommendations: ['Take a deep breath', 'Drink water'],
  triggers: ['Mock Exams'],
});
