import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserService} from "../services/user-service";
import {DatabaseManager} from "../data/database-manager";
import {Pool} from "pg";
import {Auth} from "../utils/auth";
import {ThemeService} from "../services/theme-service";

/**
 * This controller maps and provides for all the controllers under /theme.
 */
export class ThemeController implements Controller {
  private readonly userManager: UserService;

  private fastify: FastifyInstance;
  private databaseManager: DatabaseManager;
  private pool: Pool;
  private themeService: ThemeService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    this.fastify = fastify;
    this.databaseManager = databaseManager;
    this.pool = databaseManager.pool;
    this.userManager = new UserService(databaseManager);
    this.themeService = new ThemeService(databaseManager);
  }

  registerRoutes(): void {
    this.fastify.post('/theme/fetch', Auth.AuthedRouteOpts, this.FetchTheme.bind(this));
    this.fastify.post('/theme/update', Auth.AuthedRouteOpts, this.UpdateTheme.bind(this));
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
