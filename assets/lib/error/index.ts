import type { FieldError } from "@/lib/error/validation.ts";

export const ErrorType = "validationError";

export interface ErrorInterface {
  message: string;
  type?: string;
  fields?: FieldError[];
}

export class DebugError extends Error {
  debugMessage?: string;

  constructor(message: string, debugMessage?: string) {
    super(message);
    this.debugMessage = debugMessage;
  }
}
