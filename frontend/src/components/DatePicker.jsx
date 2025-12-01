import React from 'react'

export default function DatePicker({ value, onChange }){
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input type="date" value={value} onChange={e=>onChange(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-sm" />
    </div>
  )
}
