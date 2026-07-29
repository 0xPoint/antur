const ISO_CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

// Union держим локально: tsconfig.test.json компилирует только tests/ и utils/,
// поэтому utils не должен зависеть от data/i18n-base.
type MediaDateLocale = 'ru' | 'en' | 'zh'

const intlLocaleByCode: Record<MediaDateLocale, string> = {
  ru: 'ru-RU',
  en: 'en-GB',
  zh: 'zh-CN'
}

/**
 * Человекочитаемая подпись для даты съёмки. Медиа-даты хранятся как камчатские
 * календарные дни, поэтому разбираем их по компонентам и форматируем полдень
 * локального дня — так подпись не съезжает на сутки ни в одной таймзоне.
 */
export const formatMediaDate = (date: string, locale: MediaDateLocale) => {
  const match = ISO_CALENDAR_DATE.exec(date)

  if (!match) {
    throw new TypeError(`Invalid media date: ${date}`)
  }

  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const parsed = new Date(year, month - 1, day, 12)

  if (
    parsed.getFullYear() !== year
    || parsed.getMonth() !== month - 1
    || parsed.getDate() !== day
  ) {
    throw new TypeError(`Invalid media date: ${date}`)
  }

  return new Intl.DateTimeFormat(intlLocaleByCode[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(parsed)
}
