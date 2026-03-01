import { prisma } from '@/lib/prisma'
import { NavbarClient } from './NavbarClient'

export async function Navbar() {
  let about = null
  try {
    about = await prisma.about.findUnique({ where: { id: 'about' } })
  } catch {
    // 数据库未初始化时忽略错误
  }

  return <NavbarClient about={about} />
}