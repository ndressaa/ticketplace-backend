import type { TimestampColumns, TableDefinition } from "./types";

export namespace Ingressos {
  /**
   * List of ticket types
   */
  export enum TicketType {
    standard = "standard",
    vip = "vip",
    premium = "premium",
  }

  /**
   * This table relative columns
   */
  export interface TableType extends TimestampColumns {
    id: number;
    ticket_type: TicketType;
    value: number;
    id_evento: number;
  }

  /**
   * Columns that can be returned
   */
  export type RetornableColumns = TableType;

  /**
   * Table definition
   */
  export const tableDefinition: TableDefinition<TableType, RetornableColumns> =
    {
      name: "tb_ingressos",
      schema: "public",
      alias: "ingressos",
      indexBy: ["id", "id_evento"],
      colummns: {
        id: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        ticket_type: {
          omit: false,
          operators: ["eq"],
          type: "string",
        },
        value: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        id_evento: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        created_at: {
          omit: false,
          operators: ["eq", "gt", "lt"],
          type: "string",
        },
        updated_at: {
          omit: false,
          operators: ["eq", "gt", "lt"],
          type: "string",
        },
      },
    } as const;
}
