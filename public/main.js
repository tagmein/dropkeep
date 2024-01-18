const apiUrl =
 location.origin === 'http://localhost:8076'
  ? 'https://dropkeep.app/api'
  : '/api'

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
 if (
  typeof result === 'object' &&
  result &&
  'error' in result
 ) {
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

async function dkHTML(url) {
 return api({
  operation: 'html',
  data: { url },
 })
}

async function dkStatus() {
 return api({
  operation: 'status',
 })
}

async function main() {
 const url = document.createElement('input')
 const view = document.createElement('iframe')
 view.setAttribute('allow', 'cross-origin')
 url.addEventListener(
  'input',
  async function () {
   const jsonSource = await dkHTML(url.value)
   const viewHtml = `<!doctype html>
<html>
 <head>
  <script src="/frame.js"></script>
 </head>
 <body>
  render(${JSON.stringify(jsonSource)})
 </body>
</html>`
   view.setAttribute(
    'src',
    URL.createObjectURL(
     new Blob([viewHtml], {
      type: 'text/html',
     })
    )
   )
  }
 )
 document.body.appendChild(url, view)
 document.body.appendChild(view)
}

main().catch((e) => console.error(e))
