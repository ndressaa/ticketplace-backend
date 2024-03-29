import type { IncomingHttpHeaders } from "http";

import type { RetornableColumns } from "../tables";
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
export type Context<T extends Array<any> | undefined> = {
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
} & (T extends Array<any>
  ? {
      /**
       * Request body
       */
      body: T;
    }
  : {});

/**
 * Controller function
 */
export type Controller<
  T extends boolean | ReturnContent,
  B extends Array<any> | undefined = undefined
> = (context: Context<B>) => Promise<undefined | T>;

/**
 * Enpoints (controller names)
 */
export type Endpoints =
  /**
   * Manual endpoints (no table direct reference)
   */
  | "login"
  | "newUser"

  /**
   * Table endpoints
   */
  | "eventos"
  | "carrinho"
  | "cartoes"
  | "empresas"
  | "ingressos"
  | "usuarios";
