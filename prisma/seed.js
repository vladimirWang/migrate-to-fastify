const prismaClient = require("../prismaClient.js");

async function rawSql() {
  // const result =
  //   await prismaClient.$executeRaw`INSERT INTO Product(name, updateAt) values ('trousers221', '2021-01-02');`;
  // // await prismaClient.$executeRaw`INSERT INTO "User" ("email", "username", "password") VALUES ('555666@example.com', 'johnson', '555666') ON CONFLICT DO NOTHING;`;
  // console.log({ result });
}

rawSql()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
