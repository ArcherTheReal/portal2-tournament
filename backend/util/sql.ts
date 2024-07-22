const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const sql: Record<string, Function> = {};

module.exports = sql;

sql.getAll = async function () {
  return new Promise((resolve, reject) => {
    const query = "SELECT name FROM sqlite_master WHERE type='table'";
    global.db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const tableNames = rows.map((row: any) => row.name);
        resolve(tableNames);
      }
    });
  });
};

sql.getColumns = async function (table: string) {
  if (!table) {
    return tournament.util.output.error("No table specified", 400);
  }

  const tableNames = await sql.getAll();
  if (!tableNames.includes(table))
    return tournament.util.output.error("Table not found", 404);

  return new Promise((resolve, reject) => {
    const query = `PRAGMA table_info(${table});`;
    global.db.all(query, (err: any, columns: any) => {
      if (err) {
        console.log(err);
        resolve(tournament.util.output.error("Error getting columns", 500));
      } else {
        const columnDetails = columns.map((column: any) => ({
          name: column.name,
          type: column.type,
          notnull: column.notnull,
          pk: column.pk,
        }));
        resolve(tournament.util.output.success(columnDetails));
      }
    });
  });
};
sql.get = async function (table: string) {
  if (!table) {
    return tournament.util.output.error("No table specified", 400);
  }
  const tableNames = await sql.getAll();
  if (!tableNames.includes(table)) {
    return tournament.util.output.error("Table not found", 404);
  }
  const getSql = `SELECT * FROM ${table}`;
  return new Promise((resolve, reject) => {
    global.db.all(getSql, (err: any, rows: any) => {
      if (err) {
        console.log(err);
        resolve(tournament.util.output.error("Error getting data", 500));
      }
      resolve(tournament.util.output.success(rows));
    });
  });
};

sql.add = async function (table: string, data: Record<string, any>) {
  if (!table) {
    return tournament.util.output.error("No table specified", 400);
  }
  const tableNames = await sql.getAll();
  if (!tableNames.includes(table)) {
    return tournament.util.output.error("Table not found", 404);
  }

  const columnsret = await sql.getColumns(table);
  if (!columnsret.success)
    return tournament.util.output.error("Error getting columns", 500);

  const columns = columnsret.data;

  for (const column of columns) {
    if (!Object.keys(data).includes(column.name)) {
      if (column.notnull) {
        return tournament.util.output.error(
          `Column ${column.name} cannot be null`,
          400
        );
      }
    }
    if (column.pk && Object.keys(data).includes(column.name)) {
      delete data[column.name];
    }
  }

  for (const key of Object.keys(data)) {
    if (!columns.find((column: any) => column.name === key)) {
      return tournament.util.output.error(`Column ${key} does not exist`, 400);
    }
  }

  const keys = Object.keys(data);
  const values = Object.values(data);
  const addSql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys
    .map(() => "?")
    .join(", ")})`;
  return new Promise((resolve, reject) => {
    global.db.run(addSql, values, (err: any) => {
      if (err) {
        resolve(tournament.util.output.error("Error adding data", 500));
      }
      resolve(tournament.util.output.success("Data added"));
    });
  });
};

sql.update = async function (
  table: string,
  where: Record<string, any>,
  data: Record<string, any>
) {
  if (!table) {
    return tournament.util.output.error("No table specified", 400);
  }
  const tableNames = await sql.getAll();
  if (!tableNames.includes(table)) {
    return tournament.util.output.error("Table not found", 404);
  }

  const columnsret = await sql.getColumns(table);
  if (!columnsret.success)
    return tournament.util.output.error("Error getting columns", 500);

  const columns = columnsret.data;

  for (const column of columns) {
    if (column.pk && Object.keys(data).includes(column.name)) {
      return tournament.util.output.error(
        `Cannot change primary key ${column.name}`,
        400
      );
    }
  }

  for (const key of Object.keys(data)) {
    if (!columns.find((column: any) => column.name === key)) {
      return tournament.util.output.error(`Column ${key} does not exist`, 400);
    }
  }

  for (const key of Object.keys(where)) {
    if (!columns.find((column: any) => column.name === key)) {
      return tournament.util.output.error(`Column ${key} does not exist`, 400);
    }
  }

  const keys = Object.keys(data);
  const values = Object.values(data);
  const whereKeys = Object.keys(where);
  const whereValues = Object.values(where);
  const changeSql = `UPDATE ${table} SET ${keys
    .map((key) => `${key} = ?`)
    .join(", ")} WHERE ${whereKeys.map((key) => `${key} = ?`).join(", ")}`;
  return new Promise((resolve, reject) => {
    global.db.run(changeSql, [...values, ...whereValues], (err: any) => {
      if (err) {
        resolve(tournament.util.output.error("Error changing data", 500));
      }
      resolve(tournament.util.output.success("Data changed"));
    });
  });
};

sql.del = async function (table: string, where: Record<string, any>) {
  if (!table) {
    return tournament.util.output.error("No table specified", 400);
  }
  const tableNames = await sql.getAll();
  if (!tableNames.includes(table)) {
    return tournament.util.output.error("Table not found", 404);
  }

  const columnsret = await sql.getColumns(table);
  if (!columnsret.success)
    return tournament.util.output.error("Error getting columns", 500);

  const columns = columnsret.data;

  for (const key of Object.keys(where)) {
    if (!columns.find((column: any) => column.name === key)) {
      return tournament.util.output.error(`Column ${key} does not exist`, 400);
    }
  }

  const whereKeys = Object.keys(where);
  const whereValues = Object.values(where);
  const delSql = `DELETE FROM ${table} WHERE ${whereKeys
    .map((key) => `${key} = ?`)
    .join(", ")}`;
  return new Promise((resolve, reject) => {
    global.db.run(delSql, whereValues, (err: any) => {
      if (err) {
        resolve(tournament.util.output.error("Error deleting data", 500));
      }
      resolve(tournament.util.output.success("Data deleted"));
    });
  });
};
