# Botanic App

Una aplicación simple para gestionar las plantas de los usuarios

## Características

- Seccion de perfil de usuario
- Listado de plantas
- Modelos base para las plantas
- Soporte para imagenes
- Muchas cosas más...

## Requerimientos

**Este tutorial esta diseñado para sistemas Linux basados en Debian**
BotanicApp requiere [Node.js](https://nodejs.org/) v10+ para ejecutar la vista web y [PHP](https://www.php.net) para ejecutar el servidor web.
Adicionalmente se requiere [MYSQL](https://www.mysql.com/) para poder conectar con los servicios de base de datos.
A continuacion se detallan los pasos para instalar cada uno de los requerimientos

### Node.Js

Para poder instalar [Node.JS]() en el sistema, se deben de ejecutar los siguientes comandos en la terminal

```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt update
sudo apt install nodejs
```

Ahora, comprobaremos que se haya instalado de manera correcta ejecutando

```
npm --version
node --version
```

### PHP

Para poder ejecutar el servidor es necesario contar con [PHP](), no importa tanto la versión; sin embargo, este se actualiza cada que se hace una actualización del sistema.
Verificamos que ya tengamos instalado PHP en el sistema ejecutando lo siguiente en una terminal

```
php -v
```

Y si el comando muestra una salida satisfactoria, podemos omitir este paso y continuar con la siguiente dependencia. En el caso de que no, continuar leyendo.
Para poder instalar PHP en el sistema se debe de ejecutar

```
sudo apt-get install php7.3
```

**En caso de que haya algun error, se deben de agregar los repositorios de PHP7**

```
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
sudo apt install php7.3
```

### MySQL Server

Para poder conectar con la base de datos desde el backend, es necesario contar con un SGBD, el cual, se puede instalar ejecutando los siguientes comandos en una terminal

```
sudo apt install mysql-server
```

**En el caso de que el comando falle, se le recomienda seguir el [siguiente tutorial](https://computingforgeeks.com/how-to-install-mysql-on-kali-linux/)**

Por default, para iniciar la consola de Mysql se debe de ejecutar

```
sudo mysql -u root -p
```

Y la contraseña por defecto está en blanco

## Instalación del proyecto

Una vez teniendo todas las dependencias necesarias, podemos empezar clonando el proyecto
Para clonar el proyecto basta con abrir una terminal en la carpeta o lugar donde se desee guardar la carpeta del proyecto y ejecutar lo siguiente

```
git clone https://github.com/rodrigoalvarez-20/BotanicApp.git
```

Lo cual se encarga de clonar el proyecto de manera local para poder trabajar en el
Nos dirigimos a la carpeta recien clonada mediante `cd BotanicApp` y ahí podremos ver todo el codigo fuente de la aplicación

### Configuración del frontend

Para instalar las dependencias del proyecto, debemos de ejecutar `npm i` en una terminal, ubicada en la carpeta raiz del proyecto
Esto se encarga de instalar todas las dependencias de React y librerias utilizadas para poder ejecutar la vista web.

### Configuración del backend

Como se puede notar, existe una carpeta llamada "api", la cual contiene todo el código PHP necesario para crear un servidor virtual y realizar el intercambio de datos entre la base de datos y la vista web.

Primero, se debe de configurar la base de datos
Para crear nuestra base de datos, se debe de iniciar sesión en la consola de mysql mediante `sudo mysql -u root -p` y posteriormente, ejecutar `create database botanic`. Lo cual nos crea un nuevo esquema de trabajo para generar tablas y datos dentro de ello

En la carpeta raiz del proyecto se encuentra el archivo `database.sql`, el cual contiene el script necesario para crear la base de datos y generar datos de prueba en el catalogo de plantas
Para cargar este archivo, basta con ejecutar

```
sudo mysql  -u root botanic < ruta_carpeta_raiz_proyecto/database.sql
```

Con lo cual se generarán las tablas y datos necesarios para utilizar la aplicación

Una vez terminado con la base de datos, en otra terminal, nos dirigimos a la carpeta raiz del proyecto y ejecutamos el servidor PHP local mediante `php -S 127.0.0.1:8000`, lo cual creará un servidor local de desarrollo en la direccion 127.0.0.1 y el puerto 8000.

### Frontend

Ahora, solo falta ejecutar las vistas web.
En otra terminal, nos dirigimos a la carpeta raiz del proyecto y ejecutamos `npm run start` para poder ejecutar el servidor local de React y correr la aplicacion web

Una vez terminado esto, podemos ir a nuestro navegador, en la direccion `http://127.0.0.1:3000` y podremos ver la pagina inicial de la aplicacion