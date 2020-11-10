import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Pool} from "pg";
import {AuthUtils} from "../utils/auth-utils";
import {LinkService} from "../services/link-service";
import {AnalyticsService} from "../services/analytics-service";

/**
 * This controller maps and provides for all the controllers under /link.
 */
export class LinkController implements IController {

  private fastify: FastifyInstance;
  private databaseManager: DatabaseManager;
  private pool: Pool;
  private linkService: LinkService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    this.fastify = fastify;
    this.databaseManager = databaseManager;
    this.pool = databaseManager.pool;
    this.linkService = new LinkService(databaseManager);
  }

  registerRoutes(): void {

    this.fastify.post('/link/create', AuthUtils.AuthedRouteOpts, this.CreateLink.bind(this));
    this.fastify.post('/link/update', AuthUtils.AuthedRouteOpts, this.UpdateLink.bind(this));
    this.fastify.post('/link/destroy', AuthUtils.AuthedRouteOpts, this.DestroyLink.bind(this));
    this.fastify.post('/link/reorder', AuthUtils.AuthedRouteOpts, this.ReorderLink.bind(this));
    this.fastify.post('/link/reset-order', AuthUtils.AuthedRouteOpts, this.ResetLinkOrder.bind(this));

  }

  /**
   * Route for /link/create
   *
   * Creates a new link.
   *
   * @param request
   * @param reply
   */
  async CreateLink(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /link/update
   *
   * Updates a link for a user.
   *
   * @param request
   * @param reply
   */
  async UpdateLink(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /link/destroy
   *
   * Destroys a link.
   *
   * @param request
   * @param reply
   */
  async DestroyLink(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /link/reorder
   *
   * Sets the reorder value for a link.
   *
   * @param request
   * @param reply
   */
  async ReorderLink(request: FastifyRequest, reply: FastifyReply) {

  }

  /**
   * Route for /link/reset-order
   *
   * Resets the link reorder value for a link.
   *
   * @param request
   * @param reply
   */
  async ResetLinkOrder(request: FastifyRequest, reply: FastifyReply) {

  }
}
