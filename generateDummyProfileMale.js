const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

async function createDummyMaleProfile () {
    const user = await prisma.user.create({
        data: {
          supabaseAuthId: 'abcd-dsds-sdsns-abcd',
          phone: '+9233351465874',
          name: "Akbar Khan",
          email: "akbarkhan@gmail.com",
          city: "Washington DC",
          state: "Alaska",
          gender: 'male', // or 'female'
          dob: "1990-06-20",
          profileCreatedBy: 'self',
          adminVerificationStatus: true,
        },
    });

    await prisma.religiousDetails.create({
        data: {
          userId: user.id,
          religiosity: 'Moderate',
          prayer: 'Always Pray',
          revert: 'yes',
          revertDuration : '5 years',
          mosqueVisit: '2-3 Times a week',
          smoke: 'no',
        },
    });

    await prisma.personalDetails.create({
        data: {
          userId: user.id,
          aboutMe: "I am Akbar",
          height: '5ft 8in',
          maritalStatus: 'divorced',
          children: '2',
          childrenLiving : 'yes',
          moreKids : 'maybe',
          ethnicBackground: 'desi/south-asian',
          occupation: 'Software Engineer',
          hobbies: 'Coding, Reading',
          education: 'College / University',
        },
    });

    await prisma.partnerPreferences.create({
        data: {
          userId: user.id,
          gender: 'female',
          ageGroupFrom: "20",
          ageGroupTo: "30",
          state: 'ANY',
          maritalStatus: 'neverMarried',
          religiousPreference: 'Religious',
          ethnicityPreference: 'desi/south-asian',
          educationLevel: 'College / University',
          work: 'Housewife',
          considerSomeoneHavingChildren: 'Yes',
          hijab: 'Yes',
        },
    })
    
    await prisma.images.create({
        data: {
          userId: user.id,
          profilePhoto: 'https://res.cloudinary.com/dsq7wjcnz/image/upload/v1735021956/portrait-confident-south-asian-man-600w-739003933_ypwang.jpg',
          selfiePhoto: 'https://res.cloudinary.com/dsq7wjcnz/image/upload/v1735022000/portrait-confident-south-asian-man-260nw-735776242_sgvaj3.jpg',
          photos: ['https://res.cloudinary.com/dsq7wjcnz/image/upload/v1735022000/portrait-confident-south-asian-man-260nw-735776242_sgvaj3.jpg','https://res.cloudinary.com/dsq7wjcnz/image/upload/v1735021956/portrait-confident-south-asian-man-600w-739003933_ypwang.jpg'],
          adminVerificationStatus: true,
        },
    });

    console.log(`Dummy profile created for ${user.name}`);
    await prisma.$disconnect();
}

async function main(){
    await createDummyMaleProfile();
}

main()
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });