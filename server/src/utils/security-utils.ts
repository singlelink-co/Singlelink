import crypto from "crypto";
import {Pool} from "pg";

export class SecurityUtils {
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

  /**
   * Generates a random password string. Maximum possible length 32 characters, minimum length 20.
   */
  static generateRandomPassword(): string {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }

  /**
   * Generates a nonce value with the specified length.
   *
   * @param length
   */
  static generateNonce(length: number = 32) {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
    let result = '';

    while (length > 0) {
      const random = crypto.pseudoRandomBytes(length);

      random.forEach(function (c: any) {
        if (length == 0) {
          return;
        }

        if (c < charset.length) {
          result += charset[c];
          length--;
        }
      });
    }
    return result;
  }

  /**
   * Records a nonce for tracking.
   * @param nonce
   *
   * @return true if the Nonce was successfully recorded (never used), or false if it's already in the database
   */
  static async recordNonce(nonce: string) {
    let queryResult = await this.pool.query<{ nonce: string }>("insert into security.nonces values ($1)", [nonce]);

    return queryResult.rowCount >= 1;
  }

  /**
   * Uses up a nonce.
   * @param nonce
   *
   * @return true if the Nonce was successfully expired, otherwise returns false
   */
  static async expireNonce(nonce: string) {
    let queryResult = await this.pool.query<{ nonce: string }>("delete from security.nonces where nonce=$1 returning *", [nonce]);

    return queryResult.rowCount >= 1;
  }

  /**
   * Validates a nonce by making sure it exists in the DB.
   *
   * @param nonce
   * @return true if the Nonce is valid, false otherwise
   */
  static async validateNonce(nonce: string) {
    let queryResult = await this.pool.query<{ nonce: string }>("select * from security.nonces where nonce=$1 limit 1", [nonce]);

    return queryResult.rowCount > 0;
  }
}
