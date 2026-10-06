# Help Desk

Este proyecto consiste en el desarrollo de un sistema de **Help Desk** para gestionar solicitudes de soporte técnico dentro de una organización.

El sistema permite que los **empleados** creen tickets para reportar problemas o solicitar asistencia, seleccionando una categoría y proporcionando una descripción del inconveniente. Los **agentes de soporte** pueden consultar y gestionar los tickets asignados, agregar comentarios y actualizar su estado hasta su resolución. Por su parte, los **administradores** se encargan de gestionar los **usuarios**, **categorías** y asignaciones de **tickets**.

Además, el sistema cuenta con un módulo de **notificaciones**, que permite informar a los usuarios sobre cambios relevantes en sus tickets mediante correo electrónico.

El proyecto está desarrollado siguiendo una arquitectura modular, separando las responsabilidades de **usuarios/autenticación, categorías, tickets, comentarios y notificaciones**.


## Roles y permisos

### Creación de usuarios

- **ADMIN**: puede crear usuarios con rol ADMIN, AGENTE o EMPLEADO.
- **AGENTE**: puede crear usuarios EMPLEADO.
- **EMPLEADO**: puede registrarse como EMPLEADO, pero no puede asignarse a sí mismo los roles ADMIN o AGENTE.

Los roles ADMIN y AGENTE son roles internos y no pueden ser asignados libremente por un empleado durante su registro.

(documentación a mejorar......)