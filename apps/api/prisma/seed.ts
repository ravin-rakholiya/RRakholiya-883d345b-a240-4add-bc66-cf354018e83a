import { PrismaClient, RoleEnum } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Root organization (TurboVets)
  const turboVets = await prisma.organization.upsert({
    where: { slug: 'turbo-vets' },
    create: { name: 'TurboVets', slug: 'turbo-vets', parentId: null },
    update: {},
  });

  await prisma.role.upsert({
    where: { name: RoleEnum.Owner },
    create: { name: RoleEnum.Owner, description: 'Full org access and audit log' },
    update: {},
  });
  await prisma.role.upsert({
    where: { name: RoleEnum.Admin },
    create: { name: RoleEnum.Admin, description: 'CRUD tasks within organization' },
    update: {},
  });
  await prisma.role.upsert({
    where: { name: RoleEnum.Viewer },
    create: { name: RoleEnum.Viewer, description: 'Read-only within organization' },
    update: {},
  });

  // Optional: create default Owner user in TurboVets (password: Pass1234)
  const ownerRole = await prisma.role.findUnique({ where: { name: RoleEnum.Owner } });
  if (ownerRole) {
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('Pass1234', 12);
    await prisma.user.upsert({
      where: { email: 'owner@turbovets.com' },
      create: {
        email: 'owner@turbovets.com',
        passwordHash: hash,
        firstName: 'Owner',
        lastName: 'User',
        roleId: ownerRole.id,
        organizationId: turboVets.id,
      },
      update: {},
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
