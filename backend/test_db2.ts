import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const appts = await prisma.appointment.findMany({ take: 2 });
  console.log("Appointments:", JSON.stringify(appts, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
