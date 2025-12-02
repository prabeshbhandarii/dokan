export const dynamic = "force-dynamic";
import { prisma } from '../../../../../lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type Props = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Props) {
  const { id } = await params
  const customerId = Number(id)

  // Delete all transactions first (foreign key constraint)
  await prisma.transaction.deleteMany({ where: { customerId } })
  
  // Delete the customer
  await prisma.customer.delete({ where: { id: customerId } })

  // Revalidate the dashboard
  revalidatePath('/')
  
  // Redirect to dashboard
  redirect('/')
}
