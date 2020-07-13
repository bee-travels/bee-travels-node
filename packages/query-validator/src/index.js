import IllegalDatabaseQueryError from "./IllegalDatabaseQueryError";
import SQL_RESERVED_WORDS from "./sqlReservedWords";
const ILLEGAL_STRING_REGEX = /\$|'|;/;

function illegalString(string) {
  const illegal = true;
  if (!isNaN(Number(string))) {
    return !illegal;
  }
  if (ILLEGAL_STRING_REGEX.test(string)) {
    return illegal;
  }
  const words = string.split(" ");
  for (let word of words) {
    if (SQL_RESERVED_WORDS.includes(word.toUpperCase())) {
      return illegal;
    }
  }
  try {
    // If we can parse the string as JSON, it's illegal.
    JSON.parse(string);
    return illegal;
  } catch {
    return !illegal;
  }
}

export function isValidQueryValue(value) {
  // If the query is an array check if any items are illegal strings.
  if (value instanceof Array) {
    value.forEach((v) => {
      if (illegalString(v)) {
        throw new IllegalDatabaseQueryError(v);
      }
    });
    return value;
  }
  // Check if query is an illegal string.
  if (illegalString(value)) {
    throw new IllegalDatabaseQueryError(value);
  }
  return value;
}

export { default as IllegalDatabaseQueryError } from "./IllegalDatabaseQueryError";
