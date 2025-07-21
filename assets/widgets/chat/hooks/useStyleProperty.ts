import { useMemo, type RefObject } from "react";

/**
 * A hook to get CSS custom property values from an element
 * @param ref - React ref object pointing to the DOM element
 * @param propertyName - CSS custom property name (without the -- prefix)
 * @param defaultValue - Default value to return if the property is not found
 * @returns The value of the CSS custom property or the default value
 */
export function useStyleProperty<T>(
    ref: RefObject<HTMLElement | null>,
    propertyName: string = "string",
    defaultValue?: T,
): T | undefined {
    return useMemo(() => {
        const current = ref.current;
        if (!current) {
            return defaultValue;
        }

        const value = getComputedStyle(current).getPropertyValue(
            `--${propertyName}`,
        );

        // If the value is empty or not set, return the default value
        if (!value || value.trim() === "") {
            return defaultValue;
        }

        // Try to parse the value if it's a number or boolean
        if (typeof defaultValue === "number") {
            const numValue = parseFloat(value);
            return !isNaN(numValue) ? (numValue as unknown as T) : defaultValue;
        }

        if (typeof defaultValue === "boolean") {
            return (value.trim().toLowerCase() === "true") as unknown as T;
        }

        // Remove quotes and double quotes from the value if it's a string
        let processedValue = value;
        if (typeof defaultValue === "string" || defaultValue === undefined) {
            // Check if the value starts and ends with quotes and remove them
            processedValue = processedValue.trim();
            if (
                (processedValue.startsWith('"') &&
                    processedValue.endsWith('"')) ||
                (processedValue.startsWith("'") && processedValue.endsWith("'"))
            ) {
                processedValue = processedValue.slice(1, -1);
            }
        }

        // Return as string or the original type
        return processedValue as unknown as T;
    }, [ref.current, propertyName, defaultValue]);
}
