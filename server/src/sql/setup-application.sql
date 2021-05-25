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
    inventory         jsonb                        default '{}', -- All the stuff this account owns
    metadata          jsonb               not null default '{}',
    private_metadata  jsonb               not null default '{
      "favorites": [],
      "googleId": null,
      "githubId": null,
      "emailNotifications": {
        "major": true,
        "minor": true,
        "marketing": true,
        "leaderboard": true
      }
    }',
    created_on        timestamp           not null default current_timestamp
);

create index if not exists accounts_email_index on app.users (email);
create index if not exists accounts_private_metadata_favorites on app.users ((private_metadata -> 'favorites'));
create index if not exists accounts_private_metadata_googleId on app.users ((private_metadata -> 'googleId'));
create index if not exists accounts_private_metadata_github_id on app.users ((private_metadata -> 'githubId'));

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
    user_id     bigint references app.users (id) on update cascade,
    created_on  timestamp not null default current_timestamp
);

create index if not exists themes_global_index on app.themes (global);
create index if not exists themes_user_id_index on app.themes (user_id);

alter table app.themes
    drop constraint themes_user_id_fkey,
    add constraint themes_user_id_fkey foreign key (user_id) references app.users (id) on update cascade;

/*
 Creates a profile table with a constraint pointing to a parent account.
 */
create table if not exists app.profiles
(
    id               bigserial primary key unique,
    handle           text unique not null,                                                        -- The name of the profile in the url
    user_id          bigint,
    image_url        text,
    headline         text,                                                                        -- The name that shows up on the page
    subtitle         text,                                                                        -- The name underneath a profile's avatar
    social           jsonb                default '{}',
    show_watermark   bool                 default true,                                           -- The "Proudly built with Singlelink" underneath people's profiles
    custom_css       text,
    custom_html      text,
    custom_domain    text unique,
    theme_id         bigint      references app.themes (id) on update cascade on delete set null, -- The profile's currently selected theme
    visibility       visibility_t         default 'unpublished',
    metadata         jsonb       not null default '{
      "privacyMode": false,
      "unlisted": false
    }',
    private_metadata jsonb       not null default '{}',
    created_on       timestamp   not null default current_timestamp
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
    id               bigserial primary key unique,
    profile_id       bigint references app.profiles (id) on update cascade on delete cascade,
    type             linktype_t         default 'link' not null,
    url              text               default '#' not null,
    sort_order       int       not null,
    label            text      not null,
    subtitle         text,
    style            text,
    custom_css       text,
    use_deep_link    bool               default false not null,
    metadata         jsonb     not null default '{}',
    private_metadata jsonb     not null default '{}',
    created_on       timestamp not null default current_timestamp
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

alter table app.links
    add column if not exists type linktype_t default 'link' not null;

alter table app.users
    add column if not exists private_metadata jsonb not null default '{
      "favorites": [],
      "googleId": null,
      "githubId": null,
      "emailNotifications": {
        "major": true,
        "minor": true,
        "marketing": true,
        "leaderboard": true
      }
    }';

alter table app.profiles
    add column if not exists private_metadata jsonb not null default '{}';

alter table app.links
    add column if not exists private_metadata jsonb not null default '{}';

-- Update v3.0
alter table app.users
    drop column if exists subscription_tier;

alter table app.users
    drop column if exists payment_id;
