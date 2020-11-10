import {DatabaseManager} from "./data/database-manager";
import {SingleLinkServer} from "./singlelink-server";
import {AnalyticsController} from "./controllers/analytics-controller";
import {LinkController} from "./controllers/link-controller";
import {ProfileController} from "./controllers/profile-controller";
import {ThemeController} from "./controllers/theme-controller";
import {UserController} from "./controllers/user-controller";
import {VisitController} from "./controllers/visit-controller";

console.log("Initializing Singlelink");

let server: SingleLinkServer = new SingleLinkServer();
let database = new DatabaseManager();

start().then(() => {
  console.log("Neutron Capture Enterprise is listening for requests!");
});

async function start() {
  await database.initialize();

  server.addController(new AnalyticsController(server.fastify, database));
  server.addController(new LinkController(server.fastify, database));
  server.addController(new ProfileController(server.fastify, database));
  server.addController(new ThemeController(server.fastify, database));
  server.addController(new UserController(server.fastify, database));
  server.addController(new VisitController(server.fastify, database));

  server.startServer();
}
