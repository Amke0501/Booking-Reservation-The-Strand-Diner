import React from 'react'

export default function SlotsView({ slots = [], selected, onSelect }) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Available Slots</h2>

      {/* Dropdown for small screens */}
      <div className="mb-3 md:hidden">
        <select
          className="w-full px-2 py-2 rounded border border-gray-300"
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="">Select a time</option>
          {slots.map((s) => (
            <option key={s.time} value={s.time} disabled={!s.available}>
              {s.time} {s.available ? "" : "(Booked)"}
            </option>
          ))}
        </select>
      </div>

      {/* Grid buttons for desktop */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-2">
        {slots.length === 0 && (
          <div className="col-span-3 text-sm text-gray-500">
            Select a resource and date to see slots.
          </div>
        )}

        {slots.map((s) => {
          const isSelected = selected === s.time;

          return (
            <button
              key={s.time}
              disabled={!s.available}
              onClick={() => onSelect(s.time)}
              className={`p-2 rounded transition 
                ${s.available
                  ? isSelected
                    ? "bg-amber-600 text-white"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {s.time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
