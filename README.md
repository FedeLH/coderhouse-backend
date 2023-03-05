# coderhouse-backend
Este repositorio contendrá los entregables y proyecto final correspondientes al curso de "Programación-Backend" de Coderhouse comisión #39730 del alumno "Federico Hanson".

Precondición:
-Tener instalado nodejs, instrucciones en la web oficial:
  
  https://nodejs.org/en/

-Tener instalado nodemon (Se necesita haber instalado nodejs y se recomienda instalarlo de forma global):

  npm i -g nodemon

Para ejecutar el entregable correspondiente se debe contar con node instalado y correr el comando: 

  node <file_name>.js

Para levantar el servidor se debe ejecutar desde el proyecto:

  nodemon ./src/app.js

Los endpoints disponibles son:

GET http://localhost:8080/products/:pid
  Sí el pid no existe devolvera un objeto que contentra el campo "Error" cuyo valor sera el mensaje del error correspondiente

GET http://localhost:8080/products/?limit=n
  Donde n debe ser el numero de productos que se desea traer, si no se especifica se traeran todos
