const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// REQUIRED FOR RENDER
const PORT = process.env.PORT || 4000;

// In-memory storage
const resources = [
  'Table 1',
  'Table 2',
  'Table 3',
  'Table 4',
  'Private Room'
];

const bookings = [];

// Format helpers
function pad(n) { return n < 10 ? '0' + n : '' + n; }

function formatTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad(h)}:${pad(m)}`;
}

/*
  Business Hours:
  Lunch: 12:00 → 14:30 closing
  Dinner: 18:00 → 22:30 closing

  Slots are 30 min.
*/
function generateSlotsForDate(date) {
  const ranges = [
    [12 * 60, 14 * 60 + 30], // 12:00 – 14:30
    [18 * 60, 22 * 60 + 30]  // 18:00 – 22:30
  ];

  const slots = [];
  for (const [start, end] of ranges) {
    for (let t = start; t < end; t += 30) {
      slots.push(formatTime(t));
    }
  }
  return slots;
}

// GET /api/slots
app.get('/api/slots', (req, res) => {
  const { resource, date } = req.query;

  if (!resource || !date)
    return res.status(400).json({ error: 'resource and date required' });

  if (!resources.includes(resource))
    return res.status(400).json({ error: 'unknown resource' });

  const allSlots = generateSlotsForDate(date);

  const takenTimes = bookings
    .filter(b => b.resource === resource && b.date === date)
    .map(b => b.time);

  const slots = allSlots.map(t => ({
    time: t,
    available: !takenTimes.includes(t)
  }));

  res.json({ resource, date, slots });
});

// POST /api/bookings
app.post('/api/bookings', (req, res) => {
  const { resource, date, time, name, email } = req.body;

  if (!resource || !date || !time || !name || !email) {
    return res.status(400).json({
      error: 'resource, date, time, name, email required'
    });
  }

  if (!resources.includes(resource)) {
    return res.status(400).json({ error: 'unknown resource' });
  }

  const validSlots = generateSlotsForDate(date);
  if (!validSlots.includes(time)) {
    return res.status(400).json({
      error: `Invalid time. Must be one of: ${validSlots.join(', ')}` 
    });
  }

  const conflict = bookings.find(
    b => b.resource === resource && b.date === date && b.time === time
  );

  if (conflict) {
    return res.status(409).json({ error: 'time slot already booked' });
  }

  const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const booking = {
    id,
    resource,
    date,
    time,
    name,
    email,
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);
  res.status(201).json(booking);
});

// GET /api/bookings/:date/:resource
app.get('/api/bookings/:date/:resource', (req, res) => {
  const { date, resource } = req.params;

  if (!resources.includes(resource)) {
    return res.status(400).json({ error: 'unknown resource' });
  }

  const list = bookings.filter(
    b => b.date === date && b.resource === resource
  );

  res.json(list);
});

// DELETE /api/bookings/:id

app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;

  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'booking not found' });
  }

  const [removed] = bookings.splice(idx, 1);
  res.json({ success: true, booking: removed });
});

// GET /api/resources
app.get('/api/resources', (req, res) => {
  res.json(resources);
});

// START THE SERVER
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
