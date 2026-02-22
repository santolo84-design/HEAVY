import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AnalysisResult, TestRecord } from "../types.ts";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;

// ... (il resto della funzione handleApiError rimane uguale)

export const analyzeTestDocument = async (base64Data: string, mimeType: string): Promise<AnalysisResult> => {
  if (!API_KEY) throw new Error("KEY_REQUIRED");

  // NOTA: Qui il nome cambia in GoogleGenerativeAI
  const ai = new GoogleGenerativeAI(API_KEY);
  const model = "gemini-1.5-flash"; 
  
  // ... (nel resto del file, assicurati che dove c'era Type.OBJECT ora ci sia SchemaType.OBJECT)

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY});
  const model = "gemini-3-flash-preview";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `You are a clinical psychometrics expert. Analyze this document.
            1. Determine if it contains a psychological, educational, or clinical test/assessment.
            2. If it DOES NOT contain a test, set containsTest to false and provide placeholder values for other fields.
            3. If it DOES contain a test, set containsTest to true and identify:
               - Formal name of the test (in the language of the document).
               - Canonical Name: The formal name of the test in English (e.g., if the test is "Escala de Depresión de Beck", the canonical name is "Beck Depression Inventory"). This is used for duplicate detection.
               - Item Count: The total number of questions or items in the test.
               - Test Type (e.g., Self-report, Employee test, Checklist, Performance-based, etc.).
               - Administration Method (Brief summary of how it is administered).
               - Target age.
               - Brief purpose.
            4. Extrapolate the entire test content (questions/scoring/instructions) in Markdown.
            Return ONLY JSON.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            containsTest: { type: Type.BOOLEAN, description: "True if the document contains a clinical/psychological test, false otherwise." },
            testName: { type: Type.STRING },
            canonicalName: { type: Type.STRING, description: "The formal name of the test in English for duplicate detection." },
            itemCount: { type: Type.INTEGER, description: "The total number of questions or items in the test." },
            testType: { type: Type.STRING, description: "The category of the test (e.g. Self-report, Checklist, etc.)." },
            administrationMethod: { type: Type.STRING, description: "Brief summary of how the test is administered." },
            description: { type: Type.STRING, description: "Strictly 'Self-report' or 'Dependent of operator'." },
            testPurpose: { type: Type.STRING, description: "1-2 sentence explanation of clinical/educational use." },
            ageTarget: { type: Type.STRING },
            isSelfReport: { type: Type.BOOLEAN },
            extractedContent: { type: Type.STRING, description: "Markdown formatted test content including instructions." },
          },
          required: ["containsTest", "testName", "canonicalName", "itemCount", "testType", "administrationMethod", "description", "testPurpose", "ageTarget", "isSelfReport", "extractedContent"],
        },
      },
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr) as AnalysisResult;
  } catch (error: any) {
    handleApiError(error);
    throw new Error("Could not extract test content.");
  }
};

export const generateGoogleFormScript = async (test: TestRecord, targetLanguage: string = 'original'): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_KEY) throw new Error("KEY_REQUIRED");

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });
  const model = "gemini-3-flash-preview";

  const isOriginal = targetLanguage.toLowerCase() === 'original';
  const translationInstruction = isOriginal 
    ? "Keep the content in its original language." 
    : `CRITICAL: Translate all user-facing strings (test name, description, question labels, option choices) into ${targetLanguage}.`;

  const prompt = `
    Task: Convert the following psychological test into a Google Apps Script that creates a Google Form.
    
    Test Content:
    ${test.extractedContent}
    
    Translation Instructions:
    ${translationInstruction}
    
    Requirements for the Script:
    1. Function name must be 'create${test.testName.replace(/[^a-zA-Z0-9]/g, '')}Form'.
    2. Use 'FormApp.create("${test.testName}")' (translated if required).
    3. Include '.setDescription("${test.testPurpose}")' (translated if required).
    4. Map questions to appropriate types: .addMultipleChoiceItem(), .addTextItem(), .addCheckboxItem(), or .addScaleItem().
    5. Handle section headers using .addPageBreakItem().
    6. Ensure questions are set as required where appropriate.
    7. Return ONLY the code block.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    const result = response.text?.replace(/```javascript|```|```gs|```/g, "").trim();
    if (!result) throw new Error("Empty response from AI");
    return result;
  } catch (error: any) {
    handleApiError(error);
    throw new Error("Failed to generate form architecture.");
  }
};

export const translateTest = async (
  content: string,
  targetLanguage: string
): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_KEY || import.meta.env.VITE_GEMINI_KEY === "") {
    throw new Error("KEY_REQUIRED");
  }

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });
  const model = "gemini-3-flash-preview";
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Translate the following psychological test into ${targetLanguage}. Maintain exact formatting.
      
      CONTENT:
      ${content}`,
    });
    return response.text || content;
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};
