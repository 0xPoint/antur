export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{
    name?: string
    phone?: string
    message?: string
    context?: string
  }>(event)

  const name = sanitizeField(body.name, 120)
  const phone = sanitizeField(body.phone, 80)
  const message = sanitizeField(body.message, 1200)
  const context = sanitizeField(body.context, 160)

  if (!phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Phone is required'
    })
  }

  if (!config.resendApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Resend API key is not configured'
    })
  }

  const createdAt = new Date().toISOString()
  const text = [
    'Новая заявка с сайта Антур',
    '',
    `Имя: ${name || 'Не указано'}`,
    `Телефон: ${phone}`,
    `Контекст: ${context || 'Не указан'}`,
    `Комментарий: ${message || 'Не указан'}`,
    '',
    `Время: ${createdAt}`,
    `User-Agent: ${getRequestHeader(event, 'user-agent') || 'Не указан'}`
  ].join('\n')

  try {
    const resendResponse = await $fetch<{ id?: string }>('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Idempotency-Key': `antur-lead-${Date.now()}`
      },
      body: {
        from: config.resendFromEmail,
        to: config.leadRecipientEmail,
        subject: 'Новая заявка с сайта Антур',
        text,
        html: renderLeadHtml({ name, phone, message, context, createdAt })
      }
    })

    return {
      status: 'lead-sent',
      id: resendResponse.id
    }
  } catch (error) {
    console.error('Resend lead delivery failed', error)

    throw createError({
      statusCode: 502,
      statusMessage: 'Lead delivery failed'
    })
  }
})

const sanitizeField = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength)
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const renderLeadHtml = (lead: {
  name: string
  phone: string
  message: string
  context: string
  createdAt: string
}) => {
  const rows = [
    ['Имя', lead.name || 'Не указано'],
    ['Телефон', lead.phone],
    ['Контекст', lead.context || 'Не указан'],
    ['Комментарий', lead.message || 'Не указан'],
    ['Время', lead.createdAt]
  ]

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#102331">
      <h1 style="font-size:22px;margin:0 0 16px">Новая заявка с сайта Антур</h1>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="border:1px solid #dbe5ea;font-weight:700">${escapeHtml(label)}</td>
            <td style="border:1px solid #dbe5ea">${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `
}
