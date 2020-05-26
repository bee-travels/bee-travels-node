class IllegalDatabaseQueryError extends Error {
  constructor(query) {
    super(`"${query}" is not a valid query`);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    this.status = 403;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    Error.captureStackTrace(this, this.constructor);
  }
}

export default IllegalDatabaseQueryError;
