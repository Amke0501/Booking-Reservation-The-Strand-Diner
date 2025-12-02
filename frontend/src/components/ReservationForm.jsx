import React from 'react'

export default function ReservationForm({ 
        name, setName,
        phone, setPhone,
        email, setEmail,
        date, setDate,
        guests, setGuests
}) {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            {/* Row 1: Full Name + Email */}
            <div>
                <label className="block mb-1 text-sm text-white">Full Name</label>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full h-10 px-3 py-2 rounded border border-gray-300 bg-white"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm text-white">Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full h-10 px-3 py-2 rounded border border-gray-300 bg-white"
                />
            </div>

            {/* Row 2: Phone + Reservation Date */}
            <div>
                <label className="block mb-1 text-sm text-white">Phone Number</label>
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="w-full h-10 px-3 py-2 rounded border border-gray-300 bg-white"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm text-white">Reservation Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded border border-gray-300 bg-white"
                />
            </div>

            {/* Row 3: Number of Guests (time selection rendered via SlotsView in App) */}
            <div>
                <label className="block mb-1 text-sm text-white">Number of Guests</label>
                <select
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value))}
                    className="w-full h-10 px-3 py-2 rounded border border-gray-300 bg-white"
                >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}