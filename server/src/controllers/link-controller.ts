import {FastifyInstance, FastifyReply, RequestGenericInterface, RouteHandlerMethod} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {LinkService} from "../services/link-service";
import {ReplyUtils} from "../utils/reply-utils";
import {constants as HttpStatus} from "http2";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";

interface CreateLinkRequest extends RequestGenericInterface {
  Body: {
    label?: string,
    url?: string,
    subtitle: string,
    style: string,
    customCss: string,
    useDeepLink: boolean
  }
}

interface UpdateLinkRequest extends RequestGenericInterface {
  Body: {
    id?: string,
    url: string,
    sortOrder: number,
    label: string,
    subtitle: string,
    style: string,
    customCss: string,
    useDeepLink: boolean
  }
}

interface DestroyLinkRequest extends RequestGenericInterface {
  Body: {
    id?: string
  }
}

interface ReorderLinkRequest extends RequestGenericInterface {
  Body: {
    oldIndex?: number,
    newIndex?: number
  }
}

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
    this.fastify.post('/link/create', Auth.AuthRouteOptions, <RouteHandlerMethod>this.CreateLink.bind(this));
    this.fastify.post('/link/update', Auth.AuthRouteOptions, <RouteHandlerMethod>this.UpdateLink.bind(this));
    this.fastify.post('/link/destroy', Auth.AuthRouteOptions, <RouteHandlerMethod>this.DestroyLink.bind(this));
    this.fastify.post('/link/reorder', Auth.AuthRouteOptions, <RouteHandlerMethod>this.ReorderLink.bind(this));
  }

  /**
   * Route for /link/create
   *
   * Creates a new link.
   *
   * @param request
   * @param reply
   */
  async CreateLink(request: AuthenticatedRequest<CreateLinkRequest>, reply: FastifyReply) {
    let body = request.body;
    let profile = request.profile;

    if (!body.label) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No label was provided."));
    }

    if (!body.url) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No url was provided."));
    }

    let count = await this.linkService.getProfileLinkCount(profile.id);

    let link = await this.linkService.createLink(
      profile.id,
      body.url,
      ++count,
      body.label,
      body.subtitle,
      body.style,
      body.customCss,
      body.useDeepLink
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
  async UpdateLink(request: AuthenticatedRequest<UpdateLinkRequest>, reply: FastifyReply) {
    let body = request.body;

    if (!body.id) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No id was provided."));
    }

    let link = await this.linkService.updateLink(
      body.id,
      body.url,
      body.sortOrder,
      body.label,
      body.subtitle,
      body.style,
      body.customCss,
      body.useDeepLink
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
  async DestroyLink(request: AuthenticatedRequest<DestroyLinkRequest>, reply: FastifyReply) {
    let body = request.body;

    if (!body.id) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No id was provided."));
    }

    let links = await this.linkService.deleteLink(body.id);

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
  async ReorderLink(request: AuthenticatedRequest<ReorderLinkRequest>, reply: FastifyReply) {
    if (!request.profile) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
    }

    let body = request.body;

    if (body.oldIndex !== 0 && !body.oldIndex) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No oldIndex was provided."));
    }

    if (body.newIndex !== 0 && !body.newIndex) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No newIndex was provided."));
    }

    let links = await this.linkService.reorderLinks(request.profile.id, body.oldIndex, body.newIndex);

    if (links instanceof HttpError) {
      let error: HttpError = links;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return links;
  }
}
