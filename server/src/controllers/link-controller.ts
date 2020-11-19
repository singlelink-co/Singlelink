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
    try {
      let body = request.body;
      let profile = request.profile;

      if (!body.label) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No label was provided."));
        return;
      }

      if (!body.url) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No url was provided."));
        return;
      }

      let count = await this.linkService.getProfileLinkCount(profile.id);

      return await this.linkService.createLink(
        profile.id,
        body.url,
        ++count,
        body.label,
        body.subtitle,
        body.style,
        body.customCss,
        body.useDeepLink
      );
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
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
    try {
      let body = request.body;

      if (!body.id) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No id was provided."));
        return;
      }

      return await this.linkService.updateLink(
        body.id,
        body.url,
        body.sortOrder,
        body.label,
        body.subtitle,
        body.style,
        body.customCss,
        body.useDeepLink
      );
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
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
    try {
      let body = request.body;

      if (!body.id) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No id was provided."));
        return;
      }

      return await this.linkService.deleteLink(body.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
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
    try {
      if (!request.profile) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      let body = request.body;

      if (body.oldIndex !== 0 && !body.oldIndex) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No oldIndex was provided."));
        return;
      }

      if (body.newIndex !== 0 && !body.newIndex) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No newIndex was provided."));
        return;
      }

      return await this.linkService.reorderLinks(request.profile.id, body.oldIndex, body.newIndex);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
