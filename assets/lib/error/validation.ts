import { ZodError } from "zod";

import { type ErrorInterface } from "@/lib/error/index";

export type FieldError = {
  field: string;
  message: string;
};

export const VALIDATION_ERROR_TYPE = "validationError";

export interface ValidationError extends ErrorInterface {
  fields: FieldError[];
}

export function fromZodError(zodError: ZodError): ValidationError {
  const fieldErrors: FieldError[] = zodError.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return {
    message: "Validation failed",
    type: VALIDATION_ERROR_TYPE,
    fields: fieldErrors,
  };
}
