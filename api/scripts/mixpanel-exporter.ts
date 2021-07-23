import * as fs from "fs";
import {Pool} from "pg";

type visibility_t = 'unpublished' | 'published' | 'published-18+';

interface DbProfile {
  id: string,
  handle: string,
  user_id: string,
  image_url: string | null,
  headline: string | null,
  subtitle: string | null,
  social: {
    icon: string,
    link: string,
    alt: string
  },
  show_watermark: boolean,
  custom_css: string,
  custom_html: string,
  custom_domain: string,
  theme_id: string,
  visibility: visibility_t,

  // The metadata tag will grow over time as functionality is added.
  metadata: {
    privacyMode: boolean,
    unlisted: boolean
  },

  created_on: string
}

class MixpanelExporter {
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

  async exportAll() {
    let profileIds = process.argv;

    if (profileIds.length <= 2) {
      console.log("No arguments found. Please provide all profile ids in a list.");
      return null;
    }

    profileIds.splice(0, 2);

    let profileData = [];

    for (let profileId of profileIds) {
      let queryResult = await this.pool.query<DbProfile>("select * from app.profiles where id=$1 order by id", [profileId]);

      if (queryResult.rowCount <= 0)
        continue;

      let dbProfile = queryResult.rows[0];

      profileData.push({
        id: dbProfile.id,
        handle: dbProfile.handle,
        createdOn: new Date(dbProfile.created_on).toISOString()
      });
    }

    console.log(`Queried ${profileIds.length} profiles, found ${profileData.length} profiles.`);

    return profileData;
  }
}

async function start() {
  console.log("Setting up...");

  let filename = `stats/sl-mixpanel-data-${Date.now()}.json`;
  let manager = new MixpanelExporter();

  console.log("Exporting...");
  const jsonData = await manager.exportAll();

  if (!jsonData) {
    console.log("JSON data was unable to be created.");
    return;
  }

  const jsonString = JSON.stringify(jsonData, undefined, 2);

  console.log("Done collecting! \nWriting...");

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
