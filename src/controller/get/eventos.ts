import type { Controller } from "../types";

import { Eventos } from "../../tables/eventos";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";

const dbClient = new DBClient();

function parseDate(date: string, fieldName: string): Date {
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new ControllerError(`Invalid date format: ${fieldName}`, 400);
  }
  return parsed;
}

const shows: Controller<Array<Eventos.RetornableColumns>> = async (context) => {
  const { id, searchParams } = context;

  let sql = "SELECT * FROM public.tb_eventos WHERE 1 = 1";

  const eventType: Array<string> = [];
  const genre: Array<string> = [];
  const params: Array<string | Date | typeof eventType | typeof genre> = [];

  let placeholderIndex = 1;
  if (id) {
    sql += ` AND id = $${placeholderIndex++}`;
    params.push(id);
  } else {
    searchParams.forEach((value, key) => {
      if (key === "id_empresa") {
        sql += ` AND "id_empresa" = $${placeholderIndex++}`;
        params.push(value);
      } else if (key === "title") {
        sql += ` AND "title" = $${placeholderIndex++}`;
        params.push(value);
      } else if (key === "title-like") {
        sql += ` AND LOWER("title") LIKE $${placeholderIndex++}`;
        params.push(`%${value.toLowerCase()}%`);
      } else if (key === "description") {
        sql += ` AND "description" = $${placeholderIndex++}`;
        params.push(value);
      } else if (key === "description-like") {
        sql += ` AND LOWER("description") LIKE $${placeholderIndex++}`;
        params.push(`%${value.toLowerCase()}%`);
      } else if (key === "date") {
        sql += ` AND "date" = $${placeholderIndex++}`;
        params.push(parseDate(value, "date-is"));
      } else if (key === "date-gt") {
        sql += ` AND "date" > $${placeholderIndex++}`;
        params.push(parseDate(value, "date-gt"));
      } else if (key === "date-ls") {
        sql += ` AND "date" < $${placeholderIndex++}`;
        params.push(parseDate(value, "date-lt"));
      } else if (key === "event_type") {
        eventType.push(value);
      } else if (key === "genre") {
        genre.push(value);
      } else {
        throw new ControllerError(`Invalid search parameter: ${key}`, 400);
      }
    });

    if (eventType.length > 0) {
      sql += ` AND "event_type" @> $${placeholderIndex++}`;
      params.push(eventType);
    }

    if (genre.length > 0) {
      sql += ` AND "genre" @> $${placeholderIndex++}`;
      params.push(genre);
    }
  }

  const result = await dbClient.query<Eventos.Table>(sql, params);

  return Eventos.parseRetornableColumns(result);
};

export default shows;
