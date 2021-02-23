import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Controller} from "./controller";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {ReplyUtils} from "../utils/reply-utils";
import {HttpError} from "../utils/http-error";
import {MarketplaceService} from "../services/marketplace-service";
import {config} from "../config/config";
import Mixpanel from "mixpanel";
import {StatusCodes} from "http-status-codes";

interface MarketplaceListingRequest extends AuthenticatedRequest {
  Body: {
    page?: number,
    limit?: number
  } & AuthenticatedRequest["Body"]
}

interface GetAddonRequest extends AuthenticatedRequest {
  Params: {
    id: string
  }
}

interface CreateAddonRequest extends AuthenticatedRequest {
  Body: {
    id: string
  } & AuthenticatedRequest["Body"]
}

interface UpdateAddonRequest extends AuthenticatedRequest {
  Body: {
    id: string
  } & AuthenticatedRequest["Body"]
}

interface DeleteAddonRequest extends AuthenticatedRequest {
  Body: {
    id: string
  } & AuthenticatedRequest["Body"]
}

/**
 * This controller maps and provides for all the controllers under /admin.
 */
export class MarketplaceController extends Controller {
  private marketplaceService: MarketplaceService;
  private mixpanel = config.analytics.mixpanelToken ? Mixpanel.init(config.analytics.mixpanelToken) : null;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.marketplaceService = new MarketplaceService(databaseManager);
  }

  registerRoutes(): void {
    // Authenticated
    this.fastify.all<MarketplaceListingRequest>('/marketplace/addons', Auth.ValidateWithData, this.ListAddons.bind(this));

    this.fastify.all<GetAddonRequest>('/marketplace/addon/:id', Auth.ValidateWithData, this.GetAddon.bind(this));
    this.fastify.all<CreateAddonRequest>('/marketplace/addon/create', Auth.ValidateWithData, this.CreateAddon.bind(this));
    this.fastify.all<UpdateAddonRequest>('/marketplace/addon/update', Auth.ValidateWithData, this.UpdateAddon.bind(this));
    this.fastify.all<DeleteAddonRequest>('/marketplace/addon/delete', Auth.ValidateWithData, this.DeleteAddon.bind(this));
  }

  /**
   * Route for /marketplace/addons
   *
   * @param request
   * @param reply
   * @constructor
   */
  async ListAddons(request: FastifyRequest<MarketplaceListingRequest>, reply: FastifyReply) {
    try {
      let page = request.body.page;
      let limit = request.body.limit;

      if (this.mixpanel)
        this.mixpanel.track('user listed addons', {
          distinct_id: request.body.authUser.id,
        });

      return this.marketplaceService.listAddons(request.body.authUser.id, page, limit);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /marketplace/addon/:id
   *
   * @param request
   * @param reply
   * @constructor
   */
  async GetAddon(request: FastifyRequest<GetAddonRequest>, reply: FastifyReply) {
    try {
      if (this.mixpanel)
        this.mixpanel.track('addon viewed', {
          distinct_id: request.body.authUser.id,
        });

      return this.marketplaceService.getAddon(request.params.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  // TODO: Implement marketplace
  /**
   * Route for /marketplace/addon/create
   *
   * @param request
   * @param reply
   * @constructor
   */
  async CreateAddon(request: FastifyRequest<CreateAddonRequest>, reply: FastifyReply) {
    try {
      reply.code(StatusCodes.NOT_IMPLEMENTED);

      // this.mixpanel.track('addon created', {
      //   distinct_id: request.body.id,
      // });

      return ReplyUtils.error("Sorry, this is not implemented yet.");
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  // TODO: Implement marketplace
  /**
   * Route for /marketplace/addon/update
   *
   * @param request
   * @param reply
   * @constructor
   */
  async UpdateAddon(request: FastifyRequest<UpdateAddonRequest>, reply: FastifyReply) {
    try {
      reply.code(StatusCodes.NOT_IMPLEMENTED);

      // this.mixpanel.track('addon updated', {
      //   distinct_id: request.body.id,
      // });

      return ReplyUtils.error("Sorry, this is not implemented yet.");
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  // TODO: Implement marketplace
  /**
   * Route for /marketplace/addon/delete
   *
   * @param request
   * @param reply
   * @constructor
   */
  async DeleteAddon(request: FastifyRequest<DeleteAddonRequest>, reply: FastifyReply) {
    try {
      reply.code(StatusCodes.NOT_IMPLEMENTED);

      // this.mixpanel.track('addon deleted', {
      //   distinct_id: request.body.id,
      // });

      return ReplyUtils.error("Sorry, this is not implemented yet.");
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }


}
