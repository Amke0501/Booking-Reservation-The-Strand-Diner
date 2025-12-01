import React from 'react'

export default function ResourceSelector({ resources = [], value, onChange }){
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Resource</label>

      {/* Dropdown (always visible) */}
      <select
        value={value}
        onChange={e=>onChange(e.target.value)}
        className="w-full px-2 py-2 rounded border border-gray-300"
      >
        <option value="">Select a resource</option>
        {resources.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      {/* Grid of buttons for visual table selection on medium+ screens */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-3 mt-3">
        {resources.map(r => {
          const selected = r === value
          return (
            <button
              key={r}
              type="button"
              onClick={() => onChange(r)}
              className={`w-full text-left px-3 py-3 rounded border ${selected ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300'} hover:shadow`}
            >
              {r}
            </button>
          )
        })}
      </div>
    </div>
  )
}
