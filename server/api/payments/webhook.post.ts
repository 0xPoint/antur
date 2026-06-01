export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return {
    received: true,
    event: body?.event || null,
    nextStep: 'Verify webhook signature, mark booking as paid, send notifications.'
  }
})
