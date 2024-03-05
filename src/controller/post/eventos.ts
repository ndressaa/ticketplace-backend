import type { Controller } from "../types";
import type { Eventos } from "../../tables/eventos";

import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";

const dbClient = new DBClient();

const shows: Controller<true> = async (context) => {
  const { id, searchParams, body } = context;

  if (!body) {
    throw new ControllerError("Invalid data received: Missing body", 400);
  }

  const data = JSON.parse(body) as Array<Partial<Eventos.Table>>;

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new ControllerError("Invalid data received: Missing array", 400);
  }

  if (id) {
    if (data.length > 1) {
      throw new ControllerError(
        "Invalid data received: cannot set multiple shows with an id",
        400
      );
    }

    const show = data[0];
    if (!show || typeof show !== "object") {
      throw new ControllerError(
        "Invalid data received: Missing show object",
        400
      );
    }

    const showColValue = Object.entries(show);
    if (showColValue.length === 0) {
      throw new ControllerError(
        `Invalid data received: Missing show object on line 0`,
        400
      );
    }

    let params: Array<unknown> = [];
    let sql = `
      UPDATE public.shows SET ${showColValue
        .map(([key, value], index) => {
          if (key !== "title" && key !== "description" && key !== "value") {
            throw new ControllerError(
              `Invalid data received: '${key.toUpperCase()}' cannot be set`,
              400
            );
          }

          params.push(value);
          return `"${key}" = ${index + 1}`;
        })
        .join(", ")} WHERE "id" = $${params.length + 1}`;

    await dbClient.query(sql, params);
    return true;
  }

  const columns: Array<keyof Eventos.Table> = [];
  data.forEach((show, index) => {
    if (!show || typeof show !== "object") {
      throw new ControllerError(
        "Invalid data received: Missing show object",
        400
      );
    }

    const showColumns = Object.keys(show) as Array<keyof Eventos.Table>;
    if (showColumns.length === 0) {
      throw new ControllerError(
        `Invalid data received: Missing show object on line ${index}`,
        400
      );
    }

    if (index !== 0 && columns.length !== showColumns.length) {
      throw new ControllerError(
        `Invalid data received: Inconsistent show object on line ${index}`,
        400
      );
    }

    showColumns.forEach((key) => {
      if (
        key !== "title" &&
        key !== "description" &&
        key !== "id_empresa" &&
        key !== "date" &&
        key !== "event_type" &&
        key !== "genre"
      ) {
        throw new ControllerError(
          `Invalid data received: '${key.toUpperCase()}' cannot be set`,
          400
        );
      }

      if (index === 0) {
        columns.push(key);
      } else if (!columns.includes(key)) {
        throw new ControllerError(
          `Invalid data received: '${key.toUpperCase()}' on line ${index} is inconsistent with first line`,
          400
        );
      }
    });
  });

  await dbClient.upsert<Partial<Eventos.Table>>("shows", columns, ["id"], data);

  return true;
};

export default shows;
