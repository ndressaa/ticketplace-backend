import type { TimestampColumns, TableDefinition } from "./types";

export namespace Empresas {
  /**
   * This table relative columns
   */
  export interface TableType extends TimestampColumns {
    id: number;
    cnpj: string;
    name: string;
    email: string;
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
      name: "tb_empresas",
      schema: "public",
      alias: "empresas",
      colummns: {
        id: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        cnpj: {
          omit: false,
          operators: ["eq"],
          type: "string",
        },
        name: {
          omit: false,
          operators: ["eq"],
          type: "string",
        },
        email: {
          omit: false,
          operators: ["eq"],
          type: "string",
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
