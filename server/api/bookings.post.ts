export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return {
    id: `booking_${Date.now()}`,
    status: 'lead-created',
    payload: body,
    nextStep: 'Persist booking draft, lock availability slot, then create payment intent.'
  }
})
