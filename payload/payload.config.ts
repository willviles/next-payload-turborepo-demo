import { buildConfig } from 'payload/config';
import path from 'path';
import seo from '@payloadcms/plugin-seo';
import { Users } from './collections/Users';
import { Pages } from './collections/Pages';
import { MainMenu } from './globals/MainMenu';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';
import { Media } from './collections/Media';

const adapter = s3Adapter({
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
  },
  bucket: process.env.S3_BUCKET,
})

export default buildConfig({
  collections: [
    Pages,
    Users,
    Media
  ],
  globals: [
    MainMenu,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, '../payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    seo({
      collections: [
        'pages',
      ],
    }),
    cloudStorage({
      collections: {
        'media': {
          adapter
        }
      },
    }),
  ],
});
