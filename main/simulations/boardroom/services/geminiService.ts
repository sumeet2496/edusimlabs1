
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client using the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Utility to handle API calls with exponential backoff retries.
 * Specifically targets 429 (Rate Limit) and 5xx errors.
 */
async function callGeminiWithRetry(modelName: string, prompt: string, temperature = 0.7, retries = 3): Promise<string | null> {
  const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await genAI.models.generateContent({
        model: modelName,
        contents: prompt,
        config: { temperature }
      });
      return response.text || null;
    } catch (error: any) {
      const isRateLimit = error?.message?.includes('429') || error?.status === 429;
      const isServerError = error?.status >= 500;
      
      if ((isRateLimit || isServerError) && i < retries - 1) {
        // Exponential backoff: 1s, 2s, 4s...
        const delay = Math.pow(2, i) * 1000;
        console.warn(`Gemini API error (Status: ${error?.status}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      // Log final error and return null to trigger fallback
      console.error("Gemini API final error:", error);
      return null;
    }
  }
  return null;
}

const CFO_FALLBACKS_FEEDBACK = [
  "Authorization noted. Capital transfer initiated. We'll track the delta closely.",
  "Liquidity deployment confirmed. I've alerted the regional treasury to expect the incoming wire.",
  "Allocation finalized. We are now fully committed to the local operational roadmap.",
  "Strategic wire dispatched. Maintaining a 24-hour watch on local FX volatility."
];

const CFO_FALLBACKS_YEARLY = [
  "Fiscal audit finalized. The local balance sheet shows stable operational momentum.",
  "Audit complete. Reinvestment cycles are tracking against our capital efficiency targets.",
  "Year-end reconciliation finished. Local currency performance is impacting the consolidated NPV.",
  "Review complete. Operational yields remain within our authorized variance bands."
];

export const getCFOFeedback = async (allocation: Record<string, number>) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    You are the CFO of a US MNC. The CEO has just authorized a $100M deployment to:
    ${JSON.stringify(allocation)}
    
    Provide a very brief, high-level reaction. 
    Tone: Professional, direct, and slightly cautious. 
    Focus on immediate fiscal impact and capital mobility. 
    Avoid cliches about "risk concentration" or "geographic diversification." 
    Keep it to 2 short sentences.
  `;

  const result = await callGeminiWithRetry(model, prompt, 0.8);
  if (result) return result;

  // Rich fallback if API fails
  const randomIndex = Math.floor(Math.random() * CFO_FALLBACKS_FEEDBACK.length);
  return CFO_FALLBACKS_FEEDBACK[randomIndex];
};

export const getYearlyUpdate = async (year: number, countryData: any, globalEvent?: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    You are the CFO. It is Year ${year} of the 5-year deployment.
    Context: ${JSON.stringify(countryData)}
    Global Context: ${globalEvent || 'Stable macroeconomic environment.'}
    
    Provide a concise status update for the CEO. 
    Focus on "what happened" to our capital (FX shifts, local performance, taxes). 
    Max 3 sentences. Be professional, objective, and data-driven.
  `;

  const result = await callGeminiWithRetry(model, prompt, 0.7);
  if (result) return result;

  const randomIndex = Math.floor(Math.random() * CFO_FALLBACKS_YEARLY.length);
  return `Audit for Year ${year} complete. ${CFO_FALLBACKS_YEARLY[randomIndex]}`;
};
