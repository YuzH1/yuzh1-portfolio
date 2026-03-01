import { prisma } from '@/lib/prisma'
import { AboutContent } from '@/components/AboutContent'

export const revalidate = 60

export default async function AboutPage() {
  let about = null

  try {
    about = await prisma.about.findUnique({ where: { id: 'about' } })
  } catch {
    console.log('Database not initialized yet')
  }

  return <AboutContent about={about} />
}