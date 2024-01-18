import { getKV } from './getKV'
import { DKEvent } from './dkEvent'

export function dropKeepKV(context: DKEvent) {
 const kv = getKV(context)
 async function echo(data: any) {
  return data
 }
 async function status() {
  return 'ok'
 }
 return {
  echo,
  status,
 }
}
