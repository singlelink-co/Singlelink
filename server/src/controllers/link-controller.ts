import {FastifyInstance, FastifyReply, FastifyRequest, RequestGenericInterface} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {AuthenticatedRequest, AuthOpts} from "../utils/auth";
import {LinkService} from "../services/link-service";
import {ReplyUtils} from "../utils/reply-utils";
import {constants as HttpStatus} from "http2";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";

interface CreateLinkRequest extends AuthenticatedRequest {
  Body: {
    label?: string,
    url?: string,
    subtitle: string,
    style: string,
    customCss: string,
    useDeepLink: boolean
  } & AuthenticatedRequest["Body"]
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

interface ReorderLinkRequest extends AuthenticatedRequest {
  Body: {
    oldIndex?: number,
    newIndex?: number
  } & AuthenticatedRequest["Body"]
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
    this.fastify.post<CreateLinkRequest>('/link/create', AuthOpts.ValidateWithData, this.CreateLink.bind(this));
    this.fastify.post<UpdateLinkRequest>('/link/update', AuthOpts.ValidateOnly, this.UpdateLink.bind(this));
    this.fastify.post<DestroyLinkRequest>('/link/destroy', AuthOpts.ValidateOnly, this.DestroyLink.bind(this));

    this.fastify.post<ReorderLinkRequest>('/link/reorder', AuthOpts.ValidateWithData, this.ReorderLink.bind(this));
  }

  /**
   * Route for /link/create
   *
   * Creates a new link.
   *
   * @param request
   * @param reply
   */
  async CreateLink(request: FastifyRequest<CreateLinkRequest>, reply: FastifyReply) {
    try {
      let body = request.body;
      let profile = request.body.profile;

      if (!profile) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

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
  async UpdateLink(request: FastifyRequest<UpdateLinkRequest>, reply: FastifyReply) {
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
  async DestroyLink(request: FastifyRequest<DestroyLinkRequest>, reply: FastifyReply) {
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
  async ReorderLink(request: FastifyRequest<ReorderLinkRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.profile) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      if (body.oldIndex !== 0 && !body.oldIndex) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No oldIndex was provided."));
        return;
      }

      if (body.newIndex !== 0 && !body.newIndex) {
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No newIndex was provided."));
        return;
      }

      return await this.linkService.reorderLinks(body.profile.id, body.oldIndex, body.newIndex);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
