# Help Desk Interno

API backend para registrar y gestionar solicitudes de soporte técnico dentro de una organización. Permite administrar usuarios y categorías, crear y consultar tickets, asignarlos a agentes, cambiar su estado, agregar comentarios y generar notificaciones.

La aplicación está construida con NestJS y TypeScript. Usa PostgreSQL y Prisma para persistir los datos.


## Tecnologías

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT y bcrypt
- Swagger/OpenAPI
- Socket.IO
- class-validator y class-transformer

## Roles y permisos

- **ADMIN**: puede consultar usuarios, crear usuarios, consultar todos los tickets, asignarlos a agentes y cambiar sus estados.
- **AGENTE**: puede consultar usuarios y todos los tickets, crear y modificar categorías, cambiar el estado de tickets y agregar comentarios.
- **EMPLEADO**: puede registrarse e iniciar sesión, crear tickets, consultar sus propios tickets y agregar comentarios a sus propios tickets.

Las rutas de categorías requieren autenticación para consulta. Tanto `ADMIN` como `AGENTE` pueden crear, modificar y eliminar categorías.

## Tickets

Cada ticket tiene título, descripción, estado, prioridad, creador, categoría y, opcionalmente, un agente asignado.

Los estados disponibles son:

- `ABIERTO`
- `EN_PROCESO`
- `RESUELTO`
- `CERRADO`

Las prioridades disponibles son:

- `BAJA`
- `MEDIA`
- `ALTA`

Todo ticket nuevo comienza en estado `ABIERTO`. 

Los empleados consultan únicamente los tickets que crearon. Los administradores y agentes pueden consultar todos los tickets.

La asignación está disponible para administradores y valida que el usuario seleccionado exista y tenga rol `AGENTE`.

## Comentarios

Los usuarios autenticados pueden agregar comentarios a tickets existentes. 
El autor se obtiene del usuario autenticado y la fecha de creación la establece la base de datos.
Se pueden consultar los comentarios e historial de un ticket. 
Los empleados solo pueden consultar y comentar los tickets que crearon. 
Los agentes y administradores pueden consultar y comentar otros tickets.

## Notificaciones

El sistema guarda notificaciones cuando un ticket pasa a `RESUELTO` o `CERRADO`, y cuando se agrega un comentario. 
Las notificaciones se asocian a un usuario y pueden incluir el ticket relacionado.

El proyecto incluye un gateway de Socket.IO. 

## Modelo de datos

El esquema de Prisma define estas entidades:

- `User`
- `Category`
- `Ticket`
- `Comment`
- `Notification`

Las relaciones, campos y enums están definidos en `prisma/schema.prisma`. 
Las migraciones se encuentran en `prisma/migrations`.


## Requisitos previos

- Node.js
- pnpm
- PostgreSQL

## Instalación y configuración

1. Instalar las dependencias:

   ```powershell
   pnpm install
   ```

2. Copiar `.env.example` como `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Crear un bd en PostgreSQL y configurar en el `.env` la conexión a PostgreSQL y el secreto JWT:

   ```env
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/NOMBRE_DE_LA_BASE_DE_DATOS"
   JWT_SECRET="UN_SECRETO_LOCAL"
   ```

4. Aplicar las migraciones:

   ```powershell
   pnpm prisma migrate dev
   ```

5. Generar Prisma Client:

   ```powershell
   pnpm  prisma generate
   ```

6. Iniciar la aplicación en modo desarrollo:

   ```powershell
   pnpm start:dev
   ```

La aplicación escucha en el puerto `3000` por defecto. Se puede cambiar mediante la variable `PORT`.

## Datos iniciales

El seed está definido en `prisma/seed.ts` y crea usuarios de ejemplo y categorías. Para ejecutarlo:

```powershell
pnpm prisma db seed
```

El seed contiene credenciales de ejemplo para desarrollo local. 
Ejecutarlo una sola vez en una base limpia: no está configurado para omitir registros ya existentes.

## Documentación de la API

La documentación Swagger/OpenAPI de las rutas está disponible en `/api-docs` una vez iniciada la aplicación.

```text
/api-docs
```

## Rutas principales

Entre las rutas implementadas se encuentran:

- `POST /auth/register`
- `POST /auth/login`
- `GET /users/me`
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `GET /categories`
- `GET /categories/:id`
- `POST /categories`
- `PATCH /categories/:id`
- `DELETE /categories/:id`
- `POST /tickets`
- `GET /tickets`
- `GET /tickets/:id`
- `PATCH /tickets/:id`
- `PATCH /tickets/:id/assign`
- `POST /tickets/:ticketId/comments`
- `GET /tickets/:ticketId/comments`
- `GET /tickets/:ticketId/comments/ticket/:ticketId`
- `GET /tickets/:ticketId/comments/:id`

Las rutas protegidas requieren un token JWT en el encabezado:

```text
Authorization: Bearer <token>
```

## Comandos disponibles

```powershell
pnpm start:dev
pnpm start:prod
pnpm build
```

## Funcionalidades y decisiones del equipo

El equipo definió las siguientes funcionalidades y reglas para el sistema:

- Registro de usuarios e inicio de sesión mediante JWT.
- Roles de usuario: `ADMIN`, `AGENTE` y `EMPLEADO`. El registro asigna `EMPLEADO` por defecto.
- Consulta de usuarios: `ADMIN` puede crear usuarios y `ADMIN` y `AGENTE` pueden consultar la lista.
- Consulta y gestión de categorías: `ADMIN` y `AGENTE` pueden crearlas, modificarlas y eliminarlas.
- Creación y consulta de tickets: Los empleados consultan sus propios tickets; los administradores y agentes pueden consultar todos.
- Los tickets se clasifican por categoría y prioridad (`BAJA`, `MEDIA` o `ALTA`). Todo ticket nuevo comienza en estado `ABIERTO`.
- Los estados disponibles son `ABIERTO`, `EN_PROCESO`, `RESUELTO` y `CERRADO`.
- `ADMIN` puede asignar tickets a usuarios con rol `AGENTE`.
- Los usuarios autenticados pueden agregar comentarios. El autor se registra a partir de la sesión del usuario.
- El equipo eligió WebSockets con Socket.IO para las notificaciones en tiempo real.
- Las notificaciones se guardan cuando un ticket se resuelve o se cierra, y cuando se agrega un comentario.
- Validación de datos mediante DTOs y `ValidationPipe`.
- Documentación de la API con Swagger/OpenAPI en `/api-docs`.

El modelo de datos y el detalle del comportamiento actual se describen en
[`docs/requerimientos.md`](docs/requerimientos.md).