import type { Middleware } from "./types";
import type { ControllerName } from "../controller/types";
import type { Context } from "../controller/types";

import controllers from "../controller/get";
import ControllerError from "../controller/ControllerError";
import { validadeToken } from "../controller/login";

const get: Middleware = async (context) => {
  const { request: req, response: res } = context;

  const urlParts = req.url.split("/");

  const [version, path, id] = urlParts as [
    string | undefined,
    ControllerName | undefined,
    string | undefined
  ];

  if (!version || !path) {
    res.raiseError(406, "Not acceptable");
    return;
  }

  // Performs authentication
  if (path !== "login") {
    const isTokenValid = await validadeToken(context);
    if (!isTokenValid) return;
  }

  const controller = controllers[path as keyof typeof controllers];

  if (version !== "v1" || !controller) {
    res.raiseError(501, "Not implemented");
  }

  const controllerContext: Context = {
    searchParams: req.searchParams,
    headers: req.headers,
    id,
  };

  try {
    const data = await controller(controllerContext);

    if (!data) {
      res.raiseError(500, "Internal Server Error: No content");
      return;
    }

    if (Array.isArray(data)) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
      return;
    }

    res.writeHead(data.statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data.content));
  } catch (error) {
    if (error instanceof ControllerError) {
      res.raiseError(error.statusCode || 500, error.message);
    } else {
      res.raiseError(500, "Internal Server Error");
    }
  }
};

export default get;
