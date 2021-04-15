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
import {UserService} from "../services/user-service";
import {ProfileService} from "../services/profile-service";
import Mixpanel from "mixpanel";
import {StringUtils} from "../utils/string-utils";

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
  Params: {
    code: string,
    state: string
  }
}

interface AssignGoogleUserRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
}

const googleRateLimit = {
  config: {
    rateLimit: {
      max: 4,
      timeWindow: '1 min'
    }
  }
};

const authGoogleRateLimit = {
  config: {
    rateLimit: {
      max: 4,
      timeWindow: '1 min'
    }
  },
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
      config.apiDomain + "/auth/google/redirect"
    );
  }

  registerRoutes(): void {
    // Unauthenticated
    this.fastify.all<EmailLoginUserRequest>('/user/login', this.EmailLoginUser.bind(this));
    this.fastify.all<EmailCreateUserRequest>('/user/create', this.EmailCreateUser.bind(this));
    this.fastify.all<EmailLoginUserRequest>('/auth/email/login', this.EmailLoginUser.bind(this));
    this.fastify.all<EmailCreateUserRequest>('/auth/email/create', this.EmailCreateUser.bind(this));

    if (config.google.clientId) {
      console.log("Google OAuth Authentication enabled.");

      // Unauthenticated
      this.fastify.all('/auth/google/login', googleRateLimit, this.GetGoogleLoginLink.bind(this));
      this.fastify.all('/auth/google/create', googleRateLimit, this.GetGoogleCreateLink.bind(this));

      // Authenticated
      this.fastify.all<AuthenticatedRequest>('/auth/google/assign', authGoogleRateLimit, this.GetGoogleAssignLink.bind(this));

      this.fastify.all<GoogleOAuthRedirectRequest>('/auth/google/redirect', googleRateLimit, this.GoogleOAuthRedirect.bind(this));
    }
  }

  /**
   * Route for /auth/google/login
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetGoogleLoginLink(request: FastifyRequest, reply: FastifyReply) {
    let nonce = StringUtils.generateNonce(16);
    let token = jwt.sign({nonce: nonce, type: "google_oauth"}, config.secret, {expiresIn: '15m'});

    return this.googleAuth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      state: JSON.stringify({"mode": "login", "token": token})
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
    let nonce = StringUtils.generateNonce(16);
    let token = jwt.sign({nonce: nonce, type: "google_oauth"}, config.secret, {expiresIn: '15m'});

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
    let nonce = StringUtils.generateNonce(16);
    let token = jwt.sign({
      nonce: nonce,
      userId: request.body.authUser.id,
      type: "google_auth"
    }, config.secret, {expiresIn: '15m'});

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
    let code = request.params.code;
    let stateRaw = request.params.state;
    let state: {
      mode: "login" | "create" | "assign",
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
      config.apiDomain + "/auth/google/redirect"
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
      case "login":
        try {
          let user = await this.userService.getUserByGoogleId(googleId);

          // Make sure the user has google sign in enabled for security purposes
          // then log them in normally
          let loginResultData = await this.userService.loginWithGoogle(user.id, googleId);

          if (this.mixpanel)
            this.mixpanel.track('user logged in with google', {
              distinct_id: loginResultData.user.id,
              $ip: request.ip,
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
      case "create":
        try {
          let email = userInfoResponse.data.email;

          if (!email) {
            return ReplyUtils.error("The email associated with this google account couldn't be found.");
          }

          let user = await this.userService.createUserWithGoogle(email, googleId, name);
          let profile = await this.profileService.createProfile(user.id);
          await this.userService.setActiveProfile(user.id, profile.id);

          let token = jwt.sign({userId: user.id, type: "auth"}, config.secret, {expiresIn: '168h'});

          if (this.mixpanel)
            this.mixpanel.track('user created with google', {
              distinct_id: user.id,
              $ip: request.ip,
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
              $ip: request.ip,
            });

          return ReplyUtils.success(`Google enabled: ${result}`);
        } catch (e) {
          if (e instanceof HttpError) {
            reply.code(e.statusCode);
            return ReplyUtils.error(e.message, e);
          }

          throw e;
        }

      default:
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
          $ip: request.ip,
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

      let token = jwt.sign({userId: user.id, type: "auth"}, config.secret, {expiresIn: '168h'});

      if (this.mixpanel)
        this.mixpanel.track('user created', {
          distinct_id: user.id,
          $ip: request.ip,
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
