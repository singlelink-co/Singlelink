/*
  This is a script that manages admins in Singlelink.
  Environment vars:
  POSTGRESQL - Postgresql Connection String

  The commands are:
  admins                - list all the admins
  admin add <email>     - Add an admin with the given email
  admin remove <email>  - Remove an admin with the given email

  NPM variants:
  npm run list-admins                   - list all the admins
  npm run add-admin add <email>        - Add an admin with the given email
  npm run remove-admin remove <email>  - Remove an admin with the given email
 */

import {Pool} from "pg";
import {UserService} from "../src/services/user-service";
import {DatabaseManager} from "../src/data/database-manager";
import * as fs from "fs";

interface DbPermissionGroup {
  id: string,
  user_id: string,
  group_name: string
}

class SinglelinkManager {
  pgUrl: string;
  pool: Pool;
  databaseManager: DatabaseManager;
  userService: UserService;

  constructor() {
    this.pgUrl = process.env.POSTGRESQL ?? "";

    if (!this.pgUrl) {
      console.error("No POSTGRESQL environment variable was specified!");
      process.exit(0);
      return;
    }

    this.pool = new Pool({
      connectionString: this.pgUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });

    this.pool.on("error", client => {
      console.error(`PG Database error! ${client.name}, ${client.message}, ${client.stack}`);
    });

    this.databaseManager = new DatabaseManager();
    this.databaseManager.pool = this.pool;

    this.userService = new UserService(this.databaseManager);
  }

  async parseInput() {
    const args = process.argv;
    args.splice(0, 2);

    let command = args[0];

    switch (command) {
      case "admin":
        if (args.length < 3) {
          console.log("You need to provide the email of the user.");
        }

        if (args[1].toLowerCase() === "add") {
          await this.addAdmin(args[2]);
        } else if (args[1].toLowerCase() == "remove") {
          await this.removeAdmin(args[2]);
        } else if (args[1].toLowerCase() == "gdpr-package") {
          await this.downloadDataPackage(args[2]);
        }

        break;
      case "admins":
        await this.listAdmins();
        break;
    }

  }

  async addAdmin(email: string) {
    let userQuery = await this.pool.query("select id from app.users where email=$1", [email]);

    if (userQuery.rowCount < 1) {
      console.log("The email wasn't found in the system.");
      return;
    }

    await this.pool.query("insert into app.perm_groups(user_id, group_name) values ($1, 'admin')", [userQuery.rows[0].id]);

    console.log("Added admin with email: " + email);
  }

  async removeAdmin(email: string) {
    let userQuery = await this.pool.query("select id from app.users where email=$1", [email]);

    if (userQuery.rowCount < 1) {
      console.log("The email wasn't found in the system.");
      return;
    }

    let permQuery = await this.pool.query("delete from app.perm_groups where user_id=$1", [userQuery.rows[0].id]);

    if (permQuery.rowCount < 1) {
      console.log("The user with the given email wasn't an admin.");
      return;
    }

    console.log("Removed admin with email: " + email);
  }

  async listAdmins() {
    let permQuery = await this.pool.query<DbPermissionGroup>("select * from app.perm_groups where group_name='admin'");

    if (permQuery.rowCount < 1) {
      console.log("There are no admins. Create one with `admin add <email>`");
    }

    for (let row of permQuery.rows) {
      let user = await this.pool.query("select email from app.users where id=$1", [row.user_id]);

      if (user.rowCount > 0) {
        console.log(`${user.rows[0].email} Group: ${row.group_name} Perms: ${user.rows[0].permissions}`);
      }
    }
  }

  async downloadDataPackage(email: string) {
    let user = await this.userService.getUserByEmail(email);
    let data = await this.userService.generateDataPackage(user);

    let filename = user.id + '-data-package.json';

    fs.writeFileSync(filename, data);
  }
}

async function start() {
  let manager = new SinglelinkManager();
  await manager.parseInput();
}

// Entry point
(async () => {
  await start();

  process.exit(0);
})();
