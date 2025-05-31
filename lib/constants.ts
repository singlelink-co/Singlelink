// Define which link types are considered premium
export const PREMIUM_LINK_TYPES: string[] = ['youtube', 'image', 'html'];

// Define available subscription plans (could be expanded later)
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  BUSINESS: 'business',
};

// Helper function to check if a link type is premium
export function isPremiumLinkType(linkType: string): boolean {
  return PREMIUM_LINK_TYPES.includes(linkType.toLowerCase());
}

// Helper function to check if a user has access to premium features based on their plan
export function hasPremiumAccess(subscriptionPlan: string | null | undefined): boolean {
  if (!subscriptionPlan) return false;
  const plan = subscriptionPlan.toLowerCase();
  return plan === SUBSCRIPTION_PLANS.PRO || plan === SUBSCRIPTION_PLANS.BUSINESS;
}
