# coderhouse-backend

Este repositorio contendrá los entregables y proyecto final correspondientes al curso de "Programación-Backend" de Coderhouse comisión #39730 del alumno "Federico Hanson".

Precondiciones:

1. Tener instalado nodejs, instrucciones en la web oficial:

   https://nodejs.org/en/

2. Tener instalado nodemon (Para trabajar en modo desarrollo, se recomienda instalarlo de forma global):

   npm i -g nodemon

3. Tener un servidor de base de datos (MongoDB) local o en la nube (Atlas):

   Por defecto el servidor intentará conectarse a uno local (ver ./src/config/config.js)

   Se pueden pedir las variables de conexión a una BD en la nube al autor

4. En caso de querer instalar un servidor local de BD:

   Deberá instalar el community server ver página oficial:

   https://www.mongodb.com/try/download/community

5. En caso de querer levantar un servidor en la nube puede optar por la version gratuita de Atlas, creando una cuenta en:

   https://www.mongodb.com/docs/atlas/

Pasos para levantar el proyecto:

1. Clonar el proyecto en la carpeta de preferencia

   git clone https://github.com/FedeLH/coderhouse-backend.git

2. Instalar dependencias:

   npm i

3. Contar con servidor de BD

4. Configurar variables de entorno (en caso de no hacerse hay unas por defecto):

   En la carpeta raíz hay un archivo .env.sample

   Se debe crear el archivo .env con las mismas variables

5. Levantar el servidor:

   Con node (production):

   npm run start

   Con nodemon (development):

   npm run dev

6. Se puede solicitar collection de Postman al autor
