------------
-- Types
------------

do
$$
    begin
        /*
         The subscription type of this user.

         free: Free tier account.
         whale: Whale tier account.
         enterprise: Enterprise tier account.
         */
        create type subscription_t as enum ('free', 'whale', 'enterprise');
    exception
        when duplicate_object then raise notice 'subscription_t already added.';
    end;
$$ language plpgsql;

do
$$
    begin
        /*
         Visibility_t specifies the visibility level of a profile.

         unpublished: The profile is not visible to anyone.
         published: The profile is visible to everyone.
         published-18+: The profile is visible, but with content warnings.
         */
        create type visibility_t as enum ('unpublished', 'published', 'published-18+');
    exception
        when duplicate_object then raise notice 'visibility_t already added.';
    end;
$$ language plpgsql;

do
$$
    begin
        /*
         Visit_t specifies what kind of visit an entry is.

         link: The visit was to a link.
         page: The visit was to a page.
         */
        create type visit_t as enum ('link', 'page');
    exception
        when duplicate_object then raise notice 'visit_t already added.';
    end;
$$ language plpgsql;

do
$$
    begin
        /*
         Addon_t specifies what kind of addon this is.

         theme: A theme.
         preset: A preset.
         plugin: A plugin.
         */
        create type addon_t as enum ('theme', 'preset', 'plugin');
    exception
        when duplicate_object then raise notice 'addon_t already added.';
    end;
$$ language plpgsql;

------------
-- Application
------------

create schema if not exists app;

/*
 Creates an accounts table with a list of profiles associated with it.
 */
create table if not exists app.users
(
    id                bigserial primary key unique,
    email             varchar(340) unique not null,
    email_hash        text,
    full_name         text,
    pass_hash         varchar(60)         not null,
    active_profile_id bigint,
    payment_id        text,                                        -- The associated payment account id (external) for this user
    subscription_tier subscription_t               default 'free', -- The subscription tier of this user
    inventory         jsonb                        default '{}',   -- All the stuff this account owns
    metadata          jsonb               not null default '{}',
    created_on        timestamp           not null default current_timestamp
);

create index if not exists accounts_email_index on app.users (email);

/*
 Creates a theme table that contains all user themes.
 */
create table if not exists app.themes
(
    id          bigserial primary key unique,
    label       text      not null,
    global      bool               default false not null,
    colors      jsonb              default '{}',
    custom_css  text,
    custom_html text,
    user_id     bigint references app.users (id) on update cascade on delete cascade,
    created_on  timestamp not null default current_timestamp
);

create index if not exists themes_global_index on app.themes (global);
create index if not exists themes_user_id_index on app.themes (user_id);

/*
 Creates a profile table with a constraint pointing to a parent account.
 */
create table if not exists app.profiles
(
    id             bigserial primary key unique,
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
);

create index if not exists profiles_user_id_index on app.profiles (user_id);
create index if not exists profiles_theme_id_index on app.profiles (theme_id);
create index if not exists profiles_visibility_index on app.profiles (visibility);

-- Create the foreign keys for app.users and app.profiles

do
$$
    begin
        alter table app.users
            add constraint fk_users_active_profile_id foreign key (active_profile_id) references app.profiles (id) on update cascade on delete set null deferrable initially deferred;
    exception
        when duplicate_object then raise notice 'table constraint foo.bar already exists';
    end;
$$;

do
$$
    begin
        alter table app.profiles
            add constraint fk_profiles_user_id foreign key (user_id) references app.users (id) on update cascade on delete cascade deferrable initially deferred;
    exception
        when duplicate_object then raise notice 'table constraint foo.bar already exists';
    end;
$$;

-- TODO Use this table to allow for multiple users per profile
create table if not exists app.profile_members
(
    handle text not null,
    member text not null,
    unique (handle, member)
);

create index if not exists profile_members_handle_index on app.profile_members (handle);
create index if not exists profile_members_member_index on app.profile_members (member);

/*
 Creates a table for the individual links created.
 */
create table if not exists app.links
(
    id            bigserial primary key unique,
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
);

create index if not exists links_profile_id on app.links (profile_id);
create index if not exists links_url_index on app.links (url);

-- Permissions/Admin

/*
 Creates a table for permission groups.
 */
create table if not exists app.perm_groups
(
    id          bigserial primary key unique,
    user_id     bigint references app.users (id) on update cascade on delete cascade,
    group_name  text not null,
    permissions text
);

create index if not exists perm_groups_group_name on app.perm_groups (group_name);

------------
-- Analytics
------------

create schema if not exists analytics;

/*
 Creates a table for visiting analytics.
 type: The type of visit this was.
 referral_id: The link or page this visit points to.
 */
create table if not exists analytics.visits
(
    type        visit_t   not null,
    referral_id bigint    not null,
    created_on  timestamp not null default current_timestamp
);

/*
 Creates a table for visiting anonymous analytics, when a user has privacy mode enabled.
 type: The type of visit this was.
 */
create table if not exists analytics.anonymous_visits
(
    type       visit_t   not null,
    created_on timestamp not null default current_timestamp
);

create index if not exists visits_referral_id_index on analytics.visits (referral_id);

do
$$
    begin
        /*
         Creates an analytics view for use with the server analytics.
         */
        create materialized view analytics.global_stats as
            select count(app.users.*)                                                                         as total_users,
                   (select count(app.profiles.*) from app.profiles)                                           as total_profiles,
                   (select count(app.profiles.*) filter ( where visibility = 'published' )
                    from app.profiles)                                                                        as profiles_published,
                   (select count(app.links.*) from app.links)                                                 as total_links,
                   (select count(app.themes.*) from app.themes)                                               as total_themes
            from app.users;
    exception
        when duplicate_table then raise notice 'analytics.analytics_view already added.';
    end;
$$ language plpgsql;

------------
-- Marketplace
------------

create schema if not exists marketplace;

/*
    Creates an addon table that contains the addon marketplace.
 */
create table if not exists marketplace.addons
(
    id                bigserial primary key unique,
    user_id           bigint references app.users (id) on update cascade on delete no action,
    resource_id       bigint unique,      -- The id of the resource this addon is related to
    type              addon_t   not null, -- The type of resource this is
    description       text,
    author            text,
    tags              text[],
    featured_sorting  smallint           default 0,
    price             decimal,
    payment_frequency text,
    global            bool               default false not null,
    metadata          jsonb     not null default '{
      "downloads": 0
    }',
    created_on        timestamp not null default current_timestamp
);

create index if not exists addons_type on marketplace.addons (type);
create index if not exists addons_description on marketplace.addons (description);
create index if not exists addons_author on marketplace.addons (author);
create index if not exists addons_tags on marketplace.addons (tags);
create index if not exists addons_featured_sorting on marketplace.addons (featured_sorting);
create index if not exists addons_price on marketplace.addons (price);
create index if not exists addons_global on marketplace.addons (global);

-- addon metadata indexes
create index if not exists addons_metadata_downloads on marketplace.addons ((metadata -> 'downloads'));

------------
-- Patches
-- Over time, things need to be updated and patched. This section is all about that.
------------


-- Update v2.1.9, fixes metadata being null sometimes
update app.profiles
set metadata=default
where metadata is null;
alter table app.profiles
    alter column metadata set not null;

-- Update v2.2, updates metadata tables for existing columns
update app.users
set metadata=default
where metadata is null;
alter table app.users
    alter column metadata set not null;

update app.links
set metadata=default
where metadata is null;
alter table app.links
    alter column metadata set not null;
