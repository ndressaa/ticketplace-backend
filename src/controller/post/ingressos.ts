import type { Controller } from "../types";

import { Ingressos } from "../../tables";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";
import { parsePostRequest } from "../../utils/tools";

const dbClient = new DBClient();

const controller: Controller<
  true,
  Array<Partial<Ingressos.TableType>>
> = async (context) => {
  const { id, searchParams, body } = context;

  try {
    const { columns, values } = parsePostRequest(
      body,
      Ingressos.tableDefinition,
      ["id", "ticket_type", "value", "id_evento"]
    );

    await dbClient.upsert<Partial<Ingressos.TableType>>(
      Ingressos.tableDefinition.name,
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
