import type { ObjectReturnsArrayOrObject } from "../types";
import type { TimestampColumns } from "./types";

export namespace Eventos {
  export interface Table extends TimestampColumns {
    id: number;
    id_empresa: number;
    title: string;
    description: string;
    date: string;
    event_type: Array<string>;
    genre: Array<string>;
  }

  export type RetornableColumns = Table;

  /**
   * Get the columns that can be returned from the table
   * @param rows
   */
  export function parseRetornableColumns(rows: Table): RetornableColumns;
  export function parseRetornableColumns(
    rows: Array<Table>
  ): Array<RetornableColumns>;
  export function parseRetornableColumns(
    rows: ObjectReturnsArrayOrObject<Table>
  ): ObjectReturnsArrayOrObject<RetornableColumns> {
    if (Array.isArray(rows)) {
      /**
       * @note keep this implementation to help future changes
       */
      return rows;
    } else {
      return rows;
    }
  }
}
