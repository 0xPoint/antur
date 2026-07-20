export interface VideoWatchPage {
  slug: string
  path: string
  mediaId: string
  title: string
  description: string
  seoTitle: string
  seoDescription: string
  routePath: string
  routeLabel: string
  details: string[]
}

export const videoWatchPages: VideoWatchPage[] = [
  {
    slug: 'kosatki-kamchatka-7-iyulya-2026',
    path: '/video/kosatki-kamchatka-7-iyulya-2026/',
    mediaId: 'video-orcas-2026-07-07',
    title: 'Косатки у побережья Камчатки — видео 7 июля 2026 года',
    description: 'Фактическая встреча с косатками во время большого морского выхода вдоль побережья Камчатки 7 июля 2026 года.',
    seoTitle: 'Косатки на Камчатке — видео встречи 7 июля 2026 | Антур',
    seoDescription: 'Видео косаток у побережья Камчатки, снятое во время морского выхода Антур 7 июля 2026 года. Маршруты и честные условия наблюдения.',
    routePath: '/morskie-progulki/buhta-russkaya/',
    routeLabel: 'Маршрут в Бухту Русскую',
    details: [
      'Видео снято гостями и командой во время реального выхода сезона 2026 года.',
      'Встреча с косатками стала частью маршрута, но не была гарантированной услугой.',
      'Для морской природы чаще выбирают большие маршруты вдоль побережья.'
    ]
  },
  {
    slug: 'morskaya-rybalka-avachinskiy-zaliv-3-iyulya-2026',
    path: '/video/morskaya-rybalka-avachinskiy-zaliv-3-iyulya-2026/',
    mediaId: 'video-fishing-trip-2026-07-03',
    title: 'Морская рыбалка в Авачинском заливе — видео 3 июля 2026 года',
    description: 'Рыболовный выход с борта катера Антур в Авачинском заливе: реальная обстановка на воде, снасти и формат морской рыбалки.',
    seoTitle: 'Морская рыбалка на Камчатке — видео выхода 3 июля 2026 | Антур',
    seoDescription: 'Видео морской рыбалки с катера Антур в Авачинском заливе 3 июля 2026 года. Прибрежный формат, цены и условия выхода.',
    routePath: '/rybalka/morskaya-rybalka/',
    routeLabel: 'Прибрежная морская рыбалка',
    details: [
      'Это фактический выход 3 июля 2026 года, а не постановочный рекламный ролик.',
      'Прибрежную рыбалку можно забронировать на 5 или 10 часов для компании до 11 человек.',
      'Состав улова зависит от точки, глубины, погоды и конкретного дня.'
    ]
  },
  {
    slug: 'krabovoe-safari-kamchatka-30-maya-2026',
    path: '/video/krabovoe-safari-kamchatka-30-maya-2026/',
    mediaId: 'video-crab-safari-2026-05-30',
    title: 'Крабовое сафари на Камчатке — видео 30 мая 2026 года',
    description: 'Видео крабового сафари на борту катера во время морского выхода Антур 30 мая 2026 года.',
    seoTitle: 'Крабовое сафари на Камчатке — видео выхода | Антур',
    seoDescription: 'Видео крабового сафари на Камчатке 30 мая 2026 года: как выглядит морской выход с крабом и с какими маршрутами он совмещается.',
    routePath: '/morskie-progulki/krabovoe-safari/',
    routeLabel: 'Крабовое сафари на Камчатке',
    details: [
      'Крабовая часть проводится только там, где позволяют маршрут, погода и безопасность.',
      'Её можно совместить с островом Старичков, Бухтой Русской или арендой катера для рыбалки.',
      'Видео показывает реальный формат, но не является гарантией одинакового улова на каждом выходе.'
    ]
  }
]

export const videoWatchPageByMediaId = new Map(videoWatchPages.map((page) => [page.mediaId, page]))
