import {DatabaseService} from "./database-service";
import {DatabaseManager} from "../data/database-manager";

export class PermissionService extends DatabaseService {

  constructor(databaseManager: DatabaseManager) {
    super(databaseManager);
  }

}
