# Guía de ejecución del proyecto --- Angular + Node.js + Express + PostgreSQL

Esta guía explica cómo preparar y ejecutar el proyecto localmente
utilizando Docker para PostgreSQL. Está pensada para todos los
integrantes del equipo.

## 1. Requisitos previos

Antes de iniciar, instalar y comprobar:

-   **Node.js y npm**.
-   **Docker Desktop**, abierto y en ejecución.
-   **Git**, para clonar o actualizar el repositorio.

Comprobar las instalaciones desde PowerShell o la terminal de VS Code:

``` powershell
node -v
npm -v
docker --version
docker compose version
```

## 2. Obtener el proyecto

Clonar el repositorio del equipo o actualizar la copia local. Luego
abrir una terminal en la carpeta del proyecto.

La estructura relevante es:

``` text
ecommerce/
├── backend/
│   ├── docker-compose.yml
│   ├── package.json
│   ├── .env                 # Se crea localmente; no se sube a Git
│   └── src/
└── package.json             # Frontend Angular
```

Los comandos de esta guía suponen que la terminal está ubicada en
`ecommerce` o en `ecommerce/backend`, según se indique.

## 3. Configurar las variables de entorno del backend

Dentro de `ecommerce/backend`, crear un archivo llamado `.env`.

Contenido esperado:

``` env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taller_web_II
DB_USER=usuario_tw_II
DB_PASSWORD=REEMPLAZAR_POR_LA_CLAVE_LOCAL
```

Cada integrante debe configurar su propia contraseña local. No compartir
credenciales reales por el repositorio, chats públicos ni commits.

> Importante: el archivo `.env` debe estar excluido mediante
> `backend/.gitignore`. El repositorio puede incluir un `.env.example`
> con nombres de variables y valores ficticios, pero nunca con
> contraseñas reales.

## 4. Configuración de Docker Compose

El archivo `backend/docker-compose.yml` define el servicio de
PostgreSQL. La configuración acordada utiliza las variables del `.env`:

``` yaml
services:
  db:
    image: postgres:17-alpine
    container_name: taller-web-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

Si el archivo del repositorio tiene una configuración equivalente, no es
necesario reemplazarlo. Lo importante es que las variables `DB_NAME`,
`DB_USER` y `DB_PASSWORD` coincidan con las del `.env`.

## 5. Iniciar PostgreSQL con Docker

Abrir una terminal en `ecommerce/backend`:

``` powershell
cd backend
docker compose up -d
```

La primera ejecución puede tardar porque Docker debe descargar la imagen
de PostgreSQL.

Comprobar el estado:

``` powershell
docker compose ps
```

El contenedor `taller-web-db` debe aparecer en ejecución y, una vez
completado el chequeo, como `healthy`.

Para consultar los registros del contenedor:

``` powershell
docker compose logs db
```

### Verificar el acceso a PostgreSQL

Ejecutar:

``` powershell
docker exec -it taller-web-db psql -U usuario_tw_II -d taller_web_II
```

Dentro de la consola SQL, ejecutar:

``` sql
SELECT current_database(), current_user;
```

Los valores esperados son:

-   Base de datos: `taller_web_II`
-   Usuario: `usuario_tw_II`

Para salir de `psql`:

``` sql
\q
```

Si el equipo modifica el nombre de la base o el usuario en `.env`,
también debe actualizar los valores usados en este comando.

## 6. Instalar e iniciar el backend

Desde `ecommerce/backend`, instalar las dependencias:

``` powershell
npm install
```

Iniciar el servidor en modo desarrollo:

``` powershell
npm run dev
```

El backend debe comprobar la conexión a PostgreSQL antes de comenzar a
escuchar. El resultado esperado es similar a:

``` text
Conexión con PostgreSQL exitosa
Servidor ejecutándose en http://localhost:3000
```

Dejar esta terminal abierta mientras se trabaja.

La configuración actual de desarrollo utiliza `tsx watch src/index.ts`,
por lo que reinicia el proceso cuando se detectan cambios en los
archivos TypeScript.

## 7. Instalar e iniciar Angular

Abrir una segunda terminal en la carpeta `ecommerce` (la raíz del
frontend):

``` powershell
npm install
npm start
```

El frontend Angular normalmente queda disponible en:

``` text
http://localhost:4200
```

Confirmar la dirección exacta que informa Angular en la terminal.

Dejar esta segunda terminal abierta.

## 8. Orden habitual para iniciar el proyecto

En cada sesión de trabajo:

1.  Abrir Docker Desktop y esperar a que esté iniciado.
2.  Abrir una terminal en `ecommerce/backend`.
3.  Ejecutar `docker compose up -d`.
4.  Ejecutar `npm run dev` en el backend.
5.  Abrir otra terminal en `ecommerce`.
6.  Ejecutar `npm start`.
7.  Abrir `http://localhost:4200` en el navegador.

Si las dependencias ya están instaladas y no cambiaron los archivos
`package.json` o `package-lock.json`, no es necesario ejecutar
`npm install` en cada inicio.

## 9. Detener los servicios

Para detener Angular y Express, ir a cada terminal y presionar
`Ctrl + C`.

Para detener el contenedor de PostgreSQL sin borrar los datos:

``` powershell
cd backend
docker compose stop
```

Para volver a iniciarlo en otra sesión:

``` powershell
docker compose start
```

También se puede ejecutar `docker compose down` para eliminar el
contenedor y la red del proyecto. El volumen nombrado `postgres_data` se
conserva si no se utiliza `-v`.

> **No ejecutar `docker compose down -v` como comando habitual.** La
> opción `-v` elimina el volumen de PostgreSQL y borra los datos
> almacenados. Solo utilizarla si se desea reinicializar deliberadamente
> la base y se confirmó que los datos pueden perderse.

## 10. Posibles problemas

### Error `28P01: password authentication failed`

La contraseña o el usuario que usa Node.js no coinciden con los
registrados en PostgreSQL.

Revisar:

-   `DB_USER` y `DB_PASSWORD` en `backend/.env`.
-   Que Docker Compose esté leyendo esas mismas variables.
-   Que el volumen no haya sido inicializado anteriormente con otras
    credenciales.

PostgreSQL utiliza las variables `POSTGRES_USER`, `POSTGRES_PASSWORD` y
`POSTGRES_DB` para inicializar una base nueva. Si el volumen ya contiene
una base, cambiar `.env` no actualiza automáticamente las credenciales
existentes.

Si hay datos que deben conservarse, **no borrar el volumen**. Se debe
corregir o cambiar la contraseña del usuario dentro de PostgreSQL, o
acordar una migración segura.

Solo si es un entorno descartable y todos aceptan perder los datos, se
puede reinicializar:

``` powershell
docker compose down -v
docker compose up -d
```

### El contenedor no aparece como `healthy`

Consultar:

``` powershell
docker compose ps
docker compose logs db
```

Comprobar que Docker Desktop esté funcionando y que el puerto `5432` no
esté ocupado por otra instalación local de PostgreSQL.

### El puerto 5432 está ocupado

Otro servicio puede estar utilizando el puerto. Revisar qué proceso lo
ocupa antes de cambiar la configuración. Si se modifica el puerto
publicado, mantener `DB_PORT` coherente con el puerto local elegido.

### Express no puede conectarse

Verificar que:

-   El contenedor esté iniciado y saludable.
-   `backend/.env` exista y tenga los valores correctos.
-   `DB_HOST=localhost` sea correcto cuando Node.js se ejecuta
    directamente en Windows y PostgreSQL está publicado por Docker en el
    puerto local 5432.
-   Se hayan instalado las dependencias del backend con `npm install`.

### Angular carga, pero no obtiene datos

Que ambos servidores estén activos no garantiza por sí solo que el
frontend esté consumiendo la API. Revisar la URL configurada en los
servicios Angular, la pestaña **Network** del navegador y los registros
del backend.

## 11. Reglas para trabajar en equipo

-   Versionar `backend/docker-compose.yml`.
-   Versionar `backend/package.json` y `backend/package-lock.json`.
-   No versionar `backend/.env`.
-   No versionar carpetas `node_modules/`.
-   Compartir los cambios de dependencias mediante los archivos
    `package.json` y `package-lock.json`.
-   No borrar el volumen de PostgreSQL sin coordinarlo con el equipo.
-   Mantener los nombres de las variables de entorno consistentes entre
    `.env`, Docker Compose y la configuración de Node.js.

## Resumen rápido

  ------------------------------------------------------------------------
  Acción                  Carpeta                 Comando
  ----------------------- ----------------------- ------------------------
  Iniciar PostgreSQL      `ecommerce/backend`     `docker compose up -d`

  Ver estado de           `ecommerce/backend`     `docker compose ps`
  PostgreSQL                                      

  Iniciar backend         `ecommerce/backend`     `npm run dev`

  Iniciar Angular         `ecommerce`             `npm start`

  Detener                 Cada terminal           `Ctrl + C`
  backend/frontend                                

  Detener PostgreSQL      `ecommerce/backend`     `docker compose stop`
  conservando datos                               
  ------------------------------------------------------------------------

------------------------------------------------------------------------

**Nota:** esta documentación refleja la configuración acordada para el
proyecto: PostgreSQL 17 en Docker, base `DB_NAME`, usuario
`DB_USER`, puerto local `5432`, backend Express en `3000` y
frontend Angular normalmente en `4200`. Cada uno  debe usar sus
propias credenciales locales en `.env`.
