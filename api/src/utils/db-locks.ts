/*
Useful class that manages locks so the cluster can only manage a certain number of resources at a time.
 */
import {Pool} from "pg";
import {PgErrorCodes} from "./pg-error-codes";

export class DbLocks {
  /**
   * Private pool instance for Job Manager.
   * @private
   */
  private static pool: Pool;

  /**
   * Initialize Job System.
   * @param pool
   */
  static async initialize(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Creates a lock created in the DB. If there are no locks available, returns null.
   * @param name
   *
   * @return The requested lock
   */
  static async requestLock(name: string) {
    try {
      let queryResult = await this.pool.query<{ id: string, name: string, created_on: string, expires: string }>(
        "insert into jobs.locks(name) values ($1) returning *", [name]
      );

      if (queryResult.rowCount <= 0) {
        return null;
      }

      return queryResult.rows[0];
    } catch (e) {
      if (e.code === PgErrorCodes.UNIQUE_VIOLATION) {
        // lock already exists
        return null;
      }

      // we can't deal with this error
      throw e;
    }
  }

  /**
   * Releases a lock and allows it to be used again.
   * @param name
   *
   * @return The number of locks released. Should be 1, but sometimes may be more depending on network conditions.
   */
  static async releaseLock(name: string): Promise<number> {
    let queryResult = await this.pool.query("delete from jobs.locks where name=$1", [name]);

    if (queryResult.rowCount <= 0) {
      return 0;
    }

    return queryResult.rowCount;
  }
}
