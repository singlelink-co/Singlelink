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
   * @param id - 64 bit class id
   *
   * @return The requested lock
   */
  static async requestLock(id: number) {
    try {
      let queryResult = await this.pool.query<{ success: boolean }>(
        //language=PostgreSQL
        "select pg_try_advisory_lock($1) as success", [id]
      );

      if (queryResult.rowCount <= 0) {
        return null;
      }

      return queryResult.rows[0].success;
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
   * @param id
   *
   * @return The number of locks released. Should be 1 or greater (in some weird case).
   */
  static async releaseLock(id: number): Promise<number> {
    //language=PostgreSQL
    let queryResult = await this.pool.query("select pg_advisory_unlock($1)", [id]);

    if (queryResult.rowCount <= 0) {
      return 0;
    }

    return queryResult.rowCount;
  }
}
