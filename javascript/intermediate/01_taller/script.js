const URL = "http://www.ups.edu.ec"
var texto = "Programacion y Plataformas Web"

function imprimir_01() {
    let texto2 = "Avengers"
    //Esto no se debe hacer
    var texto3 = "Liga de la Justicia"

    console.log(texto)
    console.log(texto2)
    console.log(texto3)
    
    //No se puede cmabiar a una constante.
    ULR = "http://www.ups.edu.ec/home"
    console.log(URL)
}

function imprimir_02() {
    console.log(texto)
    // texto 2 no existe en esta funcion
    console.log(texto2)
    // texto 3 no existe en esta funcion
    console.log(texto3)
}

imprimir_01()
imprimir_02()