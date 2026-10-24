const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const appts = await prisma.appointments.findMany({ 
    orderBy: { start_time: 'desc' },
    take: 3 
  });
  console.log(JSON.stringify(appts, null, 2));
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
