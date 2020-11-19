/**
 * types.ts contains all the types that represent the data that will received from the database.
 */

/**
 * Subscription Tier type.
 *
 * free: Free tier
 * whale: Whale tier
 * enterprise: Enterprise tier
 */
type SubscriptionTier = 'free' | 'whale' | 'enterprise';

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

interface User {
  id: string,
  emailHash: string, // Used for gravatar, it could be better but this is how the service works
  fullName: string | null,
  activeProfileId: string | null,
  subscriptionTier: SubscriptionTier | null,
  inventory: unknown | null,
  metadata: unknown | null,
  createdOn: string
}

/**
 * User with sensitive information included.
 */
interface SensitiveUser extends User {
  email: string,
  passHash: string,
  paymentId: string | null,
}

interface ThemeColors {
  fill: {
    primary: string,
    secondary: string
  },
  text: {
    primary: string,
    secondary: string
  }
}

interface Theme {
  id: string,
  label: string,
  global: boolean,
  colors: ThemeColors | null,
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
  customCss: string,
  customHtml: string,
  customDomain: string,
  themeId: string,
  visibility: Visibility,
  metadata: unknown,
  createdOn: string
}

interface Link {
  id: string,
  profileId: string,
  url: string,
  sortOrder: number,
  label: string,
  subtitle: string | null,
  style: string | null,
  customCss: string | null,
  useDeepLink: boolean,
  createdOn: string
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
