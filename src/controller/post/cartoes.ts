import type { Controller } from "../types";

import { Cartoes } from "../../tables";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";
import { parsePostRequest } from "../../utils/tools";

const dbClient = new DBClient();

const controller: Controller<true, Array<Partial<Cartoes.TableType>>> = async (
  context
) => {
  const { id, searchParams, body } = context;

  try {
    const { columns, values } = parsePostRequest(
      body,
      Cartoes.tableDefinition,
      [
        "id",
        "id_usuario",
        "nome_cartao",
        "numero_cartao",
        "cpf_titular",
        "data_expiracao",
        "codigo_seguranca",
      ]
    );

    await dbClient.upsert<Partial<Cartoes.TableType>>(
      Cartoes.tableDefinition.name,
      columns,
      ["id"],
      values
    );
  } catch (error) {
    if (error instanceof ControllerError) throw error;
    throw new ControllerError((error as Error).message, 400);
  }

  return true;
};

export default controller;
