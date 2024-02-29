import type { User, RetornableUserColumns } from "../../tables/user";
import type { DBColumns } from "../../tables/types";
import type { Controller } from "../types";

import { getRetornableUserColumns } from "../../tables/user";
import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";

type UsersTable = DBColumns<User>;

const dbClient = new DBClient();

const users: Controller<Array<RetornableUserColumns>> = async (context) => {
  const { id, searchParams } = context;

  let sql = "SELECT * FROM public.user WHERE 1 = 1";
  let params: string[] = [];

  let placeholderIndex = 1;
  if (id) {
    sql += ` AND id = $${placeholderIndex++}`;
    params.push(id);
  } else {
    searchParams.forEach((value, key) => {
      if (key === "email") {
        sql += ` AND "email" = $${placeholderIndex++}`;
        params.push(value);
      } else if (key === "name") {
        sql += ` AND "name" = $${placeholderIndex++}`;
        params.push(value);
      } else {
        throw new ControllerError(`Invalid search parameter: ${key}`, 400);
      }
    });
  }

  const result = await dbClient.query<UsersTable>(sql, params);

  return getRetornableUserColumns(result);
};

export default users;
