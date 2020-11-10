/*
  This is a conversion script meant to convert an old SingleLink MongoDB server to a PostgreSQL database.
  It requires two environment variables:
  MONGODB - The url to connect to MongoDB
  POSTGRESQL - The url that will be used to connect to PostgreSQL
 */

import mongoose from "mongoose";
import {Pool} from "pg";

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

      console.log("Connected to MongoDB");
    } catch (err) {
      console.log('Error connecting to MongoDB');
      console.log(err);
    }
  }

  async convert() {
    try {
      console.log("Finding users...");
      let accounts = await User.find().populate("active_profile").exec();

      console.log("Finding themes...");
      let themes = await Theme.find().populate("parent").exec();

      console.log("Finding profiles...");
      let profiles = await Profile.find().exec();

      console.log("Finding links...");
      let links = await Link.find().populate("parent").exec();

      console.log("Finding visits...");
      let visits = await Visit.find().exec();

      let accountQueries: Promise<any>[] = [];
      let themeQueries: Promise<any>[] = [];
      let profileQueries: Promise<any>[] = [];
      let linkQueries: Promise<any>[] = [];
      let visitQueries: Promise<any>[] = [];

      for (let user of accounts) {
        accountQueries.push(
          (async () => {
            try {
              await this.pool.query(
                "insert into users.accounts (user_id, full_name, email, pass_hash, active_profile, created_on)\nvalues ($1, $2, $3, $4, $5, $6)\non conflict do nothing",
                [
                  user._id.toString(),
                  user.name,
                  user.email,
                  user.password,
                  user.active_profile?.handle,
                  user._id.getTimestamp()
                ]
              );
            } catch (err) {
              console.log(err);
            }
          })()
        );
      }

      for (let theme of themes) {
        themeQueries.push(
          (async () => {
            try {
              await this.pool.query(
                "insert into users.themes (theme_id, label, global, colors, custom_css, custom_html, owner, created_on)\nvalues ($1, $2, $3, $4, $5, $6, $7, $8)\non conflict do nothing",
                [
                  theme._id.toString(),
                  theme.label,
                  theme.global,
                  JSON.stringify(theme.colors),
                  theme.custom_css,
                  theme.custom_html,
                  theme.parent._id.toString(),
                  theme._id.getTimestamp()
                ]
              );
            } catch (err) {
              console.log(err);
            }
          })()
        );
      }

      for (const profile of profiles) {
        profileQueries.push(
          (async () => {
            try {
              await this.pool.query(
                "insert into users.profiles (handle, owner, image_url, headline, social, custom_css, custom_domain, theme, visibility, created_on)\nvalues ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)\non conflict do nothing",
                [
                  profile.handle,
                  profile.parent._id.toString(),
                  profile.image_url,
                  profile.headline,
                  JSON.stringify(profile.social),
                  profile.custom_css,
                  profile.custom_domain,
                  profile.theme?.toString(),
                  profile.visibility,
                  profile._id.getTimestamp()
                ]
              );
            } catch (err) {
              console.log(err);
            }
          })()
        );
      }

      for (const link of links) {
        linkQueries.push(
          (async () => {
            try {
              await this.pool.query(
                'insert into users.links (link_id, url, "order", label, subtitle, style, custom_css, created_on) values ($1, $2, $3, $4, $5, $6, $7, $8)\non conflict do nothing',
                [
                  link._id.toString(),
                  link.url,
                  link.order,
                  link.label,
                  link.subtitle,
                  link.style,
                  link.custom_css,
                  link._id.getTimestamp()
                ]
              );
            } catch (err) {
              console.log(err);
            }
          })()
        );
      }

      for (const visit of visits) {
        visitQueries.push(
          (async () => {
            try {
              await this.pool.query(
                "insert into history.visits (type, referral, created_on) values ($1, $2, $3)\non conflict do nothing",
                [
                  visit.type.toLowerCase(),
                  visit.referral.toString(),
                  visit._id.getTimestamp()
                ]
              );
            } catch (err) {
              console.log(err);
            }
          })()
        );
      }

      console.log("Committing " + accountQueries.length + " account queries");
      await Promise.all(accountQueries);

      console.log("Committing " + themeQueries.length + " theme queries");
      await Promise.all(themeQueries);

      console.log("Committing " + profileQueries.length + " profile queries");
      await Promise.all(profileQueries);

      console.log("Committing " + linkQueries.length + " link queries");
      await Promise.all(linkQueries);

      console.log("Committing " + visitQueries.length + " visit queries");
      await Promise.all(visitQueries);

    } catch (err) {
      console.error(err);
    }
  }
}

async function start() {
  let converter = new Converter();

  await converter.setup();
  await converter.convert();

  console.log("All done!");
}

// Entry point
(async () => {
  await start();

  process.exit(0);
})();
