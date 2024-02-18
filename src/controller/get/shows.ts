import type { Show, RetornableShowColumns } from "../../tables/show";
import type { DBColumns } from "../../tables/types";
import type { Controller } from "../types";

import { getRetornableShowColumns } from "../../tables/show";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";

type ShowsTable = DBColumns<Show>;

const dbClient = new DBClient();

const shows: Controller<Array<RetornableShowColumns>> = async (context) => {
  const { id, searchParams } = context;

  let sql = "SELECT * FROM public.shows WHERE 1 = 1";
  let params: string[] = [];

  if (id) {
    sql += " AND id = ?";
    params.push(id);
  } else {
    searchParams.forEach((value, key) => {
      if (key === "title") {
        sql += ' AND "title" = ?';
        params.push(value);
      } else if (key === "description") {
        sql += ' AND "description" = ?';
        params.push(value);
      } else if (key === "descriptionLike") {
        sql += ` AND "description" like '%?%'`;
        params.push(value);
      } else if (key === "value") {
        sql += ' AND "value" = ?';
        params.push(value);
      } else {
        throw new ControllerError(`Invalid search parameter: ${key}`, 400);
      }
    });
  }

  const result = await dbClient.query<ShowsTable>(sql, params);

  return getRetornableShowColumns(result);
};

export default shows;
