import type { PagesFunction } from '@cloudflare/workers-types'
import { dropKeepKV } from './lib/dropKeepKV'
import { DKEnv, DKEvent } from './lib/dkEvent'

interface RequestBody {
 operation: string
 data: string
}

async function parseBody(
 context: DKEvent
): Promise<RequestBody | null> {
 try {
  return context.request.json()
 } catch (e) {
  return null
 }
}

export const onRequestPost: PagesFunction<DKEnv> =
 async function (context: DKEvent) {
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
