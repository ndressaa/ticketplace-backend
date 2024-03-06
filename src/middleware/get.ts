import type { Middleware } from "./types";
import type { Endpoints } from "../controller/types";
import type { Context } from "../controller/types";

import controllers from "../controller/get";
import ControllerError from "../controller/ControllerError";
import { validateToken } from "../controller/login";

const middleware: Middleware = async (context) => {
  const { request: req, response: res } = context;

  const urlParts = req.url.split("/");

  const [, version, path, id] = urlParts as [
    string,
    string | undefined,
    Endpoints | undefined,
    string | undefined
  ];

  if (!version || !path) {
    res.raiseError(406, "Not acceptable");
    return;
  }

  // Performs authentication
  if (path !== "login") {
    const isTokenValid = await validateToken(context);

    if (!isTokenValid) {
      res.raiseError(401, "Unauthorized");
      return;
    }
  }

  const controller = controllers[path as keyof typeof controllers];

  if (version !== "v1" || !controller) {
    res.raiseError(501, "Not implemented");
    return;
  }

  const controllerContext: Context<undefined> = {
    searchParams: req.searchParams,
    headers: req.headers,
    id,
  };

  console.debug({ request: { version, path, id } });
  console.debug({
    get: {
      controller: controller ? controller.name || controller : "unknown",
      context: controllerContext,
    },
  });

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

export default middleware;
