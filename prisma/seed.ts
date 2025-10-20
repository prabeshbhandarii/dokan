import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file')
  }

  // Clear existing data
  await prisma.transaction.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.user.deleteMany()

  // Create user with hashed password
  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword
    }
  })

  console.log(`✓ User created: ${adminEmail}`)
  console.log('✓ Database seeded successfully')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
