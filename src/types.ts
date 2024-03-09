import type { IncomingMessage, ServerResponse } from "http";

/**
 * Request object
 */
export interface Request extends IncomingMessage {
  /**
   * URL must be defined
   */
  url: string;

  /**
   * URL search params
   */
  searchParams: URLSearchParams;
}

/**
 * Response object
 */
export type Response = ServerResponse & {
  /**
   * Responses an error message and status code
   *
   * @param statuscode
   * @param message
   */
  raiseError: (statusCode: number, message: string) => void;

  /**
   * Responses an OK message and status code
   *
   * @param statusCode
   * @param message
   */
  sendOk: (statusCode?: 200 | 201, message?: string) => void;
};

/**
 * Generic Context interface
 */
export interface Context {
  request: Request;
  response: Response;
}

/**
 * Generic Arguments for the iterator function
 *
 * @param context - The context object
 * @param next - The next function
 */
export type IteratorArgs = [Context, (error?: Error) => Promise<void>];

/**
 * Generic Iterator function
 */
export type Iterator = (...args: IteratorArgs) => Promise<void>;

/**
 * Generic single / multi row object or array
 */
export type ArrayOrObjectFromType<T extends object> = T | Array<T>;
