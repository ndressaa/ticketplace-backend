import type { User, RetornableUserColumns } from "../tables/user";
import type { Show, RetornableShowColumns } from "../tables/show";

/**
 * Every table object
 */
export type Tables = User | Show;

/**
 * Columns that can be returned
 */
export type RetornableColumns = RetornableUserColumns | RetornableShowColumns;

/**
 * Database content object
 */
export type DBColumns<T extends Tables> = T & {
  createdAt: string;
  updatedAt: string;
};
