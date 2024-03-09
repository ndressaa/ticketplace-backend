import * as http from "http";

import type { Request, Response } from "./types";

import middlewares from "./middleware";

function isValidMethod(method: string): method is keyof typeof middlewares {
  return method === "get" || method === "post" || method === "delete";
}

const server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const raiseError = (statusCode: number, message: string) => {
      console.error(`Error ${statusCode}: ${message}`);
      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: message }));
    };

    const sendOk = (statusCode = 200, message = "OK") => {
      const content: {
        status: string;
        message?: string;
      } = { status: "OK" };

      if (message) content.message = message;

      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify(content));
    };

    if (!req.url) return raiseError(404, "Not found");
    if (!req.method) return raiseError(405, "Method not allowed");

    const request = req as Request;
    const response = res as Response;

    // Parse URL
    request.url = decodeURI(req.url);

    // Parse search params
    request.searchParams = new URLSearchParams(request.url.split("?")[1]);

    // Add raiseError to response object
    response.raiseError = raiseError;

    // Add sendOk to response object
    response.sendOk = sendOk;

    const method = req.method.toLowerCase();
    if (!isValidMethod(method)) return raiseError(405, "Method not allowed");

    const context = { request, response };
    // Call the middleware
    await middlewares[method](context);

    // If the response is not ended by the middleware, send a 500 error
    if (!response.writableEnded || !response.headersSent) {
      raiseError(500, "Internal Server Error");
    }
  }
);

server.listen(8080, () => {
  console.debug("Server HTTP running on port 8080");
});
