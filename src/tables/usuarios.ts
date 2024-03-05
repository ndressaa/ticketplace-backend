import type { ObjectReturnsArrayOrObject } from "../types";
import type { TimestampColumns } from "./types";

export namespace Usuarios {
  export interface Table extends TimestampColumns {
    id: number;
    name: string;
    cpf: string;
    email: string;
    password: string;
    token?: string;
  }

  /**
   * Table columns that can be returned (no sensitive information)
   */
  export type RetornableColumns = Omit<Table, "password" | "token">;

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
  ): RetornableColumns | Array<RetornableColumns> {
    if (Array.isArray(rows)) {
      return rows.map<RetornableColumns>((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        cpf: row.cpf,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        /**
         * @doc Only usefull information should be returned
         *
         * @warn NEVER return password or token
         */
        // password: row.password,
        // token: row.token,
      }));
    } else {
      return {
        id: rows.id,
        name: rows.name,
        email: rows.email,
        cpf: rows.cpf,
        createdAt: rows.createdAt,
        updatedAt: rows.updatedAt,
      };
    }
  }
}
