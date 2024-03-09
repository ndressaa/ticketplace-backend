import type { TimestampColumns, TableDefinition } from "./types";

export namespace Usuarios {
  /**
   * This table relative columns
   */
  export interface TableType extends TimestampColumns {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    senha: string;
    token?: string;
  }

  /**
   * Table columns that can be returned (no sensitive information)
   */
  export type RetornableColumns = Omit<TableType, "senha" | "token">;

  /**
   * Table definition
   */
  export const tableDefinition: TableDefinition<TableType, RetornableColumns> =
    {
      name: "tb_usuarios",
      schema: "public",
      alias: "usuarios",
      indexBy: ["id", "email", "cpf"],
      colummns: {
        id: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        nome: {
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
        senha: {
          omit: true,
          operators: ["eq"],
          type: "string",
        },
        token: {
          omit: true,
          operators: ["eq"],
          type: "string",
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
