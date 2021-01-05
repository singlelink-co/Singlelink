import {
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
  RequestGenericInterface,
  RouteShorthandOptions
} from "fastify";
import jwt, {VerifyErrors} from "jsonwebtoken";
import {config} from "../config/config";
import {Pool} from "pg";
import {ReplyUtils} from "./reply-utils";
import {StatusCodes} from "http-status-codes";
import {DbTypeConverter} from "./db-type-converter";

/**
 * A Fastify request that has been properly authenticated via a JWT token.
 * It contains user and profile data provided by the token itself and is parsed in the routes' preHandler.
 */
export interface AuthenticatedRequest extends RequestGenericInterface {
  Body: {
    token: string,
    user: User,
    profile: Profile
  }
}

/**
 * A Fastify request that has been properly authenticated via a JWT token to contain valid admin data.
 */
export interface AdminRequest extends RequestGenericInterface {
  Body: {
    token: string,
    user: User,
    profile: Profile
    permGroup: PermissionGroup
  }
}

/**
 * A convenience class for Fastify Handler options regarding authentication.
 */
export class AuthOpts {

  /**
   * Authenticate only, do not pass in an AuthenticatedRequest. This has better performance
   * since the server does not need to communicate with the database.
   */
  static ValidateOnly: RouteShorthandOptions = {
    preHandler: <preHandlerHookHandler>AuthOpts.validateAuth,
  };

  /**
   * Authenticate and pass in an AuthenticatedRequest instead of just validating. Useful when
   * you need user and profile data.
   */
  static ValidateWithData: RouteShorthandOptions = {
    preHandler: <preHandlerHookHandler>AuthOpts.validateAuthWithData,
  };

  /**
   * Authenticate Admin privileges and pass in an Admin request.
   */
  static ValidateAdminWithData: RouteShorthandOptions = {
    preHandler: <preHandlerHookHandler>AuthOpts.validateAdminWithData,
  };

  /**
   * Private pool instance for Auth.
   * @private
   */
  private static pool: Pool;

  /**
   * Initialize Auth.
   * @param pool
   */
  static initialize(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Checks for authentication before allowing a request to pass through.
   *
   * @param request
   * @param reply
   * @param done
   */
  static validateAuth(request: FastifyRequest<{ Body: { token: string } }>, reply: FastifyReply, done: Function) {
    let body = request.body;
    let token: string | null | undefined = body?.token;

    if (!token) {
      reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Token was missing."));
      return;
    }

    jwt.verify(
      token,
      config.secret,
      async function (err: VerifyErrors | null, decoded: object | undefined) {
        if (err) {
          reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Error while validating token.", err));
          return;
        }

        if (!decoded) {
          reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Unable to verify user, invalid token."));
          return;
        }

        let dAuthToken: { email: string } = <{ email: string }>decoded;

        if (!dAuthToken?.email) {
          reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Unable to verify user, invalid token."));
          return;
        }

        done();
        return;
      });
  }

  /**
   * Checks for authentication before allowing a request to pass through.
   * Also adds user and profile data to the FastifyRequest to be passed to the handlers.
   *
   * @param request
   * @param reply
   * @param done
   */
  static validateAuthWithData(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply, done: Function) {
    let body = request.body;
    let token: string | null | undefined = body?.token;

    if (!token) {
      reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Token was missing."));
      return;
    }

    // Throw away passed in data (important!)
    // Otherwise someone could fake a valid token.
    body.user = <any>undefined;
    body.profile = <any>undefined;

    jwt.verify(
      token,
      config.secret,
      async function (err: VerifyErrors | null, decoded: object | undefined) {
        if (err) {
          reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Error while validating token.", err));
          return;
        }

        if (!decoded) {
          reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Unable to verify user, invalid token."));
          return;
        }

        let dAuthToken: { email: string } = <{ email: string }>decoded;

        if (!dAuthToken?.email) {
          reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Unable to verify user, invalid token."));
          return;
        }

        try {

          // First, we need to grab the user account from the token.

          let accountQuery = await AuthOpts.pool.query<DbUser>(
            "select * from app.users where email=$1",
            [
              dAuthToken.email
            ]
          );

          if (accountQuery.rowCount <= 0) {
            reply.status(StatusCodes.NOT_FOUND).send(ReplyUtils.error("Unable to find account with this token."));
            return;
          }

          let user = accountQuery.rows[0];

          let authRequest = request;
          authRequest.body.user = DbTypeConverter.toUser(user);

          // Next, we grab the active profile
          {
            let profileQuery = await AuthOpts.pool.query<DbProfile>(
              "select * from app.profiles where id=$1",
              [
                user.active_profile_id
              ]
            );

            if (profileQuery.rowCount > 0) {
              let profile = profileQuery.rows[0];
              authRequest.body.profile = DbTypeConverter.toProfile(profile);
            } else {

              // No active profile? Fine, let's try to find if the user owns any profiles at all.
              let searchProfileQuery = await AuthOpts.pool.query<DbProfile>(
                "select * from app.profiles where user_id=$1",
                [
                  user.id
                ]
              );

              // Set the active profile to the first one we see
              if (searchProfileQuery.rowCount > 0) {
                let profile = searchProfileQuery.rows[0];
                authRequest.body.profile = DbTypeConverter.toProfile(profile);
              }
            }
          }

          // Finally, after we've found all the data we need, we've attached it to the request and return it.
          done();
          return;

        } catch (err) {
          if (err) {
            reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReplyUtils.error("Error while authenticating request.", err));
            return;
          }
        }

        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReplyUtils.error("An unexpected error occurred."));
        return;
      });
  }

  /**
   * Checks for admin privileges and authentication before allowing a request to pass through.
   * Also adds user and profile data to the FastifyRequest to be passed to the handlers.
   *
   * @param request
   * @param reply
   * @param done
   */
  static validateAdminWithData(request: FastifyRequest<AdminRequest>, reply: FastifyReply, done: Function) {
    let body = request.body;
    let token: string | null | undefined = body?.token;

    if (!token) {
      reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Token was missing."));
      return;
    }

    // Throw away passed in data (important!)
    // Otherwise someone could fake a valid token.
    body.user = <any>undefined;
    body.profile = <any>undefined;

    jwt.verify(
      token,
      config.secret,
      async function (err: VerifyErrors | null, decoded: object | undefined) {
        if (err) {
          reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Error while validating token.", err));
          return;
        }

        if (!decoded) {
          reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Unable to verify user, invalid token."));
          return;
        }

        let dAuthToken: { email: string } = <{ email: string }>decoded;

        if (!dAuthToken?.email) {
          reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Unable to verify user, invalid token."));
          return;
        }

        try {

          // First, we need to grab the user account from the token.

          let accountQuery = await AuthOpts.pool.query<DbUser>(
            "select * from app.users where email=$1",
            [
              dAuthToken.email
            ]
          );

          if (accountQuery.rowCount <= 0) {
            reply.status(StatusCodes.NOT_FOUND).send(ReplyUtils.error("Unable to find account with this token."));
            return;
          }

          let user = accountQuery.rows[0];

          let authRequest = request;
          authRequest.body.user = DbTypeConverter.toUser(user);

          // Next, we grab the active profile
          {
            let profileQuery = await AuthOpts.pool.query<DbProfile>(
              "select * from app.profiles where id=$1",
              [
                user.active_profile_id
              ]
            );

            if (profileQuery.rowCount > 0) {
              let profile = profileQuery.rows[0];
              authRequest.body.profile = DbTypeConverter.toProfile(profile);
            } else {

              // No active profile? Fine, let's try to find if the user owns any profiles at all.
              let searchProfileQuery = await AuthOpts.pool.query<DbProfile>(
                "select * from app.profiles where user_id=$1",
                [
                  user.id
                ]
              );

              // Set the active profile to the first one we see
              if (searchProfileQuery.rowCount > 0) {
                let profile = searchProfileQuery.rows[0];
                authRequest.body.profile = DbTypeConverter.toProfile(profile);
              }

            }
          }

          // Find the permgroup for this user, check if it is admin
          {
            let permQuery = await AuthOpts.pool.query<DbPermissionGroup>(
              "select * from app.perm_groups where user_id=$1",
              [
                user.id
              ]
            );

            if (permQuery.rowCount > 0) {
              let permGroup = permQuery.rows[0];
              authRequest.body.permGroup = DbTypeConverter.toPermGroup(permGroup);

              if (authRequest.body.permGroup.groupName !== "admin") {
                reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("This user doesn't have the correct permissions."));
                return;
              }
            } else {
              reply.status(StatusCodes.NOT_FOUND).send(ReplyUtils.error("This user doesn't have any permissions."));
              return;
            }
          }

          // Finally, after we've found all the data we need, we've attached it to the request and return it.
          done();
          return;

        } catch (err) {
          if (err) {
            reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReplyUtils.error("Error while authenticating request.", err));
            return;
          }
        }

        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReplyUtils.error("An unexpected error occurred."));
        return;
      });
  }

}
