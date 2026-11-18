export default defineEventHandler(event => {
  if (getRequestURL(event).pathname.startsWith('/api/manager/')) {
    setHeader(event, 'Cache-Control', 'no-store, private')
    setHeader(event, 'X-Content-Type-Options', 'nosniff')
  }
})
