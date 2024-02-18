import type { Middleware } from "./types";

import get from "./get";
import post from "./post";

const middlewares: {
  get: Middleware;
  post: Middleware;
} = {
  get,
  post,
};

export default middlewares;
