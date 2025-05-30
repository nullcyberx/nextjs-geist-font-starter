import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hackplatform.com' },
    update: {},
    create: {
      email: 'admin@hackplatform.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create demo user
  const userPassword = await hashPassword('user123')
  const user = await prisma.user.upsert({
    where: { email: 'user@hackplatform.com' },
    update: {},
    create: {
      email: 'user@hackplatform.com',
      name: 'Demo User',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create sample challenges
  const challenges = [
    {
      title: 'Web Basic',
      description: 'Find the hidden flag in the website\'s source code.',
      difficulty: 'EASY' as const,
      category: 'WEB' as const,
      points: 100,
      flag: 'flag{inspect_element_master}',
      hints: JSON.stringify(['Right-click might help', 'Check the HTML comments']),
    },
    {
      title: 'Crypto 101',
      description: 'Decode this base64 string: ZmxhZ3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259',
      difficulty: 'EASY' as const,
      category: 'CRYPTO' as const,
      points: 100,
      flag: 'flag{base64_is_not_encryption}',
      hints: JSON.stringify(['This is a common encoding scheme', 'Think about email attachments']),
    },
    {
      title: 'Memory Forensics',
      description: 'Analyze this memory dump and find the malicious process.',
      difficulty: 'MEDIUM' as const,
      category: 'FORENSICS' as const,
      points: 250,
      flag: 'flag{volatility_master}',
      hints: JSON.stringify(['Use Volatility', 'Check running processes']),
    },
    {
      title: 'Binary Exploitation',
      description: 'Exploit the buffer overflow vulnerability to get the flag.',
      difficulty: 'HARD' as const,
      category: 'PWN' as const,
      points: 400,
      flag: 'flag{buffer_overflow_101}',
      hints: JSON.stringify(['Check the input buffer size', 'Think about stack memory']),
    },
    {
      title: 'Reverse Engineering Challenge',
      description: 'Reverse engineer this binary to find the password check algorithm.',
      difficulty: 'HARD' as const,
      category: 'REVERSE' as const,
      points: 350,
      flag: 'flag{reverse_engineering_pro}',
      hints: JSON.stringify(['Use a decompiler', 'Look for string comparisons']),
    },
    {
      title: 'Logic Puzzle',
      description: 'Solve this programming puzzle to get the flag.',
      difficulty: 'MEDIUM' as const,
      category: 'MISC' as const,
      points: 200,
      flag: 'flag{logic_master_2024}',
      hints: JSON.stringify(['Think about algorithms', 'Consider edge cases']),
    },
    {
      title: 'Advanced Web',
      description: 'Exploit the SQL injection vulnerability to bypass login.',
      difficulty: 'INSANE' as const,
      category: 'WEB' as const,
      points: 500,
      flag: 'flag{sql_injection_master}',
      hints: JSON.stringify(['Think about input validation', 'What happens with single quotes?']),
    },
  ]

  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { title_category: {
        title: challenge.title,
        category: challenge.category
      } },
      update: {},
      create: {
        ...challenge,
      },
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
