/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    META_TITLE: (process.env.BRANDING !== 'false') ? (process.env.META_TITLE ?? 'Under construction') + ' - Singlelink' : (process.env.META_TITLE ?? 'Under construction'),
    META_DESC: (process.env.BRANDING !== 'false') ? (process.env.META_DESC ?? 'Another micro-site waiting to be built!') + ' Built with Singlelink.' : (process.env.META_DESC ?? 'Another micro-site waiting to be built!'),
    META_IMG: process.env.META_IMG ?? 'https://singlelink.co/og-image-updated.jDB_',
    BRANDING: (process. env.BRANDING !== 'false') ?? true,
    SECRET: process.env.SECRET,
    PASSWORD: process.env.PASSWORD
  },
  experimental: {
    outputStandalone: true
  },
  // TODO: TEMPORARY SOLUTION FOR COMPONENT _APP.TSX BUILD ERRORS REMOVE
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig