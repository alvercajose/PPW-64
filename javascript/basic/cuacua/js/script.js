function seleccionar_opcion(opcion) {
    var opcion_1 = document.getElementById("opcion_01").src="cua1.avif"
    var opcion_2 = document.getElementById("opcion_02").src="cua2.jpg"

    if (opcion == 1) {
        opcion_1.style.zIndex = 2
        opcion_2.style.zIndex = 1
    } else if (opcion == 2) {
        opcion_1.style.zIndex = 1
        opcion_2.style.zIndex = 2
    }
}