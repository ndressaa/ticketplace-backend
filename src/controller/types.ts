import type { IncomingHttpHeaders } from "http";

import type { RetornableColumns } from "../tables/types";
import type { Usuarios } from "../tables/usuarios";
export interface Token {
  /**
   * The loged user token
   *
   * @doc Token is composed by random string of 32 characters and UNIX
   * timestamp in seconds separated by a dot
   *
   * @example
   * 1234567890abcdef1234567890abcdef.1234567890
   */
  token: string;

  /**
   * The user information
   */
  user: Usuarios.RetornableColumns;
}

/**
 * Generic response object
 */
export type ResponseObject<T extends object = object> = {
  statusCode: number;
  content: T;
};

/**
 * Object to be returned by the controller
 */
export type ReturnContent = Array<RetornableColumns> | ResponseObject;

/**
 * Controller context
 */
export type Context = {
  /**
   * The search params
   */
  searchParams: URLSearchParams;

  /**
   * The request headers
   */
  headers: IncomingHttpHeaders;

  /**
   * If present, content must include only the object with the given id
   */
  id?: string;

  /**
   * Request body
   */
  body?: string;
};

/**
 * Controller function
 */
export type Controller<T extends boolean | ReturnContent> = (
  context: Context
) => Promise<undefined | T>;

/**
 * Allowed controller names
 */
export type ControllerName = "login" | "newUser" | "users" | "shows";
