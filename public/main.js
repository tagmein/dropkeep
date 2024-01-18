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

function after(ref, child) {
 if (ref.nextElementSibling) {
  ref.parentElement.insertBefore(
   child,
   ref.nextElementSibling
  )
 } else {
  ref.parentElement.appendChild(child)
 }
}

function debounce(fn, delay = 500) {
 let timeout
 return function (...args) {
  clearTimeout(timeout)
  timeout = setTimeout(async function () {
   await fn(...args)
  }, delay)
 }
}

async function main() {
 const dkUrlInput =
  document.createElement('input')
 dkUrlInput.setAttribute('id', 'dk-url')
 dkUrlInput.addEventListener(
  'input',
  debounce(async function () {
   await dkOpen(dkUrlInput.value)
  })
 )
 document.body.appendChild(dkUrlInput)
 async function dkOpen(url) {
  localStorage.setItem('dk:lastUrl', url)
  const card = document.createElement('div')
  card.classList.add('dk-card')
  const content = document.createElement('div')
  content.classList.add('dk-content')
  const frame = document.createElement('iframe')
  if (['.pdf'].some((x) => url.endsWith(x))) {
   frame.setAttribute('src', url)
   card.appendChild(frame)
   after(dkUrlInput, card)
   return
  }
  frame.setAttribute(
   'referrerpolicy',
   'no-referrer'
  )
  frame.setAttribute('credentialless', true)
  frame.setAttribute('sandbox', 'allow-scripts')
  frame.setAttribute('src', '/frame.html')
  const frameUrl =
   document.createElement('input')
  frameUrl.setAttribute('readonly', 'readonly')
  frameUrl.setAttribute('value', url)
  content.appendChild(frameUrl)
  content.appendChild(frame)
  card.appendChild(content)
  after(dkUrlInput, card)
  const [jsonSource] = await Promise.all([
   dkHTML(url),
   new Promise((r) =>
    frame.addEventListener('load', r)
   ),
  ])
  frame.contentWindow.postMessage(
   {
    ...jsonSource,
    url,
   },
   '*'
  )
 }
 async function dkNavigate(url) {
  dkUrlInput.setAttribute('value', url)
  await dkOpen(url)
 }
 const lastUrl =
  localStorage.getItem('dk:lastUrl')
 addEventListener(
  'message',
  async function (event) {
   switch (event.data.type) {
    case 'navigate':
     await dkNavigate(event.data.url)
     break
   }
  }
 )
 if (lastUrl) {
  await dkNavigate(lastUrl)
 }
}

main().catch((e) => console.error(e))
