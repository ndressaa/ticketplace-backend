import type { Controller } from "../types";
import type { Usuarios } from "../../tables/usuarios";

import DBClient from "../../utils/DBClient";
import ControllerError from "../ControllerError";

const dbClient = new DBClient();

const users: Controller<true> = async (context) => {
  const { id, searchParams, body } = context;

  if (!body) {
    throw new ControllerError("Invalid data received: Missing body", 400);
  }

  const data = JSON.parse(body) as Array<Partial<Usuarios.Table>>;

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new ControllerError("Invalid data received: Missing array", 400);
  }

  const columns: Array<keyof Usuarios.Table> = [];
  data.forEach((user, index) => {
    if (!user || typeof user !== "object") {
      throw new ControllerError(
        "Invalid data received: Missing user object",
        400
      );
    }

    const userColumns = Object.keys(user);
    if (userColumns.length === 0) {
      throw new ControllerError(
        `Invalid data received: Missing user object on line ${index}`,
        400
      );
    }

    if (index !== 0 && columns.length !== userColumns.length) {
      throw new ControllerError(
        `Invalid data received: Inconsistent user object on line ${index}`,
        400
      );
    }

    userColumns.forEach((key) => {
      if (
        key !== "name" &&
        key !== "email" &&
        key !== "password" &&
        key !== "cpf"
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

  await dbClient.upsert<Partial<Usuarios.Table>>(
    "users",
    columns,
    ["id", "email"],
    data
  );

  return true;
};

export default users;
