import {FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Pool} from "pg";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {LinkService} from "../services/link-service";
import {ReplyUtils} from "../utils/reply-utils";

/**
 * This controller maps and provides for all the controllers under /link.
 */
export class LinkController implements Controller {

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
    this.fastify.post('/link/create', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.CreateLink.bind(this));
    this.fastify.post('/link/update', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.UpdateLink.bind(this));
    this.fastify.post('/link/destroy', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.DestroyLink.bind(this));
    this.fastify.post('/link/reorder', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.ReorderLink.bind(this));
    this.fastify.post('/link/reset-order', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.ResetLinkOrder.bind(this));
  }

  /**
   * Route for /link/create
   *
   * Creates a new link.
   *
   * @param request
   * @param reply
   */
  async CreateLink(request: AuthenticatedRequest, reply: FastifyReply) {
    let json: any = request.body;
    let profile = request.profile;

    reply.type("application/json");

    if (!json.label) {
      return reply.status(400).send(ReplyUtils.error("No label was provided."));
    }

    if (!json.url) {
      return reply.status(400).send(ReplyUtils.error("No url was provided."));
    }

    let count = await this.linkService.getProfileLinkCount(profile.id);

    let link = await this.linkService.createLink(
      profile.id,
      json.url,
      ++count,
      json.label,
      json.subtitle,
      json.style,
      json.custom_css,
      json.use_deep_link
    );

    if (!link) {
      return reply.status(500).send(ReplyUtils.error("There was a problem while trying to save the link."));
    }

    return link;
  }

  /**
   * Route for /link/update
   *
   * Updates a link for a user.
   *
   * @param request
   * @param reply
   */
  async UpdateLink(request: AuthenticatedRequest, reply: FastifyReply) {
    let json: any = request.body;

    if (!json.id) {
      return reply.status(400).send(ReplyUtils.error("No id was provided."));
    }

    let link = await this.linkService.updateLink(
      json.id,
      json.url,
      json.order,
      json.label,
      json.subtitle,
      json.style,
      json.custom_css,
      json.use_deep_link
    );

    if (!link) {
      return reply.status(500).send(ReplyUtils.error("There was a problem while trying to save the link."));
    }

    return link;
  }

  /**
   * Route for /link/destroy
   *
   * Destroys a link.
   *
   * @param request
   * @param reply
   */
  async DestroyLink(request: AuthenticatedRequest, reply: FastifyReply) {

  }

  /**
   * Route for /link/reorder
   *
   * Sets the reorder value for a link.
   *
   * @param request
   * @param reply
   */
  async ReorderLink(request: AuthenticatedRequest, reply: FastifyReply) {

  }

  /**
   * Route for /link/reset-order
   *
   * Resets the link reorder value for a link.
   *
   * @param request
   * @param reply
   */
  async ResetLinkOrder(request: AuthenticatedRequest, reply: FastifyReply) {

  }
}
