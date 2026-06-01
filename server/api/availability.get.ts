export default defineEventHandler((event) => {
  const query = getQuery(event)

  return {
    route: query.route || null,
    month: query.month || null,
    days: [
      { date: '2026-06-08', status: 'available', slots: ['09:00'] },
      { date: '2026-06-09', status: 'weather-check', slots: ['10:00'] },
      { date: '2026-06-10', status: 'booked', slots: [] }
    ],
    source: 'stub',
    nextStep: 'Replace with database-backed availability and weather constraints.'
  }
})
