'use client'

import { useState } from 'react'
import { SubmitButton } from './SubmitButton'

export function DeleteCustomerButton({ customerId, customerName }: { customerId: number; customerName: string }) {
  const [showConfirm, setShowConfirm] = useState(false)

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
      >
        Delete
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Confirm Delete</h3>
        <p className="text-base text-gray-700 mb-6">
          Are you sure you want to delete <span className="font-bold">{customerName}</span>? 
          This will also delete all their transactions. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <form action={`/api/customers/${customerId}/delete`} method="POST" className="flex-1">
            <SubmitButton className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Confirm Delete
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  )
}
