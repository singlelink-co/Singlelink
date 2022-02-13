/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PGUSER: process.env.PGUSER,
    PGHOST: process.env.PGHOST,
    PGDATABASE: process.env.PGDATABASE,
    PGPASSWORD: process.env.PGPASSWORD,
    PGPORT: process.env.PGPORT,
    META_TITLE: (process.env.BRANDING !== 'false') ? (process.env.META_TITLE ?? 'Under construction') + ' - Singlelink' : (process.env.META_TITLE ?? 'Under construction'),
    META_DESC: (process.env.BRANDING !== 'false') ? (process.env.META_DESC ?? 'Another micro-site waiting to be built!') + ' Built with Singlelink.' : (process.env.META_DESC ?? 'Another micro-site waiting to be built!'),
    META_IMG: process.env.META_IMG ?? 'https://singlelink.co/og-image-updated.jpg',
    BRANDING: (process. env.BRANDING !== 'false') ?? true,
    SECRET: process.env.SECRET,
    PASSWORD: process.env.PASSWORD
  }
}

module.exports = nextConfig
