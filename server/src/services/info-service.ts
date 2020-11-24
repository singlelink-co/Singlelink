import {DatabaseService} from "./database-service";
import {DatabaseManager} from "../data/database-manager";

const packageJson = require('../../package.json');

export class InfoService extends DatabaseService {
  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

  /**
   * Returns the version number of this server.
   */
  getVersion(): number {
    return packageJson.version;
  }
}
