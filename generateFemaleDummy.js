const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDummyFemaleProfile() {
    const user = await prisma.user.create({
        data: {
            supabaseAuthId: 'qrst-uvwx-yzab-cdef',
            phone: '+923218765432',
            name: "Houriya Akbar",
            email: "houriyaakbar@example.com",
            city: "Houston", // U.S. city
            state: "Texas",
            gender: 'female',
            dob: "1993-03-15",
            profileCreatedBy: 'parent',
            adminVerificationStatus: true,
        },
    });

    await prisma.religiousDetails.create({
        data: {
            userId: user.id,
            religiosity: 'Moderate',
            prayer: 'Usually Pray',
            revert: 'no',
            revertDuration: '',
            mosqueVisit: 'Occasionally',
            hijab: 'no',
            considerWearingHijab: 'Maybe in the future',
        },
    });

    await prisma.personalDetails.create({
        data: {
            userId: user.id,
            aboutMe: "I am a cheerful and optimistic person who values family and relationships. Looking for a like-minded partner.",
            height: '5ft 5in',
            maritalStatus: 'never married',
            children: '0',
            childrenLiving: 'no',
            moreKids: 'yes',
            ethnicBackground: 'South Asian',
            occupation: 'Graphic Designer',
            hobbies: 'Painting, Traveling, Photography',
            education: 'Masters',
        },
    });

    await prisma.partnerPreferences.create({
        data: {
            userId: user.id,
            gender: 'male',
            ageGroupFrom: "28",
            ageGroupTo: "38",
            state: 'ANY',
            maritalStatus: 'neverMarried',
            religiousPreference: 'Moderate',
            ethnicityPreference: 'South Asian',
            educationLevel: 'Masters',
            work: 'Professional',
            considerSomeoneHavingChildren: 'No',
            smoke: 'no',
        },
    });

    await prisma.images.create({
        data: {
            userId: user.id,
            profilePhoto: 'https://res.cloudinary.com/dsq7wjcnz/image/upload/v1735023179/ramadanrecirc-c505fb498cf84f9589e34c5fd8037439_dubv2r.jpg',
            selfiePhoto: 'https://res.cloudinary.com/dsq7wjcnz/image/upload/v1735023221/1fbe27b4e0c604646d733205529ca3d9_w1m6bw.jpg',
            photos: ['https://res.cloudinary.com/dsq7wjcnz/image/upload/v1735023179/ramadanrecirc-c505fb498cf84f9589e34c5fd8037439_dubv2r.jpg','https://res.cloudinary.com/dsq7wjcnz/image/upload/v1735023221/1fbe27b4e0c604646d733205529ca3d9_w1m6bw.jpg'],
            adminVerificationStatus: true,
        },
    });

    console.log(`Dummy profile created for ${user.name}`);
    await prisma.$disconnect();
}

async function main() {
    await createDummyFemaleProfile();
}

main()
    .catch(e => {
        console.error(e);
        prisma.$disconnect();
    });
