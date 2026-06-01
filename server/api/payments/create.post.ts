export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return {
    status: 'payment-provider-not-configured',
    bookingId: body.bookingId || null,
    paymentUrl: null,
    nextStep: 'Connect YooKassa/CloudPayments/Stripe-compatible provider in server runtime config.'
  }
})
