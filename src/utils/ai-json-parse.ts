export function parsePossiblyMalformedJsonString(input: string): any {
    try {
      // Fix common issues
      let fixed = input
        .trim()
        .replace(/(\r\n|\n|\r)/gm, "")                           // Remove newlines
        .replace(/[“”]/g, '"')                                   // Convert fancy quotes to standard
        .replace(/[‘’]/g, "'")                                   // Convert fancy single quotes
        .replace(/,\s*([\]}])/g, '$1');                          // Remove trailing commas
  
      // Extract only the JSON part if wrapped (e.g. ```json ... ```)
      const jsonMatch = fixed.match(/{[\s\S]*}/);
      if (jsonMatch) {
        fixed = jsonMatch[0];
      }
  
      return JSON.parse(fixed);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      throw new Error("Invalid JSON input.");
    }
  }