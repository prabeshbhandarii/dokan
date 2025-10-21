import Link from 'next/link'
import { prisma } from '../lib/prisma'
import { revalidatePath } from 'next/cache'
import { SubmitButton } from '../components/SubmitButton'

async function getCustomers() {
  return prisma.customer.findMany({ include: { transactions: true } })
}

export default async function Page() {
  const customers = await getCustomers()

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
        <AddCustomer />
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {customers.map(c => {
          const total = c.transactions.reduce((s, t) => s + (t.type === 'purchase' ? t.amount : -t.amount), 0)
          const last = c.transactions.slice().sort((a,b)=> b.createdAt.getTime()-a.createdAt.getTime())[0]?.createdAt ?? null
          return (
            <div key={c.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                <Link 
                  href={`/customers/${c.id}`} 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  View
                </Link>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-600">Total Owed:</span>
                  <span className="text-base font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-600">Last Transaction:</span>
                  <span className="text-sm font-medium text-gray-700">{last ? new Date(last).toLocaleDateString() : '-'}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-base font-bold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-base font-bold text-gray-700">Total Owed</th>
              <th className="px-6 py-3 text-left text-base font-bold text-gray-700">Last Transaction</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map(c => {
              const total = c.transactions.reduce((s, t) => s + (t.type === 'purchase' ? t.amount : -t.amount), 0)
              const last = c.transactions.slice().sort((a,b)=> b.createdAt.getTime()-a.createdAt.getTime())[0]?.createdAt ?? null
              return (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-base font-semibold text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-base font-bold text-gray-900">${total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{last ? new Date(last).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/customers/${c.id}`} 
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors inline-block"
                    >
                      View Account
                    </Link>
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
    <form action={handleCreate} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <input 
        name="name" 
        placeholder="New customer name" 
        className="border border-gray-300 px-4 py-2 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
        required 
      />
      <SubmitButton className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
        Add Customer
      </SubmitButton>
    </form>
  )
}
