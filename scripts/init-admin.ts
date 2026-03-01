// 初始化管理员账户脚本
// 运行方式: npx ts-node scripts/init-admin.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@yuzh1.com'
  const password = 'admin123' // 默认密码，登录后请修改
  const name = 'Admin'

  // 简单的密码哈希
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'yuzh1-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
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

    console.log('✅ 管理员账户已创建/更新:')
    console.log(`   邮箱: ${email}`)
    console.log(`   密码: ${password}`)
    console.log('   ⚠️  请登录后立即修改密码！')
  } catch (error) {
    console.error('创建管理员失败:', error)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())