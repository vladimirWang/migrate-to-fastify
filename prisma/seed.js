import prisma from "../utils/prisma.js";

async function rawSql() {
  prisma.$executeRaw`insert into gallery2.Platform (name) values ('线下'), ('闲鱼'), ('拼多多'), ('抖音');`;
  prisma.$executeRaw`insert into gallery2.Express (name) values ('顺丰'), ('韵达'), ('中通'), ('百世');`;
  // await prismaClient.$executeRaw`INSERT INTO "User" ("email", "username", "password") VALUES ('555666@example.com', 'johnson', '555666') ON CONFLICT DO NOTHING;`;
  // console.log({ result });
}

rawSql()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
