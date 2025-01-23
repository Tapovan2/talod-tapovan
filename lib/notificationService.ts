import { redis } from "./redis"

export const CHANNELS = {
  MARK_CREATED: "MARK_CREATED",
  MARK_UPDATED: "MARK_UPDATED",
}

export async function publishEvent(channel: string, message: string) {
  await redis.publish(channel, message)
}

