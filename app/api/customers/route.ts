export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const customers = await prisma.customer.findMany({
    include: { transactions: true }
  })

  const result = customers.map(c => ({
    id: c.id,
    name: c.name,
    totalOwed: c.transactions.reduce((s, t) => s + (t.type === 'purchase' ? t.amount : -t.amount), 0),
    lastTransaction: c.transactions.sort((a,b)=> b.createdAt.getTime()-a.createdAt.getTime())[0]?.createdAt ?? null
  }))

  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name } = body
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const customer = await prisma.customer.create({ data: { name } })
  return NextResponse.json(customer)
}
