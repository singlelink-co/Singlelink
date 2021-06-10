/**
 * types.d.ts contains all the types that represent the data that will received from the database.
 * db-types.d.ts types are converted to these types using the DbTypeConverter.
 */

/**
 * Profile visibility type
 *
 * unpublished: Not visible to anyone
 * published: Visible to everyone
 * published-18+: Visible to everyone with a content warning
 */
type Visibility = 'unpublished' | 'published' | 'published-18+';

/**
 * Visit type for analytics
 *
 * link: The visit was for a specific link
 * page: The visit was for a page
 */
type VisitType = 'link' | 'page';

/**
 * Addon type for the marketplace
 */
type AddonType = 'theme' | 'preset' | 'plugin';

/**
 * Link type
 */
type LinkType = 'link' | 'social' | 'image' | 'video' | string;

interface User {
  id: string,
  emailHash: string, // Used for gravatar, it could be better but this is how the service works
  fullName: string | null,
  activeProfileId: string | null,
  inventory: unknown | null,

  // The metadata tag will grow over time as functionality is added.
  metadata: {},

  createdOn: string
}

/**
 * User with sensitive information included.
 */
interface SensitiveUser extends User {
  email: string,

  privateMetadata: {
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

/**
 * User with sensitive information with password included..
 */
interface SensitiveUserWithPassword extends SensitiveUser {
  passHash: string,
}

interface Theme {
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
  customCss: string | null,
  customHtml: string | null,
  userId: string,
  createdOn: string
}

interface Profile {
  id: string,
  handle: string,
  userId: string,
  imageUrl: string | null,
  headline: string | null,
  subtitle: string | null,
  social: {
    icon: string,
    link: string,
    alt: string
  },
  showWatermark: boolean,
  customCss: string,
  customHtml: string,
  customDomain: string,
  themeId: string,
  visibility: Visibility,

  // The metadata tag will grow over time as functionality is added.
  metadata: {
    privacyMode: boolean,
    unlisted: boolean
  },

  createdOn: string
}

interface SensitiveProfile extends Profile {
  privateMetadata: unknown
}

interface Link {
  id: string,
  profileId: string,
  type: LinkType,
  url: string,
  sortOrder: number,
  label: string,
  subtitle: string | null,
  style: string | null,
  customCss: string | null,
  useDeepLink: boolean,
  metadata: unknown,
  createdOn: string
}

interface SensitiveLink extends Link {
  privateMetadata: unknown
}

interface PermissionGroup {
  id: string,
  userId: string,
  groupName: string
}

interface Visit {
  type: VisitType,
  referralId: string,
  createdOn: string
}

interface AnalyticsGlobalStats {
  totalUsers: number;
  totalProfiles: number;
  profilesPublished: number;
  totalLinks: number;
  totalThemes: number;
}

interface Addon {
  id: string,
  userId: string,
  resourceId: string,
  type: AddonType,
  displayName: string,
  description: string,
  author: string,
  tags: string[],
  featuredSorting: number,
  price: number,
  paymentFrequency: string,
  global: boolean,
  version: string,
  metadata: {
    deprecated?: boolean
  },
  createdOn: string,
  lastUpdated: string,
}

interface SensitiveAddon extends Addon {
  privateMetadata: unknown
}

interface AddonInstall {
  id: string,
  profileId: string,
  addonId: string,
  createdOn: string
}

interface HydratedAddon extends Addon {
  // Hydrated fields to be returned in a request
  resource: unknown,
  stats: unknown
}
