const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

export const latestIsoDate = (...dates: Array<string | undefined>) => {
  const validDates = dates.filter((date): date is string => Boolean(date && isoDatePattern.test(date)))

  if (!validDates.length) {
    throw new TypeError('At least one YYYY-MM-DD date is required')
  }

  return validDates.reduce((latest, date) => date > latest ? date : latest)
}
