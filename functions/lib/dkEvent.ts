import {
 EventContext,
 KVNamespace,
} from '@cloudflare/workers-types'

interface Env {
 DROPKEEP_KV: KVNamespace
}

export type DKEvent = EventContext<Env, '', any>
