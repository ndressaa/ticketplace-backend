import type { ControllerName } from "../types";

import usuarios from "./usuarios";
import eventos from "./eventos";

import { newUser } from "../login";

const controllers: Record<
  "usuarios" | "eventos" | "newUser",
  typeof usuarios | typeof eventos | typeof newUser
> = {
  usuarios,
  eventos,
  newUser,
};

export default controllers;
