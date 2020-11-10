import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserService} from "../services/user-service";
import {DatabaseManager} from "../managers/database-manager";
import {Pool} from "pg";
import {AuthUtils} from "../utils/auth-utils";
import {LinkService} from "../services/link-service";
import {ThemeService} from "../services/theme-service";
import {ProfileService} from "../services/profile-service";

/**
 * This controller maps and provides for all the controllers under /theme.
 */
export class ThemeController implements IController {
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

    this.fastify.post('/theme/fetch', AuthUtils.AuthedRouteOpts, this.FetchTheme.bind(this));
    this.fastify.post('/theme/update', AuthUtils.AuthedRouteOpts, this.UpdateTheme.bind(this));

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
