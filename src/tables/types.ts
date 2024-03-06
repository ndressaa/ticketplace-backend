export type TableOperators = "eq" | "gt" | "lt" | "like";

export interface ColumnInfo<O, T> {
  omit: O extends undefined
    ? boolean
    : O extends string | number | boolean | object | Array<any>
    ? false
    : true;
  operators: Array<TableOperators>;
  type: T extends number ? "number" : T extends Array<any> ? "array" : "string";
}

export type ColumnsDefinition<T extends object, R extends Partial<T>> = {
  [K in keyof T]: ColumnInfo<R[K], T[K]>;
};

export interface TableDefinition<T extends object, R extends Partial<T>> {
  /**
   * The table name
   */
  name: string;

  /**
   * The schema name
   */
  schema: string;

  /**
   * The table alias
   */
  alias: string;

  /**
   * The table columns
   */
  colummns: ColumnsDefinition<T, R>;

  /**
   * The columns to be indexed by
   *
   * @note List columns that could be indexed (selectable on critical queries like DELETE)
   */
  indexBy: Array<keyof T>;
}

/**
 * Database content object
 */
export interface TimestampColumns {
  created_at: string;
  updated_at: string;
}
