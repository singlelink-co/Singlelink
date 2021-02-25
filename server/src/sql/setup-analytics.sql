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

/*
 Creates a table for visiting analytics.
 type: The type of visit this was.
 referral_id: The link or page this visit points to.
 */
create table if not exists analytics.marketplace_installs
(
    addon_id   bigint    not null,
    user_id    bigint references app.users (id) on update cascade,
    created_on timestamp not null default current_timestamp,

    unique (addon_id, user_id)
);

create index if not exists marketplace_installs_addon on analytics.marketplace_installs (addon_id);
create index if not exists marketplace_installs_user_id on analytics.marketplace_installs (user_id);

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
