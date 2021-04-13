import {FastifyInstance, FastifyReply, FastifyRequest, RequestGenericInterface} from "fastify";
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

interface GoogleLoginRequest extends FastifyRequest {
  Body: {}
}

interface GoogleOAuthRedirectRequest extends FastifyRequest {
  Params: {
    code: string,
    state: string
  }
}

interface CreateGoogleUserRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
}

interface AssignGoogleUserRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
}

const authGoogleRateLimit = {
  config: {
    rateLimit: {
      max: 4,
      timeWindow: '1 min'
    }
  }
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
    if (config.google.clientId) {
      console.log("Google OAuth Authentication enabled.");

      // Unauthenticated
      this.fastify.all<EmailLoginUserRequest>('/auth/email/login', this.EmailLoginUser.bind(this));
      this.fastify.all<EmailCreateUserRequest>('/auth/email/create', this.EmailCreateUser.bind(this));
      this.fastify.all<EmailLoginUserRequest>('/user/login', this.EmailLoginUser.bind(this));
      this.fastify.all<EmailCreateUserRequest>('/user/create', this.EmailCreateUser.bind(this));

      this.fastify.all<GoogleLoginRequest>('/auth/google/login', authGoogleRateLimit, this.GetGoogleLoginLink.bind(this));
      this.fastify.all<CreateGoogleUserRequest>('/auth/google/create', authGoogleRateLimit, this.GetGoogleCreateLink.bind(this));
      this.fastify.all<GoogleOAuthRedirectRequest>('/auth/google/redirect', authGoogleRateLimit, this.GoogleOAuthRedirect.bind(this));

      // Authenticated
      this.fastify.all<AssignGoogleUserRequest>('/auth/google/assign', Auth.ValidateWithData, this.AssignGoogleUser.bind(this));
    }
  }

  /**
   * Route for /auth/google/login
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetGoogleLoginLink(request: FastifyRequest<GoogleLoginRequest>, reply: FastifyReply) {
    return this.googleAuth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      state: JSON.stringify({"mode": "login"})
    });
  }

  /**
   * Route for /auth/google/create
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetGoogleCreateLink(request: FastifyRequest<CreateGoogleUserRequest>, reply: FastifyReply) {
    return this.googleAuth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      state: JSON.stringify({"mode": "create"})
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
      "mode": "login" | "create" | "assign"
    } = JSON.parse(stateRaw);

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

    let email = userInfoResponse.data.email;
    let name = userInfoResponse.data.name ?? undefined;

    // Check the type of login

    switch (state.mode) {
      case "login":
        try {
          if (!email) {
            return ReplyUtils.error("The email associated with this google account couldn't be found.");
          }

          // Make sure the user has google sign in enabled for security purposes
          // then log them in normally
          let loginResultData = await this.userService.loginWithGoogle(email);

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
          if (!email) {
            return ReplyUtils.error("The email associated with this google account couldn't be found.");
          }

          let user = await this.userService.createUserWithGoogle(email, name);
          let profile = await this.profileService.createProfile(user.id);
          await this.userService.setActiveProfile(user.id, profile.id);

          let token = jwt.sign({email: user.email}, config.secret, {expiresIn: '168h'});

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
      // TODO Implement
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

      let token = jwt.sign({email: user.email}, config.secret, {expiresIn: '168h'});

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

  // TODO Implement assign google user route
  /**
   * Route for /auth/google/assign
   *
   * This allows users to assign a google account to an existing Singlelink account.
   *
   * @param request
   * @param reply
   * @constructor
   */
  async AssignGoogleUser(request: FastifyRequest<AssignGoogleUserRequest>, reply: FastifyReply) {

  }
}
