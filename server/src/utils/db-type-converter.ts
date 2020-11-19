/**
 * Contains many utility functions for converting from DB Types to Typescript Types.
 */
export class DbTypeConverter {

  static toUser(user: AppUser): User {
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      activeProfileId: user.active_profile_id,
      subscriptionTier: user.subscription_tier,
      inventory: user.inventory,
      metadata: user.metadata,
      createdOn: user.created_on
    };
  }

  static toSensitiveUser(user: AppSensitiveUser): SensitiveUser {
    return {
      id: user.id,
      email: user.email,
      passHash: user.pass_hash,
      fullName: user.full_name,
      activeProfileId: user.active_profile_id,
      subscriptionTier: user.subscription_tier,
      paymentId: user.payment_id,
      inventory: user.inventory,
      metadata: user.metadata,
      createdOn: user.created_on
    };
  }

  static toTheme(theme: AppTheme): Theme {
    return {
      id: theme.id,
      label: theme.label,
      global: theme.global,
      colors: theme.colors,
      customCss: theme.custom_css,
      customHtml: theme.custom_html,
      userId: theme.user_id,
      createdOn: theme.created_on
    };
  }

  static toProfile(profile: AppProfile): Profile {
    return {
      id: profile.id,
      handle: profile.handle,
      userId: profile.user_id,
      imageUrl: profile.image_url,
      headline: profile.headline,
      social: profile.social,
      customCss: profile.custom_css,
      customHtml: profile.custom_html,
      customDomain: profile.custom_domain,
      themeId: profile.theme_id,
      visibility: profile.visibility,
      metadata: profile.metadata,
      createdOn: profile.created_on
    };
  }

  static toProfileMember(member: AppProfileMember): AppProfileMember {
    return {
      handle: member.handle,
      member: member.member
    };
  }

  static toLink(link: AppLink): Link {
    return {
      id: link.id,
      profileId: link.profile_id,
      url: link.url,
      sortOrder: link.sort_order,
      label: link.label,
      subtitle: link.subtitle,
      style: link.style,
      customCss: link.custom_css,
      useDeepLink: link.use_deep_link,
      createdOn: link.created_on
    };
  }

  static toVisit(visit: AppAnalyticsVisit): Visit {
    return {
      type: visit.type,
      referral: visit.referral,
      createdOn: visit.created_on
    };
  }

  static toAnalytics(analytics: AppAnalyticsGlobalStats): AnalyticsGlobalStats {
    return {
      totalUsers: analytics.total_users,
      totalProfiles: analytics.total_profiles,
      profilesPublished: analytics.profiles_published,
      totalLinks: analytics.total_links,
      totalThemes: analytics.total_themes
    };
  }

}
