/*
  This is a script that exports some statistics for Singlelink.
  Environment vars:
  POSTGRESQL - Postgresql Connection String

  NPM command:
  npm run export-stats  - export stats
 */

import {Pool} from "pg";
import fs from 'fs';

class StatsExporter {

  pgUrl: string;
  pool: Pool;

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
  }

  async countProfilesCreated(monthsMin: number = 0, monthsMax = 1) {
    const queryResult = await this.pool.query(`select count(*)
                                               from app.profiles
                                               where profiles.created_on < current_date - interval '1 month' * $1
                                                 and profiles.created_on > current_date - interval '1 month' * $2`,
      [
        monthsMin,
        monthsMax
      ]);

    return {
      name: `profiles created (past ${monthsMin} to ${monthsMax} month(s))`,
      range: `${monthsMax - monthsMin} months`,
      count: queryResult.rows[0].count
    };
  }

  async countProfilesWithPageVisits(monthsMin: number = 0, monthsMax = 1) {
    const queryResult = await this.pool.query(`select count(*)
                                               from app.profiles
                                               where exists(select 1
                                                            from analytics.visits
                                                            where type = 'page'
                                                              and referral_id = app.profiles.user_id
                                                              and profiles.created_on < current_date - interval '1 month' * $1
                                                              and profiles.created_on > current_date - interval '1 month' * $2);`,
      [
        monthsMin,
        monthsMax
      ]);

    return {
      name: `profiles with page visits (past ${monthsMin} to ${monthsMax} month(s))`,
      range: `${monthsMax - monthsMin} months`,
      count: queryResult.rows[0].count
    };
  }

  async countProfilesWithLinkVisits(monthsMin: number = 0, monthsMax = 1) {
    const queryResult = await this.pool.query(`select count(*)
                                               from app.links
                                               where exists(select 1
                                                            from analytics.visits
                                                            where type = 'link'
                                                              and referral_id = app.links.profile_id
                                                              and links.created_on < current_date - interval '1 month' * $1
                                                              and links.created_on > current_date - interval '1 month' * $2);`,
      [
        monthsMin,
        monthsMax
      ]);

    return {
      name: `profiles with link clicks (past ${monthsMin} to ${monthsMax} month(s))`,
      range: `${monthsMax - monthsMin} months`,
      count: queryResult.rows[0].count
    };
  }

  async countProfilesWithLinksCreated(monthsMin: number = 0, monthsMax = 1) {
    const queryResult = await this.pool.query(`select count(*)
                                               from app.profiles
                                               where exists(select 1
                                                            from app.links
                                                            where app.profiles.id = app.links.profile_id
                                                              and links.created_on < current_date - interval '1 month' * $1
                                                              and links.created_on > current_date - interval '1 month' * $2)`,
      [
        monthsMin,
        monthsMax
      ]);

    return {
      name: `links created (past ${monthsMin} to ${monthsMax} month(s))`,
      range: `${monthsMax - monthsMin} months`,
      count: queryResult.rows[0].count
    };
  }

  async countUsersWithMultipleProfiles() {
    const queryResult = await this.pool.query(`select count(*)
                                               from app.users
                                               where (select count(*)
                                                      from app.profiles
                                                      where app.profiles.user_id = app.users.id) > 1`);

    return {
      name: `users with multiple profiles`,
      range: `all`,
      count: queryResult.rows[0].count
    };
  }

  async countUsersCreated(monthsMin: number = 0, monthsMax = 1) {
    const queryResult = await this.pool.query(`select count(*)
                                               from app.users
                                               where users.created_on < current_date - interval '1 month' * $1
                                                 and users.created_on > current_date - interval '1 month' * $2;`,
      [
        monthsMin,
        monthsMax
      ]);

    return {
      name: `users created (past ${monthsMin} to ${monthsMax} month(s))`,
      range: `${monthsMax - monthsMin} months`,
      count: queryResult.rows[0].count
    };
  }

  async exportAll() {
    let json: unknown[] = [];

    json.push(await this.countUsersWithMultipleProfiles());

    for (let i = 0; i < 3; i++) {
      json.push(await this.countUsersCreated(i, i + 1));
    }

    for (let i = 0; i < 3; i++) {
      json.push(await this.countProfilesCreated(i, i + 1));
    }

    for (let i = 0; i < 3; i++) {
      json.push(await this.countProfilesWithPageVisits(i, i + 1));
    }

    for (let i = 0; i < 3; i++) {
      json.push(await this.countProfilesWithLinkVisits(i, i + 1));
    }

    for (let i = 0; i < 3; i++) {
      json.push(await this.countProfilesWithLinksCreated(i, i + 1));
    }

    for (let i = 0; i < 3; i++) {
      json.push(await this.countUsersCreated(0, i + 1));
    }

    for (let i = 0; i < 3; i++) {
      json.push(await this.countProfilesCreated(0, i + 1));
    }

    for (let i = 0; i < 3; i++) {
      json.push(await this.countProfilesWithPageVisits(0, i + 1));
    }

    for (let i = 0; i < 3; i++) {
      json.push(await this.countProfilesWithLinkVisits(0, i + 1));
    }

    for (let i = 0; i < 3; i++) {
      json.push(await this.countProfilesWithLinksCreated(0, i + 1));
    }


    return json;
  }
}

async function start() {
  console.log("Collecting stats...");
  let filename = `stats/sl-stats-${Date.now()}.json`;
  let manager = new StatsExporter();
  const jsonData = await manager.exportAll();
  const jsonString = JSON.stringify(jsonData, undefined, 2);

  console.log("Done collecting! \nExporting...");

  try {
    await fs.promises.mkdir('stats');
  } catch (err) {
    // do nothing
  }

  try {

    await fs.promises.writeFile(filename, jsonString);
  } catch (err) {
    console.error('Error occurred while exporting data!', err);
  }
}

// Entry point
(async () => {
  await start();

  process.exit(0);
})();
