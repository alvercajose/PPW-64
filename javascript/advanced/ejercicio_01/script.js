const URL = 'https://rickandmortyapi.com/api/character/'
var xhttp = null

function conectar (personaje){
    xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = obtener_respuesta
    xhttp.open('GET', URL + personaje)
    xhttp.send()
}

function obtener_respuesta(){
    if(xhttp != null && xhttp.onreadystate == 4){
        if(xhttp.status == 200){
            let dato = JSON.parse(xhttp.responseText)
            
            let container = document.getElementById('container')
            let personaje = `<h1>${dato.name}</h1>
            <img src="${dato.image}"/>`
            container.innerHTML = personaje
        }
    }
}