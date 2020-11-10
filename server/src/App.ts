import {DatabaseManager} from "./server/database-manager";
import {SingleLinkServer} from "./server/singlelink-server";
import {AnalyticsRouter} from "./routes/analytics-router";
import {LinkRouter} from "./routes/link-router";
import {ProfileRouter} from "./routes/profile-router";
import {ThemeRouter} from "./routes/theme-router";
import {UserRouter} from "./routes/user-router";
import {VisitRouter} from "./routes/visit-router";

console.log("Initializing Singlelink");

let server: SingleLinkServer = new SingleLinkServer();
let database = new DatabaseManager();

start().then(() => {
  console.log("Neutron Capture Enterprise is listening for requests!");
});

async function start() {
  await database.initialize();

  server.addRouter(new AnalyticsRouter(server.fastify, database));
  server.addRouter(new LinkRouter(server.fastify, database));
  server.addRouter(new ProfileRouter(server.fastify, database));
  server.addRouter(new ThemeRouter(server.fastify, database));
  server.addRouter(new UserRouter(server.fastify, database));
  server.addRouter(new VisitRouter(server.fastify, database));

  server.startServer();
}
