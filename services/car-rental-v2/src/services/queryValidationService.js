import IllegalDatabaseQueryError from "./../errors/IllegalDatabaseQueryError";
const ILLEGAL_STRING_REGEX = /\$/;

function illegalString(string) {
  const illegal = true;
  if (typeof string === "number") {
    return !illegal;
  }
  if (ILLEGAL_STRING_REGEX.test(string)) {
    return illegal;
  }
  try {
    // If we can parse the string as JSON, it's illegal.
    JSON.parse(string);
    return illegal;
  } catch {
    return !illegal;
  }
}
export function isValidNoSQLQueryValue(value) {
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
