const apiUrl =
 location.origin === 'http://localhost:8076'
  ? 'https://dropkeep.app'
  : ''

async function api(bodyRaw) {
 const body = JSON.stringify(bodyRaw)
 const response = await fetch(apiUrl, {
  method: 'POST',
  body,
  headers: {
   'Content-Length': body.length,
   'Content-Type': 'application/json',
  },
 })
 if (!response.ok) {
  throw new Error(
   `${response.status} ${response.statusText}`
  )
 }
 const result = await response.json()
 if ('error' in result) {
  throw new Error(result.error)
 }
 return result
}

async function dkEcho(data) {
 return api({
  operation: 'echo',
  data,
 })
}

async function dkStatus() {
 return api({
  operation: 'status',
  data,
 })
}

async function main() {
 console.log(
  'echo',
  await echo({ hello: 'world' })
 )
 console.log('dkStatus', await dkStatus())
}

main().catch((e) => console.error(e))
