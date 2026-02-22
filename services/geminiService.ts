import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AnalysisResult, TestRecord } from "../types.ts";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;

const handleApiError = (error: any) => {
  let message = error?.message || "Errore sconosciuto";
  if (message.includes("quota") || message.includes("429")) throw new Error("QUOTA_EXHAUSTED");
  if (message.includes("403") || message.includes("API key not valid")) throw new Error("KEY_REQUIRED");
  throw new Error(message);
};

export const analyzeTestDocument = async (base64Data: string, mimeType: string): Promise<AnalysisResult> => {
  if (!API_KEY) throw new Error("KEY_REQUIRED");

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          containsTest: { type: SchemaType.BOOLEAN },
          testName: { type: SchemaType.STRING },
          canonicalName: { type: SchemaType.STRING },
          itemCount: { type: SchemaType.INTEGER },
          testType: { type: SchemaType.STRING },
          administrationMethod: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          testPurpose: { type: SchemaType.STRING },
          ageTarget: { type: SchemaType.STRING },
          isSelfReport: { type: SchemaType.BOOLEAN },
          extractedContent: { type: SchemaType.STRING },
        },
        required: ["containsTest", "testName", "canonicalName", "itemCount", "testType", "administrationMethod", "description", "testPurpose", "ageTarget", "isSelfReport", "extractedContent"],
      }
    }
  });

  try {
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: "Sei un esperto di psicometria clinica. Analizza questo documento. Estrai: Nome formale, Nome Canonico (inglese), Numero di item, Tipo di test, Metodo di somministrazione, Target età e Scopo. Estrai tutto il contenuto in Markdown. Restituisci SOLO JSON." }
        ]
      }]
    });

    const text = result.response.text();
    return JSON.parse(text) as AnalysisResult;
  } catch (error: any) {
    handleApiError(error);
    throw new Error("Errore durante l'analisi.");
  }
};

export const generateGoogleFormScript = async (test: TestRecord, targetLanguage: string = 'original'): Promise<string> => {
  if (!API_KEY) throw new Error("KEY_REQUIRED");
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Converti questo test in un Google Apps Script per creare un Google Form: ${test.extractedContent}. Restituisci SOLO il codice.`;
  
  try {
    const result = await model.generateContent(prompt);
    return result.response.text().replace(/```javascript|```|```gs|```/g, "").trim();
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const translateTest = async (content: string, targetLanguage: string): Promise<string> => {
  if (!API_KEY) throw new Error("KEY_REQUIRED");
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  try {
    const result = await model.generateContent(`Traduci in ${targetLanguage}: ${content}`);
    return result.response.text() || content;
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};
