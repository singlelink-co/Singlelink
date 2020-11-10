import {DatabaseManager} from "../managers/database-manager";
import {DatabaseService} from "./base-service";

/**
 * This service takes care of transactional tasks for the Link Controller.
 */
export class LinkService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

}
