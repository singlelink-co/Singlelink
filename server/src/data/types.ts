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

interface UserAccount {
  id: string,
  fullName: string | null,
  email: string,
  activeProfile: string | null,
  paymentId: string | null,
  subscriptionTier: SubscriptionTier | null,
  inventory: any | null,
  metadata: any | null,
  createdOn: string
}

interface UserAccountWithPass extends UserAccount {
  passHash: string
}

interface Theme {
  id: string,
  label: string,
  global: boolean,
  colors: {
    fill: {
      primary: string,
      secondary: string
    } | null,
    text: {
      primary: string,
      secondary: string
    } | null
  } | null,
  customCss: string | null,
  customHtml: string | null,
  owner: string,
  createdOn: string
}

interface Profile {
  id: string,
  handle: string,
  owner: string,
  imageUrl: string | null,
  headline: string | null,
  social: {
    icon: string,
    link: string,
    alt: string
  },
  customCss: string,
  customDomain: string,
  theme: string,
  visibility: Visibility,
  metadata: any,
  createdOn: string
}

interface Link {
  id: string,
  owner: string,
  url: string,
  order: number,
  label: string,
  subtitle: string | null,
  style: string | null,
  customCss: string | null,
  useDeepLink: boolean,
  createdOn: string
}

interface Visit {
  type: VisitType,
  referral: string,
  createdOn: string
}

interface Analytics {
  totalUsers: number;
  totalProfiles: number;
  profilesPublished: number;
  totalLinks: number;
  totalThemes: number;
}
