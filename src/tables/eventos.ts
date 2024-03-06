import type { TimestampColumns, TableDefinition } from "./types";

export namespace Eventos {
  /**
   * This table relative columns
   */
  export interface TableType extends TimestampColumns {
    id: number;
    id_empresa: number;
    title: string;
    description: string;
    date: string;
    event_type: Array<string>;
    genre: Array<string>;
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
      name: "tb_eventos",
      schema: "public",
      alias: "eventos",
      colummns: {
        id: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        id_empresa: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        title: {
          omit: false,
          operators: ["eq", "like"],
          type: "string",
        },
        description: {
          omit: false,
          operators: ["eq", "like"],
          type: "string",
        },
        date: {
          omit: false,
          operators: ["eq", "gt", "lt"],
          type: "string",
        },
        event_type: {
          omit: false,
          operators: ["eq"],
          type: "array",
        },
        genre: {
          omit: false,
          operators: ["eq"],
          type: "array",
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
