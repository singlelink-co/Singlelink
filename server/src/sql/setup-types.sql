create extension if not exists pg_trgm;

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

do
$$
    begin
        /*
         Linktype_t specifies what kind of addon this is.

         theme: A theme.
         preset: A preset.
         plugin: A plugin.
         */
        create type linktype_t as enum ('link', 'social', 'image', 'video');
    exception
        when duplicate_object then raise notice 'addon_t already added.';
    end ;
$$ language plpgsql;
