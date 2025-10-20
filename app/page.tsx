import Link from 'next/link'
import { prisma } from '../lib/prisma'
import { revalidatePath } from 'next/cache'

async function getCustomers() {
  return prisma.customer.findMany({ include: { transactions: true } })
}

export default async function Page() {
  const customers = await getCustomers()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Dashboard</h2>
        <AddCustomer />
      </div>

      <div className="shadow-sm border border-gray-200 rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Owed</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Last Transaction</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {customers.map(c => {
              const total = c.transactions.reduce((s, t) => s + (t.type === 'purchase' ? t.amount : -t.amount), 0)
              const last = c.transactions.slice().sort((a,b)=> b.createdAt.getTime()-a.createdAt.getTime())[0]?.createdAt ?? null
              return (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{total.toFixed(2)}</td>
                  <td className="px-4 py-3">{last ? new Date(last).toLocaleString() : '-'}</td>
                  <td className="px-4 py-3">
                    <Link href={`/customers/${c.id}`} className="text-blue-600">View Account</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AddCustomer() {
  async function handleCreate(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    if (!name) return
    await prisma.customer.create({ data: { name } })
    revalidatePath('/')
  }

  return (
    <form action={handleCreate} className="flex items-center gap-2">
      <input name="name" placeholder="New customer name" className="border px-2 py-1 rounded" />
      <button type="submit" className="bg-gray-100 px-3 py-1 rounded text-sm">Add</button>
    </form>
  )
}
