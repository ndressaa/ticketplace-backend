import type { Context } from "../types";

export type Middleware = (context: Context) => Promise<void>;
