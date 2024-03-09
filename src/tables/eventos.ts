import type { TimestampColumns, TableDefinition } from "./types";

export namespace Eventos {
  /**
   * This table relative columns
   */
  export interface TableType extends TimestampColumns {
    id: number;
    id_empresa: number;
    titulo: string;
    descricao: string;
    data: string;
    tipo_evento: Array<string>;
    genero: Array<string>;
    capa: string;
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
      indexBy: ["id", "id_empresa"],
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
        titulo: {
          omit: false,
          operators: ["eq", "like"],
          type: "string",
        },
        descricao: {
          omit: false,
          operators: ["eq", "like"],
          type: "string",
        },
        data: {
          omit: false,
          operators: ["eq", "gt", "lt"],
          type: "string",
        },
        tipo_evento: {
          omit: false,
          operators: ["eq"],
          type: "array",
        },
        genero: {
          omit: false,
          operators: ["eq"],
          type: "array",
        },
        capa: {
          omit: false,
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
