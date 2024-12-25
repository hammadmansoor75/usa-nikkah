const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

async function updateUserSchema () {
    
    await prisma.user.updateMany({
        where : {},
        data : {
            shortlistedUsers : [],
            matchedUsers : [],
            blockedUsers : [],
            profileViews : [],
            shortlistedBy : []     
        }
    })

    console.log(`Users Updated`);
    await prisma.$disconnect();
}

async function main(){
    await updateUserSchema();
}

main()
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });