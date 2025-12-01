import React, { useEffect, useState } from 'react'
import ResourceSelector from './components/ResourceSelector'
import SlotsView from './components/SlotsView'

const API = 'http://localhost:4000'

export default function App() {
  const [resources, setResources] = useState([])
  const [resource, setResource] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [slots, setSlots] = useState([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${API}/api/resources`)
      .then(r => r.json())
      .then(data => {
        // Accept either an array or an object with a `resources` key
        const list = Array.isArray(data) ? data : (data && data.resources) || []
        if (list && list.length > 0) {
          setResources(list)
        } else {
          // Fallback so UI remains usable when backend isn't running
          const fallback = ['Table 1', 'Table 2', 'Table 3']
          console.warn('No resources returned from API — using fallback', fallback)
          setResources(fallback)
        }
      })
      .catch(err => {
        console.error(err)
        const fallback = ['Table 1', 'Table 2', 'Table 3']
        setResources(fallback)
      })
  }, [])

  useEffect(() => {
    if (!resource || !date) {
      setSlots([])
      return
    }
    fetch(`${API}/api/slots?resource=${encodeURIComponent(resource)}&date=${date}`)
      .then(r => r.json())
      .then(data => {
        console.debug('fetched slots', data.slots)
        const slotsList = data.slots || []
        if (slotsList.length > 0) {
          setSlots(slotsList)
        } else {
          // Fallback sample slots for testing when backend is unavailable
          const fallbackSlots = [
            { time: '11:00 AM', available: true },
            { time: '11:30 AM', available: true },
            { time: '12:00 PM', available: false },
            { time: '12:30 PM', available: true },
            { time: '1:00 PM', available: true },
            { time: '1:30 PM', available: true },
            { time: '2:00 PM', available: false },
            { time: '2:30 PM', available: true },
            { time: '3:00 PM', available: true },
            { time: '5:30 PM', available: true },
            { time: '6:00 PM', available: true },
            { time: '6:30 PM', available: false },
            { time: '7:00 PM', available: true },
            { time: '7:30 PM', available: true },
            { time: '8:00 PM', available: true }
          ]
          console.warn('No slots returned from API — using fallback', fallbackSlots)
          setSlots(fallbackSlots)
        }
      })
      .catch(err => {
        console.error(err)
        // Fallback on fetch error
        const fallbackSlots = [
          { time: '11:00 AM', available: true },
          { time: '11:30 AM', available: true },
          { time: '12:00 PM', available: false },
          { time: '12:30 PM', available: true },
          { time: '1:00 PM', available: true },
          { time: '1:30 PM', available: true },
          { time: '2:00 PM', available: false },
          { time: '2:30 PM', available: true },
          { time: '3:00 PM', available: true },
          { time: '5:30 PM', available: true },
          { time: '6:00 PM', available: true },
          { time: '6:30 PM', available: false },
          { time: '7:00 PM', available: true },
          { time: '7:30 PM', available: true },
          { time: '8:00 PM', available: true }
        ]
        setSlots(fallbackSlots)
      })
  }, [resource, date])

  useEffect(() => {
    if (!resource || !date) {
      setBookings([])
      return
    }
    fetch(`${API}/api/bookings/${date}/${encodeURIComponent(resource)}`)
      .then(r => r.json())
      .then(setBookings)
      .catch(err => console.error(err))
  }, [resource, date])

  useEffect(() => {
    console.debug('resources', resources)
  }, [resources])

  async function handleBook(e) {
    e.preventDefault()
    if (!selectedSlot) {
      setMessage('Please select a time slot')
      return
    }
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource, date, time: selectedSlot, name, phone, email })
      })
      if (res.ok) {
        const booking = await res.json()
        setMessage(`✓ Booked! ID: ${booking.id}`)
        setName('')
        setPhone('')
        setEmail('')
        setSelectedSlot(null)
        const updated = await fetch(`${API}/api/bookings/${date}/${encodeURIComponent(resource)}`).then(r => r.json())
        setBookings(updated)
      } else {
        const err = await res.json()
        setMessage(`Error: ${err.error}`)
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    }
  }

  async function handleCancel(id) {
    await fetch(`${API}/api/bookings/${id}`, { method: 'DELETE' })
    setBookings(bookings.filter(b => b.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-5">
      <h1 className="text-primary font-serif text-5xl">The Strand Diner</h1>

      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* Form */}
        <div className="bg-light-bg p-5 rounded-lg">
          <h2 className="text-primary font-serif text-2xl mb-5">Make a Reservation</h2>

          <ResourceSelector resources={resources} value={resource} onChange={setResource} />

          <div className="mb-4">
            <label className="block mb-1 font-bold text-sm">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-2 py-2 rounded border border-gray-300" />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-bold text-sm">Time</label>
            <SlotsView slots={slots} onSelect={setSelectedSlot} />
            {selectedSlot && <p className="mt-2 text-sm">Selected: <strong>{selectedSlot}</strong></p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-bold text-sm">Full Name</label>
            <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} className="w-full px-2 py-2 rounded border border-gray-300" />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-bold text-sm">Phone Number</label>
            <input type="tel" placeholder="Your phone number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-2 py-2 rounded border border-gray-300" />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-bold text-sm">Email</label>
            <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-2 py-2 rounded border border-gray-300" />
          </div>

          <button onClick={handleBook} className="w-full py-3 bg-primary text-white border-none rounded text-base font-bold cursor-pointer hover:bg-primary-dark">
            BOOK NOW
          </button>

          {message && <p className={`mt-2.5 font-bold text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
        </div>

        {/* Bookings */}
        <div className="bg-light-bg p-5 rounded-lg">
          <h2 className="text-primary font-serif text-2xl mb-5">Current Bookings</h2>
          {resource && date ? (
            bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left px-2 py-2 text-sm">Time</th>
                    <th className="text-left px-2 py-2 text-sm">Guest</th>
                    <th className="text-left px-2 py-2 text-sm">Email</th>
                    <th className="text-center px-2 py-2 text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} className="border-b border-gray-200">
                      <td className="px-2 py-2 text-sm">{b.time}</td>
                      <td className="px-2 py-2 text-sm">{b.name}</td>
                      <td className="px-2 py-2 text-xs">{b.email}</td>
                      <td className="px-2 py-2 text-center">
                        <button onClick={() => handleCancel(b.id)} className="bg-red-500 text-white border-none px-2 py-1 rounded text-xs cursor-pointer hover:bg-red-600">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <p>Select resource and date to view bookings.</p>
          )}
        </div>
      </div>
    </div>
  )
}
 
