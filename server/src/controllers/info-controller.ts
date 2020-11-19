import {Controller} from "./controller";
import {FastifyInstance} from "fastify";
import {DatabaseManager} from "../data/database-manager";
import {InfoService} from "../services/info-service";

// TODO Implement server info controller
/**
 * This controller maps and provides for all the controllers under /info.
 */
export class InfoController extends Controller {
  private infoService: InfoService;

  constructor(fastify: FastifyInstance, databaseManager: DatabaseManager) {
    super(fastify, databaseManager);

    this.infoService = new InfoService(databaseManager);
  }

  registerRoutes(): void {

  }
}
