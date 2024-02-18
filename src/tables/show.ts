import type { ObjectReturnsArrayOrObject } from "../types";
import type { DBColumns } from "./types";

/**
 * Show table
 */
export interface Show {
  id: number;
  title: string;
  description: string;
  value: string;
}

/**
 * Show columns that can be returned (no sensitive information)
 */
export type RetornableShowColumns = Show; // For now, all columns can be returned

/**
 * Get the columns that can be returned from the show table
 * @param show
 */
export function getRetornableShowColumns(
  show: Show | DBColumns<Show>
): RetornableShowColumns;
export function getRetornableShowColumns(
  show: Array<Show> | Array<DBColumns<Show>>
): Array<RetornableShowColumns>;
export function getRetornableShowColumns(
  show:
    | ObjectReturnsArrayOrObject<Show>
    | ObjectReturnsArrayOrObject<DBColumns<Show>>
): ObjectReturnsArrayOrObject<RetornableShowColumns> {
  if (Array.isArray(show)) {
    /**
     * @note keep this implementation to help future changes
     */
    return show;
  } else {
    return show;
  }
}
