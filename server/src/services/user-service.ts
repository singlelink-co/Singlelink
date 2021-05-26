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
import {Auth} from "../utils/auth";

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
    let queryResult = await this.pool.query<DbUser>("select id, email_hash, full_name, active_profile_id, inventory, metadata, created_on from app.users where id=$1", [userId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return DbTypeConverter.toUser(queryResult.rows[0]);
  }

  /**
   * Gets a user by their email.
   *
   * @param email
   */
  async getUserByEmail(email: string): Promise<User> {
    let queryResult = await this.pool.query<DbUser>("select id, email_hash, full_name, active_profile_id, inventory, metadata, created_on from app.users where email=$1", [email]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return DbTypeConverter.toUser(queryResult.rows[0]);
  }

  /**
   * Gets a user by their google id.
   *
   * @param googleId
   */
  async getUserByGoogleId(googleId: string): Promise<User> {
    let queryResult = await this.pool.query<DbUser>("select id, email_hash, full_name, active_profile_id, inventory, metadata, created_on from app.users where private_metadata->>'googleId'=$1", [googleId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return DbTypeConverter.toUser(queryResult.rows[0]);
  }

  /**
   * Gets a sensitive user by the account Id.
   *
   * @param userId
   */
  async getSensitiveUser(userId: string): Promise<SensitiveUser> {
    let queryResult = await this.pool.query<DbSensitiveUser>("select id, email, email_hash, full_name, active_profile_id, inventory, metadata, created_on, private_metadata from app.users where id=$1", [userId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return DbTypeConverter.toSensitiveUser(queryResult.rows[0]);
  }

  /**
   * Gets a user by their email.
   *
   * @param email
   */
  async getSensitiveUserByEmail(email: string): Promise<SensitiveUser> {
    let queryResult = await this.pool.query<DbSensitiveUser>("select id, email, email_hash, full_name, active_profile_id, inventory, metadata, created_on, private_metadata from app.users where email=$1", [email]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return DbTypeConverter.toSensitiveUser(queryResult.rows[0]);
  }

  /**
   * Gets a user by their google id.
   *
   * @param googleId
   */
  async getSensitiveUserByGoogleId(googleId: string): Promise<SensitiveUser> {
    let queryResult = await this.pool.query<DbSensitiveUser>("select id, email, email_hash, full_name, active_profile_id, inventory, metadata, created_on, private_metadata from app.users where private_metadata->>'googleId'=$1", [googleId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return DbTypeConverter.toSensitiveUser(queryResult.rows[0]);
  }

  /**
   * Gets a sensitive user by the account Id.
   *
   * @param userId
   */
  async getSensitiveUserWithPassword(userId: string): Promise<SensitiveUserWithPassword> {
    let queryResult = await this.pool.query<DbSensitiveUserWithPassword>("select * from app.users where id=$1", [userId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return DbTypeConverter.toSensitiveUserWithPassword(queryResult.rows[0]);
  }

  /**
   * Gets a user by their email.
   *
   * @param email
   */
  async getSensitiveUserWithPasswordByEmail(email: string): Promise<SensitiveUserWithPassword> {
    let queryResult = await this.pool.query<DbSensitiveUserWithPassword>("select * from app.users where email=$1", [email]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return DbTypeConverter.toSensitiveUserWithPassword(queryResult.rows[0]);
  }

  /**
   * Gets a user by their google id.
   *
   * @param googleId
   */
  async getSensitiveUserWithPasswordByGoogleId(googleId: string): Promise<SensitiveUserWithPassword> {
    let queryResult = await this.pool.query<DbSensitiveUserWithPassword>("select * from app.users where private_metadata->>'googleId'=$1", [googleId]);

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    return DbTypeConverter.toSensitiveUserWithPassword(queryResult.rows[0]);
  }

  /**
   * Changes a userId's password requiring only a password reset token.
   *
   * @param token
   * @param password
   */
  async setPasswordWithToken(token: string, password: string) {
    let decoded = <{userId: string, type: TokenType}>jwt.verify(token, config.secret, {
      maxAge: "15m"
    });

    if (!decoded.userId) {
      return false;
    }

    if (decoded?.type !== "passwordReset") {
      return false;
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let queryResult = await this.pool.query(
      "update app.users set pass_hash=$2 where id=$1",
      [decoded.userId, hashedPassword]
    );

    if (queryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");
  }

  /**
   * Sends a password reset email.
   * @param email
   */
  async sendPasswordResetEmail(email: string): Promise<User> {
    let user = await this.getUserByEmail(email);

    let token = jwt.sign(
      {
        userId: user.id,
        type: "passwordReset"
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

      return user;
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
  async loginWithEmail(email: string, password: string): Promise<LoginResultData> {
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

    let token = jwt.sign({userId: user.id, type: "auth"}, config.secret, {expiresIn: '168h'});

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
   * Logs in a user with Google OAuth and returns LoginResultData.
   *
   * @param userId
   * @param googleId
   */
  async loginWithGoogle(userId: string, googleId: string): Promise<LoginResultData> {
    if (!await Auth.checkGoogleAuthId(this, userId, googleId)) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid google authentication!");
    }

    let user = await this.getSensitiveUserWithPassword(userId);
    let profileQuery = await this.pool.query<DbProfile>("select * from app.profiles where user_id=$1", [user.id]);
    let activeProfile;

    if (profileQuery.rowCount > 0) {
      activeProfile = DbTypeConverter.toProfile(profileQuery.rows[0]);
    }

    let token = jwt.sign({userId: user.id, type: "auth"}, config.secret, {expiresIn: '168h'});

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
  async createUserWithEmail(email: string, password: string, name?: string): Promise<SensitiveUser> {
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

    if (userInsertQuery.rowCount < 1) {
      throw new HttpError(StatusCodes.CONFLICT, "The user already exists.");
    }

    let dbSensitiveUser = userInsertQuery.rows[0];

    return DbTypeConverter.toSensitiveUser(dbSensitiveUser);
  }

  /**
   * Creates a new user with a Google account.
   * The password field is set to a random value.
   *
   * @param email
   * @param googleId
   * @param name
   */
  async createUserWithGoogle(email: string, googleId: string, name?: string): Promise<SensitiveUser> {
    let passHash = await bcrypt.hash(StringUtils.generateRandomPassword(), 10);

    // Force lowercase
    email = email.toLowerCase();

    let userInsertQuery = await this.pool.query<DbSensitiveUser>("insert into app.users(email, email_hash, pass_hash, full_name) values ($1, $2, $3, $4) on conflict do nothing returning *",
      [
        email,
        crypto.createHash("md5").update(email).digest("hex"),
        passHash,
        name
      ]);

    if (userInsertQuery.rowCount < 1) {
      throw new HttpError(StatusCodes.CONFLICT, "The user already exists.");
    }

    let enableGoogleSignInQueryResult = await this.pool.query<{ googleId: string }>("update app.users set private_metadata = jsonb_set(private_metadata::jsonb, '{googleId}', $1, true) where email=$2 returning private_metadata->>'googleId' as googleId",
      [
        JSON.stringify(googleId),
        email
      ]);

    if (enableGoogleSignInQueryResult.rowCount < 1)
      throw new HttpError(StatusCodes.NOT_FOUND, "The user couldn't be found.");

    let dbSensitiveUser = userInsertQuery.rows[0];

    return DbTypeConverter.toSensitiveUser(dbSensitiveUser);
  }

  //TODO Implement user update
  /**
   *
   */
  async updateUser(userId: string, user: User) {

  }

  async deleteUser(userId: string): Promise<User> {
    let queryResult = await this.pool.query<DbUser>("delete from app.users where id=$1 returning id, email_hash, full_name, active_profile_id, inventory, metadata, created_on",
      [userId]);

    if (queryResult.rowCount < 1) {
      throw new HttpError(StatusCodes.CONFLICT, "The user doesn't exist.");
    }

    return DbTypeConverter.toUser(queryResult.rows[0]);
  }

  //TODO Implement data package download
  /**
   * Allows a user to download a data package containing all their collected personal information within SL's databases,
   * excluding password hashes. This is intended to be GDPR compliant.
   */
  async generateDataPackage(user: User): Promise<string> {
    let json: any = {};

    json.user = await this.getSensitiveUser(user.id);

    let profilesQuery = await this.pool.query<DbProfile>("select * from app.profiles where user_id=$1", [user.id]);
    let themesQuery = await this.pool.query<DbTheme>("select * from app.themes where user_id=$1", [user.id]);

    json.profiles = profilesQuery.rows.map(x => DbTypeConverter.toProfile(x));
    json.themes = themesQuery.rows.map(x => DbTypeConverter.toTheme(x));

    let profileIds = (<DbProfile[]>json.profiles).map(x => x.id);

    let linkQuery = await this.pool.query<DbLink>("select * from app.links where profile_id=any($1)", [profileIds]);

    json.links = linkQuery.rows.map(x => DbTypeConverter.toLink(x));

    let addonQuery = await this.pool.query<DbAddon>("select * from marketplace.addons where user_id=$1", [user.id]);

    json.addons = addonQuery.rows.map(x => DbTypeConverter.toAddon(x));

    let installsQuery = await this.pool.query<DbAddonInstall>("select * from marketplace.installs where profile_id=any($1)", [profileIds]);

    json.addonInstalls = installsQuery.rows.map(x => DbTypeConverter.toAddonInstall(x));

    return JSON.stringify(json, undefined, 2);
  }

  /**
   * Sets the active profile for a user. Does not check for ownership.
   *
   * @param userId
   * @param profileId
   */
  async setActiveProfile(userId: string, profileId: string): Promise<Profile> {
    let profileResult = await this.pool.query<DbProfile>("update app.users set active_profile_id=$1 where id=$2 returning *", [profileId, userId]);

    if (profileResult.rowCount < 1) {
      throw new HttpError(StatusCodes.NOT_FOUND, "The user or profile could not be found.");
    }

    return DbTypeConverter.toProfile(profileResult.rows[0]);
  }

  /**
   * Edits email notification settings for users.
   *
   * @param userId
   * @param emailNotifications
   */
  async setEmailNotifications(userId: string, emailNotifications: DbSensitiveUser["private_metadata"]["emailNotifications"]): Promise<SensitiveUser> {
    let profileQuery = await this.pool.query<DbSensitiveUser>(`update app.users
                                                               set private_metadata = jsonb_set(private_metadata::jsonb, '{emailNotifications}', $1, true)
                                                               where id = $2
                                                               returning *;`,
      [emailNotifications, userId]);

    if (profileQuery.rowCount < 1) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Unable to update the profile because of an internal error.");
    }

    return DbTypeConverter.toSensitiveUser(profileQuery.rows[0]);
  }
}
