import type { H3Event } from 'h3'

export async function readManagerBody(event: H3Event): Promise<any> {
  if (!getHeader(event, 'content-type')?.toLowerCase().startsWith('application/json')) throw createError({ statusCode: 415, statusMessage: 'JSON required' })
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of event.node.req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > 4096) throw createError({ statusCode: 413, statusMessage: 'Request too large' })
    chunks.push(buffer)
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { throw createError({ statusCode: 400, statusMessage: 'Invalid JSON' }) }
}
