function combineUrls(baseUrl, relativeUrl) {
 const base = new URL(baseUrl)
 return new URL(relativeUrl, base).href
}

function populateRootElement(url, root, data) {
 if (typeof data.attributes === 'object') {
  for (const [k, v] of Object.entries(
   data.attributes
  )) {
   root.setAttribute(k, v)
  }
 }
 createChildElements(url, root, data.content)
}

function createChildElements(
 url,
 root,
 contents
) {
 for (const content of contents) {
  if (typeof content === 'string') {
   const tempSpan =
    document.createElement('span')
   tempSpan.innerHTML = content
   root.appendChild(
    document.createTextNode(
     tempSpan.textContent
    )
   )
  } else {
   const node = document.createElement(
    content.type
   )
   if (typeof content.attributes === 'object') {
    for (const [k, v] of Object.entries(
     content.attributes
    )) {
     switch (k) {
      case 'href':
      case 'src':
       node.setAttribute(k, combineUrls(url, v))
       break
      default:
       node.setAttribute(k, v)
     }
    }
   }
   if (content.content) {
    createChildElements(
     url,
     node,
     content.content
    )
   }
   root.appendChild(node)
  }
 }
}

function render(json) {
 window.location = new URL(json.url)
 document.body.addEventListener(
  'click',
  function (e) {
   debugger
   if (e.target.tagName === 'A') {
    e.preventDefault()
    top.postMessage(
     {
      type: 'navigate',
      url: combineUrls(
       json.url,
       e.target.getAttribute('href')
      ),
     },
     '*'
    )
   }
  }
 )

 const candidateHtml = json?.content?.find(
  (x) => x.type === 'html'
 )
 const root =
  (json?.content?.some((x) => x.type === 'body')
   ? json
   : candidateHtml) ?? html

 if (!Array.isArray(root?.content)) {
  return
 }
 const foundHead = root.content.find(
  (x) => x.type === 'head'
 )
 if (foundHead) {
  populateRootElement(
   json.url,
   document.head,
   foundHead
  )
 }
 const foundBody = root.content.find(
  (x) => x.type === 'body'
 )
 if (foundBody) {
  populateRootElement(
   json.url,
   document.body,
   foundBody
  )
 }
}

addEventListener('message', function (event) {
 render(event.data)
})
