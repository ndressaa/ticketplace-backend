import type { ObjectReturnsArrayOrObject } from "../types";
import type { TimestampColumns } from "./types";

export namespace Cartoes {
  export interface Table extends TimestampColumns {
    id: number;
    nome_cartao?: string;
    cpf_titular: string;
    numero_cartao: string;
    data_expiracao: string;
    codigo_seguranca: string;
    id_usuario: number;
  }

  export type RetornableColumns = Omit<
    Table,
    "codigo_seguranca" | "numero_cartao" | "data_expiracao"
  >;

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
      return rows.map<RetornableColumns>((row) => ({
        id: row.id,
        nome_cartao: row.nome_cartao,
        cpf_titular: row.cpf_titular,
        id_usuario: row.id_usuario,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));
    } else {
      return {
        id: rows.id,
        nome_cartao: rows.nome_cartao,
        cpf_titular: rows.cpf_titular,
        id_usuario: rows.id_usuario,
        createdAt: rows.createdAt,
        updatedAt: rows.updatedAt,
      };
    }
  }
}
