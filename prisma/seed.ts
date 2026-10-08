import {
  PrismaClient,
  Role,
  TicketStatus,
  Priority,
} from '../src/generated/prisma/client.js';

import { PrismaPg } from '@prisma/adapter-pg';

import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('12345678', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Admin',
        lastName: 'Sistema',
        email: 'admin@helpdesk.com',
        password,
        role: Role.ADMIN,
      },
      {
        name: 'Lucas',
        lastName: 'Soporte',
        email: 'lucas@helpdesk.com',
        password,
        role: Role.AGENTE,
      },
      {
        name: 'Maria',
        lastName: 'Soporte',
        email: 'maria@helpdesk.com',
        password,
        role: Role.AGENTE,
      },
      {
        name: 'Juan',
        lastName: 'Empleado',
        email: 'juan@helpdesk.com',
        password,
        role: Role.EMPLEADO,
      },
    ],
  });

  await prisma.category.createMany({
    data: [
      {
        name: 'Hardware',
        description:
          'Problemas relacionados con computadoras, impresoras y dispositivos.',
      },
      {
        name: 'Software',
        description:
          'Problemas relacionados con aplicaciones, sistemas y programas.',
      },
      {
        name: 'Acceso',
        description:
          'Problemas relacionados con contraseñas, cuentas y permisos.',
      },
      {
        name: 'Redes',
        description:
          'Problemas relacionados con internet, Wi-Fi y conexiones de red.',
      },
    ],
  });

  const juan = await prisma.user.findUniqueOrThrow({
    where: {
      email: 'juan@helpdesk.com',
    },
  });

  const lucas = await prisma.user.findUniqueOrThrow({
    where: {
      email: 'lucas@helpdesk.com',
    },
  });

  const maria = await prisma.user.findUniqueOrThrow({
    where: {
      email: 'maria@helpdesk.com',
    },
  });

  const hardware = await prisma.category.findUniqueOrThrow({
    where: {
      name: 'Hardware',
    },
  });

  const software = await prisma.category.findUniqueOrThrow({
    where: {
      name: 'Software',
    },
  });

  const acceso = await prisma.category.findUniqueOrThrow({
    where: {
      name: 'Acceso',
    },
  });

  const redes = await prisma.category.findUniqueOrThrow({
    where: {
      name: 'Redes',
    },
  });

  const ticketAbierto = await prisma.ticket.create({
    data: {
      title: 'La computadora no enciende',
      description:
        'La computadora de la oficina no enciende al presionar el botón de encendido.',
      status: TicketStatus.ABIERTO,
      priority: Priority.ALTA,
      createdById: juan.id,
      categoryId: hardware.id,
    },
  });

  const ticketEnProceso = await prisma.ticket.create({
    data: {
      title: 'Problema con el sistema de ventas',
      description:
        'El sistema de ventas presenta errores al momento de iniciar sesión.',
      status: TicketStatus.EN_PROCESO,
      priority: Priority.MEDIA,
      createdById: juan.id,
      assignedToId: lucas.id,
      categoryId: software.id,
    },
  });

  const ticketResuelto = await prisma.ticket.create({
    data: {
      title: 'No puedo acceder a mi cuenta',
      description:
        'El usuario no puede ingresar a su cuenta porque olvidó su contraseña.',
      status: TicketStatus.RESUELTO,
      priority: Priority.ALTA,
      createdById: juan.id,
      assignedToId: maria.id,
      categoryId: acceso.id,
    },
  });

  const ticketCerrado = await prisma.ticket.create({
    data: {
      title: 'Problemas de conexión Wi-Fi',
      description:
        'La conexión Wi-Fi de la oficina se desconecta constantemente.',
      status: TicketStatus.CERRADO,
      priority: Priority.BAJA,
      createdById: juan.id,
      assignedToId: lucas.id,
      categoryId: redes.id,
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        content:
          'El problema comenzó esta mañana y la computadora no muestra ninguna señal de encendido.',
        ticketId: ticketAbierto.id,
        userId: juan.id,
      },
      {
        content:
          'Voy a revisar el equipo y verificar la fuente de alimentación.',
        ticketId: ticketAbierto.id,
        userId: lucas.id,
      },
      {
        content:
          'Estoy revisando el error de inicio de sesión y los registros del sistema.',
        ticketId: ticketEnProceso.id,
        userId: lucas.id,
      },
      {
        content:
          'Se encontró un problema con la configuración del sistema. Se está aplicando una corrección.',
        ticketId: ticketEnProceso.id,
        userId: maria.id,
      },
      {
        content:
          'Se restableció la contraseña y el usuario ya puede ingresar nuevamente.',
        ticketId: ticketResuelto.id,
        userId: maria.id,
      },
      {
        content: 'Confirmo que ya puedo acceder a mi cuenta. Muchas gracias.',
        ticketId: ticketResuelto.id,
        userId: juan.id,
      },
      {
        content:
          'Se reinició el equipo de red y se actualizó la configuración del punto de acceso.',
        ticketId: ticketCerrado.id,
        userId: lucas.id,
      },
      {
        content:
          'La conexión funciona correctamente. Doy por solucionado el problema.',
        ticketId: ticketCerrado.id,
        userId: juan.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
