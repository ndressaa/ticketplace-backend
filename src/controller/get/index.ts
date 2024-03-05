import type { ControllerName } from "../types";

import usuarios from "./usuarios";
import eventos from "./eventos";

import { login } from "../login";

const controllers: Record<
  "usuarios" | "eventos" | "login",
  typeof usuarios | typeof eventos | typeof login
> = {
  usuarios,
  eventos,
  login,
};

export default controllers;
