import { GoogleGenAI } from '@google/genai';

export interface ChatHistoryMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AIProvider {
  name: string;
  generateResponse(params: {
    prompt: string;
    systemInstruction: string;
    history?: ChatHistoryMessage[];
  }): Promise<string>;
}

export class GeminiProvider implements AIProvider {
  name = 'Google Gemini API';

  private getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  async generateResponse(params: {
    prompt: string;
    systemInstruction: string;
    history?: ChatHistoryMessage[];
  }): Promise<string> {
    const ai = this.getClient();

    // Format previous multi-turn conversation history
    let historyText = '';
    if (params.history && params.history.length > 1) {
      historyText = params.history
        .slice(0, -1)
        .map((m) => `${m.role === 'user' ? 'Customer' : 'AI Assistant'}: ${m.content}`)
        .join('\n');
    }

    const fullPrompt = historyText
      ? `Previous Conversation History:\n${historyText}\n\nCurrent Customer Message: ${params.prompt}`
      : params.prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: params.systemInstruction,
        temperature: 0.2,
      },
    });

    return (
      response.text ||
      'I am here to assist you with LTS BAGS custom products, specifications, and wholesale inquiries. How can I help you today?'
    );
  }
}

// Modular AI Provider Factory
export function getAIProvider(): AIProvider {
  // Can easily be swapped to other providers in future without changing API route logic
  return new GeminiProvider();
}
