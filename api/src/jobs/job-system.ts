import {Pool} from "pg";
import cron from "node-cron";
import {DbLocks} from "../utils/db-locks";

export class JobSystem {
  static LOCK_REFRESH_MATERIAL_VIEW: number = 1;
  static LOCK_DELETE_EXPIRED_NONCES: number = 2;

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

    await this.scheduleMaintenanceTasks();
  }

  static async scheduleMaintenanceTasks() {
    // Refresh material view
    cron.schedule("*/10 * * * *", this.refreshMaterialView.bind(this));

    // Delete expired nonces
    cron.schedule("*/5 * * * *", this.deleteExpiredNonces.bind(this));
  }

  static async refreshMaterialView() {
    let lock = await DbLocks.requestLock(JobSystem.LOCK_REFRESH_MATERIAL_VIEW);

    if (!lock)
      return;

    //language=PostgreSQL
    await this.pool.query("refresh materialized view analytics.global_stats");

    await DbLocks.releaseLock(JobSystem.LOCK_REFRESH_MATERIAL_VIEW);
  }

  static async deleteExpiredNonces() {
    let lock = await DbLocks.requestLock(JobSystem.LOCK_DELETE_EXPIRED_NONCES);

    if (!lock)
      return;

    //language=PostgreSQL
    await this.pool.query("delete from security.nonces where expires < now()");

    await DbLocks.releaseLock(JobSystem.LOCK_DELETE_EXPIRED_NONCES);
  }
}
