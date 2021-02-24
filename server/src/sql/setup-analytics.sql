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
