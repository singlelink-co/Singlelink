import {DatabaseManager} from "../data/database-manager";
import {DatabaseService} from "./database-service";

/**
 * This service takes care of transactional tasks for the Visit Controller.
 */
export class VisitService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

}
