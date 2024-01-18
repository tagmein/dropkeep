function populateRootElement(root, data) {
 if (typeof data.attributes === 'object') {
  for (const [k, v] of Object.entries(
   data.attributes
  )) {
   root.setAttribute(k, v)
  }
 }
 createChildElements(root, data.content)
}

function createChildElements(root, contents) {
 for (const content of contents) {
  if (typeof content === 'string') {
   root.appendChild(
    document.createTextNode(content)
   )
  } else {
   if (content.type === 'script') {
    continue
   }
   const node = document.createElement(
    content.type
   )
   if (typeof content.attributes === 'object') {
    for (const [k, v] of Object.entries(
     content.attributes
    )) {
     node.setAttribute(k, v)
    }
   }
   if (content.content) {
    createChildElements(node, content.content)
   }
   root.appendChild(node)
  }
 }
}

function render(json) {
 console.log(json)
 const root =
  json?.content?.find(
   (x) => x.type === 'html'
  ) ?? json
 if (!Array.isArray(root?.content)) {
  return
 }
 const foundHead = root.content.find(
  (x) => x.type === 'head'
 )
 if (foundHead) {
  populateRootElement(document.head, foundHead)
 }
 const foundBody = root.content.find(
  (x) => x.type === 'body'
 )
 if (foundBody) {
  populateRootElement(document.body, foundBody)
 }
}

addEventListener('message', function (event) {
 render(event.data)
})
