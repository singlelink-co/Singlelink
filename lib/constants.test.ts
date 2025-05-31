import { isPremiumLinkType, PREMIUM_LINK_TYPES, SUBSCRIPTION_PLANS, hasPremiumAccess } from './constants';

describe('isPremiumLinkType', () => {
  it('should return true for premium link types', () => {
    expect(isPremiumLinkType('youtube')).toBe(true);
    expect(isPremiumLinkType('image')).toBe(true);
    expect(isPremiumLinkType('html')).toBe(true);
    // Case insensitivity
    expect(isPremiumLinkType('YOUTUBE')).toBe(true);
  });

  it('should return false for non-premium link types', () => {
    expect(isPremiumLinkType('vanilla')).toBe(false);
    expect(isPremiumLinkType('text')).toBe(false);
    expect(isPremiumLinkType('avatar')).toBe(false);
    expect(isPremiumLinkType('unknown')).toBe(false);
    expect(isPremiumLinkType('')).toBe(false);
  });

  it('should correctly identify all defined premium types', () => {
    PREMIUM_LINK_TYPES.forEach(type => {
      expect(isPremiumLinkType(type)).toBe(true);
    });
  });
});

describe('hasPremiumAccess', () => {
  it('should return true for pro plan', () => {
    expect(hasPremiumAccess(SUBSCRIPTION_PLANS.PRO)).toBe(true);
  });

  it('should return true for business plan', () => {
    expect(hasPremiumAccess(SUBSCRIPTION_PLANS.BUSINESS)).toBe(true);
  });

  it('should return true for pro plan regardless of case', () => {
    expect(hasPremiumAccess('PrO')).toBe(true);
  });

  it('should return false for free plan', () => {
    expect(hasPremiumAccess(SUBSCRIPTION_PLANS.FREE)).toBe(false);
  });

  it('should return false for null or undefined plan', () => {
    expect(hasPremiumAccess(null)).toBe(false);
    expect(hasPremiumAccess(undefined)).toBe(false);
  });

  it('should return false for an unknown plan string', () => {
    expect(hasPremiumAccess('unknown_plan')).toBe(false);
    expect(hasPremiumAccess('')).toBe(false);
  });
});
