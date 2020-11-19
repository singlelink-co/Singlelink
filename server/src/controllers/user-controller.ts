import {FastifyInstance, FastifyReply, FastifyRequest, RequestGenericInterface, RouteHandlerMethod} from "fastify";
import {UserService} from "../services/user-service";
import {DatabaseManager} from "../data/database-manager";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {Controller} from "./controller";
import {ReplyUtils} from "../utils/reply-utils";
import {constants as HttpStatus} from "http2";
import {HttpError} from "../utils/http-error";
import {ProfileService} from "../services/profile-service";
import * as jwt from "jsonwebtoken";
import {appConfig} from "../config/app-config";

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
interface UpdateUserRequest extends RequestGenericInterface {
  Body: {}
}

interface SetActiveProfileRequest extends RequestGenericInterface {
  Body: {
    profile?: string
  }
}

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
    this.fastify.all('/user/login', this.LoginUser.bind(this));
    this.fastify.all('/user/create', this.CreateUser.bind(this));
    this.fastify.all('/user/request-reset-password', this.UserRequestResetPassword.bind(this));
    this.fastify.all('/user/reset-password', this.ResetUserPassword.bind(this));

    // Authenticated
    this.fastify.all('/user', Auth.AuthRouteOptions, <RouteHandlerMethod>this.GetUser.bind(this));
    this.fastify.all('/user/update', Auth.AuthRouteOptions, <RouteHandlerMethod>this.UpdateUser.bind(this));
    this.fastify.all('/user/set-active-profile', Auth.AuthRouteOptions, <RouteHandlerMethod>this.SetActiveProfile.bind(this));
    this.fastify.all('/user/delete', Auth.AuthRouteOptions, <RouteHandlerMethod>this.DeleteUser.bind(this));
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
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No email was provided."));
        return;
      }

      if (!body.password) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No password was provided."));
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
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No email was provided."));
        return;
      }

      if (!body.password) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No password was provided."));
        return;
      }

      let user = await this.userService.createUser(body.email, body.password, body.name);
      let profile = await this.profileService.createProfile(user.id, body.handle);
      await this.userService.setActiveProfile(user.id, profile.id);

      let token = jwt.sign({email: user.email}, appConfig.secret, {expiresIn: '168h'});

      return {
        user: user,
        activeProfile: profile,
        token: token
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
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No email was provided."));
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
  async GetUser(request: AuthenticatedRequest, reply: FastifyReply) {
    return request.user;
  }

  //TODO Implement UpdateUser
  /**
   * Route for /user/update
   * @param request
   * @param reply
   */
  async UpdateUser(request: AuthenticatedRequest<UpdateUserRequest>, reply: FastifyReply) {
    try {
      reply.code(HttpStatus.HTTP_STATUS_NOT_IMPLEMENTED);

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
   * @param request
   * @param reply
   */
  async SetActiveProfile(request: AuthenticatedRequest<SetActiveProfileRequest>, reply: FastifyReply) {
    try {

    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /user/delete
   * @param request
   * @param reply
   */
  async DeleteUser(request: AuthenticatedRequest, reply: FastifyReply) {
    try {

    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
