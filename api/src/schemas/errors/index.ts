import z from "zod";

export const Codes = {
  BAD_REQUEST: {
    code: "BAD_REQUEST",
    number: 400,
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    number: 401,
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    number: 403,
  },
  NOT_FOUND: {
    code: "NOT_FOUND",
    number: 404,
  },
  METHOD_NOT_ALLOWED: {
    code: "METHOD_NOT_ALLOWED",
    number: 405,
  },
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    number: 500,
  },
} as const

export const CodesKeys = Object.keys(Codes) as [keyof typeof Codes, ...Array<keyof typeof Codes>]

export const ErrorSchema = z.object({
  error: z.string(),
  code: z.enum(CodesKeys),
});



