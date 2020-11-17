import {FastifyInstance, FastifyReply, RouteHandlerMethod} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {ThemeService} from "../services/theme-service";
import {Controller} from "./controller";

/**
 * This controller maps and provides for all the controllers under /theme.
 */
export class ThemeController extends Controller {
  private themeService: ThemeService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.themeService = new ThemeService(databaseManager);
  }

  registerRoutes(): void {
    this.fastify.post('/theme/fetch', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.FetchTheme.bind(this));
    this.fastify.post('/theme/update', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.UpdateTheme.bind(this));
  }

  /**
   * Route for /theme/fetch
   * @param request
   * @param reply
   */
  async FetchTheme(request: AuthenticatedRequest, reply: FastifyReply) {

  }

  /**
   * Route for /theme/update
   * @param request
   * @param reply
   */
  async UpdateTheme(request: AuthenticatedRequest, reply: FastifyReply) {

  }
}
