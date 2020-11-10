import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserManager} from "../server/user-manager";
import {DatabaseManager} from "../server/database-manager";
import {Pool} from "pg";
import {AuthUtils} from "../utils/auth-utils";

/**
 * The analytics router maps and provides for all the routes under /user.
 */
export class UserRouter implements IRouter {
  private readonly userManager: UserManager;

  private fastify: FastifyInstance;
  private databaseManager: DatabaseManager;
  private pool: Pool;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    this.fastify = fastify;
    this.databaseManager = databaseManager;
    this.pool = databaseManager.pool;
    this.userManager = new UserManager(databaseManager);
  }

  registerRoutes(): void {

    // Unauthenticated

    this.fastify.all('/user/login', this.LoginUser);
    this.fastify.all('/user/create', this.CreateUser);
    this.fastify.all('/user/request-reset-password', this.UserRequestResetPassword);
    this.fastify.all('/user/reset-password', this.ResetUserPassword);

    // Authenticated

    this.fastify.all('/user/fetch', AuthUtils.AuthedRouteOpts, this.FetchUser);
    this.fastify.all('/user/set-active', AuthUtils.AuthedRouteOpts, this.SetActiveUser);

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
