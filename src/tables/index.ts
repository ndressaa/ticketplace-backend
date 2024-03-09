import { Empresas } from "./empresas";
import { Usuarios } from "./usuarios";
import { Eventos } from "./eventos";
import { Ingressos } from "./ingressos";
import { Cartoes } from "./cartoes";
import { Carrinho } from "./carrinho";

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
