import { z } from "zod";

const hoursSchema = z.union([
  z.literal(1),
  z.literal(6),
  z.literal(12),
  z.literal(24),
]);
const daysSchema = z.union([
  z.literal(30),
  z.literal(60),
  z.literal(90),
  z.literal(365),
]);

export const daysSelection = daysSchema.options.map(v => v.value);
export const hoursSelection = hoursSchema.options.map(v => v.value);

export const historySelectedSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("days"), days: daysSchema }),
  z.object({ type: z.literal("hours"), hours: hoursSchema }),
]);

export type HistorySelection = z.infer<typeof historySelectedSchema>;
