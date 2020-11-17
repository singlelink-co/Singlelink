import {FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {LinkService} from "../services/link-service";
import {ReplyUtils} from "../utils/reply-utils";
import {constants as HttpStatus} from "http2";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";

/**
 * This controller maps and provides for all the controllers under /link.
 */
export class LinkController extends Controller {
  private linkService: LinkService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.linkService = new LinkService(databaseManager);
  }

  registerRoutes(): void {
    this.fastify.post('/link/create', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.CreateLink.bind(this));
    this.fastify.post('/link/list', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.CreateLink.bind(this));
    this.fastify.post('/link/update', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.UpdateLink.bind(this));
    this.fastify.post('/link/destroy', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.DestroyLink.bind(this));
    this.fastify.post('/link/reorder', Auth.AuthedRouteOpts, <RouteHandlerMethod>this.ReorderLink.bind(this));
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

    if (!json.label) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No label was provided."));
    }

    if (!json.url) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No url was provided."));
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

    if (link instanceof HttpError) {
      let error: HttpError = link;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
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
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No id was provided."));
    }

    let link = await this.linkService.updateLink(
      json.id,
      json.url,
      json.sort_order,
      json.label,
      json.subtitle,
      json.style,
      json.custom_css,
      json.use_deep_link
    );

    if (link instanceof HttpError) {
      let error: HttpError = link;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
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
    let json: any = request.body;

    if (!json.id) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No id was provided."));
    }

    let links = await this.linkService.deleteLink(json.id);

    if (links instanceof HttpError) {
      let error: HttpError = links;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return links;
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
    if (!request.profile) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
    }

    let json: any = request.body;

    if (json.oldIndex !== 0 && !json.oldIndex) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No oldIndex was provided."));
    }

    if (json.newIndex !== 0 && !json.newIndex) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No newIndex was provided."));
    }

    let links = await this.linkService.reorderLinks(request.profile.id, json.oldIndex, json.newIndex);

    if (links instanceof HttpError) {
      let error: HttpError = links;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return links;
  }
}
