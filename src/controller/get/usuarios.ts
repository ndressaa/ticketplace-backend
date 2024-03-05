import type { Controller } from "../types";

import { Usuarios } from "../../tables/usuarios";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";

const dbClient = new DBClient();

const usuarios: Controller<Array<Usuarios.RetornableColumns>> = async (
  context
) => {
  const { id, searchParams } = context;

  let sql = "SELECT * FROM public.tb_usuarios WHERE 1 = 1";
  let params: string[] = [];

  let placeholderIndex = 1;
  if (id) {
    sql += ` AND id = $${placeholderIndex++}`;
    params.push(id);
  } else {
    searchParams.forEach((value, key) => {
      if (key === "email") {
        sql += ` AND "email" = $${placeholderIndex++}`;
        params.push(value);
      } else if (key === "name") {
        sql += ` AND "name" = $${placeholderIndex++}`;
        params.push(value);
      } else {
        throw new ControllerError(`Invalid search parameter: ${key}`, 400);
      }
    });
  }

  const result = await dbClient.query<Usuarios.Table>(sql, params);

  return Usuarios.parseRetornableColumns(result);
};

export default usuarios;
