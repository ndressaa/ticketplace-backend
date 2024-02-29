import { genSalt, hash, compare } from "bcrypt";

import type { Context } from "../types";
import type { Controller, ResponseObject } from "./types";
import type { Token } from "./types";
import type { User } from "../tables/user";
import type { DBColumns } from "../tables/types";

import ControllerError from "./ControllerError";
import DBClient from "../utils/DBClient";
import { getRetornableUserColumns } from "../tables/user";

const dbClient = new DBClient();

const tokenExpiration = 60 * 60 * 24; // 24 hours

/**
 * Hash the password
 *
 * @param password
 * @returns
 */
async function hashPassword(password: string) {
  const salt = await genSalt(10);
  const hashPassword = await hash(password, salt);
  return hashPassword;
}

/**
 * Compare given password with the hash
 *
 * @param password
 * @param hash
 * @returns
 */
async function comparePasswords(password: string, hash: string) {
  return await compare(password, hash);
}

/**
 * Generate a token
 *
 * @doc Generate a token has two parts, a random number and the current unix time
 * in seconds, converted to base64.
 * To verify the token, we can decode it and check if the second part is not too old.
 *
 * @returns
 */
function getToken(): string {
  const rndNumber = Math.random().toString(36).substring(2);
  const nowUnix = Math.floor(Date.now() / 1000);
  return Buffer.from(`${rndNumber}.${nowUnix}`).toString("base64");
}

/**
 * Decode the token
 *
 * @param token
 * @returns
 */
function decodeToken(token: string) {
  const decoded = Buffer.from(token, "base64").toString();
  const [rndNumber, nowUnix] = decoded.split(".");

  if (!rndNumber || !nowUnix) {
    throw new Error("Invalid token");
  }

  const tokenTime = parseInt(nowUnix);
  if (isNaN(tokenTime) || tokenTime < 0) {
    throw new Error("Invalid token");
  }

  const now = Math.floor(Date.now() / 1000);
  if (now - tokenTime > tokenExpiration) {
    throw new Error("Token expired");
  }

  return { rndNumber, nowUnix };
}

/**
 *  Validate the token
 *
 * @param context
 * @returns
 */
export const validateToken = async (context: Context): Promise<boolean> => {
  const { request, response } = context;

  const authHeader = request.headers["authorization"];
  if (authHeader) {
    const [bearer, token] = authHeader.split(" ");
    console.debug({
      validateToken: {
        bearer,
        token,
      },
    });

    if (bearer === "Bearer" && token) {
      try {
        decodeToken(token);

        const foundUser = await dbClient.query<User>(
          `SELECT * FROM public.user WHERE "token" = $1`,
          [token]
        );

        if (foundUser.length === 1) return true;
      } catch (error) {
        response.raiseError(401, `Unauthorized: ${(error as Error).message}`);
        return false;
      }
    }
  }

  response.raiseError(401, "Unauthorized");
  return false;
};

/**
 * New user middleware
 *
 * @param context
 */
export const newUser: Controller<ResponseObject<Token>> = async (context) => {
  const { body } = context;

  if (!body) {
    throw new ControllerError("Invalid data received: Missing body", 400);
  }

  try {
    const data = JSON.parse(body) as Partial<User>;
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new ControllerError(
        `Invalid data received: Missing ${
          !name ? "name" : !email ? "email" : "password"
        }`,
        400
      );
    }

    const hashedPassword = await hashPassword(password);
    const token = getToken();

    console.debug({
      newUser: {
        data,
        hashedPassword,
        token,
      },
    });

    const dbTransaction = await dbClient.startTransaction();

    const user = await dbClient.query<DBColumns<User>>(
      `INSERT INTO public.user
        ("name", "email", "password", "token") 
      VALUES ($1, $2, $3, $3)
      RETURNING *`,
      [name, email, hashedPassword, token],
      dbTransaction
    );

    if (user.length !== 1) {
      await DBClient.rollbackTransaction(dbTransaction);
      throw new ControllerError(
        `Internal server error: Incorrect number of users returned: ${user.length}`,
        500
      );
    }
    await DBClient.commitTransaction(dbTransaction);

    const payload: ResponseObject<Token> = {
      statusCode: 201,
      content: { token, user: getRetornableUserColumns(user[0]) },
    };

    return payload;
  } catch (error) {
    if (error instanceof ControllerError) throw error;
    throw new ControllerError(
      `Error while creating user: ${(error as Error).message}`,
      400
    );
  }
};

/**
 * Login middleware
 *
 * @param context
 * @returns
 */
export const login: Controller<ResponseObject<Token>> = async (context) => {
  const { headers } = context;

  const authHeader = headers["authorization"];
  if (authHeader) {
    const [authMethod, auth] = authHeader.split(" ");
    if (authMethod !== "Basic" || !auth) {
      throw new ControllerError("Unauthorized", 401);
    }

    const decodedAuth = Buffer.from(auth, "base64").toString().split(":");
    const email = decodedAuth[0];
    const pass = decodedAuth[1];
    console.log(`email: ${email} pass: ${pass}`);
    if (email && pass) {
      const foundUser = await dbClient.query<User>(
        `SELECT * FROM public.user WHERE "email" = $1`,
        [email]
      );
      console.debug({
        login: {
          select: {
            email,
            foundUser,
          },
        },
      });

      if (foundUser.length > 1) {
        throw new ControllerError(
          `Internal server error: duplicated user`,
          500
        );
      }

      if (foundUser.length !== 0) {
        const { password } = foundUser[0];
        const isPasswordValid = await comparePasswords(pass, password);
        console.debug({
          login: {
            passwordCompare: {
              receivedPassword: pass,
              dbPassword: password,
              valid: isPasswordValid,
            },
          },
        });
        if (isPasswordValid) {
          const token = getToken();

          await dbClient.query(
            `
            UPDATE public.user
            SET "token" = $1
            WHERE "email" = $2
          `,
            [token, email]
          );

          const payload: ResponseObject<Token> = {
            statusCode: 201,
            content: { token, user: getRetornableUserColumns(foundUser[0]) },
          };

          return payload;
        }
      }
    }
  }

  throw new ControllerError("Unauthorized", 401);
};
