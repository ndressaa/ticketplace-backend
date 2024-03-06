import type { Endpoints } from "../types";

import carrinho from "./carrinho";
import cartoes from "./cartoes";
import empresas from "./empresas";
import eventos from "./eventos";
import ingressos from "./ingressos";
import usuarios from "./usuarios";

import { newUser } from "../login";

type EndpointsControllers =
  | typeof usuarios
  | typeof eventos
  | typeof newUser
  | typeof carrinho
  | typeof cartoes
  | typeof empresas
  | typeof ingressos;

const controllers: Record<Exclude<Endpoints, "login">, EndpointsControllers> = {
  usuarios,
  eventos,
  newUser,
  carrinho,
  cartoes,
  empresas,
  ingressos,
};

export default controllers;
