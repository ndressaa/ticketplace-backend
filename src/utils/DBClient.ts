import { DatabaseError, Pool, PoolClient, QueryResultRow } from "pg";

/**
 * Database configuration options
 */
export interface DatabaseOptions {
  /**
   * @default 'database'
   */
  host: string;

  /**
   * @default 5432
   */
  port: number;

  /**
   * @default 'ticketplace-db'
   */
  database: string;

  /**
   * Database user
   * @default 'postgres'
   */
  user: string;

  /**
   * Database password
   * @default 'semsenha'
   */
  password: string;
}

/**
 * Database error
 */
export interface DBError extends DatabaseError {}

const options: DatabaseOptions = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: "ticketplace-db",
  user: "postgres",
  password: "semsenha",
};

class DBClient {
  /**
   * The PG pool
   */
  private pool: Pool;

  constructor() {
    this.pool = new Pool(options);
  }

  /**
   * Connect to the database
   * @returns
   */
  public connect(): Promise<PoolClient> {
    return this.pool.connect();
  }

  /**
   * Start a transaction
   * @returns
   */
  public async startTransaction(): Promise<PoolClient> {
    const client = await this.connect();
    await client.query("begin;");
    return client;
  }

  /**
   * Commit a transaction
   * @param transaction The transaction to commit
   */
  static async commitTransaction(transaction: PoolClient): Promise<void> {
    try {
      await transaction.query("commit;");
    } catch (err) {
      throw err;
    } finally {
      transaction.release();
    }
  }

  /**
   * Rollback a transaction
   * @param transaction The transaction to rollback
   */
  static async rollbackTransaction(transaction: PoolClient): Promise<void> {
    try {
      await transaction.query("rollback;");
    } catch (err) {
      throw err;
    } finally {
      transaction.release();
    }
  }

  /**
   * Run a query
   * @param query The query to run
   * @param values The values to use in the query
   * @param transaction The transaction to use (optional)
   * @returns
   */
  public async query<T extends QueryResultRow>(
    query: string,
    values?: Array<any>,
    transaction?: PoolClient
  ): Promise<Array<T>> {
    let client: PoolClient | null = null;
    try {
      client = transaction || (await this.connect());
      const result = await client.query(query, values);
      return result.rows;
    } catch (err) {
      console.error({
        message: "Error while running `query()`",
        query,
        values,
        error: err,
      });
      throw err;
    } finally {
      if (!transaction && client) client.release();
    }
  }

  /**
   * Insert or update a new row(s)
   *
   * @param table Table name
   * @param columns Columns to insert
   * @param conflictColumns Columns to check for conflicts (constaints)
   * @param values Values to insert
   * @param transaction The transaction to use (optional)
   */
  public async upsert<T extends object>(
    table: string,
    columns: Array<keyof T>,
    conflictColumns: Array<keyof T>,
    values: Array<Array<any>>,
    transaction?: PoolClient
  ): Promise<void> {
    const client = transaction || (await this.connect());

    let query = "UNKNOWN QUERY";
    try {
      let placeholder = 1;
      const cols = `"${columns.join('", "')}"`;
      const insertValues = values
        .map(
          (line) => `(${line.map((_col) => `$${placeholder++}`).join(", ")})`
        )
        .join(", ");
      const updateValues = columns
        .map((c) => `${c.toString()} = EXCLUDED.${c.toString()}`)
        .join(", ");
      query = `
        INSERT INTO public.${table}
          (${cols})
        VALUES
          ${insertValues}
        ON CONFLICT
          ("${conflictColumns.join('", "')}")
          DO UPDATE SET ${updateValues};
      `;
      await client.query(query, values.flat());
    } catch (err) {
      console.error({
        message: "Error while running `upsert()`",
        query,
        values,
        error: err,
      });
      throw err;
    } finally {
      if (!transaction) client.release();
    }
  }
}

export default DBClient;
