import type { ObjectReturnsArrayOrObject } from "../types";
import type { TimestampColumns } from "./types";

export namespace Carrinho {
  export enum TocketClass {
    standard = "standard",
    senior = "senior",
    student = "student",
    promotional = "promotional",
  }

  export interface Table extends TimestampColumns {
    id_usuario: number;
    id_ingresso: number;
    ticket_class: TocketClass;
    discount: number;
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
