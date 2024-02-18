import type { ControllerName } from "../types";

import users from "./users";
import shows from "./shows";

import { newUser } from "../login";

const controllers: Record<
  "users" | "shows" | "newUser",
  typeof users | typeof shows | typeof newUser
> = {
  users,
  shows,
  newUser,
};

export default controllers;
