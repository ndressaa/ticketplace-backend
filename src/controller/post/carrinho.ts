import type { Controller } from "../types";

import { Carrinho } from "../../tables";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";
import { parsePostRequest } from "../../utils/tools";

const dbClient = new DBClient();

const controller: Controller<true, Array<Partial<Carrinho.TableType>>> = async (
  context
) => {
  const { id, searchParams, body } = context;

  try {
    const { columns, values } = parsePostRequest(
      body,
      Carrinho.tableDefinition,
      ["id_usuario", "id_ingresso", "ticket_class", "discount"]
    );

    let placeholder = 1;
    const insertValues = values
      .map((line) => `(${line.map((_col) => `$${placeholder++}`).join(", ")})`)
      .join(", ");

    const sql = `
    WITH new_lines AS (
      INSERT INTO ${Carrinho.tableDefinition.schema}.${
      Carrinho.tableDefinition.name
    }
        ("${columns.join('", "')}")
      VALUES
        ${insertValues}
      RETURNING *
    )
    SELECT COUNT(*) AS "new_lines_count" FROM new_lines;`;

    const result = await dbClient.query<{ new_lines_count: number }>(
      sql,
      values.flat()
    );

    if (!result[0] || result[0].new_lines_count !== values.length) {
      throw new ControllerError(
        `Internal server error: Failed on insert new lines (${result[0].new_lines_count} <> ${values.length})`,
        500
      );
    }
  } catch (error) {
    if (error instanceof ControllerError) throw error;
    throw new ControllerError((error as Error).message, 400);
  }

  return true;
};

export default controller;
