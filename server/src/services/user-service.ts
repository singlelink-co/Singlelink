import * as bcrypt from "bcrypt";
import {appConfig} from "../config/app-config";
import * as jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {DbTypeConverter} from "../utils/db-type-converter";
import {HttpError} from "../utils/http-error";
import {constants as HttpStatus} from "http2";

/**
 * This service takes care of transactional tasks for Accounts.
 */
export class UserService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  /**
   * Gets a user by the account Id.
   *
   * @param userId
   */
  async getUser(userId: string): Promise<User | HttpError> {
    let queryResult = await this.pool.query<AppUser>("select (id, email, full_name, active_profile, subscription_tier, inventory, metadata, created_on) from app.users where id=$1", [userId]);

    if (queryResult.rowCount < 1) {
      return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The user couldn't be found.");
    }

    return DbTypeConverter.toUser(queryResult.rows[0]);
  }

  /**
   * Gets a sensitive user by the account Id.
   *
   * @param userId
   */
  async getSensitiveUser(userId: string): Promise<SensitiveUser | HttpError> {
    let queryResult = await this.pool.query<AppSensitiveUser>("select * from app.users where id=$1", [userId]);

    if (queryResult.rowCount < 1) {
      return new HttpError(HttpStatus.HTTP_STATUS_NOT_FOUND, "The user couldn't be found.");
    }

    return DbTypeConverter.toSensitiveUser(queryResult.rows[0]);
  }

  /**
   * Changes a userId's password requiring only a password reset token.
   * @param token
   * @param password
   */
  async setPasswordWithToken(token: string, password: string): Promise<boolean> {
    try {
      let decoded: any = jwt.verify(token, appConfig.secret, {
        algorithms: ["RS256"],
        maxAge: "15m"
      });

      if (!decoded.userId) {
        return false;
      }

      if (!decoded.passwordReset) {
        return false;
      }

      let hashedPassword = await bcrypt.hash(password, 12);

      let result = await this.pool.query(
        "update app.users set pass_hash=$2 where id=$1",
        [decoded.userId, hashedPassword]
      );

      return result.rowCount > 0;
    } catch (err) {
      return false;
    }
  }

  async sendPasswordResetEmail(userId: string): Promise<boolean> {
    let token = jwt.sign(
      {
        userId,
        passwordReset: true
      },
      appConfig.secret,
      {algorithm: "RS256", expiresIn: '15m'}
    );

    let user = await this.getUser(userId);

    if (user instanceof HttpError) {
      return false;
    }

    let url = appConfig.baseUrl + "/forgot-password/change?";
    const params = new URLSearchParams({token: token});
    url += params.toString();

    try {

      let emailParams = {
        Destination: {
          ToAddresses: [
            user.email,
          ]
        },
        Message: {
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: `Hello,

Somebody requested a password request for your account on SingleLink.

If this was your doing, please visit the link below to reset your password.

${url}

This link will be valid for 15 minutes.
If you cannot click the link above, copy & paste the link into your browser.

If this was not you, please ignore this email.

Thank you,
SingleLink Team

Note: Do not reply to this email, as there is no inbox for it.`
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'Password Reset Request for SingleLink'
          }
        },
        Source: appConfig.senderEmailAddress
      };

      await new AWS.SES().sendEmail(emailParams).promise();

      return true;

    } catch (e) {
      console.error(e);
    }

    return false;
  }
}
