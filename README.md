# Ecommerce

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.8.

## Migraciones de PostgreSQL

El backend usa `node-pg-migrate` para compartir y aplicar cambios en la estructura de la base de datos. Cada integrante tiene su propia base en Docker: Git comparte los archivos de migración, no las tablas ni los datos del volumen local.

### Preparar el entorno por primera vez

1. Abrir Docker Desktop y esperar a que esté en ejecución.
2. Desde la raíz del repositorio, entrar al backend e instalar las dependencias, incluidas las de desarrollo:

   ```powershell
   cd backend
   npm ci
   ```

3. Crear `backend/.env` si todavía no existe. Si ya existe, conservar la configuración local. Usar los siguientes campos con los valores propios:

   ```dotenv
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nombre_de_la_base
   DB_USER=usuario_local
   DB_PASSWORD=contraseña_local
   ```

   `migrations.config.cjs` lee estas variables directamente.
   
4. Desde `backend`, iniciar PostgreSQL y comprobar que figure como `healthy`:

   ```powershell
   docker compose up -d db
   docker compose ps
   ```

5. Aplicar las migraciones pendientes:

   ```powershell
   npm run migrate -- up
   ```

No es necesario iniciar Angular ni Express para ejecutar migraciones. PostgreSQL sí debe estar disponible. Cambiar las credenciales en `.env` no cambia las de una base que ya fue inicializada en un volumen existente.

### Ejecutar migraciones que agregó un compañero

Después de actualizar el repositorio con `git pull`, ejecutar desde `backend`:

```powershell
npm ci
docker compose up -d db
docker compose ps
npm run migrate -- up
```

Esperar a que la base esté saludable antes del último comando. La herramienta registra las migraciones aplicadas en `public.pgmigrations` y ejecuta únicamente las pendientes. No hay que recrear manualmente las tablas ni ejecutar directamente el SQL de los archivos.

### Crear una nueva migración

Desde `backend`, generar un archivo con un nombre que describa el cambio:

```powershell
npm run migrate -- create agregar-descripcion-categorias -j mjs
```

Esto crea `backend/migrations/<timestamp>_agregar-descripcion-categorias.mjs`; todavía no modifica la base. Se usa `.mjs` porque el backend trabaja con módulos ES.

Editar el archivo generado. Por ejemplo, para agregar una columna a la tabla `categorias` que ya crea la primera migración:

```js
export function up(pgm) {
  pgm.sql(`
    ALTER TABLE categorias ADD COLUMN descripcion TEXT;
  `);
}

export function down(pgm) {
  pgm.sql(`
    ALTER TABLE categorias DROP COLUMN descripcion;
  `);
}
```

`up` aplica el cambio y `down` define cómo revertirlo. Aplicar la migración localmente y comprobar el resultado:

```powershell
npm run migrate -- up
```

Para inspeccionar la tabla desde la consola de PostgreSQL:

```powershell
docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Dentro de `psql`, ejecutar `\d categorias` para ver su estructura, `SELECT * FROM public.pgmigrations ORDER BY run_on;` para consultar el historial y `\q` para salir.

### Revertir un cambio local

Si hace falta probar la reversión, este comando ejecuta el `down` de la última migración aplicada:

```powershell
npm run migrate -- down
```

Revisar primero su contenido: un `DROP TABLE` elimina la tabla y sus datos; un `DROP COLUMN` elimina los datos de esa columna. No usarlo como paso habitual para actualizar la base. Para volver a aplicar el cambio, ejecutar `npm run migrate -- up`.

### Qué compartir y reglas del equipo

- Subir a Git los archivos de `backend/migrations`, `backend/migrations.config.cjs` y los cambios necesarios en `backend/package.json` y `backend/package-lock.json`.
- No subir `.env`, credenciales ni `node_modules`.
- No modificar ni renombrar una migración que ya fue aplicada y compartida. Crear otra para el siguiente cambio.
- Si una tabla ya se creó manualmente, revisar y alinear su estructura e historial antes de aplicar una migración que la cree. No borrar datos ni marcar migraciones como aplicadas sin comprobar que coincidan.
- No ejecutar `docker compose down -v` para actualizar el esquema: elimina el volumen con los datos. Usar las migraciones.
- Crear una tabla no inserta registros automáticamente. Los datos de ejemplo deben compartirse mediante un script de carga inicial separado cuando sea necesario.

Para más detalles del entorno, consultar [la guía de ejecución con Docker y PostgreSQL](README_Ejecucion_Docker_PostgreSQL.md).

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
