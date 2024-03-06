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
  | Empresas.TableType
  | Usuarios.TableType
  | Eventos.TableType
  | Ingressos.TableType
  | Cartoes.TableType
  | Carrinho.TableType;

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

export { Empresas, Usuarios, Eventos, Ingressos, Cartoes, Carrinho };
