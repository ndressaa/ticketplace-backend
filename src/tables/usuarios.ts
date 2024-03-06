import type { TimestampColumns, TableDefinition } from "./types";

export namespace Usuarios {
  /**
   * This table relative columns
   */
  export interface TableType extends TimestampColumns {
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
  export type RetornableColumns = Omit<TableType, "password" | "token">;

  /**
   * Table definition
   */
  export const tableDefinition: TableDefinition<TableType, RetornableColumns> =
    {
      name: "tb_usuarios",
      schema: "public",
      alias: "usuarios",
      colummns: {
        id: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        name: {
          omit: false,
          operators: ["eq"],
          type: "string",
        },
        cpf: {
          omit: false,
          operators: ["eq"],
          type: "string",
        },
        email: {
          omit: false,
          operators: ["eq"],
          type: "string",
        },
        password: {
          omit: true,
          operators: ["eq"],
          type: "string",
        },
        token: {
          omit: true,
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
