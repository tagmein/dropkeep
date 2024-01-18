import { civilMemoryKV } from '@tagmein/civil-memory'
import { DKEvent } from './dkEvent'

export function getKV(context: DKEvent) {
 return civilMemoryKV.cloudflare({
  binding: context.env.DROPKEEP_KV,
 })
}
