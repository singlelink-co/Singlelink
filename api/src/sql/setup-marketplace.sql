------------
-- Marketplace
------------

create schema if not exists marketplace;

/*
    Creates an addon table that contains the addon marketplace.
 */
create table if not exists marketplace.addons
(
    id                bigserial primary key,
    user_id           bigint references app.users (id) on update cascade,
    resource_id       bigint unique not null, -- The id of the resource this addon is related to
    type              addon_t       not null, -- The type of resource this is
    display_name      text,                   -- The name of this resource
    description       text,
    author            text,
    tags              text[],
    featured_sorting  smallint      not null default 0,
    price             decimal,
    payment_frequency text,
    global            bool                   default false not null,
    version           text                   default '0.0.1',
    metadata          jsonb                  default '{}' not null,
    private_metadata  jsonb         not null default '{}',
    created_on        timestamp     not null default current_timestamp,
    last_updated      timestamp     not null default current_timestamp
);

create index if not exists addons_type on marketplace.addons (type);
create index if not exists addons_display_name on marketplace.addons (display_name);
create index if not exists addons_description on marketplace.addons (description);
create index if not exists addons_author on marketplace.addons (author);
create index if not exists addons_tags on marketplace.addons (tags);
create index if not exists addons_featured_sorting on marketplace.addons (featured_sorting);
create index if not exists addons_price on marketplace.addons (price);
create index if not exists addons_global on marketplace.addons (global);
create index if not exists addons_metadata on marketplace.addons (metadata);
create index if not exists addons_last_updated on marketplace.addons (last_updated);

create table if not exists marketplace.installs
(
    id         bigserial primary key,
    profile_id bigint references app.profiles (id) on update cascade,
    addon_id   bigint references marketplace.addons (id) on update cascade,
    created_on timestamp not null default current_timestamp,

    unique (profile_id, addon_id) -- make sure user can't install the same thing twice
);

create index if not exists installs_profile_id on marketplace.installs (profile_id);
create index if not exists installs_addon_id on marketplace.installs (addon_id);

------------
-- Patches
-- Over time, things need to be updated and patched. This section is all about that.
------------

alter table marketplace.addons
    add column if not exists private_metadata jsonb not null default '{}';
