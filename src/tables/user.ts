import type { ObjectReturnsArrayOrObject } from "../types";
import type { DBColumns } from "./types";

/**
 * User table
 */
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string | null;
}

/**
 * User columns that can be returned (no sensitive information)
 */
export type RetornableUserColumns = Pick<User, "id" | "name" | "email">;

/**
 * Get the columns that can be returned from the user table
 * @param user
 */
export function getRetornableUserColumns(
  user: User | DBColumns<User>
): RetornableUserColumns;
export function getRetornableUserColumns(
  user: Array<User> | Array<DBColumns<User>>
): Array<RetornableUserColumns>;
export function getRetornableUserColumns(
  user:
    | ObjectReturnsArrayOrObject<User>
    | ObjectReturnsArrayOrObject<DBColumns<User>>
): ObjectReturnsArrayOrObject<RetornableUserColumns> {
  if (Array.isArray(user)) {
    return user.map((row) => {
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        /**
         * @doc Only usefull information should be returned
         *
         * @warn NEVER return password or token
         */
        // password: row.password,
        // token: row.token,
        // createdAt: row.createdAt,
        // updatedAt: row.updatedAt,
      };
    });
  } else {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
