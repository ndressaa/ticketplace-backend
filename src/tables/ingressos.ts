import type { ObjectReturnsArrayOrObject } from "../types";
import type { TimestampColumns } from "./types";

export namespace Ingressos {
  /**
 * Table public.tb_ingressos as ingressos {
  id bigint [pk, not null, increment]
  type ticket_type [not null]
  value float [not null]
  id_evento bigint [not null, ref: > eventos.id]
  created_at timestamptz [not null, default: `current_timestamp`]
  updated_at timestamptz [not null, default: `current_timestamp`]
}
 */
  export enum TicketType {
    standard = "standard",
    vip = "vip",
    premium = "premium",
  }

  export interface Table extends TimestampColumns {
    id: number;
    ticket_type: TicketType;
    value: number;
    id_evento: number;
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
