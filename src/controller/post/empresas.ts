import type { Controller } from "../types";

import { Empresas } from "../../tables";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";
import { parsePostRequest } from "../../utils/tools";

const dbClient = new DBClient();

const controller: Controller<true, Array<Partial<Empresas.TableType>>> = async (
  context
) => {
  const { id, searchParams, body } = context;

  try {
    const { columns, values } = parsePostRequest(
      body,
      Empresas.tableDefinition,
      ["id", "cnpj", "name", "email"]
    );

    await dbClient.upsert<Partial<Empresas.TableType>>(
      Empresas.tableDefinition.name,
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
