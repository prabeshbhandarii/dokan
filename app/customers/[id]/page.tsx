import { prisma } from '../../../lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { SubmitButton } from '../../../components/SubmitButton'
import { DeleteCustomerButton } from '../../../components/DeleteCustomerButton'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const customerId = Number(id)
  const customer = await prisma.customer.findUnique({ where: { id: customerId }, include: { transactions: { orderBy: { createdAt: 'asc' } } } })
  if (!customer) return <div>Not found</div>

  const total = customer.transactions.reduce((s, t) => s + (t.type === 'purchase' ? t.amount : -t.amount), 0)

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{customer.name}</h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Account details</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link 
            href="/" 
            className="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors text-center"
          >
            Back
          </Link>
          <div className="flex-1 sm:flex-none">
            <DeleteCustomerButton customerId={customerId} customerName={customer.name} />
          </div>
        </div>
      </div>

      <div className="shadow-sm border border-gray-200 rounded-lg mb-6 p-4 sm:p-6">
        <h3 className="text-xl font-bold mb-4">Transactions</h3>
        {customer.transactions.length === 0 ? (
          <p className="text-gray-500 font-medium text-center py-4">No transactions yet</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {customer.transactions.map(t => (
              <li key={t.id} className="py-3 flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold text-gray-900 truncate">{t.item ?? (t.type === 'payment' ? 'Payment' : '')}</div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">{new Date(t.createdAt).toLocaleString()}</div>
                </div>
                <div className={`text-base sm:text-lg font-bold whitespace-nowrap ${t.type === 'purchase' ? 'text-red-600' : 'text-green-600'}`}>
                  {t.type === 'purchase' ? '+' : '-'}${t.amount.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 pt-4 border-t border-gray-300 text-right">
          <span className="text-lg sm:text-xl font-bold text-gray-900">Total owed: ${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PurchaseForm customerId={customerId} />
        <PaymentForm customerId={customerId} />
      </div>
    </div>
  )
}

function PurchaseForm({ customerId }: { customerId: number }) {
  async function handleSubmit(formData: FormData) {
    'use server'
    const item = formData.get('item') as string
    const amount = Number(formData.get('amount'))
    if (!item || !amount) return
    await prisma.transaction.create({ data: { customerId, type: 'purchase', item, amount } })
    revalidatePath(`/customers/${customerId}`)
    revalidatePath('/')
  }

  return (
    <form action={handleSubmit} className="border-2 border-gray-200 p-4 sm:p-6 rounded-lg shadow-sm">
      <h4 className="text-lg font-bold mb-4 text-gray-900">Add Purchase</h4>
      <input 
        name="item" 
        placeholder="Item name" 
        className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        required 
      />
      <input 
        name="amount" 
        type="number" 
        step="0.01" 
        placeholder="Amount" 
        className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        required 
      />
      <SubmitButton className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
        Add Purchase
      </SubmitButton>
    </form>
  )
}

function PaymentForm({ customerId }: { customerId: number }) {
  async function handleSubmit(formData: FormData) {
    'use server'
    const amount = Number(formData.get('amount'))
    if (!amount) return
    await prisma.transaction.create({ data: { customerId, type: 'payment', amount } })
    revalidatePath(`/customers/${customerId}`)
    revalidatePath('/')
  }

  return (
    <form action={handleSubmit} className="border-2 border-gray-200 p-4 sm:p-6 rounded-lg shadow-sm">
      <h4 className="text-lg font-bold mb-4 text-gray-900">Add Payment</h4>
      <input 
        name="amount" 
        type="number" 
        step="0.01" 
        placeholder="Amount" 
        className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
        required 
      />
      <SubmitButton className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
        Add Payment
      </SubmitButton>
    </form>
  )
}
