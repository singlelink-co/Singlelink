import crypto from "crypto";
import {Pool} from "pg";
import {PgErrorCodes} from "./pg-error-codes";

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

  /**
   * Returns true if a token is expired.
   *
   * @param token
   */
  static async isTokenExpired(token: string) {
    let queryResult = await this.pool.query("select 1 from security.expired_tokens where token=$1", [token]);

    return queryResult.rowCount > 0;
  }

  /**
   * Expires a token.
   *
   * @param userId
   * @param token
   */
  static async expireToken(userId: string, token: string): Promise<boolean> {
    try {
      let queryResult = await this.pool.query("insert into security.expired_tokens(user_id, token) values ($1, $2) returning *", [userId, token]);

      return queryResult.rowCount > 0;
    } catch (e) {
      if (e.code === PgErrorCodes.UNIQUE_VIOLATION) {
        return false;
      }

      // we can't deal with this error
      throw e;
    }
  }
}
