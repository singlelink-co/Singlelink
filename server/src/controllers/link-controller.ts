import {FastifyInstance, FastifyReply, FastifyRequest, RequestGenericInterface} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {LinkService} from "../services/link-service";
import {ReplyUtils} from "../utils/reply-utils";
import {StatusCodes} from "http-status-codes";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";
import Mixpanel from "mixpanel";
import {config} from "../config/config";

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
  } & AuthenticatedRequest["Body"]
}

interface DeleteLinkRequest extends RequestGenericInterface {
  Body: {
    id?: string
  } & AuthenticatedRequest["Body"]
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
  private readonly linkService: LinkService;
  private mixpanel = Mixpanel.init(config.analytics.mixpanelToken);

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.linkService = new LinkService(databaseManager);
  }

  registerRoutes(): void {
    this.fastify.post<CreateLinkRequest>('/link/create', Auth.ValidateWithData, this.CreateLink.bind(this));
    this.fastify.post<UpdateLinkRequest>('/link/update', Auth.ValidateWithData, this.UpdateLink.bind(this));
    this.fastify.post<DeleteLinkRequest>('/link/delete', Auth.ValidateWithData, this.DeleteLink.bind(this));

    this.fastify.post<ReorderLinkRequest>('/link/reorder', Auth.ValidateWithData, this.ReorderLink.bind(this));
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
      let profile = request.body.authProfile;

      if (!profile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      if (!body.label) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No label was provided."));
        return;
      }

      if (!body.url) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No url was provided."));
        return;
      }

      let count = await this.linkService.getProfileLinkCount(profile.id);

      let link = await this.linkService.createLink(
        profile.id,
        body.url,
        count,
        body.label,
        body.subtitle,
        body.style,
        body.customCss,
        body.useDeepLink
      );

      this.mixpanel.track('profile link created', {
        distinct_id: profile.userId,
        profile: profile.id,
        link: link.id,
        url: link.url
      });

      return link;
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
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No id was provided."));
        return;
      }

      await Auth.checkLinkOwnership(this.linkService, body.id, body.authProfile);

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

      this.mixpanel.track('profile link updated', {
        distinct_id: body.authUser.id,
        profile: body.authProfile.id,
        link: link.id,
        url: link.url
      });

      return link;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /link/delete
   *
   * Deletes a link.
   *
   * @param request
   * @param reply
   */
  async DeleteLink(request: FastifyRequest<DeleteLinkRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.id) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No id was provided."));
        return;
      }

      await Auth.checkLinkOwnership(this.linkService, body.id, body.authProfile);

      let link = await this.linkService.deleteLink(body.id);

      this.mixpanel.track('profile link deleted', {
        distinct_id: body.authUser.id,
        profile: body.authProfile.id,
        link: body.id
      });

      return link;
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

      if (!body.authProfile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      if (body.oldIndex !== 0 && !body.oldIndex) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No oldIndex was provided."));
        return;
      }

      if (body.newIndex !== 0 && !body.newIndex) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No newIndex was provided."));
        return;
      }

      let links = await this.linkService.reorderLinks(body.authProfile.id, body.oldIndex, body.newIndex);

      this.mixpanel.track('profile links reordered', {
        distinct_id: body.authUser.id,
        profile: body.authProfile.id,
      });

      return links;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
