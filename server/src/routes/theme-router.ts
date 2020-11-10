import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserManager} from "../server/user-manager";
import {DatabaseManager} from "../server/database-manager";
import {Pool} from "pg";
import {AuthUtils} from "../utils/auth-utils";

/**
 * The analytics router maps and provides for all the routes under /theme.
 */
export class ThemeRouter implements IRouter {
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

    this.fastify.post('/theme/fetch', AuthUtils.AuthedRouteOpts, this.FetchTheme);
    this.fastify.post('/theme/update', AuthUtils.AuthedRouteOpts, this.UpdateTheme);

  }

  /**
   * Route for /theme/fetch
   * @param request
   * @param reply
   */
  async FetchTheme(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /theme/update
   * @param request
   * @param reply
   */
  async UpdateTheme(request: FastifyRequest, reply: FastifyReply) {

  }
}
