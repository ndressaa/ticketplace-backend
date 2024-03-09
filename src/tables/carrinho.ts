import type { TimestampColumns, TableDefinition } from "./types";

export namespace Carrinho {
  /**
   * List class of tickets
   */
  export enum TicketClass {
    standard = "standard",
    senior = "senior",
    student = "estudante",
    promotional = "promocional",
  }

  /**
   * This table relative columns
   */
  export interface TableType extends TimestampColumns {
    id_usuario: number;
    id_ingresso: number;
    classe: TicketClass;
    desconto: number;
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
      indexBy: ["id_usuario", "id_ingresso"],
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
        classe: {
          omit: false,
          operators: ["eq"],
          type: "string",
        },
        desconto: {
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
