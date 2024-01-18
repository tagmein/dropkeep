import type {
 KVNamespace,
 PagesFunction,
} from '@cloudflare/workers-types'
import { dropKeepKV } from './lib/dropKeepKV'

interface Env {
 DROPKEEP_KV: KVNamespace
}

interface RequestBody {
 operation: string
 data: string
}

async function parseBody(
 context: EventContext<Env, '', any>
): Promise<RequestBody | null> {
 try {
  return context.request.json()
 } catch (e) {
  return null
 }
}

export const onRequestPost: PagesFunction<Env> =
 async function (
  context: EventContext<Env, '', any>
 ) {
  const dkkv = dropKeepKV(context)
  const requestBody = await parseBody(context)
  if (requestBody === null) {
   return new Response(
    JSON.stringify({
     error: 'missing request body',
    }),
    {
     status: 400,
    }
   )
  }
  const { data, operation } = requestBody
  if (
   typeof requestBody.operation !== 'string'
  ) {
   return new Response(
    JSON.stringify({
     error: 'operation missing in request body',
    }),
    {
     status: 400,
    }
   )
  }
  if (!(requestBody.operation in dkkv)) {
   return new Response(
    JSON.stringify({
     error: 'unknown operation in request body',
    }),
    {
     status: 400,
    }
   )
  }
  try {
   const responseBody = await dkkv[operation](
    data
   )
   return new Response(responseBody)
  } catch (e) {
   return new Response(
    JSON.stringify({ error: e.message }),
    {
     status: 500,
    }
   )
  }
 }
