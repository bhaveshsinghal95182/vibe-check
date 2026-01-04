import z from "zod";

export const ToxicityBreakdownItemSchema = z.object({
  type: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  detected: z.boolean(),
});

export const ToxicityResponseSchema = z.object({
  score: z.number().min(0).max(100),
  breakdown: z.array(ToxicityBreakdownItemSchema),
});

export type ToxicityBreakdownItem = z.infer<typeof ToxicityBreakdownItemSchema>;
export type ToxicityResult = z.infer<typeof ToxicityResponseSchema>;