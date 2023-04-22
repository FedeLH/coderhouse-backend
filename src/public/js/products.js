// let url = window.location.href
// let urlObj = new URL(url)
// let searchParams = urlObj.searchParams

// const select = document.getElementById("miSelect")
// let opcionSeleccionada = "opcion2"
// for (var i = 0; i < select.options.length; i++) {
//   if (select.options[i].value === valor) {
//     select.selectedIndex = i
//     break
//   }
// }

// function detectarCambio() {
//     opcionSeleccionada = select.options[select.selectedIndex].value
// }
// const parsingUrl = _ => {
//     if (window.location.search) {
//         return window.location.search
//     } else {
//         return false
//     }
// } 

// var miString = "Este es un ejemplo de string";
// if (miString.includes("ejemplo")) {
//   console.log("El string contiene la palabra 'ejemplo'");
// } else {
//   console.log("El string no contiene la palabra 'ejemplo'");
// }

// const changeOptions = select => {
//     const value = select.options[select.selectedIndex].value

//     Si no posee el parametro lo tiene que setear
//     if (!searchParams.has(select.name) && select.name === "query") {
        
//         Tengo que armar query
        
//     }
    
//     Si posee el param pero elegi none, tengo que borrarlo
//     if (value === "none") {
//         searchParams.delete(select.name)
//     }
    
//     Tengo que setear

//     if (searchParams.has(select.name)) {
//         if (value === "none") {
//             searchParams.delete(select.name)
//         } else {
//             if (select.id === "sort") {
//                 searchParams.set(select.id,value)
//             }
//         }
//     }
//     let params = parsingUrl()
//     if (params) {
//         if (params.includes(select.id)) {
//             console.log("Tengo que reemplazar el valor")
//             console.log(window.location.href)
//         }
//         console.log("Tengo que sumar")
//         console.log(window.location.href += "&"+select.id+"="+select.options[select.selectedIndex].value)
//     }
//     console.log("Tengo que iniciar")
//     console.log(window.location.href+"?"+select.id+"="+select.options[select.selectedIndex].value)
// }
