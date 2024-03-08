import type { Controller } from "../types";

import { Eventos } from "../../tables";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";
import { parsePostRequest } from "../../utils/tools";

const dbClient = new DBClient();

const controller: Controller<true, Array<Partial<Eventos.TableType>>> = async (
  context
) => {
  const { id, searchParams, body } = context;

  try {
    const { columns, values } = parsePostRequest(
      body,
      Eventos.tableDefinition,
      [
        "titulo",
        "descricao",
        "id_empresa",
        "data",
        "tipo_evento",
        "genero",
        "capa",
      ]
    );

    await dbClient.upsert<Partial<Eventos.TableType>>(
      Eventos.tableDefinition.name,
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
