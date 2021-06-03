import {Pool} from "pg";
import cron from "node-cron";
import {DbLocks} from "../utils/db-locks";

export class JobSystem {
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
    let lock = await DbLocks.requestLock("refresh_material_view");

    if (!lock)
      return;

    //language=PostgreSQL
    await this.pool.query("refresh materialized view analytics.global_stats");

    await DbLocks.releaseLock("refresh_material_view");
  }

  static async deleteExpiredNonces() {
    let lock = await DbLocks.requestLock("delete_expired_nonces");

    if (!lock)
      return;

    //language=PostgreSQL
    await this.pool.query("delete from security.nonces where expires < now()");

    await DbLocks.releaseLock("delete_expired_nonces");
  }
}
