import {
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
  RequestGenericInterface,
  RouteShorthandOptions
} from "fastify";
import jwt, {VerifyErrors} from "jsonwebtoken";
import {appConfig} from "../config/app-config";
import {Pool} from "pg";
import {ReplyUtils} from "./reply-utils";
import {constants as HttpStatus} from "http2";
import {DbTypeConverter} from "./db-type-converter";
import {RouteGenericInterface} from "fastify/types/route";
import {RawRequestDefaultExpression, RawServerBase, RawServerDefault} from "fastify/types/utils";

/**
 * A Fastify request that has been properly authenticated via a JWT token.
 * It contains extra data provided by the token itself and is parsed in the routes' preHandler.
 */
export interface AuthenticatedRequest<RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  > extends FastifyRequest<RouteGeneric, RawServer, RawRequest> {
  /**
   * The authenticated request user account.
   */
  user: User;

  /**
   * The authenticated request active profile.
   */
  profile: Profile;
}

interface AuthRequestParams extends RequestGenericInterface {
  Body: {
    token: string
  }
}

interface DecodedAuthToken {
  email: string,
}

export class Auth {

  /**
   * Default authentication options for controllers.
   */
  static AuthRouteOptions: RouteShorthandOptions = {
    preHandler: <preHandlerHookHandler>Auth.checkAuth,
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
  static checkAuth(request: FastifyRequest<AuthRequestParams>, reply: FastifyReply, done: Function) {
    let body = request.body;
    let token: string | null | undefined = body?.token;

    if (!token) {
      reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("Token was missing."));
      return;
    }

    jwt.verify(
      token,
      appConfig.secret,
      async function (err: VerifyErrors | null, decoded: object | undefined) {
        if (err) {
          reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("Error while validating token.", err));
          return;
        }

        if (!decoded) {
          reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("Unable to verify user, invalid token."));
          return;
        }

        let dAuthToken: DecodedAuthToken = <DecodedAuthToken>decoded;

        if (!dAuthToken?.email) {
          reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("Unable to verify user, invalid token."));
          return;
        }

        try {

          // First, we need to grab the user account from the token.

          let accountQuery = await Auth.pool.query<AppUser>(
            "select * from app.users where email=$1",
            [
              dAuthToken.email
            ]
          );

          if (accountQuery.rowCount <= 0) {
            reply.status(HttpStatus.HTTP_STATUS_NOT_FOUND).send(ReplyUtils.error("Unable to find account with this token."));
            return;
          }

          let user = accountQuery.rows[0];
          let authRequest = <AuthenticatedRequest>request;
          authRequest.user = DbTypeConverter.toUser(user);

          // Next, we grab the active profile

          let profileQuery = await Auth.pool.query<AppProfile>(
            "select * from app.profiles where handle=$1",
            [
              user.active_profile_id
            ]
          );

          if (profileQuery.rowCount > 0) {
            let profile = profileQuery.rows[0];
            authRequest.profile = DbTypeConverter.toProfile(profile);
          }

          // Finally, after we've found all the data we need, we've attached it to the request and return it.
          done();
          return;

        } catch (err) {
          if (err) {
            reply.status(HttpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(ReplyUtils.error("Error while authenticating request.", err));
            return;
          }
        }

        reply.status(HttpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(ReplyUtils.error("An unexpected error occurred."));
        return;
      });
  }

}
