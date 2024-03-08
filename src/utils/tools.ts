import { TableDefinition, ColumnInfo, TableOperators } from "../tables/types";

type GenericObject = Record<string, any>;

/**
 * Parse URL parameters and return a SQL query and its parameters
 *
 * @param tableDefinition
 * @param searchParams
 * @param sql
 * @returns
 */
function parseUrlParams<
  T extends TableDefinition<GenericObject, GenericObject>
>(tableDefinition: T, searchParams: URLSearchParams, sql?: string) {
  let params: Array<string | Date | number> = [];
  let placeholderIndex = 1;

  const selectableColumns = Object.keys(tableDefinition.colummns).filter(
    (key) =>
      !(
        tableDefinition.colummns[key as never] as ColumnInfo<
          undefined | true,
          any
        >
      ).omit
  );

  if (!sql) {
    sql = `
      SELECT "${selectableColumns.join('", "')}" 
      FROM ${tableDefinition.schema}.${tableDefinition.name} ${
      tableDefinition.alias
    } 
      WHERE 1 = 1`;
  }

  const arrayColumns: Record<
    Exclude<keyof T["colummns"], symbol>,
    typeof params
  > = {} as never;

  searchParams.forEach((value, key) => {
    const [columnName, operator] = key.split("-") as [
      Exclude<keyof T["colummns"], symbol>,
      TableOperators | undefined
    ];
    const column = tableDefinition.colummns[columnName as never] as
      | ColumnInfo<undefined | true, any>
      | undefined;

    if (!column || column.omit) {
      throw new Error(`Invalid column: ${columnName}`);
    }

    if (column.type === "array") {
      if (operator && operator !== "eq") {
        throw new Error(`Invalid operator for ${columnName}: ${operator}`);
      }

      if (!arrayColumns[columnName]) arrayColumns[columnName] = [];
      arrayColumns[columnName].push(value);
      return;
    }

    if (operator) {
      if (!column.operators.includes(operator)) {
        throw new Error(`Invalid operator: ${operator}`);
      }

      if (operator === "like") {
        sql += ` AND ${
          tableDefinition.alias
        }."${columnName}" ILIKE $${placeholderIndex++}`;
        params.push(`%${value.toLowerCase()}%`);
      } else {
        let sqlOperator: string;
        switch (operator) {
          case "eq":
            sqlOperator = "=";
            break;
          case "gt":
            sqlOperator = ">";
            break;
          case "lt":
            sqlOperator = "<";
            break;

          default:
            throw new Error(`Operator not implemented: ${operator}`);
            break;
        }

        sql += ` AND ${
          tableDefinition.alias
        }."${columnName}" ${sqlOperator} $${placeholderIndex++}`;
        params.push(value);
      }
    } else {
      sql += ` AND ${
        tableDefinition.alias
      }."${columnName}" = $${placeholderIndex++}`;
    }
  });

  Object.entries(arrayColumns).forEach(([columnName, values]) => {
    sql += ` AND ${
      tableDefinition.alias
    }."${columnName}" @> $${placeholderIndex++}`;
    params.push(values as never);
  });

  return { sql, params };
}

/**
 * Parse a POST request and return affected columns and values
 *
 * @param body
 * @param tableDefinition
 * @param acceptedColumns
 */
function parsePostRequest<
  T extends TableDefinition<GenericObject, GenericObject>
>(
  body: Array<any>,
  tableDefinition: T,
  acceptedColumns: Array<keyof T["colummns"]>
) {
  const columns: Array<keyof T["colummns"]> = [];
  const values: Array<Array<any>> = [];

  body.forEach((line, index) => {
    if (!line || typeof line !== "object") {
      throw new Error(
        `Invalid data received: Missing ${
          tableDefinition.alias
        } object on line ${index + 1}`
      );
    }

    values[index] = [];

    const columnValue = Object.entries(line);
    if (columnValue.length === 0) {
      throw new Error(
        `Invalid data received: Missing ${tableDefinition.alias} object on line ${index}`
      );
    }

    if (index !== 0 && columns.length !== columnValue.length) {
      throw new Error(
        `Invalid data received: Inconsistent ${tableDefinition.alias} object on line ${index}`
      );
    }

    columnValue.forEach(([key, value]) => {
      if (!acceptedColumns.includes(key as never)) {
        throw new Error(
          `Invalid data received: '${key.toUpperCase()}' cannot be set`
        );
      }

      if (index === 0) {
        columns.push(key as never);
      } else if (!columns.includes(key as never)) {
        throw new Error(
          `Invalid data received: '${key.toUpperCase()}' on line ${index} is inconsistent with first line`
        );
      }

      values[index].push(value);
    });
  });

  return { columns, values };
}

export { parseUrlParams, parsePostRequest };
