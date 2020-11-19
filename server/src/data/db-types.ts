/**
 * DB Types contains all the types that represent the raw QueryResult data that is received from the database.
 *
 * It is a direct 1:1 of the tables and types within the database.
 */

type subscription_t = 'free' | 'whale' | 'enterprise';
type visibility_t = 'unpublished' | 'published' | 'published-18+';
type visit_t = 'link' | 'page';

/*
Tables will be mapped with the schema name in front of them to prevent collisions with resolved types.
 */

interface AppUser {
  id: string,
  email: string,
  full_name: string | null,
  active_profile_id: string | null,
  subscription_tier: subscription_t | null,
  inventory: unknown | null,
  metadata: unknown | null,
  created_on: string
}

interface AppSensitiveUser extends AppUser {
  pass_hash: string,
  payment_id: string | null,
}

interface AppThemeColors {
  fill: {
    primary: string,
    secondary: string
  },
  text: {
    primary: string,
    secondary: string
  }
}

interface AppTheme {
  id: string,
  label: string,
  global: boolean,
  colors: AppThemeColors | null,
  custom_css: string | null,
  custom_html: string | null,
  user_id: string,
  created_on: string
}

interface AppProfile {
  id: string,
  handle: string,
  user_id: string,
  image_url: string | null,
  headline: string | null,
  social: {
    icon: string,
    link: string,
    alt: string
  },
  custom_css: string,
  custom_html: string,
  custom_domain: string,
  theme_id: string,
  visibility: visibility_t,
  metadata: unknown,
  created_on: string
}

interface AppProfileMember {
  handle: string,
  member: string
}

interface AppLink {
  id: string,
  profile_id: string,
  url: string,
  sort_order: number,
  label: string,
  subtitle: string | null,
  style: string | null,
  custom_css: string | null,
  use_deep_link: boolean,
  created_on: string
}

interface AppAnalyticsVisit {
  type: visit_t,
  referral: string,
  created_on: string
}


interface AppAnalyticsGlobalStats {
  total_users: number;
  total_profiles: number;
  profiles_published: number;
  total_links: number;
  total_themes: number;
}
