import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SchemaField, DataType, UploadedFile } from "../types";

// Helper to convert UI Schema to Gemini Schema
const mapToGeminiSchema = (fields: SchemaField[]): Schema => {
  const properties: Record<string, Schema> = {};
  const required: string[] = [];

  fields.forEach((field) => {
    required.push(field.key);
    
    let fieldSchema: Schema;

    switch (field.type) {
      case DataType.NUMBER:
        fieldSchema = { type: Type.NUMBER, description: field.description };
        break;
      case DataType.BOOLEAN:
        fieldSchema = { type: Type.BOOLEAN, description: field.description };
        break;
      case DataType.ARRAY_STRING:
        fieldSchema = {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: field.description,
        };
        break;
      case DataType.STRING:
      default:
        fieldSchema = { type: Type.STRING, description: field.description };
        break;
    }

    properties[field.key] = fieldSchema;
  });

  return {
    type: Type.OBJECT,
    properties,
    required,
  };
};

export const extractDataWithGemini = async (
  file: UploadedFile | null,
  schemaFields: SchemaField[]
): Promise<any> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // We use gemini-3-pro-preview for complex extraction tasks
    const modelId = "gemini-3-pro-preview";

    const parts: any[] = [];
    let prompt = "Extract the following information from the provided input based on the schema.";

    if (file) {
      // Remove data URL prefix if present for proper base64
      const base64Data = file.data.includes('base64,') 
        ? file.data.split('base64,')[1] 
        : file.data;

      // If it is a text-based file, we prefer sending it as text prompt for better reasoning
      const isTextFile = file.type.startsWith('text/') || file.type === 'application/json' || file.name.endsWith('.md');
      
      if (isTextFile) {
        try {
            const decodedText = atob(base64Data);
            prompt += `\n\nInput File Content:\n${decodedText}`;
        } catch (e) {
            console.warn("Could not decode text file, sending as inline data.");
             parts.push({
                inlineData: {
                mimeType: file.type || 'text/plain',
                data: base64Data,
                },
            });
        }
      } else {
          // Images, PDFs
          parts.push({
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          });
      }
    } else {
        throw new Error("No input file provided.");
    }

    parts.push({ text: prompt });

    const responseSchema = mapToGeminiSchema(schemaFields);

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 2048 }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated.");

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON", text);
      return { error: "Failed to parse JSON response", raw: text };
    }

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};
