/** An error the client caused, answered with its status and message. */
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** A reply with a status other than 200: `return reply(201, item)`. */
export class Reply {
  constructor(status, body) {
    this.status = status;
    this.body = body;
  }
}

export const reply = (status, body) => new Reply(status, body);
