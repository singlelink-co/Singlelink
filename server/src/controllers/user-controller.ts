import {FastifyInstance, FastifyReply, FastifyRequest, preHandlerHookHandler, RequestGenericInterface} from "fastify";
import {UserService} from "../services/user-service";
import {DatabaseManager} from "../data/database-manager";
import {Controller} from "./controller";
import {ReplyUtils} from "../utils/reply-utils";
import {StatusCodes} from "http-status-codes";
import {HttpError} from "../utils/http-error";
import {ProfileService} from "../services/profile-service";
import {config} from "../config/config";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import Mixpanel from "mixpanel";
import {Readable} from "stream";

interface UserRequestResetPasswordRequest extends RequestGenericInterface {
  Body: {
    email?: string
  }
}

interface ResetUserPasswordRequest extends RequestGenericInterface {
  Body: {
    token?: string,
    password?: string
  }
}

interface UpdateUserRequest extends AuthenticatedRequest {
  Body: {
    id: string,
    email: string,
    fullName?: string
  } & AuthenticatedRequest["Body"]
}

interface DeleteUserRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
}

interface SetActiveProfileRequest extends AuthenticatedRequest {
  Body: {
    newProfileId?: string
  } & AuthenticatedRequest["Body"]
}

interface GetUserDataPackageRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
}

interface SetEmailNotifications extends AuthenticatedRequest {
  Body: {
    emailNotifications: {
      major: true,
      minor: true,
      marketing: true,
      leaderboard: true
    }
  } & AuthenticatedRequest["Body"]
}

const userRequestResetPasswordOpts = {
  config: {
    rateLimit: {
      max: 3,
      timeWindow: '4 hours'
    }
  }
};

const userDataPackageRateLimit = {
  config: {
    rateLimit: {
      max: 5,
      timeWindow: '30 min'
    }
  },
  preHandler: <preHandlerHookHandler>Auth.validateAuthWithData
};

/**
 * This controller maps and provides for all the controllers under /user.
 */
export class UserController extends Controller {
  private readonly userService: UserService;
  private readonly profileService: ProfileService;
  private readonly mixpanel = config.analytics.mixpanelToken ? Mixpanel.init(config.analytics.mixpanelToken) : null;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.userService = new UserService(databaseManager);
    this.profileService = new ProfileService(databaseManager);
  }

  registerRoutes(): void {
    // Unauthenticated
    this.fastify.all<UserRequestResetPasswordRequest>('/user/request-reset-password', userRequestResetPasswordOpts, this.UserRequestResetPassword.bind(this));
    this.fastify.all<ResetUserPasswordRequest>('/user/reset-password', this.ResetUserPassword.bind(this));

    // Authenticated
    this.fastify.all<AuthenticatedRequest>('/user', Auth.ValidateWithData, this.GetUser.bind(this));
    this.fastify.all<AuthenticatedRequest>('/user/private-metadata', Auth.ValidateWithData, this.GetPrivateMetadata.bind(this));

    this.fastify.all<UpdateUserRequest>('/user/update', Auth.ValidateWithData, this.UpdateUser.bind(this));
    this.fastify.all<DeleteUserRequest>('/user/delete', Auth.ValidateWithData, this.DeleteUser.bind(this));
    this.fastify.all<SetActiveProfileRequest>('/user/set-active-profile', Auth.ValidateWithData, this.SetActiveProfile.bind(this));

    this.fastify.all<GetUserDataPackageRequest>('/user/data-package', userDataPackageRateLimit, this.GetUserDataPackage.bind(this));

    this.fastify.post<SetEmailNotifications>('/user/set-email-notifications', Auth.ValidateWithData, this.SetEmailNotifications.bind(this));
  }

  /**
   * Route for /user/request-reset-password
   * @param request
   * @param reply
   */
  async UserRequestResetPassword(request: FastifyRequest<UserRequestResetPasswordRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.email) {
        reply.status(StatusCodes.NOT_FOUND).send(ReplyUtils.error("No email was provided."));
        return;
      }

      let user = await this.userService.sendPasswordResetEmail(body.email);

      if (this.mixpanel)
        this.mixpanel.track('user requested password reset', {
          distinct_id: user.id,
          $ip: request.ip
        });

      return ReplyUtils.success("Successfully sent password reset email.");
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /user/reset-password
   * @param request
   * @param reply
   */
  async ResetUserPassword(request: FastifyRequest<ResetUserPasswordRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.token) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No email was provided."));
        return;
      }

      if (!body.password) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No email was provided."));
        return;
      }

      await this.userService.setPasswordWithToken(body.token, body.password);

      return ReplyUtils.success("Successfully changed password.");
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /user
   * @param request
   * @param reply
   */
  async GetUser(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    return request.body.authUser;
  }

  /**
   * Route for /user/private-metadata
   * @param request
   * @param reply
   */
  async GetPrivateMetadata(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    try {
      let sensitiveUser = await this.userService.getSensitiveUser(request.body.authUser.id);

      return sensitiveUser.privateMetadata;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  //TODO Implement UpdateUser
  /**
   * Route for /user/update
   * @param request
   * @param reply
   */
  async UpdateUser(request: FastifyRequest<UpdateUserRequest>, reply: FastifyReply) {
    try {
      reply.code(StatusCodes.NOT_IMPLEMENTED);

      // this.mixpanel.track('user updated', {
      //   distinct_id: request.body.id,
      //   $ip: request.ip,
      // });

      return ReplyUtils.error("Sorry, this is not implemented yet.");
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  //TODO Implement DeleteUser
  /**
   * Route for /user/delete
   * @param request
   * @param reply
   */
  async DeleteUser(request: FastifyRequest<DeleteUserRequest>, reply: FastifyReply) {
    try {
      let user = request.body.authUser;

      let deletedUser = await this.userService.deleteUser(user.id);

      if (this.mixpanel)
        this.mixpanel.track('user deleted', {
          distinct_id: user.id,
          $ip: request.ip,
        });

      return deletedUser;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /user/data-package
   *
   * Compiles and sends the user a package of their data.
   */
  async GetUserDataPackage(request: FastifyRequest<GetUserDataPackageRequest>, reply: FastifyReply) {
    try {
      let user = request.body.authUser;

      let data = await this.userService.generateDataPackage(user);

      if (this.mixpanel)
        this.mixpanel.track('user requested GDPR data', {
          distinct_id: request.body.authUser.id,
          $ip: request.ip,
        });


      let filename = user.id + '-data-package.json';

      reply.type('application/octet-stream').code(StatusCodes.OK);
      reply.header('Content-Disposition', `inline; filename=${filename}`);

      const stream = Readable.from(data);
      reply.send(stream);

      return;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /user/set-active
   *
   * @param request
   * @param reply
   */
  async SetActiveProfile(request: FastifyRequest<SetActiveProfileRequest>, reply: FastifyReply) {
    try {
      let body = request.body;
      let user = body.authUser;
      let newProfileId = body.newProfileId;

      if (!newProfileId) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No email was provided."));
        return;
      }

      let newProfile = await this.profileService.getProfile(newProfileId);

      if (user.id !== newProfile.userId) {
        reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("The user doesn't own the profile."));
        return;
      }

      if (this.mixpanel)
        this.mixpanel.track('user set active profile', {
          distinct_id: user.id,
          $ip: request.ip,
          profile: newProfileId
        });

      return this.userService.setActiveProfile(user.id, newProfileId);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /profile/set-email-notifications
   *
   * @param request
   * @param reply
   */
  async SetEmailNotifications(request: FastifyRequest<SetEmailNotifications>, reply: FastifyReply) {
    try {
      let user = await this.userService.setEmailNotifications(request.body.authUser.id, request.body.emailNotifications);

      if (this.mixpanel)
        this.mixpanel.track('toggle email notifications', {
          distinct_id: user.id,
          $ip: request.ip,
          emailNotifications: request.body.emailNotifications
        });

      return user;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
