import type { Controller } from "../types";

import { Ingressos } from "../../tables/ingressos";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";
import { parseUrlParams } from "../../utils/tools";

const dbClient = new DBClient();

const controller: Controller<Array<Ingressos.RetornableColumns>> = async (
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
      Ingressos.tableDefinition,
      searchParams
    );
    const result = await dbClient.query<Ingressos.TableType>(sql, params);

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
