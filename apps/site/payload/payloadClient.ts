import { type Payload, getPayload } from "payload/dist/payload";
import config from './payload.config';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is missing')
}

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is missing')
}

type PayloadPromise = ReturnType<typeof getPayload>

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 *
 * Source: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js
 */
let globalWithPayload = global as typeof globalThis & {
  payload: {
    client: Payload | undefined
    promise?: PayloadPromise | undefined
  }
}

let cached = globalWithPayload.payload

if (!cached) {
  cached = globalWithPayload.payload = { client: undefined, promise: undefined }
}

export const getPayloadClient = async () => {
  if (cached.client) {
    console.info(`--- USING CACHED CLIENT --`)
    return cached.client
  }

  if (!cached.promise) {
    console.info(`--- NEW PAYLOAD --`)
    cached.promise = getPayload({
      // Make sure that your environment variables are filled out accordingly
      mongoURL: process.env.MONGODB_URI as string,
      secret: process.env.PAYLOAD_SECRET as string,
      config
    })
  }

  try {
    console.info(`--- AWAITING NEW PAYLOAD INIT --`)
    cached.client = await cached.promise
  } catch (err) {
    console.error(`--- ERROR --`, err)
    cached.promise = undefined
    throw err
  }

  return cached.client
};

export default getPayloadClient;
