import {Pool} from "pg";

export class LogUtils {
  /**
   * Private pool instance for Security Utils.
   * @private
   */
  private static pool: Pool;

  /**
   * Initialize Security Utils.
   * @param pool
   */
  static initialize(pool: Pool) {
    this.pool = pool;
  }

  static async logIpEvent(userId: string, ips: string | string[], event: string) {
    if (!Array.isArray(ips)) {
      ips = [ips];
    }

    let queryResult = await this.pool.query<{ nonce: string }>("insert into security.ip_log(user_id, ips, event) values ($1, $2, $3)", [userId, ips, event]);

    return queryResult.rowCount >= 1;
  }
}
