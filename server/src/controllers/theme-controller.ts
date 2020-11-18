import {FastifyInstance, FastifyReply, RequestGenericInterface, RouteHandlerMethod} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Auth, AuthenticatedRequest} from "../utils/auth";
import {ThemeService} from "../services/theme-service";
import {Controller} from "./controller";
import {HttpError} from "../utils/http-error";
import {ReplyUtils} from "../utils/reply-utils";
import {constants as HttpStatus} from "http2";

interface GetThemeRequest extends RequestGenericInterface {
  Body: {
    includeGlobal: boolean
  }
}

interface CreateThemeRequest extends RequestGenericInterface {
  Body: {
    label: string,
    colors: ThemeColors,
    customCss: string,
    customHtml: string
  }
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
    this.fastify.post('/theme', Auth.AuthRouteOptions, <RouteHandlerMethod>this.GetTheme.bind(this));
    this.fastify.post('/theme/create', Auth.AuthRouteOptions, <RouteHandlerMethod>this.CreateTheme.bind(this));
    this.fastify.post('/theme/update', Auth.AuthRouteOptions, <RouteHandlerMethod>this.UpdateTheme.bind(this));
  }

  /**
   * Route for /theme
   * @param request
   * @param reply
   */
  async GetTheme(request: AuthenticatedRequest<GetThemeRequest>, reply: FastifyReply) {
    let body = request.body;

    let themes = await this.themeService.listThemes(request.user.id, body.includeGlobal);

    if (themes instanceof HttpError) {
      let error: HttpError = themes;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return themes;
  }

  /**
   * Route for /theme/create
   * @param request
   * @param reply
   */
  async CreateTheme(request: AuthenticatedRequest<CreateThemeRequest>, reply: FastifyReply) {
    let body = request.body;

    if (!body.label) {
      return reply.status(HttpStatus.HTTP_STATUS_BAD_REQUEST).send(ReplyUtils.error("No label was provided."));
    }

    let theme = await this.themeService.createTheme(request.user.id, body.label, body.colors, body.customCss, body.customHtml);

    if (theme instanceof HttpError) {
      let error: HttpError = theme;
      reply.code(error.statusCode);

      return ReplyUtils.error(error.message, error);
    }

    return theme;
  }

  /**
   * Route for /theme/update
   * @param request
   * @param reply
   */
  async UpdateTheme(request: AuthenticatedRequest, reply: FastifyReply) {

    reply.code(HttpStatus.HTTP_STATUS_NOT_IMPLEMENTED);
    return ReplyUtils.error("Sorry, this is not available yet.");
  }
}
