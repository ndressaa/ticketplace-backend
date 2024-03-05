import type { Empresas } from "./empresas";
import type { Usuarios } from "./usuarios";
import type { Eventos } from "./eventos";
import type { Ingressos } from "./ingressos";
import type { Cartoes } from "./cartoes";
import type { Carrinho } from "./carrinho";

/**
 * Every table object
 */
export type Tables =
  | Empresas.Table
  | Usuarios.Table
  | Eventos.Table
  | Ingressos.Table
  | Cartoes.Table
  | Carrinho.Table;

/**
 * Columns that can be returned\
 */
export type RetornableColumns =
  | Empresas.RetornableColumns
  | Usuarios.RetornableColumns
  | Eventos.RetornableColumns
  | Ingressos.RetornableColumns
  | Cartoes.RetornableColumns
  | Carrinho.RetornableColumns;

/**
 * Database content object
 */
export interface TimestampColumns {
  createdAt: string;
  updatedAt: string;
}
