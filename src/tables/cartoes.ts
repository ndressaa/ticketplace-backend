import type { TimestampColumns, TableDefinition } from "./types";

export namespace Cartoes {
  /**
   * This table relative columns
   */
  export interface TableType extends TimestampColumns {
    id: number;
    nome_cartao?: string;
    cpf_titular: string;
    numero_cartao: string;
    data_expiracao: string;
    codigo_seguranca: string;
    id_usuario: number;
  }
  /**
   * Columns that can be returned
   */
  export type RetornableColumns = Omit<
    TableType,
    "codigo_seguranca" | "numero_cartao" | "data_expiracao"
  >;

  export const tableDefinition: TableDefinition<TableType, RetornableColumns> =
    {
      name: "tb_dados_cartao",
      schema: "public",
      alias: "cartoes",
      indexBy: ["id", "id_usuario"],
      colummns: {
        id: {
          omit: false,
          operators: ["eq"],
          type: "number",
        },
        nome_cartao: {
          omit: true,
          operators: ["eq"],
          type: "string",
        },
        cpf_titular: {
          omit: false,
          operators: ["eq"],
          type: "string",
        },
        numero_cartao: {
          omit: true,
          operators: ["eq"],
          type: "string",
        },
        data_expiracao: {
          omit: true,
          operators: ["eq"],
          type: "string",
        },
        codigo_seguranca: {
          omit: true,
          operators: ["eq"],
          type: "string",
        },
        id_usuario: {
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
