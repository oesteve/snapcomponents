/**
 * Function to get a nested value using dot notation from an object,
 * including support for array indexing.
 *
 * @param obj - The object to retrieve data from.
 * @param key - Key string in dot notation (e.g., "user.address.city" or "items[0].name").
 * @returns The value or undefined if not found.
 */
export function getNestedObjectValue(
  obj: Record<string, any>,
  key: string,
): any {
  return key.split(".").reduce((acc: any, part) => {
    // Handle array indexing like `items[0]`
    const match = part.match(/^(\w*)\[(\d+)\]$/);
    if (match) {
      const arrayKey = match[1]; // E.g., 'items'
      const index = parseInt(match[2], 10); // E.g., 0

      if (arrayKey) {
        // If it's an array key like `items`
        acc = acc && typeof acc === "object" ? acc[arrayKey] : undefined;
      }

      if (Array.isArray(acc)) {
        // Get the value at the specified index
        return acc[index];
      }

      return undefined; // If not an array, return undefined
    }

    // Handle regular object keys
    return acc && typeof acc === "object" && part in acc
      ? acc[part]
      : undefined;
  }, obj);
}
