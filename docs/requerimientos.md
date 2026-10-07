# API Help Desk Interno

---

# Diagrama Entidad-Relación

El siguiente diagrama representa las entidades principales del sistema de Help Desk Interno, sus atributos, claves primarias, claves foráneas y relaciones.

![Diagrama Entidad-Relación del Help Desk](docs/der-help-desk.png)

---

# Entidades

## Entidad: User

Representa a los usuarios del sistema. Un usuario puede ser administrador, agente o empleado.

| Atributo    | Tipo          | Notas                               |
| ----------- | ------------- | ----------------------------------- |
| `id`        | Número Entero | PK autoincremental                  |
| `name`      | Texto         | Obligatorio                         |
| `lastName`  | Texto         | Obligatorio                         |
| `email`     | Texto         | Obligatorio, único                  |
| `password`  | Texto         | Obligatorio                         |
| `role`      | ENUM          | Obligatorio, por defecto `EMPLEADO` |
| `createdAt` | Fecha/Hora    | Generado automáticamente            |
| `updatedAt` | Fecha/Hora    | Actualizado automáticamente         |

### Valores de `role`

* `ADMIN`
* `AGENTE`
* `EMPLEADO`

### Relaciones

* Un usuario puede crear muchos tickets.
* Un usuario puede tener muchos tickets asignados.
* Un usuario puede escribir muchos comentarios.
* Un usuario puede recibir muchas notificaciones.

---

## Entidad: Category

Representa la categoría a la que pertenece un ticket.

| Atributo      | Tipo          | Notas                       |
| ------------- | ------------- | --------------------------- |
| `id`          | Número Entero | PK autoincremental          |
| `name`        | Texto         | Obligatorio, único          |
| `description` | Texto         | Opcional                    |
| `createdAt`   | Fecha/Hora    | Generado automáticamente    |
| `updatedAt`   | Fecha/Hora    | Actualizado automáticamente |

### Relaciones

* Una categoría puede tener muchos tickets.
* Cada ticket pertenece a una categoría.

---

## Entidad: Ticket

Representa una solicitud de soporte realizada dentro del sistema.

| Atributo       | Tipo          | Notas                              |
| -------------- | ------------- | ---------------------------------- |
| `id`           | Número Entero | PK autoincremental                 |
| `title`        | Texto         | Obligatorio                        |
| `description`  | Texto         | Obligatorio                        |
| `status`       | ENUM          | Obligatorio, por defecto `ABIERTO` |
| `priority`     | ENUM          | Obligatorio, por defecto `MEDIA`   |
| `createdById`  | Número Entero | FK → User                          |
| `assignedToId` | Número Entero | FK → User, opcional                |
| `categoryId`   | Número Entero | FK → Category                      |
| `createdAt`    | Fecha/Hora    | Generado automáticamente           |
| `updatedAt`    | Fecha/Hora    | Actualizado automáticamente        |

### Valores de `status`

* `ABIERTO`
* `EN_PROCESO`
* `RESUELTO`
* `CERRADO`

### Valores de `priority`

* `BAJA`
* `MEDIA`
* `ALTA`

### Relaciones

* Cada ticket es creado por un usuario.
* Un ticket puede estar asignado a un usuario.
* Cada ticket pertenece a una categoría.
* Un ticket puede tener muchos comentarios.
* Un ticket puede generar muchas notificaciones.

### Reglas principales

* Un ticket debe tener un usuario creador.
* Un ticket debe pertenecer a una categoría existente.
* La asignación de un ticket es opcional.
* Cuando se asigna un ticket, el usuario asignado debe tener rol `AGENTE`.

---

## Entidad: Comment

Representa un comentario realizado sobre un ticket.

| Atributo    | Tipo          | Notas                    |
| ----------- | ------------- | ------------------------ |
| `id`        | Número Entero | PK autoincremental       |
| `content`   | Texto         | Obligatorio              |
| `ticketId`  | Número Entero | FK → Ticket              |
| `userId`    | Número Entero | FK → User                |
| `createdAt` | Fecha/Hora    | Generado automáticamente |

### Relaciones

* Cada comentario pertenece a un ticket.
* Cada comentario pertenece a un usuario.
* Un ticket puede tener muchos comentarios.
* Un usuario puede escribir muchos comentarios.

### Reglas principales

* Solo se puede comentar sobre un ticket existente.
* El autor del comentario es determinado por el usuario autenticado.
* La fecha del comentario es generada automáticamente por el sistema.
* Los datos del autor y de la fecha no deben ser proporcionados por el cliente.
* Los permisos para comentar dependerán del rol del usuario y de las reglas de autorización definidas para el sistema.

---

## Entidad: Notification

Representa una notificación generada por eventos relacionados con los tickets.

| Atributo    | Tipo          | Notas                            |
| ----------- | ------------- | -------------------------------- |
| `id`        | Número Entero | PK autoincremental               |
| `message`   | Texto         | Obligatorio                      |
| `type`      | ENUM          | Obligatorio                      |
| `read`      | Booleano      | Obligatorio, por defecto `false` |
| `userId`    | Número Entero | FK → User                        |
| `ticketId`  | Número Entero | FK → Ticket, opcional            |
| `createdAt` | Fecha/Hora    | Generado automáticamente         |

### Valores de `type`

* `TICKET_ASIGNADO`
* `TICKET_RESUELTO`
* `TICKET_CERRADO`
* `NUEVO_COMENTARIO`

### Relaciones

* Cada notificación pertenece a un usuario.
* Una notificación puede estar asociada a un ticket.
* Un usuario puede recibir muchas notificaciones.
* Un ticket puede generar muchas notificaciones.

---

# Relaciones

| # | Entidad origen | Entidad destino | Cardinalidad | Descripción                                             |
| - | -------------- | --------------- | ------------ | ------------------------------------------------------- |
| 1 | User           | Ticket          | 1 : N        | Un usuario puede crear muchos tickets.                  |
| 2 | User           | Ticket          | 1 : 0..N     | Un usuario puede tener cero o muchos tickets asignados. |
| 3 | Category       | Ticket          | 1 : N        | Una categoría puede tener muchos tickets.               |
| 4 | Ticket         | Comment         | 1 : N        | Un ticket puede tener muchos comentarios.               |
| 5 | User           | Comment         | 1 : N        | Un usuario puede escribir muchos comentarios.           |
| 6 | User           | Notification    | 1 : N        | Un usuario puede recibir muchas notificaciones.         |
| 7 | Ticket         | Notification    | 1 : 0..N     | Un ticket puede tener cero o muchas notificaciones.     |

### Relaciones de Ticket con User

La entidad `Ticket` mantiene dos relaciones diferentes con `User`:

* `createdBy` → usuario que creó el ticket.
* `assignedTo` → agente responsable del ticket.

Esto permite distinguir entre el creador y el responsable del ticket.

---

# Normalización

## Primera Forma Normal — 1FN

El modelo cumple con la primera forma normal porque los atributos contienen valores atómicos y las relaciones múltiples se representan mediante entidades relacionadas.

Por ejemplo:

* los comentarios se almacenan como registros independientes;
* las notificaciones se almacenan como registros independientes;
* los tickets no almacenan directamente una lista de comentarios o notificaciones;
* las relaciones entre usuarios y tickets se representan mediante claves foráneas.

---

## Segunda Forma Normal — 2FN

El modelo utiliza claves primarias simples y los atributos de cada entidad dependen de su correspondiente clave primaria.

Por ejemplo:

* los datos del ticket dependen de `Ticket.id`;
* los datos del comentario dependen de `Comment.id`;
* los datos del usuario dependen de `User.id`.

Las relaciones entre entidades se representan mediante claves foráneas.

---

## Tercera Forma Normal — 3FN

El modelo evita almacenar información que pertenece a otras entidades.

Por ejemplo:

* los datos del usuario se almacenan en `User`;
* los datos de la categoría se almacenan en `Category`;
* los datos del ticket se almacenan en `Ticket`;
* los comentarios se almacenan en `Comment`;
* las notificaciones se almacenan en `Notification`.

Las entidades se relacionan mediante claves foráneas en lugar de duplicar información.

---

# Reglas principales de negocio

## Usuarios y autenticación

* Existen tres roles: `ADMIN`, `AGENTE` y `EMPLEADO`.
* Los usuarios tienen el rol `EMPLEADO` por defecto.
* El correo electrónico de cada usuario debe ser único.
* Las contraseñas deben almacenarse de forma segura.
* El acceso al sistema se realiza mediante autenticación basada en JWT.
* Las operaciones que requieren permisos deben validar el rol del usuario autenticado.
* Los Guards de NestJS serán responsables de controlar el acceso según el rol.

---

## Categorías

* Las categorías son utilizadas para clasificar los tickets.
* El nombre de una categoría debe ser único.
* Los administradores pueden crear categorías.
* Los administradores pueden modificar categorías.
* Los administradores pueden eliminar categorías según las restricciones de integridad de los tickets existentes.
* Los empleados pueden consultar las categorías disponibles.
* Los agentes pueden consultar las categorías disponibles.

---

## Tickets

* Cada ticket debe tener un usuario creador.
* Cada ticket debe pertenecer a una categoría.
* Un ticket puede estar sin asignar.
* Un ticket puede asignarse a un usuario con rol `AGENTE`.
* No se debe permitir asignar un ticket a un usuario inexistente.
* No se debe permitir asignar un ticket a un usuario que no tenga rol `AGENTE`.
* Todo ticket comienza en estado `ABIERTO`.
* Los tickets siguen el flujo de estados definido por el sistema.
* El título y la descripción del ticket son obligatorios.
* La prioridad del ticket puede ser `BAJA`, `MEDIA` o `ALTA`.

---

## Asignación de tickets

* El sistema permite asignar un ticket a un agente.
* El usuario seleccionado debe existir.
* El usuario seleccionado debe tener rol `AGENTE`.
* El sistema debe controlar qué roles tienen permiso para realizar asignaciones.
* La asignación de un ticket puede generar una notificación al agente asignado.

---

## Comentarios

* Un comentario debe pertenecer a un ticket existente.
* Un comentario debe tener un autor.
* El autor se obtiene del usuario autenticado.
* La fecha de creación se genera automáticamente.
* Los datos del autor y la fecha enviados por el cliente no deben utilizarse para determinar estos valores.
* Los permisos para crear comentarios dependen del rol del usuario y de las reglas de autorización definidas por el sistema.
* Los comentarios forman parte del historial del ticket.

---

## Notificaciones

* Las notificaciones pertenecen a un usuario.
* Una notificación puede estar relacionada con un ticket.
* Las notificaciones pueden generarse a partir de eventos relacionados con los tickets.
* El sistema contempla notificaciones para:

  * asignación de tickets;
  * resolución de tickets;
  * cierre de tickets;
  * nuevos comentarios.
* Las notificaciones pueden enviarse mediante correo electrónico con el servicio Nodemailer.
* El sistema puede mantener el estado de lectura de cada notificación.

---

# Flujo de estados de los Tickets

Los tickets siguen el siguiente ciclo de vida:

```text
┌──────────┐
│ ABIERTO  │
└────┬─────┘
     │
     ▼
┌─────────────┐
│ EN_PROCESO  │
└──────┬──────┘
       │
       ▼
┌──────────┐
│ RESUELTO │
└────┬─────┘
     │
     ▼
┌─────────┐
│ CERRADO │
└─────────┘
```

### Descripción

* `ABIERTO`: el ticket fue creado y todavía no está siendo gestionado.
* `EN_PROCESO`: un agente está trabajando sobre el ticket.
* `RESUELTO`: el problema o solicitud fue solucionado.
* `CERRADO`: el ticket finalizó su ciclo de atención.

---

# Roles y responsabilidades

## ADMIN

El administrador tiene acceso a las funciones administrativas del sistema.

Puede:

* gestionar usuarios según las reglas definidas;
* gestionar categorías;
* consultar tickets;
* asignar tickets a agentes;
* consultar métricas;
* acceder a funcionalidades administrativas.

---

## AGENTE

El agente es responsable de gestionar tickets asignados.

Puede:

* consultar tickets que le correspondan;
* trabajar sobre tickets asignados;
* cambiar el estado de los tickets según el flujo definido;
* agregar comentarios;
* consultar categorías;
* recibir notificaciones relacionadas con sus tickets.

---

## EMPLEADO

El empleado es el usuario que solicita soporte.

Puede:

* iniciar sesión;
* crear tickets;
* consultar sus tickets;
* consultar categorías;
* agregar comentarios según las reglas de autorización;
* consultar las notificaciones que le correspondan.

---

# Módulos de la aplicación

La aplicación seguirá una arquitectura modular utilizando NestJS.

Cada módulo contará con su propio `Module`, `Controller` y `Service`.

## Módulo: Usuarios / Auth

Responsable de la gestión de usuarios y autenticación.

Componentes principales:

* `UsersModule`
* `UsersController`
* `UsersService`
* autenticación mediante JWT;
* Guards para autorización;
* gestión de roles.

---

## Módulo: Categorías

Responsable de la gestión de categorías de los tickets.

Componentes principales:

* `CategoriesModule`
* `CategoriesController`
* `CategoriesService`

---

## Módulo: Tickets

Responsable de la creación, consulta, asignación y gestión del ciclo de vida de los tickets.

Componentes principales:

* `TicketsModule`
* `TicketsController`
* `TicketsService`

---

## Módulo: Comentarios

Responsable del historial de comentarios de los tickets.

Componentes principales:

* `CommentsModule`
* `CommentsController`
* `CommentsService`

---

## Módulo: Notificaciones

Responsable de generar y enviar notificaciones relacionadas con eventos del sistema.

Componentes principales:

* `NotificationsModule`
* `NotificationsController`
* `NotificationsService`

Las notificaciones podrán utilizar un servicio de envío de correo electronico (Nodemailer).

---

# Métricas

El sistema deberá disponer de un endpoint interno para obtener métricas relacionadas con los tickets.

Las métricas deberán estar agrupadas de forma que puedan ser utilizadas posteriormente para representar información mediante gráficos.

Entre las métricas posibles se encuentran:

* cantidad de tickets por estado;
* cantidad de tickets por categoría;
* cantidad de tickets por agente;
* cantidad de tickets creados;
* cantidad de tickets resueltos;
* cantidad de tickets cerrados;
* cantidad de tickets según prioridad.

Las métricas serán de uso interno y el acceso deberá estar protegido mediante autenticación y autorización.

---

# Arquitectura y organización del proyecto

La aplicación estará desarrollada utilizando una arquitectura modular basada en NestJS.

Cada funcionalidad principal estará separada en:

```text
Module
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL
```

Los DTOs serán utilizados para validar los datos recibidos mediante las solicitudes HTTP.

Los Guards serán utilizados para controlar la autenticación y autorización de las rutas.

La comunicación con la base de datos será realizada mediante Prisma ORM.

---

# Flujo general del sistema

```text
                    ┌──────────────┐
                    │    Usuario   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     Auth     │
                    │     JWT      │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Ticket    │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        Categoría     Asignación    Comentarios
                           │            │
                           ▼            ▼
                        Agente      Historial
                           │
                           └─────┬──────┘
                                 ▼
                          Notificaciones
                                 │
                                 ▼
                             Nodemailer
```

---

# Tecnologías

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* Passport / JWT
* Swagger / OpenAPI
* class-validator
* Nodemailer.
* Git
* GitHub
* Trello

---

# Entregables

El proyecto incluye:

* API REST desarrollada con NestJS.
* Arquitectura modular mediante `Module`, `Controller` y `Service`.
* Base de datos relacional PostgreSQL.
* Modelo de datos gestionado mediante Prisma.
* DER con las entidades y relaciones.
* Autenticación mediante JWT.
* Autorización basada en roles.
* Guards para protección de rutas.
* DTOs para validación de datos.
* Manejo global de excepciones.
* Manejo de errores de Prisma.
* Documentación mediante Swagger.
* Migraciones de Prisma.
* Gestión de categorías.
* Gestión del ciclo de vida de tickets.
* Sistema de comentarios e historial.
* Endpoint interno de métricas.
* Sistema de notificaciones mediante correo electrónico con Nodemailer.
* Control de acceso según roles.
* Historial de trabajo mediante Git y Pull Requests.
* Organización del trabajo mediante Trello.