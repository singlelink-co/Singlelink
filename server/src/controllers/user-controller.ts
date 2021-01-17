import {FastifyInstance, FastifyReply, FastifyRequest, RequestGenericInterface} from "fastify";
import {UserService} from "../services/user-service";
import {DatabaseManager} from "../data/database-manager";
import {Controller} from "./controller";
import {ReplyUtils} from "../utils/reply-utils";
import {StatusCodes} from "http-status-codes";
import {HttpError} from "../utils/http-error";
import {ProfileService} from "../services/profile-service";
import * as jwt from "jsonwebtoken";
import {config} from "../config/config";
import {Auth, AuthenticatedRequest} from "../utils/auth";

interface LoginUserRequest extends RequestGenericInterface {
  Body: {
    email?: string,
    password?: string
  }
}

interface CreateUserRequest extends RequestGenericInterface {
  Body: {
    email?: string,
    password?: string,
    name: string,
    handle: string
  }
}

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

// TODO Implement UpdateUserRequest
interface UpdateUserRequest extends AuthenticatedRequest {
  Body: {} & AuthenticatedRequest["Body"]
}

interface SetActiveProfileRequest extends AuthenticatedRequest {
  Body: {
    newProfileId?: string
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

/**
 * This controller maps and provides for all the controllers under /user.
 */
export class UserController extends Controller {
  private userService: UserService;
  private profileService: ProfileService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.userService = new UserService(databaseManager);
    this.profileService = new ProfileService(databaseManager);
  }

  registerRoutes(): void {
    // Unauthenticated
    this.fastify.all<LoginUserRequest>('/user/login', this.LoginUser.bind(this));
    this.fastify.all<CreateUserRequest>('/user/create', this.CreateUser.bind(this));
    this.fastify.all<UserRequestResetPasswordRequest>('/user/request-reset-password', userRequestResetPasswordOpts, this.UserRequestResetPassword.bind(this));
    this.fastify.all<ResetUserPasswordRequest>('/user/reset-password', this.ResetUserPassword.bind(this));

    // Authenticated
    this.fastify.all<AuthenticatedRequest>('/user', Auth.ValidateWithData, this.GetUser.bind(this));
    this.fastify.all<UpdateUserRequest>('/user/update', Auth.ValidateWithData, this.UpdateUser.bind(this));
    this.fastify.all<AuthenticatedRequest>('/user/delete', Auth.ValidateWithData, this.DeleteUser.bind(this));
    this.fastify.all<SetActiveProfileRequest>('/user/set-active-profile', Auth.ValidateWithData, this.SetActiveProfile.bind(this));
  }

  /**
   * Route for /user/login
   * @param request
   * @param reply
   */
  async LoginUser(request: FastifyRequest<LoginUserRequest>, reply: FastifyReply) {
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

      return await this.userService.loginUser(body.email, body.password);
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
  async CreateUser(request: FastifyRequest<CreateUserRequest>, reply: FastifyReply) {
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

      let user = await this.userService.createUser(body.email, body.password, body.name);
      let profile = await this.profileService.createProfile(user.id, body.handle);
      await this.userService.setActiveProfile(user.id, profile.id);

      let token = jwt.sign({email: user.email}, config.secret, {expiresIn: '168h'});

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

      await this.userService.sendPasswordResetEmail(body.email);

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

  //TODO Implement UpdateUser
  /**
   * Route for /user/update
   * @param request
   * @param reply
   */
  async UpdateUser(request: FastifyRequest<UpdateUserRequest>, reply: FastifyReply) {
    try {
      reply.code(StatusCodes.NOT_IMPLEMENTED);

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
  async DeleteUser(request: FastifyRequest<AuthenticatedRequest>, reply: FastifyReply) {
    try {
      reply.code(StatusCodes.NOT_IMPLEMENTED);

      return ReplyUtils.error("Sorry, this is not implemented yet.");
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

      let newProfile = await this.profileService.getProfile(newProfileId, false);

      if (user.id !== newProfile.userId) {
        reply.status(StatusCodes.UNAUTHORIZED).send(ReplyUtils.error("The user doesn't own the profile."));
        return;
      }

      return await this.userService.setActiveProfile(user.id, newProfileId);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
