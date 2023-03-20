# coderhouse-backend
Este repositorio contendrá los entregables y proyecto final correspondientes al curso de "Programación-Backend" de Coderhouse comisión #39730 del alumno "Federico Hanson".

Precondición:
-Tener instalado nodejs, instrucciones en la web oficial:
  
  https://nodejs.org/en/

-Tener instalado nodemon (Se necesita haber instalado nodejs y se recomienda instalarlo de forma global):

  npm i -g nodemon

Para ejecutar el entregable correspondiente se debe contar con node instalado y correr el comando: 

  npm run start

Para levantar el servidor se debe ejecutar desde el proyecto:

  nodemon ./src/app.js

Endpoints:

Los endpoints siempre devolverán un objeto con las propiedades status (actualmente "error" o "success") y payload que contendra lo que se espera del endpoint, productos, carritos, etc.

Ejemplo:

{
  "status": "success"
  "payload": []
}

Si no se modifica la configuracion del servidor correrá en http://localhost:8080

Dispone de las siguientes rutas:

.../api/products

Obtener producto por id
GET    .../:pid
  request.body = none

Obtener productos activos
GET    .../?limit=n
  request.body = none

Editar producto por id
PUT    .../:pid
  request.body = {
    "description": {"type": "string" ,"required: false"},
    "price":       {"type": "number" ,"required: false"},
    "title":       {"type": "string" ,"required: false"},
    "stock":       {"type": "number" ,"required: false"},
    "code":        {"type": "string" ,"required: false"},
    "category":    {"type": "string" ,"required: false"},
    "status":      {"type": "boolean","required: false"},
    "thumbnails":  {"type": "array"  ,"required: false"}
  }

Borrado logico de producto
DELETE .../:pid
  request.body = none

Agregar producto nuevo*
POST   .../
  request.body = {
    "description": {"type": "string" ,"required: true"},
    "price":       {"type": "number" ,"required: true"},
    "title":       {"type": "string" ,"required: true"},
    "stock":       {"type": "number" ,"required: true"},
    "code":        {"type": "string" ,"required: true"},
    "category":    {"type": "string" ,"required: true"},
    "status":      {"type": "boolean","required: false"},
    "thumbnails":  {"type": "array"  ,"required: false"}
  }

.../api/carts

Obtener los productos de un carrito
GET    .../:cid
  request.body = none

Obtener los carritos**
GET    .../?limit=n
  request.body = none

Agregar nuevo carrito
POST   .../
  request.body = none

Agregar un producto a un carrito por id
POST   .../:cid/product/:pid
  request.body = none

Comentarios extras
* code es un valor único, sin importar que se haya borrado el producto, actualmente si se desea agregar un producto borrado, se deberia editar el status del producto borrado, se podria implementar de ser necesario que al intentar agregar un producto borrado el mismo se reactive.
** este endpoint no era requerido para esta entrega, pero se considera util para ver como afectan los demas endpoints al listado de carritos sin tener que abrir el archivo y poder visualizar todo desde la herramienta en la que se realicen los test (ejemplo: Postman***)
*** en caso de usarse Postman se pueden solicitar los archivos para importar los endpoints y el entorno de trabajo 
