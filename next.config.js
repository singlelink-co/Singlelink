/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GRAPHQL_URL: 'http://localhost:3000/api/graphql'
  }
}

module.exports = nextConfig
