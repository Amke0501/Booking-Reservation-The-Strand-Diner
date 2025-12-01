import React, { useState } from 'react'

export default function BookingModal({ apiRoot, resource, date, time, onClose }){
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function submit(e){
    e.preventDefault();
    setLoading(true); setError(null);
    try{
      const res = await fetch(`${apiRoot}/api/bookings`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ resource, date, time, name, phone, email })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to book');
      }
      const booked = await res.json();
      setSuccess(booked);
    }catch(err){ setError(err.message) }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Book {resource} — {date} @ {time}</h3>
        {success ? (
          <div>
            <p className="text-green-600">Booking confirmed. ID: {success.id}</p>
            <div className="mt-4 flex justify-end"><button onClick={onClose} className="px-4 py-2 bg-gray-800 text-white rounded">Close</button></div>
          </div>
        ) : (
        <form onSubmit={submit}>
          <label className="block text-sm">Full Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded border px-2 py-1 mb-2" placeholder="Full Name" required />
          <label className="block text-sm">Phone Number</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full rounded border px-2 py-1 mb-2" type="tel" placeholder="Phone Number" />
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded border px-2 py-1 mb-2" type="email" required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-amber-600 text-white rounded">{loading ? 'Booking...' : 'Confirm'}</button>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}
