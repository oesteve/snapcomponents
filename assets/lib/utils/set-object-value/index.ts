export function setNestedObjectValue(
  obj: Record<string, any>,
  path: string,
  value: any,
): Record<string, any> {
  if (!path) {
    return obj;
  }

  const keys = path.split(".");
  const isArray = Array.isArray(obj);
  const newObject: any = isArray ? [...obj] : { ...obj }; // Shallow copy
  let current: any = newObject;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    const match = key.match(/^(\w*)\[(\d*)\]$/);
    if (match) {
      const arrayKey = match[1]; // "items"
      const index = match[2] ? parseInt(match[2], 10) : null; // "2" or null for "[]"

      if (arrayKey) {
        if (!current[arrayKey]) {
          current[arrayKey] = []; // Initialize array
        }
        if (!Array.isArray(current[arrayKey])) {
          throw new Error(
            `Expected array but found ${typeof current[arrayKey]} at ${arrayKey}`,
          );
        }

        const oldArray = current[arrayKey];
        const newArray = [...oldArray];
        current[arrayKey] = newArray;

        if (index === null) {
          // Append to the array when no specific index is provided
          if (i === keys.length - 1) {
            newArray.push(value); // Directly add the value
          } else {
            const newElement = {};
            newArray.push(newElement);
            current = newElement;
          }
        } else {
          if (i === keys.length - 1) {
            // Handle removal if `value` is undefined
            if (value === undefined) {
              newArray.splice(index, 1); // Remove the element at the index
            } else {
              newArray[index] = value; // Otherwise, set the value
            }
          } else {
            while (newArray.length <= index) {
              newArray.push(undefined);
            }
            newArray[index] = newArray[index] ? { ...newArray[index] } : {};
            current = newArray[index];
          }
        }
      } else {
        // Array without a key
        if (!Array.isArray(current)) {
          throw new Error(`Expected array but found ${typeof current}`);
        }

        const newArray = [...current];
        while (newArray.length <= index!) {
          newArray.push(undefined);
        }
        if (i === keys.length - 1) {
          newArray[index!] = value;
        } else {
          newArray[index!] = newArray[index!] ? { ...newArray[index!] } : {};
          current = newArray[index!];
        }
        return newArray;
      }
    } else {
      // Handle regular object keys
      if (i === keys.length - 1) {
        // Remove the key if the value is undefined
        if (value === undefined) {
          delete current[key];
        } else {
          current[key] = value;
        }
      } else {
        current[key] = current[key] ? { ...current[key] } : {};
        current = current[key];
      }
    }
  }

  return newObject;
}
