import z from "zod";

export interface ToxicityBreakdownItem {
  type: string;
  score: number;
  breakdown: string;
}

export const ToxicityResponseSchema = z.object({
  score: z.number().min(0).max(100),
  breakdown: z.string(),
  type: z.string(),
});