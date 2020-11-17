/**
 * An Error that is extended to also contain a status code.
 */
import {FastifyReply} from "fastify";

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
  }
}
