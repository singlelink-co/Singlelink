create schema if not exists users;
create schema if not exists history;

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

/*
 Creates an accounts table with a list of profiles associated with it.
 */
create table if not exists users.accounts
(
    id                bigserial primary key unique,
    email             varchar(340) unique not null,
    full_name         text,
    pass_hash         varchar(60)         not null,
    active_profile    text,
    payment_id        text,                                        -- The associated payment account id (external) for this user
    subscription_tier subscription_t               default 'free', -- The subscription tier of this user
    inventory         jsonb                        default '{}',   -- All the stuff this account owns
    metadata          jsonb                        default '{}',
    created_on        timestamp           not null default current_timestamp
);

create index if not exists accounts_email_index on users.accounts (email);

/*
 Creates a theme table that contains all user themes.
 */
create table if not exists users.themes
(
    id          bigserial primary key unique,
    label       text      not null,
    global      bool               default false not null,
    colors      jsonb              default '{}',
    custom_css  text,
    custom_html text,
    account_id  bigint    references users.accounts (id) on update cascade on delete set null,
    created_on  timestamp not null default current_timestamp
);

create index if not exists themes_global_index on users.themes (global);
create index if not exists themes_account_id_index on users.themes (account_id);

/*
 Creates a profile table with a constraint pointing to a parent account.
 */
create table if not exists users.profiles
(
    id            bigserial primary key unique,
    handle        text unique not null,                                                    -- The name of the profile in the url
    account_id    bigint references users.accounts (id) on update cascade on delete cascade,
    image_url     text,
    headline      text,                                                                    -- The name that shows up on the page
    subtitle      text,                                                                    -- The name underneath a profile's avatar
    social        jsonb                default '{}',
    custom_css    text,
    custom_html   text,
    custom_domain text unique,
    theme_id      bigint references users.themes (id) on update cascade on delete cascade, -- The profile's currently selected theme
    visibility    visibility_t         default 'unpublished',
    metadata      jsonb                default '{}',
    created_on    timestamp   not null default current_timestamp
);

create index if not exists profiles_account_id_index on users.profiles (account_id);
create index if not exists profiles_theme_id_index on users.profiles (theme_id);
create index if not exists profiles_visibility_index on users.profiles (visibility);

/*
 Creates a table for the individual links created.
 */
create table if not exists users.links
(
    id            bigserial primary key unique,
    profile_id    bigint references users.profiles (id) on update cascade on delete cascade,
    url           text default '#'   not null,
    "order"       int                not null,
    label         text               not null,
    subtitle      text,
    style         text,
    custom_css    text,
    use_deep_link bool default false not null,
    created_on    timestamp          not null default current_timestamp
);

create index if not exists links_profile_id on users.links (profile_id);
create index if not exists links_url_index on users.links (url);

/*
 Creates a table for analytics, keeps track of all the visits.
 type: The type of visit this was.
 referral: The link or page this visit points to.
 */
create table if not exists history.visits
(
    type       visit_t   not null,
    referral   bigint    not null,
    created_on timestamp not null default current_timestamp
);

create index if not exists visits_referral_index on history.visits (referral);

do
$$
    begin
        /*
         Creates an analytics view for use with the server analytics.
         */
        create materialized view users.analytics_view as
            select count(users.accounts.*)                                                                        as total_users,
                   (select count(users.profiles.*) from users.profiles)                                           as total_profiles,
                   (select count(users.profiles.*) filter ( where visibility = 'published' )
                    from users.profiles)                                                                          as profiles_published,
                   (select count(users.links.*) from users.links)                                                 as total_links,
                   (select count(users.themes.*) from users.themes)                                               as total_themes
            from users.accounts;
    exception
        when duplicate_table then raise notice 'users.analytics_view already added.';
    end;
$$ language plpgsql;

