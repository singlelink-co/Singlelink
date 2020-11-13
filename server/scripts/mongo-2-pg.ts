/*
  This is a conversion script meant to convert an old SingleLink MongoDB server to a PostgreSQL database.
  It requires two environment variables:
  MONGODB - The url to connect to MongoDB
  POSTGRESQL - The url that will be used to connect to PostgreSQL
 */

import readline from "readline";
import mongoose from "mongoose";
import {Pool} from "pg";
import fs from "fs";

const User = require('./models/User');
const Profile = require('./models/Profile');
const Link = require('./models/Link');
const Theme = require('./models/Theme');
const Visit = require('./models/Visit');

class Converter {
  mongoDbUrl: string;
  pgUrl: string;
  pool: Pool;

  constructor() {
    this.mongoDbUrl = process.env.MONGODB ?? "";
    this.pgUrl = process.env.POSTGRESQL ?? "";

    if (!this.mongoDbUrl) {
      console.error("No MONGODB environment variable was specified!");
      process.exit(0);
      return;
    }

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

    console.log("Pooled PostgreSQL.");

    this.pool.on("error", client => {
      console.error(`PG Database error! ${client.name}, ${client.message}, ${client.stack}`);
    });
  }

  async setup() {
    try {
      console.log("Connecting to MongoDB");

      await mongoose.connect(this.mongoDbUrl,
        {
          useNewUrlParser: true
        });

      console.log("Databases ready.");
    } catch (err) {
      console.log('Error connecting to MongoDB');
      console.log(err);
    }
  }

  async convert() {
    try {
      console.log("Setup PostgreSQL database...");

      console.log("Truncating PostgreSQL database, wiping it clean...");

      // language=PostgreSQL
      let truncateQuery = "drop table users.accounts, users.links, users.profiles, users.themes, history.visits cascade";
      await this.pool.query(truncateQuery);

      let sql = fs.readFileSync(`${__dirname}/../src/sql/setup-database.sql`).toString();
      await this.pool.query(sql);

      console.log("Done.");

      console.log("Finding users...");
      let mongoAccounts = await User.find().populate("active_profile").exec();

      console.log("Finding themes...");
      let mongoThemes = await Theme.find().exec();

      console.log("Finding profiles...");
      let mongoProfiles = await Profile.find().exec();

      console.log("Finding links...");
      let mongoLinks = await Link.find().exec();

      console.log("Finding visits...");
      let mongoVisits = await Visit.find().exec();

      let pgAccounts: any[] = [];
      let pgThemes: any[] = [];
      let pgProfiles: any[] = [];
      let pgLinks: any[] = [];

      let accountQueries: (() => Promise<void>)[] = [];
      let themeQueries: (() => Promise<void>)[] = [];
      let profileQueries: (() => Promise<void>)[] = [];
      let linkQueries: (() => Promise<void>)[] = [];
      let visitQueries: (() => Promise<void>)[] = [];

      let addedAccounts = 0;
      let addedThemes = 0;
      let addedProfiles = 0;
      let addedLinks = 0;
      let addedVisits = 0;

      let badThemes = 0;
      let badProfiles = 0;
      let badLinks = 0;
      let badVisits = 0;

      console.log("Reading data into memory.");

      for (let user of mongoAccounts) {
        let func = async () => {
          try {
            let queryResult = await this.pool.query(
              "insert into users.accounts (full_name, email, pass_hash, active_profile, created_on)\nvalues ($1, $2, $3, $4, $5)\non conflict do nothing\nreturning *;",
              [
                user.name,
                user.email,
                user.password,
                user.active_profile?.handle,
                user._id.getTimestamp()
              ]
            );

            if (queryResult.rowCount < 1) {
              queryResult.rows[0] = (await this.pool.query("select * from users.accounts where email=$1", [user.email])).rows[0];
            } else {
              addedAccounts++;
            }

            let obj = queryResult.rows[0];
            obj.oldId = user._id.toString();

            pgAccounts.push(obj);
          } catch (err) {
            console.log(err);
          }
        };

        accountQueries.push(func);
      }

      for (let theme of mongoThemes) {
        let func = async () => {
          try {
            let pgAccount = pgAccounts.find(x => x.oldId == theme.parent._id.toString());

            if (!pgAccount) {
              badThemes++;
              return;
            }

            let queryResult = await this.pool.query(
              "insert into users.themes (label, global, colors, custom_css, custom_html, account_id, created_on)\nvalues ($1, $2, $3, $4, $5, $6, $7)\non conflict do nothing\nreturning *;",
              [
                theme.label,
                theme.global,
                JSON.stringify(theme.colors),
                theme.custom_css,
                theme.custom_html,
                pgAccount.id,
                theme._id.getTimestamp()
              ]
            );

            if (queryResult.rowCount < 1) {
              queryResult.rows[0] = (await this.pool.query("select * from users.themes where account_id=$1 and label=$2", [pgAccount.id, theme.label])).rows[0];
            } else {
              addedThemes++;
            }

            let obj = queryResult.rows[0];
            obj.oldId = theme._id.toString();

            pgThemes.push(obj);
          } catch (err) {
            console.log(err);
          }
        };

        themeQueries.push(func);
      }

      for (const profile of mongoProfiles) {
        let func = async () => {
          try {
            let pgAccount = pgAccounts.find(x => x.oldId == profile.parent._id.toString());
            let pgTheme = pgThemes.find(x => x.oldId == profile.theme?.toString());

            if (!pgAccount) {
              badProfiles++;
              return;
            }

            let queryResult = await this.pool.query(
              "insert into users.profiles (handle, account_id, image_url, headline, subtitle, social, custom_css, custom_html, custom_domain, theme_id, visibility, created_on)\nvalues ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)\non conflict do nothing\nreturning *;",
              [
                profile.handle,
                pgAccount.id,
                profile.image_url,
                profile.headline,
                profile.subtitle,
                JSON.stringify(profile.social),
                profile.custom_css,
                profile.custom_html,
                profile.custom_domain,
                pgTheme?.id ?? null,
                profile.visibility,
                profile._id.getTimestamp()
              ]
            );

            if (queryResult.rowCount < 1) {
              queryResult.rows[0] = (await this.pool.query("select * from users.profiles where handle=$1", [profile.handle])).rows[0];
            } else {
              addedProfiles++;
            }

            let obj = queryResult.rows[0];
            obj.oldId = profile._id.toString();

            pgProfiles.push(obj);
          } catch (err) {
            console.log(err);
          }
        };

        profileQueries.push(func);
      }

      for (const link of mongoLinks) {
        let func = async () => {
          try {
            let pgProfile = pgProfiles.find(x => x.oldId == link.parent._id.toString());

            if (!pgProfile) {
              badLinks++;
              return;
            }

            let queryResult = await this.pool.query(
              'insert into users.links (profile_id, url, "order", label, subtitle, style, custom_css, created_on) values ($1, $2, $3, $4, $5, $6, $7, $8)\non conflict do nothing\nreturning *;',
              [
                pgProfile.id,
                link.url,
                link.order,
                link.label,
                link.subtitle,
                link.style,
                link.custom_css,
                link._id.getTimestamp()
              ]
            );

            if (queryResult.rowCount < 1) {
              queryResult.rows[0] = (await this.pool.query("select * from users.links where profile_id=$1", [pgProfile.id])).rows[0];
            } else {
              addedLinks++;
            }

            let obj = queryResult.rows[0];
            obj.oldId = link._id.toString();

            pgLinks.push(obj);
          } catch (err) {
            console.log(err);
          }
        };

        linkQueries.push(func);
      }

      for (const visit of mongoVisits) {
        let func = async () => {
          try {
            let pgObj: any = null;

            switch (visit.type.toLowerCase()) {
              case "link":
                pgObj = pgLinks.find(x => x.oldId == visit.referral.toString());
                break;
              case "page":
                pgObj = pgProfiles.find(x => x.oldId == visit.referral.toString());
                break;
            }

            if (!pgObj) {
              badVisits++;
              return;
            }

            let queryResult = await this.pool.query(
              "insert into history.visits (type, referral, created_on) values ($1, $2, $3)\non conflict do nothing\nreturning *;",
              [
                visit.type.toLowerCase(),
                pgObj.id,
                visit._id.getTimestamp()
              ]
            );

            if (queryResult.rowCount > 0) {
              addedVisits++;
            }
          } catch (err) {
            console.log(err);
          }
        };

        visitQueries.push(func);
      }

      console.log("Done writing.");

      console.log("Done, PostgreSQL is ready for data import.");

      console.log("Committing " + accountQueries.length + " account queries");
      await Promise.all(accountQueries.map(x => x()));

      console.log("Committing " + themeQueries.length + " theme queries");
      await Promise.all(themeQueries.map(x => x()));

      console.log("Committing " + profileQueries.length + " profile queries");
      await Promise.all(profileQueries.map(x => x()));

      console.log("Committing " + linkQueries.length + " link queries");
      await Promise.all(linkQueries.map(x => x()));

      console.log("Committing " + visitQueries.length + " visit queries");
      await Promise.all(visitQueries.map(x => x()));

      console.log(`Added ${addedAccounts} account(s).`);
      console.log(`Added ${addedThemes} themes(s).`);
      console.log(`Added ${addedProfiles} profiles(s).`);
      console.log(`Added ${addedLinks} links(s).`);
      console.log(`Added ${addedVisits} visit(s).`);

      if (badThemes || badProfiles || badLinks || badVisits)
        console.log("\n---- Some invalid data was detected, and was ignored! ----");

      if (badThemes)
        console.log(badThemes + " theme(s) couldn't be transferred. (Bad data)");

      if (badProfiles)
        console.log(badProfiles + " profile(s) couldn't be transferred. (Bad data)");

      if (badLinks)
        console.log(badLinks + " link(s) couldn't be transferred. (Bad data)");

      if (badVisits)
        console.log(badVisits + " visit(s) couldn't be transferred. (Bad data)");


      console.log("Refreshing analytics view.");
      await this.pool.query('refresh materialized view users.analytics_view');

    } catch (err) {
      console.error(err);
    }
  }
}

async function start() {
  let converter = new Converter();

  await converter.setup();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    await new Promise((resolve, reject) => {
      console.log();
      console.log("===== POINT OF NO RETURN WARNING: READ CAREFULLY =====");
      console.log("WARNING: This script DOES NOT MERGE DATA. IT COMPLETELY WIPES THE RECEIVING DATABASE FIRST.");
      rl.question("This is a DESTRUCTIVE operation. It will completely wipe the receiving PostgreSQL database. There is NO UNDO. Are you sure you want to continue? (Y/n)",
        answer => {
          if (answer.toLowerCase() == "y")
            resolve();
          else
            reject();
        }
      );
    });
  } catch (err) {
    console.log("Aborted operation. Data was not modified nor transferred.");
    return;
  }

  console.log();

  await converter.convert();

  console.log("All done!");
}

// Entry point
(async () => {
  await start();

  process.exit(0);
})();
