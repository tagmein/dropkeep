function render(json) {
 console.log(json)
 const source = document.createElement('pre')
 source.textContent = json
 document.body.appendChild(source)
}

addEventListener('message', function (event) {
 render(event.data)
})
