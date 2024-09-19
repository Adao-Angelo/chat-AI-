import { GoogleGenerativeAI } from "@google/generative-ai";

const google_api_key: string = "AIzaSyAyiw4yhVAfNlGvl2-bM6de-LooaumRuZ0";
const generative_ai = new GoogleGenerativeAI(google_api_key);

async function getGemini(messages: string) {
  const prompt: string = `Gera um hitoria com base a esse texto "${messages}"`;
  const model = generative_ai.getGenerativeModel({
    model: "gemini-pro",
  });

  const result = await model.generateContent(prompt);
  const message = result.response;
  const text = message.text();

  return {
    status: "success",
    message: text,
    name: "Gemini",
  };
}

type QueryResponse = {
  generated_text: string;
};

async function query(file: File): Promise<QueryResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
    {
      headers: {
        Authorization: "Bearer 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",
      },
      method: "POST",
      body: formData,
    }
  ).catch((error) => {
    throw new Error("Failed to generate history");
  });

  const result = (await response.json()) as QueryResponse;
  return result;
}

export { getGemini, query };
