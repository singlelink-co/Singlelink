import {DatabaseManager} from "../managers/database-manager";
import {DatabaseService} from "./base-service";

/**
 * This service takes care of transactional tasks for the Profile Controller.
 */
export class ProfileService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

}
