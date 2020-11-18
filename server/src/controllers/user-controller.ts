import {FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod} from "fastify";
import {UserService} from "../services/user-service";
import {DatabaseManager} from "../data/database-manager";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {Controller} from "./controller";

/**
 * This controller maps and provides for all the controllers under /user.
 */
export class UserController extends Controller {
  private userService: UserService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.userService = new UserService(databaseManager);
  }

  registerRoutes(): void {
    // Unauthenticated

    this.fastify.all('/user/login', this.LoginUser.bind(this));
    this.fastify.all('/user/create', this.CreateUser.bind(this));
    this.fastify.all('/user/request-reset-password', this.UserRequestResetPassword.bind(this));
    this.fastify.all('/user/reset-password', this.ResetUserPassword.bind(this));

    // Authenticated

    this.fastify.all('/user', Auth.AuthRouteOptions, <RouteHandlerMethod>this.GetUser.bind(this));
    this.fastify.all('/user/set-active', Auth.AuthRouteOptions, <RouteHandlerMethod>this.SetActiveUser.bind(this));
    this.fastify.all('/user/delete', Auth.AuthRouteOptions, <RouteHandlerMethod>this.DeleteUser.bind(this));
  }

  /**
   * Route for /user/login
   * @param request
   * @param reply
   */
  async LoginUser(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /user/create
   * @param request
   * @param reply
   */
  async CreateUser(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /user/request-reset-password
   * @param request
   * @param reply
   */
  async UserRequestResetPassword(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /user/reset-password
   * @param request
   * @param reply
   */
  async ResetUserPassword(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /user
   * @param request
   * @param reply
   */
  async GetUser(request: AuthenticatedRequest, reply: FastifyReply) {

  }

  /**
   * Route for /user/set-active
   * @param request
   * @param reply
   */
  async SetActiveUser(request: AuthenticatedRequest, reply: FastifyReply) {

  }

  /**
   * Route for /user/delete
   * @param request
   * @param reply
   */
  async DeleteUser(request: AuthenticatedRequest, reply: FastifyReply) {

  }
}
