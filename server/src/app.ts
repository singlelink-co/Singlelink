import {DatabaseManager} from "./data/database-manager";
import {SingleLinkServer} from "./singlelink-server";
import {AnalyticsController} from "./controllers/analytics-controller";
import {LinkController} from "./controllers/link-controller";
import {ProfileController} from "./controllers/profile-controller";
import {ThemeController} from "./controllers/theme-controller";
import {UserController} from "./controllers/user-controller";
import {InfoController} from "./controllers/info-controller";
import {Auth} from "./utils/auth";
import {CustomDomainHandler} from "./utils/custom-domains";
import {AdminController} from "./controllers/admin-controller";
import {PermissionController} from "./controllers/permission-controller";
import {MarketplaceController} from "./controllers/marketplace-controller";
import {AuthController} from "./controllers/auth-controller";

console.log("Initializing Singlelink");

let server: SingleLinkServer = new SingleLinkServer();
let database = new DatabaseManager();

start().then(() => {
  // do nothing
});

async function start() {
  await database.initialize();

  Auth.initialize(database.pool);
  CustomDomainHandler.initialize(database.pool);

  // SingleLink main controllers
  server.addController(new AnalyticsController(server.fastify, database));
  server.addController(new AuthController(server.fastify, database));
  server.addController(new LinkController(server.fastify, database));
  server.addController(new ProfileController(server.fastify, database));
  server.addController(new ThemeController(server.fastify, database));
  server.addController(new UserController(server.fastify, database));

  // Management controllers
  server.addController(new PermissionController(server.fastify, database));
  server.addController(new MarketplaceController(server.fastify, database));

  // Admin controllers
  server.addController(new AdminController(server.fastify, database));

  // Server utility controllers
  server.addController(new InfoController(server.fastify, database));

  server.startServer();
}
