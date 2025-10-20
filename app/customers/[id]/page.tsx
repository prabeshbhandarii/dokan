import { prisma } from '../../../lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

type Props = { params: { id: string } }

export default async function Page({ params }: Props) {
  const id = Number(params.id)
  const customer = await prisma.customer.findUnique({ where: { id }, include: { transactions: { orderBy: { createdAt: 'asc' } } } })
  if (!customer) return <div>Not found</div>

  const total = customer.transactions.reduce((s, t) => s + (t.type === 'purchase' ? t.amount : -t.amount), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-medium">{customer.name}</h2>
          <p className="text-sm text-gray-600">Account details</p>
        </div>
        <Link href="/">Back</Link>
      </div>

      <div className="shadow-sm border border-gray-200 rounded mb-4 p-4">
        <h3 className="font-medium mb-2">Transactions</h3>
        <ul className="divide-y">
          {customer.transactions.map(t => (
            <li key={t.id} className="py-2 flex justify-between">
              <div>
                <div className="text-sm text-gray-800">{t.item ?? (t.type === 'payment' ? 'Payment' : '')}</div>
                <div className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div className={`text-sm ${t.type === 'purchase' ? 'text-red-600' : 'text-green-600'}`}>
                {t.type === 'purchase' ? '+' : '-'}{t.amount.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 text-right font-semibold">Total owed: {total.toFixed(2)}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PurchaseForm customerId={id} />
        <PaymentForm customerId={id} />
      </div>
    </div>
  )
}

function PurchaseForm({ customerId }: { customerId: number }) {
  async function handleSubmit(formData: FormData) {
    'use server'
    const item = formData.get('item') as string
    const amount = Number(formData.get('amount'))
    await prisma.transaction.create({ data: { customerId, type: 'purchase', item, amount } })
    revalidatePath(`/customers/${customerId}`)
    revalidatePath('/')
  }

  return (
    <form action={handleSubmit} className="border p-4 rounded">
      <h4 className="font-medium mb-2">Add Purchase</h4>
      <input name="item" placeholder="Item name" className="w-full border px-2 py-1 rounded mb-2" />
      <input name="amount" type="number" step="0.01" placeholder="Amount" className="w-full border px-2 py-1 rounded mb-2" />
      <button className="bg-gray-100 px-3 py-1 rounded">Add Purchase</button>
    </form>
  )
}

function PaymentForm({ customerId }: { customerId: number }) {
  async function handleSubmit(formData: FormData) {
    'use server'
    const amount = Number(formData.get('amount'))
    await prisma.transaction.create({ data: { customerId, type: 'payment', amount } })
    revalidatePath(`/customers/${customerId}`)
    revalidatePath('/')
  }

  return (
    <form action={handleSubmit} className="border p-4 rounded">
      <h4 className="font-medium mb-2">Add Payment</h4>
      <input name="amount" type="number" step="0.01" placeholder="Amount" className="w-full border px-2 py-1 rounded mb-2" />
      <button className="bg-gray-100 px-3 py-1 rounded">Add Payment</button>
    </form>
  )
}
