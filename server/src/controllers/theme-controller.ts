import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {AuthenticatedRequest, AuthOpts} from "../utils/auth";
import {ThemeService} from "../services/theme-service";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";
import {ReplyUtils} from "../utils/reply-utils";
import {constants as HttpStatus} from "http2";

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
    this.fastify.post('/theme/update', AuthOpts.ValidateOnly, this.UpdateTheme.bind(this));
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
        reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No label was provided."));
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
  async UpdateTheme(request: FastifyRequest, reply: FastifyReply) {
    try {
      reply.code(HttpStatus.HTTP_STATUS_NOT_IMPLEMENTED);

      return ReplyUtils.error("Sorry, this is not available yet.");
    } catch (e) {
      if (e instanceof HttpError) {
        reply.code(e.statusCode);
        return ReplyUtils.error(e.message, e);
      }

      throw e;
    }
  }
}
