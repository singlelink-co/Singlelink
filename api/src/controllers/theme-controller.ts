import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {AdminRequest, Auth, AuthenticatedRequest} from "../utils/auth";
import {ThemeService} from "../services/theme-service";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";
import {ReplyUtils} from "../utils/reply-utils";
import {StatusCodes} from "http-status-codes";
import Mixpanel from "mixpanel";
import {config} from "../config/config";
import {MarketplaceService} from "../services/marketplace-service";
import {IpUtils} from "../utils/ip-utils";

interface GetThemeRequest extends AuthenticatedRequest {
  Body: {
    includeGlobal: boolean,
    onlyGlobal: boolean
  } & AuthenticatedRequest["Body"]
}

interface CreateThemeRequest extends AuthenticatedRequest {
  Body: {
    label: string,
    colors: Theme["colors"],
    customCss: string,
    customHtml: string
  } & AuthenticatedRequest["Body"]
}

interface UpdateThemeRequest extends AuthenticatedRequest {
  Body: {
    id: string,
    label: string,
    colors: Theme["colors"],
    customCss: string,
    customHtml: string
  } & AuthenticatedRequest["Body"]
}


interface DeleteThemeRequest extends AuthenticatedRequest {
  Body: {
    id: string,
  } & AuthenticatedRequest["Body"]
}

interface SetGlobalRequest extends AdminRequest {
  Body: {
    id: string,
    global: boolean
  } & AdminRequest["Body"]
}

interface SetUserIdRequest extends AdminRequest {
  Body: {
    id: string,
    userId: string
  } & AdminRequest["Body"]
}

/**
 * This controller maps and provides for all the controllers under /theme.
 */
export class ThemeController extends Controller {
  private readonly themeService: ThemeService;
  private readonly marketplaceService: MarketplaceService;
  private readonly mixpanel = config.analytics.mixpanelToken ? Mixpanel.init(config.analytics.mixpanelToken) : null;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.themeService = new ThemeService(databaseManager);
    this.marketplaceService = new MarketplaceService(databaseManager);

  }

  registerRoutes(): void {
    // Authenticated
    this.fastify.post<GetThemeRequest>('/themes', Auth.ValidateWithData, this.GetThemes.bind(this));
    this.fastify.post<CreateThemeRequest>('/theme/create', Auth.ValidateWithData, this.CreateTheme.bind(this));
    this.fastify.post<UpdateThemeRequest>('/theme/update', Auth.ValidateWithData, this.UpdateTheme.bind(this));
    this.fastify.post<DeleteThemeRequest>('/theme/delete', Auth.ValidateWithData, this.DeleteTheme.bind(this));

    // Admin Authenticated
    this.fastify.post<SetGlobalRequest>('/theme/admin/set-global', Auth.ValidateAdminWithData, this.AdminSetGlobal.bind(this));
    this.fastify.post<SetUserIdRequest>('/theme/admin/set-user-id', Auth.ValidateAdminWithData, this.AdminSetUserId.bind(this));
    this.fastify.post<UpdateThemeRequest>('/theme/admin/update', Auth.ValidateAdminWithData, this.AdminUpdateTheme.bind(this));
    this.fastify.post<DeleteThemeRequest>('/theme/admin/delete', Auth.ValidateAdminWithData, this.AdminDeleteTheme.bind(this));
  }

  /**
   * Route for /themes
   * @param request
   * @param reply
   */
  async GetThemes(request: FastifyRequest<GetThemeRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (body.onlyGlobal) {
        return this.themeService.listGlobalThemes();
      } else {
        return this.themeService.listUserThemes(body.authUser.id, body.includeGlobal);
      }
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /theme/create
   * @param request
   * @param reply
   */
  async CreateTheme(request: FastifyRequest<CreateThemeRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.label) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No label was provided."));
        return;
      }

      let theme = await this.themeService.createTheme(body.authUser.id, body.label, body.colors, body.customCss, body.customHtml);

      if (this.mixpanel) {
        let ips = IpUtils.GrabIps(request);

        this.mixpanel.track('new theme created', {
          distinct_id: request.body.authUser.id,
          $ip: ips,
          theme: theme.id,
          themeObject: theme
        });
      }

      return theme;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /theme/update
   * @param request
   * @param reply
   */
  async UpdateTheme(request: FastifyRequest<UpdateThemeRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.label) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No label was provided."));
        return;
      }

      let theme = await this.themeService.updateUserTheme(body.id, body.authUser.id, body.label, body.colors, body.customCss, body.customHtml);

      if (this.mixpanel) {
        let ips = IpUtils.GrabIps(request);

        this.mixpanel.track('theme updated', {
          distinct_id: request.body.authUser.id,
          $ip: ips,
          theme: theme.id,
          themeObject: theme
        });
      }

      return theme;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /theme/delete
   * @param request
   * @param reply
   */
  async DeleteTheme(request: FastifyRequest<DeleteThemeRequest>, reply: FastifyReply) {
    try {
      let user = request.body.authUser;
      let id = request.body.id;

      let addons = await this.marketplaceService.getAuthoredAddons(request.body.authUser.id);

      for (let addon of addons) {
        if (addon.type == "theme" && addon.id == id) {
          reply.code(StatusCodes.FORBIDDEN);
          return ReplyUtils.error("Sorry, but you cannot delete a theme that is on the marketplace!");
        }
      }

      let deletedTheme = await this.themeService.deleteUserTheme(id, user.id);

      if (this.mixpanel) {
        let ips = IpUtils.GrabIps(request);

        this.mixpanel.track('theme deleted', {
          distinct_id: request.body.authUser.id,
          $ip: ips,
          theme: deletedTheme.id,
          themeObject: deletedTheme
        });

      }

      return deletedTheme;
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  // region Admin Routes

  /**
   * Route for /theme/set-global
   * @param request
   * @param reply
   */
  async AdminSetGlobal(request: FastifyRequest<SetGlobalRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      return this.themeService.setGlobal(body.id, body.global);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /theme/set-user-id
   * @param request
   * @param reply
   */
  async AdminSetUserId(request: FastifyRequest<SetUserIdRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      return this.themeService.setUserId(body.id, body.userId);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /theme/admin/update
   * @param request
   * @param reply
   */
  async AdminUpdateTheme(request: FastifyRequest<UpdateThemeRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      if (!body.label) {
        reply.status(StatusCodes.BAD_REQUEST).send(ReplyUtils.error("No label was provided."));
        return;
      }

      return this.themeService.updateTheme(body.id, body.label, body.colors, body.customCss, body.customHtml);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /theme/admin/update
   * @param request
   * @param reply
   */
  async AdminDeleteTheme(request: FastifyRequest<DeleteThemeRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      return this.themeService.deleteTheme(body.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  // endregion
}
