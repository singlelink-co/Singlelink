/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PGUSER: process.env.PGUSER,
    PGHOST: process.env.PGHOST,
    PGDATABASE: process.env.PGDATABASE,
    PGPASSWORD: process.env.PGPASSWORD,
    PGPORT: process.env.PGPORT,
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    META_TITLE: process.env.META_TITLE ?? 'Singlelink under construction',
    META_DESC: process.env.META_DESC ?? 'Another Singlelink micro-site waiting to be built!',
    META_IMG: process.env.META_IMG ?? 'https://singlelink.co/og-image-updated.jpg',
    BRANDING: (process.env.BRANDING !== 'false') ?? true
  }
}

module.exports = nextConfig
