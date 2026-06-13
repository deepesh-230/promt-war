// Note: Using the REST API directly with fetch since the @google/genai module might 
// have issues in some browser environments or Vite setups, but let's stick to the fetch 
// method used previously which is rock solid in the browser for this simple prototype.

export const analyzeJournalWithGemini = async (journalText) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_actual_key_here') {
      console.warn("VITE_GEMINI_API_KEY is not set. Returning mock analysis.");
      return getMockAnalysis();
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze the following journal entry for a student preparing for competitive exams. Provide a JSON response (without markdown formatting) with the following structure:
{
  "sentiment": "Positive/Neutral/Negative",
  "stressLevel": "Low/Medium/High",
  "burnoutRisk": "Low/Medium/High",
  "summary": "1-2 sentence summary",
  "recommendations": ["Tip 1", "Tip 2", "Tip 3"],
  "triggers": ["Trigger 1", "Trigger 2"]
}

Journal Entry:
"${journalText}"` }] }]
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const resultText = data.candidates[0].content.parts[0].text;
      const cleanedText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    } else {
      throw new Error("Failed to generate content");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getMockAnalysis();
  }
};

export const chatWithMentor = async (historyMessages) => {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_actual_key_here') {
            return "Mock response: Please set VITE_GEMINI_API_KEY in client/.env to enable real AI responses. You're doing great with your studies!";
        }

        const historyForApi = historyMessages.slice(-10).map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
        }));
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            systemInstruction: { parts: [{ text: "You are a compassionate student wellness mentor. Never diagnose medical conditions. Provide short, helpful, and empathetic responses." }] },
            contents: historyForApi
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        }
        return "I'm sorry, I couldn't process that response.";
    } catch (err) {
        console.error("Gemini Chat Error:", err);
        return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }
}

const getMockAnalysis = () => ({
  sentiment: "Neutral",
  stressLevel: "Medium",
  burnoutRisk: "Low",
  summary: "Mock summary due to missing API key.",
  recommendations: ["Take a deep breath", "Drink water"],
  triggers: ["Mock Exams"]
});
