import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

const createProjectsArr = (ownerIds: string[]) => {
  return Array.from({
    length: faker.number.int({
      min: 3,
      max: 10,
    }),
  }).map(() => ({
    name: faker.lorem.words(5),
    slug: faker.lorem.slug(5),
    description: faker.lorem.paragraph(),
    avatarUrl: faker.image.avatarGitHub(),
    ownerId: faker.helpers.arrayElement(ownerIds),
  }))
}

export async function seed() {
  await prisma.project.deleteMany()
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('12345678', 1)
  const [user, anotherUser, anotherUser2] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'yan@acme.com',
        name: 'Yan Lyra',
        avatarUrl: 'https://github.com/ylyra.png',
        passwordHash,
      },
    }),

    prisma.user.create({
      data: {
        email: faker.internet.email().toLocaleLowerCase(),
        name: faker.person.fullName(),
        avatarUrl: 'https://github.com/ylyra.png',
        passwordHash,
      },
    }),

    prisma.user.create({
      data: {
        email: faker.internet.email().toLocaleLowerCase(),
        name: faker.person.fullName(),
        avatarUrl: 'https://github.com/ylyra.png',
        passwordHash,
      },
    }),
  ])

  await Promise.all([
    prisma.organization.create({
      data: {
        name: 'Acme Inc (Admin)',
        domain: 'acme.com',
        slug: 'acme-admin',
        avatarUrl: faker.image.avatarGitHub(),
        shouldAttachUsersByDomain: true,
        ownerId: user.id,
        members: {
          createMany: {
            data: [
              {
                userId: user.id,
                role: 'ADMIN',
              },
              {
                userId: anotherUser.id,
                role: 'MEMBER',
              },
              {
                userId: anotherUser2.id,
                role: 'BILLING',
              },
            ],
          },
        },
        projects: {
          createMany: {
            data: createProjectsArr([user.id, anotherUser.id, anotherUser2.id]),
          },
        },
      },
    }),

    prisma.organization.create({
      data: {
        name: 'Acme Inc (Member)',
        slug: 'acme-member',
        avatarUrl: faker.image.avatarGitHub(),
        ownerId: anotherUser.id,
        members: {
          createMany: {
            data: [
              {
                userId: user.id,
                role: 'MEMBER',
              },
              {
                userId: anotherUser.id,
                role: 'ADMIN',
              },
              {
                userId: anotherUser2.id,
                role: 'BILLING',
              },
            ],
          },
        },
        projects: {
          createMany: {
            data: createProjectsArr([user.id, anotherUser.id, anotherUser2.id]),
          },
        },
      },
    }),

    prisma.organization.create({
      data: {
        name: 'Acme Inc (Billing)',
        slug: 'acme-billing',
        avatarUrl: faker.image.avatarGitHub(),
        ownerId: anotherUser.id,
        members: {
          createMany: {
            data: [
              {
                userId: user.id,
                role: 'BILLING',
              },
              {
                userId: anotherUser.id,
                role: 'ADMIN',
              },
              {
                userId: anotherUser2.id,
                role: 'MEMBER',
              },
            ],
          },
        },
        projects: {
          createMany: {
            data: createProjectsArr([user.id, anotherUser.id, anotherUser2.id]),
          },
        },
      },
    }),
  ])
}

seed().then(() => {
  console.log('Seeding complete')
})
