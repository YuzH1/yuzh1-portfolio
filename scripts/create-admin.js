const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@yuzh1.com'
  const password = '123456'
  const name = 'YuzH1'

  // SHA-256 哈希
  const hashedPassword = crypto
    .createHash('sha256')
    .update(password + 'yuzh1-salt')
    .digest('hex')

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'admin',
      },
      create: {
        email,
        password: hashedPassword,
        name,
        nickname: 'YuzH1',
        role: 'admin',
      },
    })

    console.log('✅ 管理员账户已创建!')
    console.log('📧 邮箱:', email)
    console.log('🔑 密码:', password)
    console.log('👤 角色: 管理员')
  } catch (error) {
    console.error('创建失败:', error)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())