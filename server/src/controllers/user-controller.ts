import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserService} from "../services/user-service";
import {DatabaseManager} from "../managers/database-manager";
import {Pool} from "pg";
import {AuthUtils} from "../utils/auth-utils";

/**
 * This controller maps and provides for all the controllers under /user.
 */
export class UserController implements IController {
  private fastify: FastifyInstance;
  private databaseManager: DatabaseManager;
  private pool: Pool;
  private userService: UserService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    this.fastify = fastify;
    this.databaseManager = databaseManager;
    this.pool = databaseManager.pool;
    this.userService = new UserService(databaseManager);
  }

  registerRoutes(): void {

    // Unauthenticated

    this.fastify.all('/user/login', this.LoginUser.bind(this));
    this.fastify.all('/user/create', this.CreateUser.bind(this));
    this.fastify.all('/user/request-reset-password', this.UserRequestResetPassword.bind(this));
    this.fastify.all('/user/reset-password', this.ResetUserPassword.bind(this));

    // Authenticated

    this.fastify.all('/user/fetch', AuthUtils.AuthedRouteOpts, this.FetchUser.bind(this));
    this.fastify.all('/user/set-active', AuthUtils.AuthedRouteOpts, this.SetActiveUser.bind(this));

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
   * Route for /user/fetch
   * @param request
   * @param reply
   */
  async FetchUser(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /user/set-active
   * @param request
   * @param reply
   */
  async SetActiveUser(request: FastifyRequest, reply: FastifyReply) {

  }
}