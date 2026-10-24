import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  const appts = await prisma.appointment.findMany({ take: 2 });
  console.log("Appointments:", JSON.stringify(appts, null, 2));

  const schedules = await prisma.schedule.findMany({ take: 2 });
  console.log("Schedules:", JSON.stringify(schedules, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
