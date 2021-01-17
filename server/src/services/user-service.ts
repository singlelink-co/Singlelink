import * as bcrypt from "bcrypt";
import {config} from "../config/config";
import * as jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";
import {DbTypeConverter} from "../utils/db-type-converter";
import {HttpError} from "../utils/http-error";
import {StatusCodes} from "http-status-codes";
import {StringUtils} from "../utils/string-utils";
import crypto from "crypto";

interface LoginResultData {
  user: {
    id: string,
    email: string
  },
  activeProfile?: Profile,
  token: string
}

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
  async getUser(userId: string): Promise<User> {
    let queryResult = await this.pool.query<DbUser>("select id, email_hash, full_name, active_profile_id, subscription_tier, inventory, metadata, created_on from app.users where id=$1", [userId]);

    if (queryResult.rowCount <= 0) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");
    }

    return DbTypeConverter.toUser(queryResult.rows[0]);
  }

  /**
   * Gets a user by their email.
   *
   * @param email
   */
  async getUserByEmail(email: string): Promise<User> {
    let queryResult = await this.pool.query<DbUser>("select id, email_hash, full_name, active_profile_id, subscription_tier, inventory, metadata, created_on from app.users where email=$1", [email]);

    if (queryResult.rowCount <= 0) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");
    }

    return DbTypeConverter.toUser(queryResult.rows[0]);
  }

  /**
   * Gets a sensitive user by the account Id.
   *
   * @param userId
   */
  async getSensitiveUser(userId: string): Promise<SensitiveUser> {
    let queryResult = await this.pool.query<DbSensitiveUser>("select id, email, email_hash, full_name, active_profile_id, payment_id, subscription_tier, inventory, metadata, created_on from app.users where id=$1", [userId]);

    if (queryResult.rowCount <= 0) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");
    }

    return DbTypeConverter.toSensitiveUser(queryResult.rows[0]);
  }

  /**
   * Gets a user by their email.
   *
   * @param email
   */
  async getSensitiveUserByEmail(email: string): Promise<SensitiveUser> {
    let queryResult = await this.pool.query<DbSensitiveUser>("select id, email, email_hash, full_name, active_profile_id, payment_id, subscription_tier, inventory, metadata, created_on from app.users where email=$1", [email]);

    if (queryResult.rowCount <= 0) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");
    }

    return DbTypeConverter.toSensitiveUser(queryResult.rows[0]);
  }

  /**
   * Gets a sensitive user by the account Id.
   *
   * @param userId
   */
  async getSensitiveUserWithPassword(userId: string): Promise<SensitiveUserWithPassword> {
    let queryResult = await this.pool.query<DbSensitiveUserWithPassword>("select * from app.users where id=$1", [userId]);

    if (queryResult.rowCount <= 0) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");
    }

    return DbTypeConverter.toSensitiveUserWithPassword(queryResult.rows[0]);
  }

  /**
   * Gets a user by their email.
   *
   * @param email
   */
  async getSensitiveUserWithPasswordByEmail(email: string): Promise<SensitiveUserWithPassword> {
    let queryResult = await this.pool.query<DbSensitiveUserWithPassword>("select * from app.users where email=$1", [email]);

    if (queryResult.rowCount <= 0) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");
    }

    return DbTypeConverter.toSensitiveUserWithPassword(queryResult.rows[0]);
  }

  /**
   * Changes a userId's password requiring only a password reset token.
   *
   * @param token
   * @param password
   */
  async setPasswordWithToken(token: string, password: string) {
    let decoded: any = jwt.verify(token, config.secret, {
      maxAge: "15m"
    });

    if (!decoded.userId) {
      return false;
    }

    if (!decoded.passwordReset) {
      return false;
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let queryResult = await this.pool.query(
      "update app.users set pass_hash=$2 where id=$1",
      [decoded.userId, hashedPassword]
    );

    if (queryResult.rowCount <= 0) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");
    }
  }

  /**
   * Sends a password reset email.
   * @param email
   */
  async sendPasswordResetEmail(email: string) {
    let user = await this.getUserByEmail(email);

    let token = jwt.sign(
      {
        userId: user.id,
        passwordReset: true
      },
      config.secret,
      {expiresIn: '15m'}
    );

    let url = config.clientDomain + "/forgot-password/change?";
    const params = new URLSearchParams({token});
    url += params.toString();

    try {
      let emailParams = {
        Destination: {
          ToAddresses: [
            email,
          ]
        },
        Message: {
          Body: {
            Text: {
              Charset: config.messages.passwordResetEmail.messageCharset,
              Data: StringUtils.parseTemplate(config.messages.passwordResetEmail.message, {url})
            }
          },
          Subject: {
            Charset: config.messages.passwordResetEmail.subjectCharset,
            Data: StringUtils.parseTemplate(config.messages.passwordResetEmail.subject, {url})
          }
        },
        Source: config.aws.senderEmailAddress
      };

      await new AWS.SES().sendEmail(emailParams).promise();
    } catch (e) {
      console.error(e);
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to send email because of an internal server error: " + e.toString());
    }
  }

  /**
   * Logs in a user and returns LoginResultData.
   *
   * @param email
   * @param password
   */
  async loginUser(email: string, password: string): Promise<LoginResultData> {
    let user = await this.getSensitiveUserWithPasswordByEmail(email);
    let profileQuery = await this.pool.query<DbProfile>("select * from app.profiles where user_id=$1", [user.id]);
    let activeProfile;

    if (profileQuery.rowCount > 0) {
      activeProfile = DbTypeConverter.toProfile(profileQuery.rows[0]);
    }

    let valid = await bcrypt.compare(password, user.passHash);

    if (!valid) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "The password was incorrect.");
    }

    let token = jwt.sign({email: user.email}, config.secret, {expiresIn: '168h'});

    return {
      user: {
        id: user.id,
        email: user.email
      },
      activeProfile,
      token
    };
  }

  /**
   * Creates a new user.
   *
   * @param email
   * @param password
   * @param name
   */
  async createUser(email: string, password: string, name?: string): Promise<SensitiveUser> {
    let passHash = await bcrypt.hash(password, 10);

    // Force lowercase
    email = email.toLowerCase();

    let userInsertQuery = await this.pool.query<DbSensitiveUser>("insert into app.users(email, email_hash, pass_hash, full_name) values ($1, $2, $3, $4) on conflict do nothing returning *",
      [
        email,
        crypto.createHash("md5").update(email).digest("hex"),
        passHash,
        name
      ]);

    if (userInsertQuery.rowCount <= 0) {
      throw new HttpError(StatusCodes.CONFLICT, "The user already exists.");
    }

    let dbSensitiveUser = userInsertQuery.rows[0];

    return DbTypeConverter.toSensitiveUser(dbSensitiveUser);
  }

  /**
   * Sets the active profile for a user. Does not check for ownership.
   *
   * @param userId
   * @param profileId
   */
  async setActiveProfile(userId: string, profileId: string): Promise<Profile> {
    let profileResult = await this.pool.query<DbProfile>("update app.users set active_profile_id=$1 where id=$2 returning *", [profileId, userId]);

    if (profileResult.rowCount <= 0) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The user or profile could not be found.");
    }

    return DbTypeConverter.toProfile(profileResult.rows[0]);
  }
}
