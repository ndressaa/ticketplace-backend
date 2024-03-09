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
    tipo: TicketType;
    valor: number;
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
        tipo: {
          omit: false,
          operators: ["eq"],
          type: "string",
        },
        valor: {
          omit: false,
          operators: ["eq", "gt", "lt"],
          type: "number",
        },
        id_evento: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        criado_data: {
          omit: false,
          operators: ["eq", "gt", "lt"],
          type: "string",
        },
        atualizado_data: {
          omit: false,
          operators: ["eq", "gt", "lt"],
          type: "string",
        },
      },
    } as const;
}
