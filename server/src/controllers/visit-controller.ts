import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {Auth} from "../utils/auth";
import {VisitService} from "../services/visit-service";
import {Controller} from "./controller";

/**
 * This controller maps and provides for all the controllers under /visit.
 */
export class VisitController extends Controller {
  private visitService: VisitService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.visitService = new VisitService(databaseManager);
  }

  registerRoutes(): void {
    this.fastify.all('/visit/fetch', Auth.AuthedRouteOpts, this.FetchVisit.bind(this));
  }

  /**
   * Route for /visit/fetch
   * @param request
   * @param reply
   */
  async FetchVisit(request: FastifyRequest, reply: FastifyReply) {

  }
}
