import type { Controller } from "../types";

import { Usuarios } from "../../tables/usuarios";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";
import { parsePostRequest } from "../../utils/tools";

const dbClient = new DBClient();

const controller: Controller<true, Array<Partial<Usuarios.TableType>>> = async (
  context
) => {
  const { id, searchParams, body } = context;

  try {
    const { columns, values } = parsePostRequest(
      body,
      Usuarios.tableDefinition,
      ["name", "email", "password", "cpf"]
    );

    await dbClient.upsert<Partial<Usuarios.TableType>>(
      Usuarios.tableDefinition.name,
      columns,
      ["id", "email"],
      values
    );
  } catch (error) {
    if (error instanceof ControllerError) throw error;
    throw new ControllerError((error as Error).message, 400);
  }

  return true;
};

export default controller;
