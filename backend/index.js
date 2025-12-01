const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

function toMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function pad(n) { return n < 10 ? '0' + n : '' + n }

function formatTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad(h)}:${pad(m)}`;
}

// generate slots (30-min steps) for a date
function generateSlotsForDate(date) {
  // Example: lunch (12:00-14:30) and dinner (18:00-22:00)
  const ranges = [ [12*60, 14*60 + 30], [18*60, 22*60] ];
  const slots = [];
  ranges.forEach(([start, end]) => {
    for (let t = start; t <= end; t += 30) {
      slots.push(formatTime(t));
    }
  });
  return slots;
}

// GET /api/slots?resource=Table%201&date=2025-12-01
app.get('/api/slots', (req, res) => {
  const { resource, date } = req.query;
  if (!resource || !date) return res.status(400).json({ error: 'resource and date required' });
  if (!resources.includes(resource)) return res.status(400).json({ error: 'unknown resource' });

  const allSlots = generateSlotsForDate(date);
  const takenTimes = bookings
    .filter(b => b.resource === resource && b.date === date)
    .map(b => b.time);

  const slots = allSlots.map(t => ({ time: t, available: !takenTimes.includes(t) }));
  res.json({ resource, date, slots });
});

// POST /api/bookings
// body: { resource, date, time, name, email }
app.post('/api/bookings', (req, res) => {
  const { resource, date, time, name, email } = req.body;
  if (!resource || !date || !time || !name || !email) {
    return res.status(400).json({ error: 'resource, date, time, name, email required' });
  }
  if (!resources.includes(resource)) return res.status(400).json({ error: 'unknown resource' });

  // conflict detection: exact time match for same resource/date
  const conflict = bookings.find(b => b.resource === resource && b.date === date && b.time === time);
  if (conflict) return res.status(409).json({ error: 'time slot already booked' });

  const id = `${Date.now()}-${Math.floor(Math.random()*10000)}`;
  const booking = { id, resource, date, time, name, email, createdAt: new Date().toISOString() };
  bookings.push(booking);
  res.status(201).json(booking);
});

// GET /api/bookings/:date/:resource
app.get('/api/bookings/:date/:resource', (req, res) => {
  const { date, resource } = req.params;
  if (!date || !resource) return res.status(400).json({ error: 'date and resource required' });
  const list = bookings.filter(b => b.date === date && b.resource === resource);
  res.json(list);
});

// DELETE /api/bookings/:id
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'booking not found' });
  const [removed] = bookings.splice(idx, 1);
  res.json({ success: true, booking: removed });
});

// Simple route to list resources
app.get('/api/resources', (req, res) => res.json(resources));

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
