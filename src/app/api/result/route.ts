import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { ToxicityResponseSchema } from "@/types";

export default async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await generateText({
      model: google("gemini-flash-latest"),
      prompt: `Analyze the following message for toxic content and provide a toxicity score from 0 to 100, along with a breakdown of detected toxic patterns (if any). Respond in JSON format with "score" and "breakdown" fields.

Message: "${message}"`,
      output: Output.object({
        schema: ToxicityResponseSchema,
      }),

    });

    return response
  } catch (error) {
    return new Response("Error processing request", { status: 500 });
  }
}
