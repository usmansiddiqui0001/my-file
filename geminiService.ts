
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const supportedLanguagesList = 'English, Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Urdu, Bhojpuri, Spanish, French, German, Arabic, Chinese, Japanese, Korean';

export const translateText = async (
  sourceLang: string,
  targetLang: string,
  text: string
): Promise<string> => {
  try {
    const prompt = `
You are a professional AI-powered language translator tool.

Your task is to follow these rules strictly:
- Translate the text accurately.
- Supported languages are: ${supportedLanguagesList}.
- Maintain correct grammar, spelling, and punctuation.
- Use natural, human-like phrasing. Avoid literal word-for-word translation unless necessary.
- Keep the tone, formality, and politeness level similar to the original text.
- Do not add or remove meaning from the original text.
- If the text contains idioms, slang, or cultural references, translate them into equivalent expressions in the target language.
- If the input text is a single word, just output the single translated word without any extra text or explanation.
- If either the source or target language provided below is not in the list of supported languages, your ONLY response must be: "Sorry, this language is not supported yet."
- Your output MUST ONLY be the translated text. Do not include any extra comments, explanations, or labels like "Translated text:".

Source Language: ${sourceLang}
Target Language: ${targetLang}
Text: ${text}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to translate text.");
  }
};
