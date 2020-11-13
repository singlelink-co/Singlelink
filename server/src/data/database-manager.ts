import {Pool} from "pg";
import * as fs from "fs";
import {runtimeConfig} from "../config/runtime-config";

/**
 * The DatabaseManager manages a connection to the PostgreSQL database.
 */
export class DatabaseManager {
  pool = new Pool({
    connectionString: runtimeConfig.database,
    ssl: {
      rejectUnauthorized: false
    }
  });

  /**
   * Sets up the database that will be used by SingleLink.
   *
   * By default, this will be a PostgreSQL database.
   */
  async initialize() {
    this.pool.on("error", client => {
      console.error(`Database error! ${client.name}, ${client.message}, ${client.stack}`);
    });

    await this.createDatabase();
  }

  /**
   * Creates the database from a provided sql file in the relative /sql/setup-database.sql file.
   */
  async createDatabase() {
    let sql = fs.readFileSync(`${__dirname}/../sql/setup-database.sql`).toString();

    await this.pool.query(sql);
  }

  /**
   * Call this when the pool needs to be disposed. It is unlikely this needs to ever be done in the life span of the
   * server, however, since the pool will always be active.
   */
  async dispose() {
    await this.pool.end();
  }
}
