import type { Endpoints } from "../types";

import carrinho from "./carrinho";

type EndpointsControllers = typeof carrinho;

const controllers: Record<
  Exclude<
    Endpoints,
    | "newUser"
    | "login"
    | "eventos"
    | "cartoes"
    | "empresas"
    | "usuarios"
    | "ingressos"
  >,
  EndpointsControllers
> = {
  carrinho,
};

export default controllers;
