const ISO_CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Google expects VideoObject dates to be DateTime values, including a timezone.
 * Media dates are stored as Kamchatka calendar dates, so use the start of that
 * local day rather than letting a crawler or server infer its own timezone.
 */
export const toVideoPublicationDateTime = (date: string) => {
  const match = ISO_CALENDAR_DATE.exec(date)

  if (!match) {
    throw new TypeError(`Invalid media date: ${date}`)
  }

  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const parsed = new Date(Date.UTC(year, month - 1, day))

  if (
    parsed.getUTCFullYear() !== year
    || parsed.getUTCMonth() !== month - 1
    || parsed.getUTCDate() !== day
  ) {
    throw new TypeError(`Invalid media date: ${date}`)
  }

  return `${date}T00:00:00+12:00`
}
