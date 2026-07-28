import { Codes } from "../schemas/errors/index.js";

export type CodesKeys = keyof typeof Codes

export class CustomError extends Error {
  code: CodesKeys
  number: number
  constructor(message: string, code: CodesKeys) {
    super(message);
    this.code = code;
    this.number = Codes[code].number
  }
}