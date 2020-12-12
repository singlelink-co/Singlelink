import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {AuthenticatedRequest, AuthOpts} from "../utils/auth";
import {ThemeService} from "../services/theme-service";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";
import {ReplyUtils} from "../utils/reply-utils";
import {StatusCodes} from "http-status-codes";

interface GetThemeRequest extends AuthenticatedRequest {
  Body: {
    includeGlobal: boolean
  } & AuthenticatedRequest["Body"]
}

interface CreateThemeRequest extends AuthenticatedRequest {
  Body: {
    label: string,
    colors: ThemeColors,
    customCss: string,
    customHtml: string
  } & AuthenticatedRequest["Body"]
}

interface UpdateThemeRequest extends AuthenticatedRequest {
  Body: {
    id: string,
    label: string,
    colors: ThemeColors,
    customCss: string,
    customHtml: string
  } & AuthenticatedRequest["Body"]
}


interface DeleteThemeRequest extends AuthenticatedRequest {
  Body: {
    id: string,
  } & AuthenticatedRequest["Body"]
}

interface SetGlobalRequest extends AuthenticatedRequest {
  Body: {
    id: string,
    global: boolean
  } & AuthenticatedRequest["Body"]
}

interface SetUserIdRequest extends AuthenticatedRequest {
  Body: {
    id: string,
    userId: string
  } & AuthenticatedRequest["Body"]
}

/**
 * This controller maps and provides for all the controllers under /theme.
 */
export class ThemeController extends Controller {
  private themeService: ThemeService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.themeService = new ThemeService(databaseManager);
  }

  registerRoutes(): void {
    this.fastify.post<GetThemeRequest>('/theme', AuthOpts.ValidateWithData, this.GetTheme.bind(this));
    this.fastify.post<CreateThemeRequest>('/theme/create', AuthOpts.ValidateWithData, this.CreateTheme.bind(this));
    this.fastify.post<UpdateThemeRequest>('/theme/update', AuthOpts.ValidateWithData, this.UpdateTheme.bind(this));
    this.fastify.post<DeleteThemeRequest>('/theme/delete', AuthOpts.ValidateWithData, this.DeleteTheme.bind(this));

    //TODO: Add permissions authentication for these endpoints, disable for now

    // this.fastify.post<SetGlobalRequest>('/theme/set-global', AuthOpts.ValidateOnly, this.SetGlobal.bind(this));
    // this.fastify.post<SetUserIdRequest>('/theme/set-user-id', AuthOpts.ValidateOnly, this.SetUserId.bind(this));
  }

  /**
   * Route for /theme
   * @param request
   * @param reply
   */
  async GetTheme(request: FastifyRequest<GetThemeRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      return await this.themeService.listThemes(body.user.id, body.includeGlobal);
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

      return await this.themeService.createTheme(body.user.id, body.label, body.colors, body.customCss, body.customHtml);
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

      return await this.themeService.updateTheme(body.id, body.user.id, body.label, body.colors, body.customCss, body.customHtml);
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
      let body = request.body;

      return await this.themeService.deleteTheme(body.id, body.user.id);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }

  /**
   * Route for /theme/set-global
   * @param request
   * @param reply
   */
  async SetGlobal(request: FastifyRequest<SetGlobalRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      return await this.themeService.setGlobal(body.id, body.global);
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
  async SetUserId(request: FastifyRequest<SetUserIdRequest>, reply: FastifyReply) {
    try {
      let body = request.body;

      return await this.themeService.setUserId(body.id, body.userId);
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
