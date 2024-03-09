import type { Middleware } from "./types";

import get from "./get";
import post from "./post";
import del from "./delete";

const middlewares: {
  get: Middleware;
  post: Middleware;
  delete: Middleware;
} = {
  get,
  post,
  delete: del,
};

export default middlewares;
