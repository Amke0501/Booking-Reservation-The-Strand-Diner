import React, { useEffect, useState } from 'react'
import ResourceSelector from './components/ResourceSelector'
import ReservationForm from './components/ReservationForm'
import SlotsView from './components/SlotsView'

// Use environment variable for backend URL; fallback to Render URL if not set
const API ='https://booking-reservation-the-strand-diner-1.onrender.com'

// Convert "6:00 PM" → "18:00"
function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(" ")
  let [hours, minutes] = time.split(":").map(Number)
  if (modifier === "PM" && hours !== 12) hours += 12
  if (modifier === "AM" && hours === 12) hours = 0
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

// Convert "18:00" → "6:00 PM"
function convertToAMPM(time24) {
  let [h, m] = time24.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = (h % 12) || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`
}

export default function App() {
  const [resources, setResources] = useState([])
  const [resource, setResource] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [guests, setGuests] = useState(1)
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState('')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  // Fetch resources on load
  useEffect(() => {
    fetch(`${API}/api/resources`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data?.resources || []
        if (list.length > 0) {
          setResources(list)
          setResource(list[0])
        } else {
          const fallback = ['Table 1', 'Table 2', 'Table 3']
          setResources(fallback)
          setResource(fallback[0])
        }
      })
      .catch(() => {
        const fallback = ['Table 1', 'Table 2', 'Table 3']
        setResources(fallback)
        setResource(fallback[0])
      })
  }, [])

  // Fetch slots when resource/date changes
  useEffect(() => {
    setSelectedSlot(null)
    if (!resource || !date) return setSlots([])

    fetch(`${API}/api/slots?resource=${encodeURIComponent(resource)}&date=${date}`)
      .then(r => r.json())
      .then(data => {
        const raw = Array.isArray(data) ? data : data?.slots || []
        const slotsList = raw.map(s => {
          const t = typeof s === 'string' ? s : s.time
          const display = /AM|PM/i.test(t) ? t : convertToAMPM(t)
          return typeof s === 'string' ? { time: display, available: true } : { ...s, time: display }
        })
        setSlots(slotsList.length ? slotsList : getFallbackSlots())
      })
      .catch(() => setSlots(getFallbackSlots()))
  }, [resource, date])

  // Fetch bookings when resource/date changes
  useEffect(() => {
    if (!resource || !date) return setBookings([])
    fetch(`${API}/api/bookings/${date}/${encodeURIComponent(resource)}`)
      .then(r => r.json())
      .then(setBookings)
      .catch(console.error)
  }, [resource, date])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!selectedSlot) return setMessage('Please select a time slot')

    try {
      const convertedTime = convertTo24Hour(selectedSlot)
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource, date, time: convertedTime, name, phone, email })
      })

      if (res.ok) {
        const booking = await res.json()
        setMessage(`✓ Booked successfully! Reservation ID: ${booking.id}`)
        setSelectedSlot(null)
        setName(''); setPhone(''); setEmail('')
        const updated = await fetch(`${API}/api/bookings/${date}/${encodeURIComponent(resource)}`).then(r => r.json())
        setBookings(updated)
      } else {
        const err = await res.json()
        setMessage(`Error: ${err.error}`)
      }
    } catch (err) {
      const msg = err?.message || 'Unknown error'
      if (/Failed to fetch/i.test(msg)) setMessage(`Error: Could not reach API at ${API}`)
      else setMessage(`Error: ${msg}`)
    }
  }

  const handleCancel = async (id) => {
    await fetch(`${API}/api/bookings/${id}`, { method: 'DELETE' })
    setBookings(bookings.filter(b => b.id !== id))
  }

  const getFallbackSlots = () => [
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

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center bg-[url('/images/The%20Strand%20Hero%20Page.jpg')]" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-5 py-5 grid grid-cols-2 gap-8 mt-8">

        <div className="relative rounded-lg overflow-hidden bg-dark-bg/90 p-6">
          <h2 className="font-serif text-2xl mb-5 text-white">Enjoy the Perfect Dining Experience</h2>
          <form onSubmit={handleBook}>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-white">Resource</label>
              <ResourceSelector resources={resources} value={resource} onChange={setResource} />
            </div>
            <div className="mb-4">
              <SlotsView slots={slots} selected={selectedSlot} onSelect={setSelectedSlot} />
            </div>
            <ReservationForm 
              name={name} setName={setName}
              phone={phone} setPhone={setPhone}
              email={email} setEmail={setEmail}
              date={date} setDate={setDate}
              guests={guests} setGuests={setGuests}
            />
            <button type="submit" className="mt-5 w-full py-3 bg-primary text-white rounded font-bold hover:bg-primary-dark">
              Book A Table
            </button>
            {message && <p className={`mt-2.5 font-bold text-sm ${message.includes('Error') || message.includes('Please select') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
          </form>
        </div>

        <div className="bg-light-bg p-5 rounded-lg">
          <h2 className="text-primary font-serif text-2xl mb-5">Current Bookings</h2>
          {resource && date ? (
            bookings.length === 0 ? <p>No bookings yet.</p> : (
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
                        <button onClick={() => handleCancel(b.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : <p>Select resource and date to view bookings.</p>}
        </div>
      </div>
    </div>
  )
}
