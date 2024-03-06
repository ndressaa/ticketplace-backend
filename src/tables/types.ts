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
  name: string;
  schema: string;
  alias: string;
  colummns: ColumnsDefinition<T, R>;
}

/**
 * Database content object
 */
export interface TimestampColumns {
  created_at: string;
  updated_at: string;
}
