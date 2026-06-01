export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return {
    status: 'pending-moderation',
    payload: body,
    nextStep: 'Store review as unapproved, notify moderator, render only approved reviews.'
  }
})
