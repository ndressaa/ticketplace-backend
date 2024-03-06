import type { TimestampColumns, TableDefinition } from "./types";

export namespace Carrinho {
  /**
   * List class of tickets
   */
  export enum TicketClass {
    standard = "standard",
    senior = "senior",
    student = "student",
    promotional = "promotional",
  }

  /**
   * This table relative columns
   */
  export interface TableType extends TimestampColumns {
    id_usuario: number;
    id_ingresso: number;
    ticket_class: TicketClass;
    discount: number;
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
      name: "tb_carrinho",
      schema: "public",
      alias: "carrinho",
      colummns: {
        id_usuario: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        id_ingresso: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        ticket_class: {
          omit: false,
          operators: ["eq"],
          type: "string",
        },
        discount: {
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
