import { PrismaClient, Role } from '../src/generated/prisma/client.js';
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
