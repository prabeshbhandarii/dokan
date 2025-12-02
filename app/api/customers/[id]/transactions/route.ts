export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customerId = Number(id)
  const body = await req.json()
  const { type, item, amount } = body
  if (!['purchase', 'payment'].includes(type)) return NextResponse.json({ error: 'invalid type' }, { status: 400 })
  if (typeof amount !== 'number') return NextResponse.json({ error: 'amount must be number' }, { status: 400 })

  const trx = await prisma.transaction.create({
    data: { customerId, type, item: item || null, amount }
  })

  return NextResponse.json(trx)
}
