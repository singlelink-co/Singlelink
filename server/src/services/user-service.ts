import * as bcrypt from "bcrypt";
import {runtimeConfig} from "../config/runtime-config";
import * as jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";

/**
 * This service takes care of transactional tasks for the User Controller.
 */
export class UserService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  async findUserById(userId: string): Promise<UserAccount> {
    let checkQuery = await this.pool.query("select id, email, pass_hash from users.accounts where id=$1", [userId]);

    return checkQuery.rowCount > 0 ? checkQuery.rows[0] : null;
  }

  async createUser(): Promise<any> {

    return null;
  }

  async deleteUser(email: string): Promise<boolean> {
    return false;
  }

  /**
   * Changes a userId's password requiring only a password reset token.
   * @param token
   * @param password
   */
  async setPasswordWithToken(token: string, password: string): Promise<boolean> {
    try {
      let decoded: any = jwt.verify(token, runtimeConfig.secret, {
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
        "update users.accounts set pass_hash=$2 where id=$1",
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
      runtimeConfig.secret,
      {algorithm: "RS256", expiresIn: '15m'}
    );

    let user = await this.findUserById(userId);

    if (!user) {
      return false;
    }

    let url = runtimeConfig.baseUrl + "/forgot-password/change?";
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
        Source: runtimeConfig.senderEmailAddress
      };

      await new AWS.SES().sendEmail(emailParams).promise();

      return true;

    } catch (e) {
      console.error(e);
    }

    return false;
  }
}
