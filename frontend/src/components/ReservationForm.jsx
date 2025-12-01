import React, { useState } from 'react'

export default function ReservationForm({
  apiRoot,
  resources,
  resource,
  setResource,
  date,
  setDate,
  slots = [],
  onBookingSuccess
}) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault() 
    if (!selectedSlot) {
      setError('Please select a time slot')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiRoot}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource,
          date,
            time: selectedSlot,
              name: fullName,
              phone,
              email
        })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to book')
      }
      const booked = await res.json()
      setSuccess(booked)
      setFullName('')
      setPhone('')
      setEmail('')
      setSelectedSlot(null)
      onBookingSuccess()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="reservation-form-container">
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group w-full md:w-1/2">
            <label className="block mb-1 text-sm">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              className="w-full h-10 px-3 py-2 rounded border border-gray-300"
            />
          </div>

          <div className="form-group w-full md:w-1/2 md:pl-3 mt-3 md:mt-0">
            <label className="block mb-1 text-sm">Phone Number</label>
            <input
              type="tel"
              placeholder="Your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              className="w-full h-10 px-3 py-2 rounded border border-gray-300"
            />
          </div>
        </div>

        <div className="form-row mt-3">
          <div className="form-group w-full md:w-1/2">
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 py-2 rounded border border-gray-300"
            />
          </div>

          <div className="form-group w-full md:w-1/2 md:pl-3 mt-3 md:mt-0">
            <label className="block mb-1 text-sm">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded border border-gray-300"
            />
          </div>
        </div>

        <div className="form-row mt-3">
          <div className="form-group w-full md:w-1/2">
            <label className="block mb-1 text-sm">Time</label>
            <select
              value={selectedSlot || ''}
              onChange={e => setSelectedSlot(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded border border-gray-300"
            >
              <option value="">Select Time</option>
              {slots.length === 0 && <option value="">Select a resource and date to see slots.</option>}
              {slots.map(s => (
                <option key={s.time} value={s.time} disabled={!s.available}>
                  {s.time} {s.available ? '' : '(Booked)'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group w-full md:w-1/2 md:pl-3 mt-3 md:mt-0">
            <label className="block mb-1 text-sm">Number of Guests</label>
            <input
              type="number"
              placeholder="Number of Guests"
              min="1"
              max="12"
              defaultValue="2"
              className="w-full h-10 px-3 py-2 rounded border border-gray-300"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Number of Guests</label>
          <input
            type="number"
            placeholder="Number of Guests"
            min="1"
            max="12"
            defaultValue="2"
          />
        </div>

        <div className="form-group mt-3">
          <label className="block mb-1 text-sm">Special Requests</label>
          <textarea placeholder="Any special requests or dietary requirements" className="w-full px-3 py-2 rounded border border-gray-300" />
        </div>

        {error && <div style={{color:'#ff6b6b', fontSize:'14px'}}>{error}</div>}
        {success && <div style={{color:'#51cf66', fontSize:'14px'}}>✓ Booking confirmed! ID: {success.id}</div>}

        <button type="submit" className="primary-btn" disabled={loading} style={{width:'100%', margin:'10px 0'}}>
          {loading ? 'BOOKING...' : 'BOOK NOW'}
        </button>
      </form>
    </div>
  )
}
