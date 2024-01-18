import {
 EventContext,
 KVNamespace,
} from '@cloudflare/workers-types'

export interface DKEnv {
 DROPKEEP_KV: KVNamespace
 DROPKEEP_R2: R2Bucket
}

export type DKEvent = EventContext<
 DKEnv,
 '',
 any
>
