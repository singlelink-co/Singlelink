create schema if not exists users;
create schema if not exists history;

/*
 Create MongoDB-like object id generator
 */
create extension if not exists pgcrypto;
create sequence if not exists epoch_seq increment by 1 maxvalue 9 cycle;

create or replace function generate_object_id() returns varchar as
$$
declare
    time_component bigint;
    epoch_seq      int;
    machine_id     text    := encode(gen_random_bytes(3), 'hex');
    process_id     bigint;
    seq_id         text    := encode(gen_random_bytes(3), 'hex');
    result         varchar := '';
begin
    select floor(extract(epoch from clock_timestamp())) into time_component;
    select nextval('epoch_seq') into epoch_seq;
    select pg_backend_pid() into process_id;

    result := result || lpad(to_hex(time_component), 8, '0');
    result := result || machine_id;
    result := result || lpad(to_hex(process_id), 4, '0');
    result := result || seq_id;
    result := result || epoch_seq;
    return result;
end;
$$ language plpgsql;

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
    user_id           varchar(24) primary key unique default generate_object_id(),
    full_name         text,
    email             varchar(340),
    pass_hash         varchar(60),
    active_profile    text,
    payment_id        text,                                          -- The associated payment account id (external) for this user
    subscription_tier subscription_t                 default 'free', -- The subscription tier of this user
    inventory         jsonb                          default '{}',   -- All the stuff this account owns
    metadata          jsonb                          default '{}',
    created_on        timestamp not null             default current_timestamp
);

create index if not exists accounts_email_index on users.accounts (email);

/*
 Creates a theme table that contains all user themes.
 */
create table if not exists users.themes
(
    theme_id    varchar(24) primary key unique default generate_object_id(),
    label       text        not null,
    global      bool                           default false not null,
    colors      jsonb                          default '{}',
    custom_css  text,
    custom_html text,
    owner       varchar(24) references users.accounts (user_id) on update cascade on delete set null,
    created_on  timestamp   not null           default current_timestamp
);

create index if not exists themes_global_index on users.themes (global);

/*
 Creates a profile table with a constraint pointing to a parent account.
 */
create table if not exists users.profiles
(
    handle        text primary key unique,                                                            -- The name of the profile in the url
    owner         varchar(24) references users.accounts (user_id) on update cascade on delete cascade,
    image_url     text,
    headline      text,                                                                               -- The name underneath a profile's avatar
    social        jsonb              default '{}',
    custom_css    text,
    custom_domain text unique,
    theme         varchar(24) references users.themes (theme_id) on update cascade on delete cascade, -- The profile's currently selected theme
    visibility    visibility_t       default 'unpublished',
    metadata      jsonb              default '{}',
    created_on    timestamp not null default current_timestamp
);

create index if not exists profiles_visibility_index on users.profiles (visibility);

/*
 Creates a table for the individual links created.
 */
create table if not exists users.links
(
    link_id       varchar(24) primary key unique default generate_object_id(),
    url           text                           default '#'   not null,
    "order"       int                                          not null,
    label         text                                         not null,
    subtitle      text,
    style         text,
    custom_css    text,
    use_deep_link bool                           default false not null,
    created_on    timestamp                                    not null default current_timestamp
);

create index if not exists links_url_index on users.links (url);


/*
 Creates a table for analytics, keeps track of all the visits.
 type: The type of visit this was.
 referral: The link or page this visit points to.
 */
create table if not exists history.visits
(
    type       visit_t     not null,
    referral   varchar(24) not null,
    created_on timestamp   not null default current_timestamp
);

create index if not exists visits_referral_index on history.visits (referral);

do
$$
    begin
        /*
         Creates an analytics view for use with the managers analytics.
         */
        create materialized view users.analytics_view as
            select count(users.accounts.user_id)                                 as total_users,
                   (select count(users.profiles.visibility) from users.profiles) as total_profiles,
                   (select count(users.profiles.visibility) filter ( where visibility = 'published' )
                    from users.profiles)                                         as profiles_published,
                   (select count(users.links.link_id) from users.links)          as total_links,
                   (select count(users.themes.theme_id) from users.themes)       as total_themes
            from users.accounts;
    exception
        when duplicate_table then raise notice 'users.analytics_view already added.';
    end;
$$ language plpgsql;

