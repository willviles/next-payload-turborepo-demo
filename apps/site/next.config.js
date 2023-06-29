const { withPayload } = require("@payloadcms/next-payload");
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = withPayload(
  {
    transpilePackages: [
      '@next-payload-demo/foo'
    ],
    eslint: {
      ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    images: {
      domains: [
        "localhost",
        "nextjs-vercel.payloadcms.com",
        `${process.env.NEXT_PUBLIC_S3_ENDPOINT}`.replace("https://", ""),
      ],
    },
  },
  {
    configPath: path.resolve(__dirname, "./payload/payload.config.ts"),
  }
);

module.exports = nextConfig;
