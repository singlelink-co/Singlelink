/**
 * db-types.d.ts contains all the types that represent the raw QueryResult data that is received from the database.
 *
 * It is a direct 1:1 of the tables and types within the database.
 */

type visibility_t = 'unpublished' | 'published' | 'published-18+';
type visit_t = 'link' | 'page';
type addon_t = 'theme' | 'preset' | 'plugin';
type linktype_t = 'link' | 'social' | 'image' | 'video' | string

/**
 Tables will sometimes be mapped with the schema name in front of them to prevent collisions with resolved types.
 */

/**
 id                bigserial primary key,
 email             varchar(340) unique not null,
 email_hash        text,
 full_name         text,
 pass_hash         varchar(60)         not null,
 active_profile_id bigint,
 inventory         jsonb                        default '{}',   -- All the stuff this account owns
 metadata          jsonb               not null default '{}',
 created_on        timestamp           not null default current_timestamp

 create index if not exists accounts_email_index on app.users (email);
 */
interface DbUser {
  id: string,
  email_hash: string, // Used for gravatar, it could be better but this is how the service works
  full_name: string | null,
  active_profile_id: string | null,
  inventory: unknown | null,

  // The metadata tag will grow over time as functionality is added.
  metadata: {},

  created_on: string
}

interface DbSensitiveUser extends DbUser {
  email: string,

  private_metadata: {
    favorites: string[],
    googleId: string | null | undefined,
    githubId: string | null | undefined,
    emailNotifications: {
      major: boolean,
      minor: boolean,
      marketing: boolean,
      leaderboard: boolean
    },
  }
}

interface DbSensitiveUserWithPassword extends DbSensitiveUser {
  pass_hash: string,
}

/**
 id          bigserial primary key,
 label       text      not null,
 global      bool               default false not null,
 colors      jsonb              default '{}',
 custom_css  text,
 custom_html text,
 user_id     bigint references app.users (id) on update cascade on delete cascade,
 created_on  timestamp not null default current_timestamp

 create index if not exists themes_global_index on app.themes (global);
 create index if not exists themes_user_id_index on app.themes (user_id);
 */
interface DbTheme {
  id: string,
  label: string,
  global: boolean,
  colors: {
    fill: {
      primary: string,
      secondary: string
    },
    text: {
      primary: string,
      secondary: string
    }
  } | null,
  custom_css: string | null,
  custom_html: string | null,
  user_id: string,
  created_on: string
}

/**
 id             bigserial primary key,
 handle         text unique not null,                                                        -- The name of the profile in the url
 user_id        bigint,
 image_url      text,
 headline       text,                                                                        -- The name that shows up on the page
 subtitle       text,                                                                        -- The name underneath a profile's avatar
 social         jsonb                default '{}',
 show_watermark bool                 default true,                                           -- The "Proudly built with Singlelink" underneath people's profiles
 custom_css     text,
 custom_html    text,
 custom_domain  text unique,
 theme_id       bigint      references app.themes (id) on update cascade on delete set null, -- The profile's currently selected theme
 visibility     visibility_t         default 'unpublished',
 metadata       jsonb       not null default '{}',
 created_on     timestamp   not null default current_timestamp

 create index if not exists profiles_user_id_index on app.profiles (user_id);
 create index if not exists profiles_theme_id_index on app.profiles (theme_id);
 create index if not exists profiles_visibility_index on app.profiles (visibility);

 add constraint fk_users_active_profile_id foreign key (active_profile_id) references app.profiles (id) on update cascade on delete set null deferrable initially deferred;
 add constraint fk_profiles_user_id foreign key (user_id) references app.users (id) on update cascade on delete cascade deferrable initially deferred;
 */
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

interface DbSensitiveProfile extends DbProfile {
  private_metadata: unknown
}

/**
 handle text not null,
 member text not null,
 unique (handle, member)

 create index if not exists profile_members_handle_index on app.profile_members (handle);
 create index if not exists profile_members_member_index on app.profile_members (member);
 */
interface DbProfileMember {
  handle: string,
  member: string
}

/**
 id            bigserial primary key,
 profile_id    bigint references app.profiles (id) on update cascade on delete cascade,
 url           text               default '#' not null,
 sort_order    int       not null,
 label         text      not null,
 subtitle      text,
 style         text,
 custom_css    text,
 use_deep_link bool               default false not null,
 metadata      jsonb     not null default '{}',
 created_on    timestamp not null default current_timestamp

 create index if not exists links_profile_id on app.links (profile_id);
 create index if not exists links_url_index on app.links (url);
 */
interface DbLink {
  id: string,
  profile_id: string,
  type: linktype_t,
  url: string,
  sort_order: number,
  label: string,
  subtitle: string | null,
  style: string | null,
  custom_css: string | null,
  use_deep_link: boolean,
  metadata: unknown,
  created_on: string
}

interface DbSensitiveLink extends DbLink {
  private_metadata: unknown
}

/**
 id          bigserial primary key,
 user_id     bigint references app.users (id) on update cascade on delete cascade,
 group_name  text not null,
 permissions text

 create index if not exists perm_groups_group_name on app.perm_groups (group_name);
 */
interface DbPermissionGroup {
  id: string,
  user_id: string,
  group_name: string
}

/**
 -- regular type
 type        visit_t   not null,
 referral_id bigint    not null,
 created_on  timestamp not null default current_timestamp

 create index if not exists visits_referral_id_index on analytics.visits (referral_id);

 -- anonymous type
 type       visit_t   not null,
 created_on timestamp not null default current_timestamp
 */
interface DbAnalyticsVisit {
  type: visit_t,
  referral_id: string,
  created_on: string
}

/**
 create materialized view analytics.global_stats as
 select count(app.users.*)                                                                         as total_users,
 (select count(app.profiles.*) from app.profiles)                                           as total_profiles,
 (select count(app.profiles.*) filter ( where visibility = 'published' )
 from app.profiles)                                                                        as profiles_published,
 (select count(app.links.*) from app.links)                                                 as total_links,
 (select count(app.themes.*) from app.themes)                                               as total_themes
 from app.users;
 */
interface DbAnalyticsGlobalStats {
  total_users: number;
  total_profiles: number;
  profiles_published: number;
  total_links: number;
  total_themes: number;
}

/**
 id                bigserial primary key,
 user_id           bigint references app.users (id) on update cascade,
 resource_id       bigint unique,      -- The id of the resource this addon is related to
 type              addon_t   not null, -- The type of resource this is
 description       text,
 author            text,
 tags              text[],
 featured_level    smallint           default 0,
 price             decimal,
 payment_frequency text,
 global            bool               default false not null,
 metadata          jsonb     not null default '{}',
 created_on        timestamp not null default current_timestamp
 */
interface DbAddon {
  id: string,
  user_id: string,
  resource_id: string,
  type: addon_t,
  display_name: string,
  description: string,
  author: string,
  tags: string[],
  featured_sorting: number,
  price: number,
  payment_frequency: string,
  global: boolean,
  version: string,
  metadata: {
    deprecated?: boolean
  },
  created_on: string
  last_updated: string,
}

interface DbSensitiveAddon extends DbAddon {
  private_metadata: unknown
}


interface DbAddonInstall {
  id: string,
  profile_id: string,
  addon_id: string,
  created_on: string
}
