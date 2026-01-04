import { generateText, Output, UserContent } from "ai";
import { google } from "@ai-sdk/google";
import { ToxicityResponseSchema } from "@/types";

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();

    const content: UserContent = [];

    // Add image if provided
    if (image) {
      content.push({
        type: "image",
        image: image,
      });
    }

    // Add text prompt
    content.push({
      type: "text",
      text: `Analyze the following content for toxic patterns. Provide:
1. A toxicity score from 0 to 100 (0 = completely harmless, 100 = extremely toxic)
2. A breakdown of detected toxic patterns

For the breakdown, analyze these categories: Insults, Threats, Sarcasm, Passive-aggressive, Gaslighting, Condescending, Manipulation, Negativity.

For each category, include:
- type: the category name
- detected: true if this pattern is present, false otherwise
- severity: "low", "medium", or "high" based on intensity

${message ? `Text message to analyze: "${message}"` : "Analyze the text content visible in the provided image."}
${image ? "An image has been provided - analyze any text or conversation visible in it." : ""}`,
    });

    const { output } = await generateText({
      model: google("gemini-flash-latest"),
      messages: [
        {
          role: "user",
          content,
        },
      ],
      experimental_output: Output.object({
        schema: ToxicityResponseSchema,
      }),
    });

    return Response.json(output);
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
