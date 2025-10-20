import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { transactions: { orderBy: { createdAt: 'asc' } } }
  })
  if (!customer) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(customer)
}

export async function POST() {
  return NextResponse.json({ error: 'method not allowed' }, { status: 405 })
}
