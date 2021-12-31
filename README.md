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
BotanicApp requiere [Node.js](https://nodejs.org/) v10+ para ejecutar la vista web y el servidor web.
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

Ahora, vamos a crear la base de datos a ocupar mediante el comando `create database botanic;`

Y para configurar el usuario para la aplicación, vamos a ejecutar 
```
CREATE USER 'botanic_user'@'%' IDENTIFIED WITH mysql_native_password BY 'botanic_user1';

GRANT ALL PRIVILEGES ON * . * TO 'botanic_user'@'%';

FLUSH PRIVILEGES;
```

Con esto, ya hemos terminado de configurar la instancia, solo queda crear las tablas necesarias.

Salimos de la consola de mysql mediante `exit` y ejecutamos el siguiente comando

```
mysql -u botanic_user -p botanic < ruta_raiz_proyecto/database.sql
```
Escribimos la contraseña de la cuenta (botanic_user1) y con ello, se habrá creado la estructura de las tablas.

## Instalación del proyecto

Una vez teniendo todas las dependencias necesarias, podemos empezar clonando el proyecto
Para clonar el proyecto basta con abrir una terminal en la carpeta o lugar donde se desee guardar la carpeta del proyecto y ejecutar lo siguiente

```
git clone https://github.com/rodrigoalvarez-20/BotanicApp.git
```

Lo cual se encarga de clonar el proyecto de manera local para poder trabajar en el
Nos dirigimos a la carpeta recien clonada mediante `cd BotanicApp` y ahí podremos ver todo el codigo fuente de la aplicación

Para instalar las dependencias del proyecto, debemos de ejecutar `npm i` en una terminal, ubicada en la carpeta raiz del proyecto
Esto se encarga de instalar todas las dependencias de React y librerias utilizadas para poder ejecutar la vista web y el servidor.

### Iniciar el servidor web

Estando en la carpeta raiz del proyecto, en una terminal, solo es necesario ejecutar `npm run server` para iniciar el servidor de desarrollo.

### Iniciar la vista web

Estando en la carpeta raiz del proyecto, en una terminal, solo es necesario ejecutar `npm run start` para iniciar la vista web del proyecto.