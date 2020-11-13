import {FastifyReply, FastifyRequest} from "fastify";
import jwt, {VerifyErrors} from "jsonwebtoken";
import {runtimeConfig} from "../config/runtime-config";
import {Pool} from "pg";
import {ReplyUtils} from "./reply-utils";

/**
 * A Fastify request that has been properly authenticated.
 */
export interface AuthenticatedRequest extends FastifyRequest {
  account: UserAccount;
  profile: Profile;
}

export class Auth {

  /**
   * Default authentication options for controllers.
   */
  static AuthedRouteOpts = {
    preHandler: Auth.checkAuth
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
  static checkAuth(request: FastifyRequest, reply: FastifyReply, done: Function) {
    let token: string | null | undefined = (<any>request.body).token;

    if ((<any>request.query).token) {
      token = (<any>request.query).token;
    }

    reply.type("application/json");

    if (!token)
      return reply.status(400).send(ReplyUtils.error("Token was missing."));

    jwt.verify(
      token,
      runtimeConfig.secret,
      async function (err: VerifyErrors | null, decoded: any | undefined) {
        if (err)
          return reply.status(400).send(ReplyUtils.error("Error while validating token.", err));

        if (!decoded.email)
          return reply.status(400).send(ReplyUtils.error("Unable to verify user, invalid token."));

        try {

          // First, we need to grab the user account from the token.

          let accountQuery = await Auth.pool.query(
            "select * from users.accounts where email=$1",
            [
              decoded.email
            ]
          );

          if (accountQuery.rowCount > 0) {
            let account = accountQuery.rows[0];

            // Next, we grab the active profile

            let profileQuery = await Auth.pool.query(
              "select * from users.profiles where handle=$1",
              [
                account.active_profile
              ]
            );

            if (profileQuery.rowCount > 0) {
              let profile = profileQuery.rows[0];

              // Finally, after we've found all the data we need, we attach it to the request.

              let authRequest = <AuthenticatedRequest>request;

              authRequest.account = {
                activeProfile: account.active_profile,
                createdOn: account.created_on,
                email: account.email,
                fullName: account.full_name,
                inventory: account.inventory,
                metadata: account.metadata,
                paymentId: account.payment_id,
                subscriptionTier: account.subscription_tier,
                id: account.id
              };

              authRequest.profile = {
                createdOn: profile.created_on,
                customCss: profile.custom_css,
                customDomain: profile.custom_domain,
                handle: profile.handle,
                headline: profile.headline,
                imageUrl: profile.image_url,
                metadata: profile.metadata,
                owner: profile.owner,
                id: profile.id,
                social: {
                  alt: profile.social?.alt,
                  icon: profile.social?.icon,
                  link: profile.social?.link
                },
                theme: profile.theme,
                visibility: profile.visibility
              };


            }

            done();
            return;

          } else {
            return reply.status(404).send(ReplyUtils.error("Unable to find account with this token."));
          }

        } catch (err) {

          if (err)
            return reply.status(500).send(ReplyUtils.error("Error while authenticating request.", err));

        }

        return reply.status(500).send(ReplyUtils.error("An unexpected error occurred."));
      });
  }

}
