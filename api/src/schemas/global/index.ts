import z from "zod"

export const MessageSchemaResponse = z.object({
  message: z.string(),
});