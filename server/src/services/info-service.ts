import {DatabaseService} from "./database-service";
import {DatabaseManager} from "../data/database-manager";

// TODO Implement server info service
export class InfoService extends DatabaseService {
  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }
}
