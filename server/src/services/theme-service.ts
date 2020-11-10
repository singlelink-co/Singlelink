import {DatabaseManager} from "../managers/database-manager";
import {DatabaseService} from "./base-service";

/**
 * This service takes care of transactional tasks for the Theme Controller.
 */
export class ThemeService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

}
