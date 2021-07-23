import {FastifyInstance, FastifyReply, FastifyRequest, preHandlerHookHandler, RequestGenericInterface} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Controller} from "./controller";
import {AuthService} from "../services/auth-service";
import {Auth as GoogleAuth, google} from 'googleapis';
import {config} from "../config/config";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {StatusCodes} from "http-status-codes";
import {ReplyUtils} from "../utils/reply-utils";
import {HttpError} from "../utils/http-error";
import * as jwt from "jsonwebtoken";
import {AccessRequestToken, UserService} from "../services/user-service";
import {ProfileService} from "../services/profile-service";
import Mixpanel from "mixpanel";
import {SecurityUtils} from "../utils/security-utils";

interface EmailLoginUserRequest extends RequestGenericInterface {
  Body: {
    email?: string,
    password?: string
  }
}

interface EmailCreateUserRequest extends RequestGenericInterface {
  Body: {
    email?: string,
    password?: string,
    name: string,
    handle: string
  }
}

interface GoogleOAuthRedirectRequest extends FastifyRequest {
  Querystring: {
    code: string,
    state: string
  }
}

interface GoogleLoginRequest extends FastifyRequest {
  Body: {
    requestToken: string
  }
}

// TODO Re-enable these!
const googleRateLimit = {
  // config: {
  //   rateLimit: {
  //     max: 4,
  //     timeWindow: '1 min'
  //   }
  // }
};

const authGoogleRateLimit = {
  // config: {
  //   rateLimit: {
  //     max: 4,
  //     timeWindow: '1 min'
  //   }
  // },
  preHandler: <preHandlerHookHandler>Auth.validateAuthWithData
};

/**
 * This controller maps and provides for all the controllers under /admin.
 */
export class AuthController extends Controller {
  private readonly authService: AuthService;
  private readonly googleAuth: GoogleAuth.OAuth2Client;
  private readonly userService: UserService;
  private readonly profileService: ProfileService;
  private readonly mixpanel = config.analytics.mixpanelToken ? Mixpanel.init(config.analytics.mixpanelToken) : null;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.authService = new AuthService(databaseManager);
    this.userService = new UserService(databaseManager);
    this.profileService = new ProfileService(databaseManager);

    this.googleAuth = new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectDomain + "/auth/google/redirect"
    );
  }

  registerRoutes(): void {
    // Unauthenticated
    this.fastify.post<EmailLoginUserRequest>('/user/login', this.EmailLoginUser.bind(this));
    this.fastify.post<EmailCreateUserRequest>('/user/create', this.EmailCreateUser.bind(this));
    this.fastify.post<EmailLoginUserRequest>('/auth/email/login', this.EmailLoginUser.bind(this));
    this.fastify.post<EmailCreateUserRequest>('/auth/email/create', this.EmailCreateUser.bind(this));

    if (config.google.clientId) {
      console.log("Google OAuth Authentication enabled.");

      // Unauthenticated
      this.fastify.post('/auth/google/request-login', googleRateLimit, this.GetGoogleRequestLoginLink.bind(this));
      this.fastify.post('/auth/google/create', googleRateLimit, this.GetGoogleCreateLink.bind(this));
      this.fastify.post<GoogleLoginRequest>('/auth/google/login', googleRateLimit, this.GoogleLoginRequest.bind(this));

      // OAuth Redirect
      this.fastify.all<GoogleOAuthRedirectRequest>('/auth/google/redirect', googleRateLimit, this.GoogleOAuthRedirect.bind(this));

      // Authenticated
      this.fastify.post<AuthenticatedRequest>('/auth/google/assign', authGoogleRateLimit, this.GetGoogleAssignLink.bind(this));

    }
  }

  /**
   * Route for /auth/google/request-login
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetGoogleRequestLoginLink(request: FastifyRequest, reply: FastifyReply) {
    let nonce = SecurityUtils.generateNonce();
    let token = jwt.sign({nonce: nonce, type: <TokenType>"google_oauth"}, config.secret, {expiresIn: '15m'});

    await SecurityUtils.recordNonce(nonce);

    return this.googleAuth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      state: JSON.stringify({"mode": "request-login", "token": token})
    });
  }

  /**
   * Route for /auth/google/create
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetGoogleCreateLink(request: FastifyRequest, reply: FastifyReply) {
    let nonce = SecurityUtils.generateNonce();
    let token = jwt.sign({nonce: nonce, type: <TokenType>"google_oauth"}, config.secret, {expiresIn: '15m'});

    await SecurityUtils.recordNonce(nonce);

    return this.googleAuth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      state: JSON.stringify({"mode": "create", "token": token})
    });
  }

  /**
   * Route for /auth/google/assign
   *
   * Authenticated, requires valid user.
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetGoogleAssignLink(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    let nonce = SecurityUtils.generateNonce();
    let token = jwt.sign({
      nonce: nonce,
      userId: request.body.authUser.id,
      type: <TokenType>"google_oauth"
    }, config.secret, {expiresIn: '15m'});

    await SecurityUtils.recordNonce(nonce);

    return this.googleAuth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      state: JSON.stringify({"mode": "assign", "token": token})
    });
  }

  /**
   * Route for /auth/google/redirect
   *
   * OAuth redirect route.
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GoogleOAuthRedirect(request: FastifyRequest<GoogleOAuthRedirectRequest>, reply: FastifyReply) {
    let code = request.query.code;
    let stateRaw = request.query.state;

    let state: {
      mode: "request-login" | "create" | "assign",
      token: string
    } = JSON.parse(stateRaw);

    let decoded = <{ nonce: string | undefined, userId: string | undefined, type: TokenType }>jwt.verify(
      state.token,
      config.secret,
      {
        maxAge: "15m"
      });

    if (!decoded.nonce) {
      return ReplyUtils.error("Invalid token.");
    }

    if (!await SecurityUtils.expireNonce(decoded.nonce)) {
      return ReplyUtils.error("Invalid token.");
    }

    if (decoded?.type !== "google_oauth") {
      reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Invalid token type."));
      return;
    }

    let data = await this.googleAuth.getToken(code);
    let tokens = data.tokens;

    // Create a new auth instance
    let authInstance = new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectDomain + "/auth/google/redirect"
    );

    authInstance.setCredentials(tokens);

    let oauth2 = google.oauth2({
      auth: authInstance,
      version: 'v2'
    });

    let userInfoResponse = await oauth2.userinfo.v2.me.get();

    let googleId = userInfoResponse.data.id;
    let name = userInfoResponse.data.name ?? undefined;

    if (!googleId) {
      return ReplyUtils.error("The google account doesn't have an associated id, so it can't be used to create a user.");
    }

    // Check the type of login

    switch (state.mode) {
      case "request-login":
        try {
          let user = await this.userService.getUserByGoogleId(googleId);
          let requestToken = await this.userService.createAccessTokenRequest(user, googleId);

          reply.type("text/html").code(StatusCodes.OK);
          let url = `${config.editorDomain}/auth/token-login?requestToken=${requestToken}&service=Google`;

          // language=HTML
          return `
            <html lang="en">
            <head>
              <meta http-equiv="refresh" content="0;url=${url}"/>
              <meta charset="UTF-8">
              <title>Singlelink - Redirecting</title>
            </head>
            <body>
            <p>
              Redirecting...<br>
              <a href="${config.editorDomain}">Click here if you aren't automatically redirected.</a>
            </p>
            </body>
            <script>

            </script>
            </html>`;
        } catch (e) {
          if (e instanceof HttpError) {
            reply.type("text/html").code(e.statusCode);
            let s = ReplyUtils.error(e.message, e);

            // language=HTML
            return `
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta http-equiv="refresh" content="5;url=${config.editorDomain}"/>
                <title>Singlelink - Error!</title>
              </head>
              <body>
              <p>
                ${e.statusCode === 404 ?
                  `You haven't linked your account to Google yet! You must do that in your settings first before logging in with Google.` :
                  `Error: ${s}`} <br>
                Redirecting in 5 seconds...<br>
                <a href="${config.editorDomain}">Click here if you aren't automatically redirected.</a>
              </p>
              </body>
              <script>

              </script>
              </html>`;
          }

          throw e;
        }

      case "create":
        try {
          let email = userInfoResponse.data.email;

          if (!email) {
            return ReplyUtils.error("The email associated with this google account couldn't be found.");
          }

          let user = await this.userService.createUserWithGoogle(email, googleId, name);
          let profile = await this.profileService.createProfile(user.id);
          await this.userService.setActiveProfile(user.id, profile.id);

          if (this.mixpanel)
            this.mixpanel.track('user created with google', {
              distinct_id: user.id,
              $ip: (config.allowXForwardHeader ?
            request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress :
            request.connection.remoteAddress),
              profile: profile.id,
            });

          if (this.mixpanel)
            this.mixpanel.people.set(user.id, {
              '$email': user.email,
              '$created': user.createdOn
            });

          let requestToken = await this.userService.createAccessTokenRequest(user, googleId);

          reply.type("text/html").code(StatusCodes.OK);
          let url = `${config.editorDomain}/auth/token-login?requestToken=${requestToken}&service=Google`;

          // language=HTML
          return `
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="refresh" content="0;url=${url}"/>
              <title>Singlelink - Redirecting</title>
            </head>
            <body>
            <p>
              Redirecting...<br>
              <a href="${config.editorDomain}">Click here if you aren't automatically redirected.</a>
            </p>
            </body>
            <script>

            </script>
            </html>`;
        } catch (e) {
          if (e instanceof HttpError) {
            reply.type("text/html").code(e.statusCode);
            let s = ReplyUtils.error(e.message, e);

            // language=HTML
            return `
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta http-equiv="refresh" content="5;url=${config.editorDomain}"/>
                <title>Singlelink - Error!</title>
              </head>
              <body>
              <p>
                Error: ${s} <br>
                Redirecting in 5 seconds...<br>
                <a href="${config.editorDomain}">Click here if you aren't automatically redirected.</a>
              </p>
              </body>
              </html>`;
          }

          throw e;
        }

      case "assign":
        try {
          if (!decoded.userId) {
            return ReplyUtils.error("Invalid token.");
          }

          let userId = decoded.userId;

          let result = await this.authService.setGoogleId(userId, googleId);

          if (this.mixpanel)
            this.mixpanel.track('user changed google account', {
              distinct_id: userId,
              $ip: (config.allowXForwardHeader ?
            request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress :
            request.connection.remoteAddress),
            });

          reply.type("text/html").code(StatusCodes.OK);

          // language=HTML
          return `
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="refresh"
                    content="0;url=${config.editorDomain}/dashboard/settings/?googleLinked=${result}"/>
              <title>Singlelink - Redirecting...</title>
            </head>
            <body>
            <p>
              Google enabled: ${result} <br>
              Redirecting...<br>
              <a href="${config.editorDomain}">Click here if you aren't automatically redirected.</a>
            </p>
            </body>
            </html>`;

        } catch (e) {
          if (e instanceof HttpError) {
            reply.type("text/html").code(e.statusCode);
            let s = ReplyUtils.error(e.message, e);

            // language=HTML
            return `
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta http-equiv="refresh" content="5;url=${config.editorDomain}"/>
                <title>Singlelink - Error!</title>
              </head>
              <body>
              <p>
                Error: ${s} <br>
                Redirecting in 5 seconds...<br>
                <a href="${config.editorDomain}">Click here if you aren't automatically redirected.</a>
              </p>
              </body>
              </html>`;
          }

          throw e;
        }

      default:
    }
  }

  async GoogleLoginRequest(request: FastifyRequest<GoogleLoginRequest>, reply: FastifyReply) {
    try {
      let body = request.body;
      let requestToken = body.requestToken;

      if (await SecurityUtils.isTokenExpired(requestToken)) {
        reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Invalid token."));
        return;
      }

      let decoded = <AccessRequestToken>jwt.verify(
        requestToken,
        config.secret,
        {
          maxAge: "2m"
        });

      if (!decoded) {
        reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("Invalid token."));
        return;
      }

      await SecurityUtils.expireToken(decoded.userId, requestToken);

      // Make sure the user has google sign in enabled for security purposes
      // then log them in normally
      let loginResultData = await this.userService.loginWithGoogle(decoded.userId, decoded.serviceUserId);

      if (this.mixpanel)
        this.mixpanel.track('user logged in with google', {
          distinct_id: loginResultData.user.id,
          $ip: (config.allowXForwardHeader ?
            request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress :
            request.connection.remoteAddress),
          profile: loginResultData.activeProfile?.id
        });

      return loginResultData;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /user/login
   * @param request
   * @param reply
   */
  async EmailLoginUser(request: FastifyRequest<EmailLoginUserRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.email) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No email was provided."));
        return;
      }

      if (!body.password) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No password was provided."));
        return;
      }

      let loginResultData = await this.userService.loginWithEmail(body.email, body.password);

      if (this.mixpanel)
        this.mixpanel.track('user logged in', {
          distinct_id: loginResultData.user.id,
          $ip: (config.allowXForwardHeader ?
            request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress :
            request.connection.remoteAddress),
          profile: loginResultData.activeProfile?.id
        });

      return loginResultData;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /user/create
   * @param request
   * @param reply
   */
  async EmailCreateUser(request: FastifyRequest<EmailCreateUserRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.email) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No email was provided."));
        return;
      }

      if (!body.password) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No password was provided."));
        return;
      }

      try {
        let checkProfile = await this.profileService.getProfileByHandle(body.handle, false);

        if (checkProfile) {
          reply.code(StatusCodes.CONFLICT);
          return ReplyUtils.error("The profile couldn't be added because it is already being used.");
        }
      } catch (e) {
        if (e instanceof HttpError) {
          if (e.statusCode !== StatusCodes.NOT_FOUND) {
            reply.code(e.statusCode);
            return ReplyUtils.error(e.message, e);
          }
        }
      }

      let user = await this.userService.createUserWithEmail(body.email, body.password, body.name);
      let profile = await this.profileService.createProfile(user.id, body.handle);
      await this.userService.setActiveProfile(user.id, profile.id);

      let token = jwt.sign({userId: user.id, type: <TokenType>"auth"}, config.secret, {expiresIn: '168h'});

      if (this.mixpanel)
        this.mixpanel.track('user created', {
          distinct_id: user.id,
          $ip: (config.allowXForwardHeader ?
            request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress :
            request.connection.remoteAddress),
          profile: profile.id,
        });

      if (this.mixpanel)
        this.mixpanel.people.set(user.id, {
          '$email': user.email,
          '$created': user.createdOn
        });

      return {
        user,
        activeProfile: profile,
        token
      };
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
