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
    link: Pick<Link, 'label' | 'url'> & Partial<Link>
  } & AuthenticatedRequest["Body"]
}

interface UpdateLinkRequest extends RequestGenericInterface {
  Body: {
    link: Pick<Link, 'id'> & Partial<Link>
  } & AuthenticatedRequest["Body"]
}

interface DeleteLinkRequest extends RequestGenericInterface {
  Body: {
    id: string
  } & AuthenticatedRequest["Body"]
}

interface ReorderLinkRequest extends AuthenticatedRequest {
  Body: {
    oldIndex: number,
    newIndex: number
  } & AuthenticatedRequest["Body"]
}

/**
 * This controller maps and provides for all the controllers under /link.
 */
export class LinkController extends Controller {
  private readonly linkService: LinkService;
  private readonly mixpanel = config.analytics.mixpanelToken ? Mixpanel.init(config.analytics.mixpanelToken) : null;

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
      let profile = request.body.authProfile;
      let link = request.body.link;

      if (!profile) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("This account doesn't have an active profile."));
        return;
      }

      // ignore profileId field if set and replace with our own
      link.profileId = request.body.authProfile.id;

      if (!link.sortOrder) {
        link.sortOrder = await this.linkService.getProfileLinkCount(profile.id);
      }

      let newLink = await this.linkService.createLink(link);

      if (this.mixpanel)
        this.mixpanel.track('profile link created', {
          distinct_id: profile.userId,
          $ip: request.ip,
          profile: profile.id,
          link: newLink.id,
          url: newLink.url
        });

      return newLink;
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
      let profile = request.body.authProfile;
      let link = request.body.link;

      // ignore profileId field if set and replace with our own
      link.profileId = request.body.authProfile.id;

      if (!await Auth.checkLinkOwnership(this.linkService, link.id, profile)) {
        return ReplyUtils.errorOnly(new HttpError(StatusCodes.UNAUTHORIZED, "The profile isn't authorized to access the requested resource"));
      }

      let newLink = await this.linkService.updateLink(link);

      if (this.mixpanel)
        this.mixpanel.track('profile link updated', {
          distinct_id: request.body.authUser.id,
          $ip: request.ip,
          profile: profile.id,
          link: newLink.id,
          url: newLink.url
        });

      return newLink;
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

      if (!await Auth.checkLinkOwnership(this.linkService, body.id, body.authProfile)) {
        return ReplyUtils.errorOnly(new HttpError(StatusCodes.UNAUTHORIZED, "The profile isn't authorized to access the requested resource"));
      }

      let link = await this.linkService.deleteLink(body.id);

      if (this.mixpanel)
        this.mixpanel.track('profile link deleted', {
          distinct_id: body.authUser.id,
          $ip: request.ip,
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

      let links = await this.linkService.reorderLinks(body.authProfile.id, body.oldIndex, body.newIndex);

      if (this.mixpanel)
        this.mixpanel.track('profile links reordered', {
          distinct_id: body.authUser.id,
          $ip: request.ip,
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
