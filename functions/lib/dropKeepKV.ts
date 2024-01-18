import { HTMLToJSON } from 'html-to-json-parser'
import { getKV } from './getKV'
import { DKEvent } from './dkEvent'

export function dropKeepKV(context: DKEvent) {
 const kv = getKV(context)
 async function echo(data: any) {
  return data
 }
 async function html(data: { url: string }) {
  const response = await fetch(data.url)
  if (!response.ok) {
   return HTMLToJSON(
    `<p>${response.status} ${response.statusText}</p>`
   )
  }
  return HTMLToJSON(
   `<html>${await response.text()}</html>`
  )
 }
 async function status() {
  return 'ok'
 }
 return {
  echo,
  html,
  status,
 }
}
