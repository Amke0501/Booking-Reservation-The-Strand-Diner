import React, { useEffect, useState } from 'react'

export default function ReservationsList({ apiRoot, date, resource, refreshKey = 0 }){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date || !resource) return setList([])
    setLoading(true)
    fetch(`${apiRoot}/api/bookings/${date}/${encodeURIComponent(resource)}`)
      .then(r=>r.json())
      .then(data => {
        setList(data)
        setLoading(false)
      })
  }, [date, resource, refreshKey])

  async function handleCancel(id){
    if (!confirm('Cancel this booking?')) return
    await fetch(`${apiRoot}/api/bookings/${id}`, { method: 'DELETE' })
    setList(list.filter(l=>l.id !== id))
  }

  if (!date || !resource) {
    return <p className="text-white/70">Select resource and date to view bookings.</p>
  }

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p className="text-white/70">Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-white/70">No bookings yet.</p>
      ) : (
        <table className="w-full border-collapse text-white">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left px-3 py-3 font-semibold">Time</th>
              <th className="text-left px-3 py-3 font-semibold">Guest</th>
              <th className="text-left px-3 py-3 font-semibold">Email</th>
              <th className="text-center px-3 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map(b => (
              <tr key={b.id} className="border-b border-white/10">
                <td className="px-3 py-3">{b.time}</td>
                <td className="px-3 py-3">{b.name}</td>
                <td className="px-3 py-3 text-sm">{b.email}</td>
                <td className="px-3 py-3 text-center">
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
