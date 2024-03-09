import type { Controller } from "../types";

import { Eventos } from "../../tables";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";
import { parseUrlParams } from "../../utils/tools";

const dbClient = new DBClient();

function parseDate(date: string, fieldName: string): Date {
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new ControllerError(`Invalid date format: ${fieldName}`, 400);
  }
  return parsed;
}

const controller: Controller<Array<Eventos.RetornableColumns>> = async (
  context
) => {
  const { id, searchParams } = context;

  if ("id" in searchParams) {
    throw new ControllerError("invalid URL parameter: id", 400);
  }

  if (id) {
    searchParams.set("id-eq", id);
  }

  try {
    const { sql, params } = parseUrlParams(
      Eventos.tableDefinition,
      searchParams
    );
    const result = await dbClient.query<Eventos.TableType>(sql, params);

    if (!result) {
      throw new ControllerError("Not found", 404);
    }

    return result;
  } catch (error) {
    if (error instanceof ControllerError) throw error;
    throw new ControllerError((error as Error).message, 400);
  }
};

export default controller;
