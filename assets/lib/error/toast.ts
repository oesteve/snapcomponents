import { type ErrorInterface } from "@/lib/error";
import {
    VALIDATION_ERROR_TYPE,
    type ValidationError,
} from "@/lib/error/validation";
import { toast } from "sonner";

export function toToast(error: ErrorInterface) {
    if (error.type === VALIDATION_ERROR_TYPE) {
        const { message, fields } = error as ValidationError;

        return {
            title: message,
            description: fields
                .map(
                    (fieldError) =>
                        `${fieldError.field}: ${fieldError.message}`,
                )
                .join("\n"),
            variant: "destructive",
        };
    }

    toast.error(error.message || "An error occurred");
}
