"use strict";
/**
 * Contains many utility functions for converting from DB Types to Typescript Types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbTypeConverter = void 0;
var DbTypeConverter = /** @class */ (function () {
    function DbTypeConverter() {
    }
    DbTypeConverter.toUser = function (user) {
        return {
            id: user.id,
            emailHash: user.email_hash,
            fullName: user.full_name,
            activeProfileId: user.active_profile_id,
            inventory: user.inventory,
            metadata: user.metadata,
            createdOn: user.created_on
        };
    };
    DbTypeConverter.toSensitiveUser = function (user) {
        return {
            id: user.id,
            email: user.email,
            emailHash: user.email_hash,
            fullName: user.full_name,
            activeProfileId: user.active_profile_id,
            inventory: user.inventory,
            metadata: user.metadata,
            privateMetadata: user.private_metadata,
            createdOn: user.created_on
        };
    };
    DbTypeConverter.toSensitiveUserWithPassword = function (user) {
        return {
            id: user.id,
            email: user.email,
            emailHash: user.email_hash,
            passHash: user.pass_hash,
            fullName: user.full_name,
            activeProfileId: user.active_profile_id,
            inventory: user.inventory,
            metadata: user.metadata,
            privateMetadata: user.private_metadata,
            createdOn: user.created_on
        };
    };
    DbTypeConverter.toTheme = function (theme) {
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
    };
    DbTypeConverter.toProfile = function (profile) {
        return {
            id: profile.id,
            handle: profile.handle,
            userId: profile.user_id,
            imageUrl: profile.image_url,
            headline: profile.headline,
            subtitle: profile.subtitle,
            social: profile.social,
            showWatermark: profile.show_watermark,
            customCss: profile.custom_css,
            customHtml: profile.custom_html,
            customDomain: profile.custom_domain,
            themeId: profile.theme_id,
            visibility: profile.visibility,
            metadata: profile.metadata,
            createdOn: profile.created_on
        };
    };
    DbTypeConverter.toSensitiveProfile = function (profile) {
        return {
            id: profile.id,
            handle: profile.handle,
            userId: profile.user_id,
            imageUrl: profile.image_url,
            headline: profile.headline,
            subtitle: profile.subtitle,
            social: profile.social,
            showWatermark: profile.show_watermark,
            customCss: profile.custom_css,
            customHtml: profile.custom_html,
            customDomain: profile.custom_domain,
            themeId: profile.theme_id,
            visibility: profile.visibility,
            metadata: profile.metadata,
            privateMetadata: profile.private_metadata,
            createdOn: profile.created_on
        };
    };
    DbTypeConverter.toProfileMember = function (member) {
        return {
            handle: member.handle,
            member: member.member
        };
    };
    DbTypeConverter.toLink = function (link) {
        return {
            id: link.id,
            profileId: link.profile_id,
            type: link.type,
            url: link.url,
            sortOrder: link.sort_order,
            label: link.label,
            subtitle: link.subtitle,
            style: link.style,
            customCss: link.custom_css,
            useDeepLink: link.use_deep_link,
            metadata: link.metadata,
            createdOn: link.created_on
        };
    };
    DbTypeConverter.toSensitiveLink = function (link) {
        return {
            id: link.id,
            profileId: link.profile_id,
            type: link.type,
            url: link.url,
            sortOrder: link.sort_order,
            label: link.label,
            subtitle: link.subtitle,
            style: link.style,
            customCss: link.custom_css,
            useDeepLink: link.use_deep_link,
            metadata: link.metadata,
            privateMetadata: link.private_metadata,
            createdOn: link.created_on
        };
    };
    DbTypeConverter.toVisit = function (visit) {
        return {
            type: visit.type,
            referralId: visit.referral_id,
            createdOn: visit.created_on
        };
    };
    DbTypeConverter.toAnalytics = function (analytics) {
        return {
            totalUsers: analytics.total_users,
            totalProfiles: analytics.total_profiles,
            profilesPublished: analytics.profiles_published,
            totalLinks: analytics.total_links,
            totalThemes: analytics.total_themes
        };
    };
    DbTypeConverter.toPermGroup = function (perms) {
        return {
            id: perms.id,
            userId: perms.user_id,
            groupName: perms.group_name
        };
    };
    DbTypeConverter.toAddon = function (addon) {
        return {
            id: addon.id,
            userId: addon.user_id,
            resourceId: addon.resource_id,
            type: addon.type,
            displayName: addon.display_name,
            description: addon.description,
            author: addon.author,
            tags: addon.tags,
            featuredSorting: addon.featured_sorting,
            price: addon.price,
            paymentFrequency: addon.payment_frequency,
            global: addon.global,
            version: addon.version,
            metadata: addon.metadata,
            createdOn: addon.created_on,
            lastUpdated: addon.last_updated
        };
    };
    DbTypeConverter.toSensitiveAddon = function (addon) {
        return {
            id: addon.id,
            userId: addon.user_id,
            resourceId: addon.resource_id,
            type: addon.type,
            displayName: addon.display_name,
            description: addon.description,
            author: addon.author,
            tags: addon.tags,
            featuredSorting: addon.featured_sorting,
            price: addon.price,
            paymentFrequency: addon.payment_frequency,
            global: addon.global,
            version: addon.version,
            metadata: addon.metadata,
            privateMetadata: addon.private_metadata,
            createdOn: addon.created_on,
            lastUpdated: addon.last_updated
        };
    };
    DbTypeConverter.toAddonInstall = function (addonInstall) {
        return {
            id: addonInstall.id,
            profileId: addonInstall.profile_id,
            addonId: addonInstall.addon_id,
            createdOn: addonInstall.created_on
        };
    };
    return DbTypeConverter;
}());
exports.DbTypeConverter = DbTypeConverter;
