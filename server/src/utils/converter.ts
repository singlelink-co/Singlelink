/**
 * Contains many utility functions for converting data, especially for SQL to Typescript Objects.
 */
export class Converter {

  static toUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      activeProfile: row.active_profile,
      subscriptionTier: row.subscription_tier,
      inventory: row.inventory,
      metadata: row.metadata,
      createdOn: row.created_on
    };
  }

  static toSensitiveUser(row: any): SensitiveUser {
    return {
      id: row.id,
      email: row.email,
      passHash: row.pass_hash,
      fullName: row.full_name,
      activeProfile: row.active_profile,
      subscriptionTier: row.subscription_tier,
      paymentId: row.payment_id,
      inventory: row.inventory,
      metadata: row.metadata,
      createdOn: row.created_on
    };
  }

  static toTheme(row: any): Theme {
    return {
      id: row.id,
      label: row.label,
      global: row.global,
      colors: row.colors,
      customCss: row.custom_css,
      customHtml: row.custom_html,
      userId: row.user_id,
      createdOn: row.created_on
    };
  }

  static toProfile(row: any): Profile {
    return {
      id: row.id,
      handle: row.handle,
      userId: row.user_id,
      imageUrl: row.imageUrl,
      headline: row.headline,
      social: row.social,
      customCss: row.custom_css,
      customHtml: row.custom_html,
      customDomain: row.custom_domain,
      themeId: row.theme_id,
      visibility: row.visibility,
      metadata: row.metadata,
      createdOn: row.created_on
    };
  }

  static toLink(row: any): Link {
    return {
      id: row.id,
      profileId: row.profile_id,
      url: row.url,
      sortOrder: row.sort_order,
      label: row.label,
      subtitle: row.subtitle,
      style: row.style,
      customCss: row.custom_css,
      useDeepLink: row.use_deep_link,
      createdOn: row.created_on
    };
  }

  static toVisit(row: any): Visit {
    return {
      type: row.type,
      referral: row.referral,
      createdOn: row.created_on
    };
  }

  static toAnalytics(row: any): Analytics {
    return {
      totalUsers: row.total_users,
      totalProfiles: row.total_profiles,
      profilesPublished: row.profiles_published,
      totalLinks: row.total_links,
      totalThemes: row.total_themes
    };
  }

}
