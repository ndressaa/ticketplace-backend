import type { ControllerName } from "../types";

import users from "./users";
import shows from "./shows";

import { login } from "../login";

const controllers: Record<
  "users" | "shows" | "login",
  typeof users | typeof shows | typeof login
> = {
  users,
  shows,
  login,
};

export default controllers;
