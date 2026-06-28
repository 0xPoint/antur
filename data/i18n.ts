import { routeOffers as ruRouteOffers } from './routes'
import { bookingTerms as ruBookingTerms, faq as ruFaq } from './site'
import { reviews as ruReviews, tourPhotos as ruTourPhotos } from './social-proof'
import type { Review, RouteOffer, TourPhoto } from '~/types/content'

export type LocaleCode = 'ru' | 'en' | 'zh'

export const defaultLocale: LocaleCode = 'ru'

export const locales: Array<{
  code: LocaleCode
  label: string
  shortLabel: string
  hreflang: string
  ogLocale: string
}> = [
  { code: 'ru', label: 'Русский', shortLabel: 'RU', hreflang: 'ru-RU', ogLocale: 'ru_RU' },
  { code: 'en', label: 'English', shortLabel: 'EN', hreflang: 'en', ogLocale: 'en_US' },
  { code: 'zh', label: '中文', shortLabel: '中文', hreflang: 'zh-CN', ogLocale: 'zh_CN' }
]

const prefixedLocales = new Set<LocaleCode>(['en', 'zh'])

export const isLocaleCode = (value: unknown): value is LocaleCode =>
  typeof value === 'string' && locales.some((locale) => locale.code === value)

export const getLocaleFromPath = (path: string): LocaleCode => {
  const firstSegment = path.split(/[/?#]/).filter(Boolean)[0]
  return isLocaleCode(firstSegment) ? firstSegment : defaultLocale
}

export const stripLocaleFromPath = (path: string) => {
  const [pathWithQuery, hash = ''] = path.split('#')
  const [pathname, query = ''] = pathWithQuery.split('?')
  const segments = pathname.split('/').filter(Boolean)

  if (isLocaleCode(segments[0])) {
    segments.shift()
  }

  const cleanPath = `/${segments.join('/')}`.replace(/\/$/, '') || '/'
  return `${cleanPath}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`
}

export const localizePath = (path: string, locale: LocaleCode) => {
  const cleanPath = stripLocaleFromPath(path)
  const [pathWithQuery, hash = ''] = cleanPath.split('#')

  if (!prefixedLocales.has(locale)) {
    return cleanPath
  }

  const localizedPath = pathWithQuery === '/' ? `/${locale}` : `/${locale}${pathWithQuery}`
  return `${localizedPath}${hash ? `#${hash}` : ''}`
}

export const localeLabels = Object.fromEntries(locales.map((locale) => [locale.code, locale.label])) as Record<LocaleCode, string>

export const localizedBusiness = {
  ru: {
    brand: 'Антур',
    tagline: 'sea tours kamchatka',
    legalName: 'ИП Хавилов А. Г.',
    region: 'Петропавловск-Камчатский',
    mapEyebrow: 'Точка сбора',
    mapTitle: 'Точка сбора на интерактивной карте',
    mapLink: 'Открыть в 2GIS',
    mapLabel: 'Интерактивная карта точки сбора Антур',
    mapAlt: 'Карта Петропавловска-Камчатского с точкой сбора Антур',
    mapCardTitle: 'Точка сбора Антур',
    mapCardPlace: 'Петропавловск-Камчатский'
  },
  en: {
    brand: 'Antur',
    tagline: 'sea tours kamchatka',
    legalName: 'Individual Entrepreneur A. G. Khavilov',
    region: 'Petropavlovsk-Kamchatsky',
    mapEyebrow: 'Meeting point',
    mapTitle: 'Meeting point on an interactive map',
    mapLink: 'Open in 2GIS',
    mapLabel: 'Interactive map of the Antur meeting point',
    mapAlt: 'Map of Petropavlovsk-Kamchatsky with the Antur meeting point',
    mapCardTitle: 'Antur meeting point',
    mapCardPlace: 'Petropavlovsk-Kamchatsky'
  },
  zh: {
    brand: 'Antur',
    tagline: 'sea tours kamchatka',
    legalName: '个体经营者 A. G. Khavilov',
    region: '彼得罗巴甫洛夫斯克-堪察加',
    mapEyebrow: '集合点',
    mapTitle: '集合点互动地图',
    mapLink: '在 2GIS 中打开',
    mapLabel: 'Antur 集合点互动地图',
    mapAlt: '彼得罗巴甫洛夫斯克-堪察加 Antur 集合点地图',
    mapCardTitle: 'Antur 集合点',
    mapCardPlace: '彼得罗巴甫洛夫斯克-堪察加'
  }
} satisfies Record<LocaleCode, Record<string, string>>

export const ui = {
  ru: {
    skip: 'Перейти к содержанию',
    homeAria: 'Антур, на главную',
    navAria: 'Разделы сайта',
    nav: { routes: 'Маршруты', gallery: 'Фото', reviews: 'Отзывы', booking: 'Бронь' },
    contact: {
      cta: 'Связаться',
      book: 'Забронировать',
      bookTrip: 'Забронировать выход',
      bookContext: 'Вопрос с сайта',
      mobileContext: 'Вопрос с мобильной версии',
      close: 'Закрыть окно связи',
      eyebrow: 'Связь',
      title: 'Как удобнее связаться?',
      lead: 'Напишите в мессенджер или позвоните. Подскажем свободные даты, маршрут и условия выхода.',
      options: 'Быстрые варианты связи',
      call: 'Позвонить',
      whatsapp: 'Написать в WhatsApp',
      max: 'Написать в MAX'
    },
    language: {
      label: 'Язык сайта',
      current: 'Текущий язык',
      switchTo: 'Переключить язык на'
    },
    hero: {
      location: 'Петропавловск-Камчатский',
      title: 'Морские прогулки и глубоководная рыбалка на Камчатке',
      lead: 'Выходы в Тихий океан на катере: рыбалка, крабовое сафари, Бухта Русская, остров Старичков и спокойный морской день с экипажем, который знает акваторию.',
      routes: 'Смотреть маршруты',
      note: 'Ответим по датам, погоде и формату поездки',
      imageAlt: 'Касатки выпрыгивают из воды',
      context: 'Бронирование из первого экрана'
    },
    home: {
      seoTitle: 'Морские прогулки и рыбалка на Камчатке | Антур',
      seoDescription: 'Морские прогулки, глубоководная рыбалка, Бухта Русская, остров Старичков и крабовое сафари из Петропавловска-Камчатского. Официальная деятельность, гости застрахованы.',
      routesEyebrow: 'Маршруты и цены',
      routesTitle: 'Выберите формат выхода',
      details: 'Подробнее',
      introEyebrow: 'Камчатка с воды',
      introTitle: 'Море, вулканы и маршруты с характером',
      introText: 'Подберем формат под вашу компанию: короткая прогулка по бухте, рыбалка в океане, выход к острову Старичков или длинный день с Бухтой Русской, крабом и остановками на берегу.',
      introAlt: 'Скалы Камчатки со стороны океана',
      introCaption: 'Маршрут подтверждаем накануне выхода с учетом погоды и состояния акватории.',
      galleryEyebrow: 'Свежие фото',
      galleryTitle: 'Океан, краб, рыбалка и Камчатка в одном дне',
      galleryText: 'Живые кадры с маршрутов: косатки, сивучи, скалы, рыбалка, краб и спокойные моменты после выхода.',
      galleryLink: 'Смотреть галерею',
      galleryAria: 'Фотографии тура',
      gallerySlider: {
        previous: 'Предыдущее медиа',
        next: 'Следующее медиа',
        open: 'Открыть во весь экран',
        close: 'Закрыть полноэкранный просмотр'
      },
      safetyEyebrow: 'Почему спокойно',
      safetyTitle: 'Маршрут ведет капитан, а не расписание',
      safetyText: 'Камчатское море быстро меняется, поэтому программа всегда сверяется с прогнозом, состоянием акватории и составом группы. Если условия требуют корректировки, обсуждаем это заранее.',
      bookingEyebrow: 'Бронирование',
      bookingTitle: 'Подберем дату и формат выхода',
      bookingText: 'Напишите или позвоните: уточним маршрут, сезонную цену, состав группы и прогноз. Для бронирования места нужна предоплата 1 000 ₽.',
      bookingButton: 'Записаться',
      bookingContext: 'Бронирование морской прогулки',
      bookingAlt: 'Крабовая дегустация на борту',
      faqEyebrow: 'Часто задаваемые вопросы',
      faqTitle: 'Перед выходом в море',
      faqAlt: 'Морские прогулки и глубоководная рыбалка на Камчатке',
      reviewsEyebrow: 'Отзывы',
      reviewsTitle: 'Отзывы гостей',
      reviewsAria: 'Отзывы гостей',
      prevReviews: 'Предыдущие отзывы',
      nextReviews: 'Следующие отзывы',
      ratingLabel: (rating: number) => `${rating} из 5`
    },
    route: {
      missing: 'Маршрут не найден',
      date: 'Уточнить дату',
      program: 'Программа',
      includes: 'Что входит',
      duration: 'Длительность',
      price: 'Стоимость',
      currentPrice: 'Актуальный прайс',
      seasonalPrice: 'Цены по сезону и формату',
      seoSuffix: 'на Камчатке | Антур',
      touristTypes: ['рыбалка', 'морская прогулка', 'Камчатка']
    },
    gallery: {
      seoTitle: 'Фото морских прогулок и рыбалки на Камчатке | Антур',
      seoDescription: 'Свежие фото из морских прогулок, рыбалки и крабового сафари на Камчатке.',
      eyebrow: 'Свежие фото',
      title: 'Фото из морских выходов',
      lead: 'Свежие фото и видео с морских прогулок, рыбалки и крабового сафари. Показываем реальные детали маршрутов, природы и отдыха после выхода.',
      dateLocale: 'ru-RU'
    }
  },
  en: {
    skip: 'Skip to content',
    homeAria: 'Antur, home page',
    navAria: 'Site sections',
    nav: { routes: 'Routes', gallery: 'Photos', reviews: 'Reviews', booking: 'Booking' },
    contact: {
      cta: 'Contact',
      book: 'Book',
      bookTrip: 'Book a trip',
      bookContext: 'Question from the website',
      mobileContext: 'Question from the mobile version',
      close: 'Close contact dialog',
      eyebrow: 'Contact',
      title: 'How would you like to contact us?',
      lead: 'Message us or call. We will suggest available dates, the right route and sea trip conditions.',
      options: 'Quick contact options',
      call: 'Call',
      whatsapp: 'Message on WhatsApp',
      max: 'Message on MAX'
    },
    language: {
      label: 'Site language',
      current: 'Current language',
      switchTo: 'Switch language to'
    },
    hero: {
      location: 'Petropavlovsk-Kamchatsky',
      title: 'Kamchatka sea tours and deep-sea fishing',
      lead: 'Boat trips into the Pacific Ocean: fishing, crab safari, Russkaya Bay, Starichkov Island and a calm sea day with a crew that knows the local waters.',
      routes: 'View routes',
      note: 'We will advise on dates, weather and the right trip format',
      imageAlt: 'Orcas jumping out of the water',
      context: 'Booking from the hero section'
    },
    home: {
      seoTitle: 'Sea tours and fishing in Kamchatka | Antur',
      seoDescription: 'Sea tours, deep-sea fishing, Russkaya Bay, Starichkov Island and crab safari from Petropavlovsk-Kamchatsky. Official operator, insured guests.',
      routesEyebrow: 'Routes and prices',
      routesTitle: 'Choose your sea trip format',
      details: 'Details',
      introEyebrow: 'Kamchatka from the sea',
      introTitle: 'Ocean, volcanoes and routes with character',
      introText: 'We will choose a format for your group: a short bay tour, ocean fishing, Starichkov Island or a full day to Russkaya Bay with crab, fishing and shore stops.',
      introAlt: 'Kamchatka cliffs seen from the ocean',
      introCaption: 'The route is confirmed the day before departure with weather and sea conditions in mind.',
      galleryEyebrow: 'Fresh photos',
      galleryTitle: 'Ocean, crab, fishing and Kamchatka in one day',
      galleryText: 'Real moments from the routes: orcas, sea lions, cliffs, fishing, crab and calm time after the trip.',
      galleryLink: 'View gallery',
      galleryAria: 'Tour photos',
      gallerySlider: {
        previous: 'Previous media',
        next: 'Next media',
        open: 'Open fullscreen',
        close: 'Close fullscreen view'
      },
      safetyEyebrow: 'Why it feels calm',
      safetyTitle: 'The captain leads the route, not the timetable',
      safetyText: 'Kamchatka waters change quickly, so every program is checked against forecast, sea state and group composition. If conditions require a change, we discuss it in advance.',
      bookingEyebrow: 'Booking',
      bookingTitle: 'We will choose the date and format',
      bookingText: 'Message or call us: we will confirm the route, seasonal price, group size and forecast. A 1,000 ₽ prepayment is required to reserve a seat.',
      bookingButton: 'Sign up',
      bookingContext: 'Sea tour booking',
      bookingAlt: 'Crab tasting on board',
      faqEyebrow: 'FAQ',
      faqTitle: 'Before going to sea',
      faqAlt: 'Kamchatka sea tours and deep-sea fishing',
      reviewsEyebrow: 'Reviews',
      reviewsTitle: 'Guest reviews',
      reviewsAria: 'Guest reviews',
      prevReviews: 'Previous reviews',
      nextReviews: 'Next reviews',
      ratingLabel: (rating: number) => `${rating} out of 5`
    },
    route: {
      missing: 'Route not found',
      date: 'Check dates',
      program: 'Program',
      includes: 'What is included',
      duration: 'Duration',
      price: 'Price',
      currentPrice: 'Current price list',
      seasonalPrice: 'Prices by season and format',
      seoSuffix: 'in Kamchatka | Antur',
      touristTypes: ['fishing', 'sea tour', 'Kamchatka']
    },
    gallery: {
      seoTitle: 'Photos from Kamchatka sea tours and fishing | Antur',
      seoDescription: 'Fresh photos from sea tours, fishing trips and crab safari in Kamchatka.',
      eyebrow: 'Fresh photos',
      title: 'Photos from sea trips',
      lead: 'Fresh photos and videos from sea tours, fishing trips and crab safari. See the routes, wildlife and post-trip moments as they are.',
      dateLocale: 'en-US'
    }
  },
  zh: {
    skip: '跳到主要内容',
    homeAria: 'Antur 首页',
    navAria: '网站栏目',
    nav: { routes: '路线', gallery: '照片', reviews: '评价', booking: '预订' },
    contact: {
      cta: '联系',
      book: '预订',
      bookTrip: '预订出海',
      bookContext: '网站咨询',
      mobileContext: '移动端咨询',
      close: '关闭联系窗口',
      eyebrow: '联系',
      title: '怎样联系更方便？',
      lead: '可以发消息或电话联系我们。我们会确认可选日期、路线和出海条件。',
      options: '快速联系方式',
      call: '电话联系',
      whatsapp: '通过 WhatsApp 联系',
      max: '通过 MAX 联系'
    },
    language: {
      label: '网站语言',
      current: '当前语言',
      switchTo: '切换语言到'
    },
    hero: {
      location: '彼得罗巴甫洛夫斯克-堪察加',
      title: '堪察加海上观光与深海钓鱼',
      lead: '乘船进入太平洋：海钓、帝王蟹体验、鲁斯卡亚湾、斯塔里奇科夫岛，以及由熟悉海域的船员陪同的轻松海上一日游。',
      routes: '查看路线',
      note: '我们会根据日期、天气和出行形式给出建议',
      imageAlt: '虎鲸跃出水面',
      context: '首屏预订咨询'
    },
    home: {
      seoTitle: '堪察加海上观光与钓鱼 | Antur',
      seoDescription: '从彼得罗巴甫洛夫斯克-堪察加出发的海上观光、深海钓鱼、鲁斯卡亚湾、斯塔里奇科夫岛和帝王蟹体验。正规运营，客人已投保。',
      routesEyebrow: '路线与价格',
      routesTitle: '选择出海形式',
      details: '了解详情',
      introEyebrow: '从海上看堪察加',
      introTitle: '海洋、火山与有性格的路线',
      introText: '我们会按您的团队选择形式：短途海湾观光、海钓、斯塔里奇科夫岛，或前往鲁斯卡亚湾的一整天行程，包含帝王蟹、钓鱼和岸上停留。',
      introAlt: '从海上看到的堪察加海岸岩石',
      introCaption: '出发前一天会根据天气和海况确认路线。',
      galleryEyebrow: '最新照片',
      galleryTitle: '一天里看见海洋、帝王蟹、钓鱼和堪察加',
      galleryText: '路线中的真实画面：虎鲸、海狮、岩石、海钓、帝王蟹和出海后的轻松时刻。',
      galleryLink: '查看图库',
      galleryAria: '行程照片',
      gallerySlider: {
        previous: '上一项媒体',
        next: '下一项媒体',
        open: '全屏打开',
        close: '关闭全屏查看'
      },
      safetyEyebrow: '为什么安心',
      safetyTitle: '路线由船长决定，而不是死板时间表',
      safetyText: '堪察加海况变化很快，因此每次行程都会结合天气预报、海况和团队组成确认。如需调整，我们会提前沟通。',
      bookingEyebrow: '预订',
      bookingTitle: '我们帮您选择日期和出海形式',
      bookingText: '请发消息或电话联系我们：我们会确认路线、季节价格、团队人数和天气预报。预留名额需支付 1,000 ₽ 预付款。',
      bookingButton: '报名',
      bookingContext: '海上行程预订',
      bookingAlt: '船上的帝王蟹品尝',
      faqEyebrow: '常见问题',
      faqTitle: '出海前须知',
      faqAlt: '堪察加海上观光与深海钓鱼',
      reviewsEyebrow: '评价',
      reviewsTitle: '客人评价',
      reviewsAria: '客人评价',
      prevReviews: '上一条评价',
      nextReviews: '下一条评价',
      ratingLabel: (rating: number) => `${rating} / 5`
    },
    route: {
      missing: '未找到路线',
      date: '确认日期',
      program: '行程',
      includes: '包含内容',
      duration: '时长',
      price: '价格',
      currentPrice: '当前价目表',
      seasonalPrice: '按季节和形式计价',
      seoSuffix: '| 堪察加 | Antur',
      touristTypes: ['海钓', '海上观光', '堪察加']
    },
    gallery: {
      seoTitle: '堪察加海上观光与钓鱼照片 | Antur',
      seoDescription: '堪察加海上观光、钓鱼和帝王蟹体验的最新照片。',
      eyebrow: '最新照片',
      title: '出海照片',
      lead: '来自海上观光、海钓和帝王蟹体验的最新照片与视频，展示路线、自然和出海后的真实细节。',
      dateLocale: 'zh-CN'
    }
  }
} satisfies Record<LocaleCode, Record<string, any>>

const enRouteOffers: RouteOffer[] = [
  {
    slug: 'rybalka',
    title: 'Coastal ocean fishing',
    kicker: 'Boat charter',
    duration: '5 or 10 hours',
    price: 'from 65,000 ₽',
    description: 'A trip for up to 6 guests: fishing near the Kamchatka coast, prepared tackle and an optional crab safari by agreement with the captain.',
    highlights: ['Group of up to 6 guests', 'Fishing tackle is provided', 'Crab safari by agreement with the captain'],
    priceOptions: [
      { season: 'May - September', format: '5 hours, group up to 6 guests', price: '65,000 ₽' },
      { season: 'May - September', format: '10 hours, group up to 6 guests', price: '130,000 ₽' },
      { season: 'May - September', format: 'Extra boat charter time', price: '5,000 ₽ / hour' }
    ],
    image: '/images/fishing-deck.jpg',
    imageAlt: 'Fishing tackle on the deck during a sea fishing trip',
    pageImage: '/images/fishing-deck.jpg',
    pageImageAlt: 'Fishing tackle on the deck during a sea fishing trip',
    imageCredit: ruRouteOffers[0].imageCredit,
    featured: true
  },
  {
    slug: 'glubokovodnaya-rybalka',
    title: 'Deep-sea ocean fishing',
    kicker: 'Boat charter',
    duration: '5 or 10 hours',
    price: 'from 85,000 ₽',
    description: 'A route farther into the ocean for guests who come specifically for fishing: more time on the water, deeper spots and a fuller day.',
    highlights: ['Group of up to 6 guests', 'Fishing tackle is provided', 'Crab safari by agreement with the captain'],
    priceOptions: [
      { season: 'May - September', format: '5 hours, group up to 6 guests', price: '85,000 ₽' },
      { season: 'May - September', format: '10 hours, group up to 6 guests', price: '170,000 ₽' },
      { season: 'May - September', format: 'Extra boat charter time', price: '5,000 ₽ / hour' }
    ],
    image: '/images/fishing-deck.jpg',
    imageAlt: 'Fishing tackle on the deck during a deep-sea fishing trip',
    pageImage: '/images/location-avacha-boat.jpg',
    pageImageAlt: 'Ocean view near the Kamchatka coast',
    imageCredit: ruRouteOffers[1].imageCredit
  },
  {
    slug: 'buhta-russkaya',
    title: 'Russkaya Bay',
    kicker: '10 hours',
    duration: '10 hours',
    price: 'from 15,000 ₽ / guest',
    description: 'A full sea day to Russkaya Bay with a shore landing, fishing and crab safari.',
    highlights: ['Crab safari', '10-hour fishing route', 'Bay entrance and shore landing', 'Shared groups and boat charter'],
    priceOptions: [
      { season: 'May - June', format: 'Shared group', price: '15,000 ₽ / guest' },
      { season: 'May - June', format: 'Boat charter, group up to 8 guests', price: '120,000 ₽' },
      { season: 'May - June', format: 'Boat charter, group up to 10 guests', price: '150,000 ₽' },
      { season: 'July - September', format: 'Shared group', price: '18,000 ₽ / guest' },
      { season: 'July - September', format: 'Boat charter, group up to 8 guests', price: '135,000 ₽' },
      { season: 'July - September', format: 'Boat charter, group up to 10 guests', price: '170,000 ₽' }
    ],
    image: '/images/hero-kamchatka-boat.jpg',
    imageAlt: 'Boat in the ocean near the Kamchatka coast',
    pageImage: '/images/location-buhta-russkaya.jpg',
    pageImageAlt: 'Cape Kekurny beach in Russkaya Bay, Kamchatka',
    imageCredit: ruRouteOffers[2].imageCredit
  },
  {
    slug: 'ostrov-starichkov',
    title: 'Starichkov Island',
    kicker: '5 hours',
    duration: '5 hours',
    price: 'from 7,000 ₽ / guest',
    description: 'A five-hour route to Starichkov Island: cliffs, seabirds, sea fishing and crab safari in one trip.',
    highlights: ['Sea fishing', 'Crab safari', 'Shared groups and boat charter', '5-hour route'],
    priceOptions: [
      { season: 'May - June', format: 'Shared group', price: '7,000 ₽ / guest' },
      { season: 'May - June', format: 'Boat charter, group up to 8 guests', price: '56,000 ₽' },
      { season: 'May - June', format: 'Boat charter, group up to 10 guests', price: '70,000 ₽' },
      { season: 'July - September', format: 'Shared group', price: '8,500 ₽ / guest' },
      { season: 'July - September', format: 'Boat charter, group up to 8 guests', price: '68,000 ₽' },
      { season: 'July - September', format: 'Boat charter, group up to 10 guests', price: '85,000 ₽' }
    ],
    image: '/images/crab-tasting.jpg',
    imageAlt: 'Crab tasting on board near the Kamchatka coast',
    pageImage: '/images/location-starichkov.jpg',
    pageImageAlt: 'Starichkov Island and coastal cliffs in Kamchatka',
    imageCredit: ruRouteOffers[3].imageCredit
  },
  {
    slug: 'avachinskaya-buhta',
    title: 'Avacha Bay sightseeing tour',
    kicker: '2.5 hours',
    duration: '2.5 hours',
    price: '5,000 ₽ / guest',
    description: 'A calm sightseeing trip through Avacha Bay: Three Brothers rocks, Tikhaya Bay and city views from the water.',
    highlights: ['Three Brothers rocks', 'Tikhaya Bay', 'Group of at least 8 guests', 'May - September'],
    priceOptions: [
      { season: 'May - September', format: 'Group of at least 8 guests', price: '5,000 ₽ / guest' }
    ],
    image: '/images/antur-kamchatka-three-brothers-avacha-2026-06-26.jpg',
    imageAlt: 'Three Brothers rocks in Avacha Bay',
    pageImage: '/images/antur-kamchatka-three-brothers-avacha-2026-06-26.jpg',
    pageImageAlt: 'Three Brothers rocks in Avacha Bay'
  }
]

const zhRouteOffers: RouteOffer[] = [
  {
    slug: 'rybalka',
    title: '近海海钓',
    kicker: '包船',
    duration: '5 或 10 小时',
    price: '65,000 ₽ 起',
    description: '适合最多 6 人的出海行程：在堪察加海岸附近钓鱼，提供钓具，也可与船长协商加入帝王蟹体验。',
    highlights: ['最多 6 人成团', '提供钓具', '帝王蟹体验可与船长协商'],
    priceOptions: [
      { season: '5 月 - 9 月', format: '5 小时，最多 6 人', price: '65,000 ₽' },
      { season: '5 月 - 9 月', format: '10 小时，最多 6 人', price: '130,000 ₽' },
      { season: '5 月 - 9 月', format: '包船延长时间', price: '5,000 ₽ / 小时' }
    ],
    image: '/images/fishing-deck.jpg',
    imageAlt: '海钓时船甲板上的钓具',
    pageImage: '/images/fishing-deck.jpg',
    pageImageAlt: '海钓时船甲板上的钓具',
    imageCredit: ruRouteOffers[0].imageCredit,
    featured: true
  },
  {
    slug: 'glubokovodnaya-rybalka',
    title: '深海海钓',
    kicker: '包船',
    duration: '5 或 10 小时',
    price: '85,000 ₽ 起',
    description: '更深入太平洋的钓鱼路线，适合专程来海钓的客人：水上时间更长、钓点更深、一天更充实。',
    highlights: ['最多 6 人成团', '提供钓具', '帝王蟹体验可与船长协商'],
    priceOptions: [
      { season: '5 月 - 9 月', format: '5 小时，最多 6 人', price: '85,000 ₽' },
      { season: '5 月 - 9 月', format: '10 小时，最多 6 人', price: '170,000 ₽' },
      { season: '5 月 - 9 月', format: '包船延长时间', price: '5,000 ₽ / 小时' }
    ],
    image: '/images/fishing-deck.jpg',
    imageAlt: '深海钓鱼时船甲板上的钓具',
    pageImage: '/images/location-avacha-boat.jpg',
    pageImageAlt: '堪察加海岸附近的海景',
    imageCredit: ruRouteOffers[1].imageCredit
  },
  {
    slug: 'buhta-russkaya',
    title: '鲁斯卡亚湾',
    kicker: '10 小时',
    duration: '10 小时',
    price: '15,000 ₽ / 人起',
    description: '前往鲁斯卡亚湾的一整天海上行程，包含上岸停留、钓鱼和帝王蟹体验。',
    highlights: ['帝王蟹体验', '10 小时钓鱼行程', '进入海湾并上岸停留', '可拼团或包船'],
    priceOptions: [
      { season: '5 月 - 6 月', format: '拼团', price: '15,000 ₽ / 人' },
      { season: '5 月 - 6 月', format: '包船，最多 8 人', price: '120,000 ₽' },
      { season: '5 月 - 6 月', format: '包船，最多 10 人', price: '150,000 ₽' },
      { season: '7 月 - 9 月', format: '拼团', price: '18,000 ₽ / 人' },
      { season: '7 月 - 9 月', format: '包船，最多 8 人', price: '135,000 ₽' },
      { season: '7 月 - 9 月', format: '包船，最多 10 人', price: '170,000 ₽' }
    ],
    image: '/images/hero-kamchatka-boat.jpg',
    imageAlt: '堪察加海岸附近海上的船',
    pageImage: '/images/location-buhta-russkaya.jpg',
    pageImageAlt: '堪察加鲁斯卡亚湾克库尔尼角海滩',
    imageCredit: ruRouteOffers[2].imageCredit
  },
  {
    slug: 'ostrov-starichkov',
    title: '斯塔里奇科夫岛',
    kicker: '5 小时',
    duration: '5 小时',
    price: '7,000 ₽ / 人起',
    description: '前往斯塔里奇科夫岛的 5 小时路线：海岸岩石、海鸟、海钓和帝王蟹体验都在一次行程中。',
    highlights: ['海钓', '帝王蟹体验', '可拼团或包船', '5 小时路线'],
    priceOptions: [
      { season: '5 月 - 6 月', format: '拼团', price: '7,000 ₽ / 人' },
      { season: '5 月 - 6 月', format: '包船，最多 8 人', price: '56,000 ₽' },
      { season: '5 月 - 6 月', format: '包船，最多 10 人', price: '70,000 ₽' },
      { season: '7 月 - 9 月', format: '拼团', price: '8,500 ₽ / 人' },
      { season: '7 月 - 9 月', format: '包船，最多 8 人', price: '68,000 ₽' },
      { season: '7 月 - 9 月', format: '包船，最多 10 人', price: '85,000 ₽' }
    ],
    image: '/images/crab-tasting.jpg',
    imageAlt: '堪察加海岸附近船上的帝王蟹品尝',
    pageImage: '/images/location-starichkov.jpg',
    pageImageAlt: '堪察加斯塔里奇科夫岛和海岸岩石',
    imageCredit: ruRouteOffers[3].imageCredit
  },
  {
    slug: 'avachinskaya-buhta',
    title: '阿瓦恰湾观光游',
    kicker: '2.5 小时',
    duration: '2.5 小时',
    price: '5,000 ₽ / 人',
    description: '轻松的阿瓦恰湾观光路线：三兄弟岩、季哈亚湾，以及从海上看城市景色。',
    highlights: ['三兄弟岩', '季哈亚湾', '至少 8 人成团', '5 月 - 9 月'],
    priceOptions: [
      { season: '5 月 - 9 月', format: '至少 8 人成团', price: '5,000 ₽ / 人' }
    ],
    image: '/images/antur-kamchatka-three-brothers-avacha-2026-06-26.jpg',
    imageAlt: '阿瓦恰湾三兄弟岩',
    pageImage: '/images/antur-kamchatka-three-brothers-avacha-2026-06-26.jpg',
    pageImageAlt: '阿瓦恰湾三兄弟岩'
  }
]

export const routeOffersByLocale: Record<LocaleCode, RouteOffer[]> = {
  ru: ruRouteOffers,
  en: enRouteOffers,
  zh: zhRouteOffers
}

export const faqByLocale = {
  ru: ruFaq,
  en: [
    {
      question: 'What happens if the weather is bad?',
      answer: 'We check the forecast and sea state before departure. If going out is unsafe or uncomfortable, we will suggest another date or a different format.'
    },
    {
      question: 'Can I join without fishing experience?',
      answer: 'Yes. The crew will explain the tackle and help on board. You can come for your first sea fishing trip or choose a more serious deep-sea format.'
    },
    {
      question: 'Can children join?',
      answer: 'Yes, if the child is comfortable with a sea trip and is accompanied by an adult. Children under 5 join free of charge.'
    },
    {
      question: 'Are there discounts?',
      answer: 'Yes. Birthday guests, children under 12, and repeat or next-trip bookings receive a 10% discount.'
    },
    {
      question: 'Is prepayment required?',
      answer: 'Yes. A 1,000 ₽ prepayment reserves a seat. If you cancel the trip, the prepayment is not refunded.'
    },
    {
      question: 'Are whales and orcas guaranteed?',
      answer: 'No, this is wildlife. Routes pass through waters where sightings are possible, but whales or orcas cannot be promised.'
    },
    {
      question: 'What is the fastest way to book?',
      answer: 'Call or message us on WhatsApp / MAX: we will confirm available dates, the trip format and the current price.'
    }
  ],
  zh: [
    {
      question: '天气不好怎么办？',
      answer: '出发前我们会检查天气预报和海况。如果出海不安全或体验不好，会建议改期或更换行程形式。'
    },
    {
      question: '没有钓鱼经验可以参加吗？',
      answer: '可以。船员会讲解钓具并在船上协助。可以作为第一次海钓体验，也可以选择更深入的深海钓鱼形式。'
    },
    {
      question: '儿童可以参加吗？',
      answer: '可以，前提是孩子适应海上行程并有成人陪同。5 岁以下儿童免费。'
    },
    {
      question: '有优惠吗？',
      answer: '有。生日客人、12 岁以下儿童，以及再次预订或下一次行程可享 10% 优惠。'
    },
    {
      question: '需要预付款吗？',
      answer: '需要。预留名额需支付 1,000 ₽ 预付款。如客人取消行程，预付款不退。'
    },
    {
      question: '一定能看到鲸鱼或虎鲸吗？',
      answer: '不能保证，这是野生自然环境。路线会经过有机会遇见鲸鱼或虎鲸的海域，但无法承诺一定出现。'
    },
    {
      question: '最快怎样预订？',
      answer: '请通过 WhatsApp / MAX 发消息或电话联系我们：我们会确认可选日期、出海形式和当前价格。'
    }
  ]
}

export const bookingTermsByLocale = {
  ru: ruBookingTerms,
  en: [
    'Children under 5 join free of charge when accompanied by parents or responsible adults.',
    'Birthday guests, children under 12, and repeat or next-trip bookings receive a 10% discount.',
    'A 1,000 ₽ prepayment is required to reserve a seat. If you cancel the trip, the prepayment is not refunded.',
    'All passengers and crew members are insured.'
  ],
  zh: [
    '5 岁以下儿童在父母或负责人陪同下免费。',
    '生日客人、12 岁以下儿童，以及再次预订或下一次行程可享 10% 优惠。',
    '预留名额需支付 1,000 ₽ 预付款。如客人取消行程，预付款不退。',
    '所有乘客和船员均已投保。'
  ]
} satisfies Record<LocaleCode, string[]>

// Переводы отзывов ключуются по id (не по индексу), чтобы добавление или
// переупорядочивание ruReviews не ломало соответствие переводов.
const reviewText: Record<Exclude<LocaleCode, 'ru'>, Record<string, { name: string, route: string, text: string }>> = {
  en: {
    'review-yandex-001': { name: 'Victoria K.', route: 'Yandex Maps', text: 'Many thanks to ANTUR and our wonderful captain Alexander for a sea of positive impressions, beautiful views, emotions and treats. Everything went wonderfully!' },
    'review-yandex-002': { name: 'Zhanna M.', route: 'Yandex Maps', text: 'A huge thank you to Alexander for the sea journey — everything went superbly! Everything was organized at the highest level and thought through to the smallest detail, an engaging route and stunning local nature. Kamchatka won our hearts!' },
    'review-yandex-003': { name: 'Yulia Nikolaeva', route: 'Yandex Maps', text: 'We really enjoyed the sea trip! Great service and an attentive captain. We admired the views and ate well. Many thanks for the emotions, I recommend it to everyone!' },
    'review-001': { name: 'Andrey M.', route: 'Deep-sea fishing', text: 'We came for fishing and got a full day at sea. The crew calmly explained the tackle and helped at the spots. The fish soup after the trip was a separate pleasure.' },
    'review-002': { name: 'Marina and Ilya', route: 'Russkaya Bay', text: 'We liked the pace: no rush, but the day was very full. The landing, crab, fishing and bay views were stronger than we expected.' },
    'review-003': { name: 'Sergey P.', route: 'Starichkov Island', text: 'We took a short trip to Starichkov. The crew was attentive, helped with boarding, suggested photo spots and made the children feel calm. The crab was fresh and very tasty.' },
    'review-004': { name: 'Ekaterina N.', route: 'Avacha Bay', text: 'For a first view of Kamchatka from the water, this format was perfect. The captain warned us about clothing and weather in advance, and everything on board was clean and clear.' },
    'review-005': { name: 'Dmitry K.', route: 'Coastal fishing', text: 'I was new to sea fishing, but the team helped right away: they gave tackle, showed how to use it and calmly supported us throughout the trip. We caught fish and got even more emotions.' },
    'review-006': { name: 'Olga R.', route: 'Russkaya Bay', text: 'What I liked most was the honesty about the weather: they explained in advance where we would go and why. Lunch with seafood after the walk was simple, fresh and very tasty.' },
    'review-007': { name: 'Pavel S.', route: 'Deep-sea fishing', text: 'A good trip for people who come specifically to fish. A good boat, experienced crew, clear organization and a lot of real ocean.' },
    'review-008': { name: 'Anna V.', route: 'Starichkov Island', text: 'Birds, cliffs, ocean and crab on board made five hours feel very rich. Special thanks for taking care of parents and children.' },
    'review-009': { name: 'Mikhail and Tatiana', route: 'Avacha Bay', text: 'The short route turned out to be more than just sightseeing. Three Brothers look powerful from the water, and the crew led the trip calmly, with explanations and photo pauses.' },
    'review-010': { name: 'Irina L.', route: 'Russkaya Bay', text: 'We remember not only the nature but also the people on board. Warm attitude, tasty fish soup, crab and hot tea made it clear that the group was truly cared for.' }
  },
  zh: {
    'review-yandex-001': { name: '维多利亚 K.', route: 'Yandex 地图', text: '非常感谢 ANTUR 和我们出色的船长 Alexander，带来满满的正能量、美丽的景色、感动和美食。一切都非常完美！' },
    'review-yandex-002': { name: '然娜 M.', route: 'Yandex 地图', text: '非常感谢 Alexander 的海上之旅——一切都棒极了！组织得非常专业，每个细节都考虑周到，路线引人入胜，当地自然风光令人惊叹。堪察加征服了我们的心！' },
    'review-yandex-003': { name: '尤利娅·尼科拉耶娃', route: 'Yandex 地图', text: '海上之行非常愉快！服务很好，船长很细心。我们饱览美景，也吃得很好。非常感谢这些感动，推荐给大家！' },
    'review-001': { name: 'Andrey M.', route: '深海海钓', text: '我们本来是为了钓鱼而来，结果得到了一整天的海上体验。船员很耐心地讲解钓具，在钓点也一直帮助我们。出海后的鱼汤也非常难忘。' },
    'review-002': { name: 'Marina 和 Ilya', route: '鲁斯卡亚湾', text: '节奏很好：不赶时间，但一天非常充实。上岸、帝王蟹、钓鱼和海湾景色都比预期更令人印象深刻。' },
    'review-003': { name: 'Sergey P.', route: '斯塔里奇科夫岛', text: '我们选择了去斯塔里奇科夫岛的短途行程。船员很细心，帮助登船，也告诉我们哪里适合拍照，孩子们也很安心。帝王蟹很新鲜。' },
    'review-004': { name: 'Ekaterina N.', route: '阿瓦恰湾', text: '第一次从海上认识堪察加，这个形式非常合适。船长提前提醒了衣着和天气，船上干净，组织也很清楚。' },
    'review-005': { name: 'Dmitry K.', route: '近海海钓', text: '我是海钓新手，但团队马上就开始帮助：提供钓具，示范如何使用，整个行程都很耐心。我们有收获，也有很多情绪价值。' },
    'review-006': { name: 'Olga R.', route: '鲁斯卡亚湾', text: '最喜欢的是他们对天气很诚实：提前解释了我们会去哪里，以及为什么这样安排。出海后的海鲜午餐简单、新鲜、很好吃。' },
    'review-007': { name: 'Pavel S.', route: '深海海钓', text: '非常适合专门来钓鱼的人。船不错，船员有经验，组织清楚，而且有真正的海洋感。' },
    'review-008': { name: 'Anna V.', route: '斯塔里奇科夫岛', text: '海鸟、岩石、海洋和船上的帝王蟹让五个小时非常充实。也感谢他们照顾老人和孩子。' },
    'review-009': { name: 'Mikhail 和 Tatiana', route: '阿瓦恰湾', text: '短途路线并不只是简单观光。从海上看三兄弟岩很震撼，船员节奏很稳，有讲解，也留了拍照时间。' },
    'review-010': { name: 'Irina L.', route: '鲁斯卡亚湾', text: '记住的不只是自然景色，还有船上的人。温暖的态度、好喝的鱼汤、帝王蟹和热茶，让人感到团队真的在照顾客人。' }
  }
}

const localizeReviews = (locale: Exclude<LocaleCode, 'ru'>): Review[] =>
  ruReviews.map((review) => ({
    ...review,
    ...(reviewText[locale][review.id] || {})
  }))

export const reviewsByLocale: Record<LocaleCode, Review[]> = {
  ru: ruReviews,
  en: localizeReviews('en'),
  zh: localizeReviews('zh')
}

const tourMediaText = {
  en: {
    'photo-captain-helm-2026-06-24': { alt: 'Antur captain at the boat helm against the Kamchatka cliffs', route: 'Sea tour' },
    'photo-crab-catch-2026-06-24': { alt: 'Fresh crab in a guest’s hands on board during a crab safari', route: 'Crab safari' },
    'photo-snow-crab-urchin-2026-06-24': { alt: 'Snow crab and a sea urchin against the Kamchatka waters', route: 'Crab safari' },
    'photo-seafood-dinner-deck-2026-06-24': { alt: 'Table with crab, sea urchins and wine on deck at sunset', route: 'After the trip' },
    'photo-sea-urchins-platter-2026-06-24': { alt: 'Plate of fresh sea urchins on board the Antur boat', route: 'Sea delicacies' },
    'photo-deck-table-cliffs-2026-06-24': { alt: 'Set table on deck against the green Kamchatka cliffs', route: 'After the trip' },
    'photo-sea-cliff-cave-2026-06-24': { alt: 'Tall coastal cliff with a grotto at the waterline in Kamchatka', route: 'Sea tour' },
    'photo-rock-passage-waves-2026-06-24': { alt: 'Narrow passage between cliffs with waves and snowy peaks on the horizon', route: 'Russkaya Bay' },
    'photo-sea-stacks-2026-06-24': { alt: 'Green-topped rock stacks near the Kamchatka coast', route: 'Starichkov Island' },
    'photo-orca-2026-05-30': { alt: 'Orca rising from the water near the Kamchatka coast during a sea tour', route: 'Sea tour' },
    'photo-fishing-catch-2026-05-30': { alt: 'Guest with the catch on board during a Kamchatka sea fishing trip', route: 'Deep-sea fishing' },
    'photo-sea-lions-2026-05-30': { alt: 'Sea lions resting on rocks near the Kamchatka coast', route: 'Starichkov Island' },
    'photo-kekur-2026-05-30': { alt: 'Ocean rock stack on a Kamchatka sea tour route', route: 'Avacha Bay' },
    'photo-sea-cave-2026-05-30': { alt: 'Sea arch in the cliffs near the Kamchatka coast', route: 'Sea tour' },
    'photo-bird-cliffs-2026-05-30': { alt: 'Sea birds on the cliffs near Starichkov Island', route: 'Starichkov Island' },
    'photo-crab-deck-2026-05-30': { alt: 'Crab catch on the boat deck during a crab safari', route: 'Crab safari' },
    'photo-crab-tasting-2026-05-30': { alt: 'Kamchatka crab served after the sea tour', route: 'Crab safari' },
    'photo-ukha-2026-05-30': { alt: 'Hot fish soup and a guest table after a sea trip', route: 'After the trip' },
    'photo-coastal-base-2026-05-30': { alt: 'Warm guest area with tables after a sea tour', route: 'After the trip' },
    'photo-boat-pier-2026-06-01': { alt: 'Antur boat at the pier in Petropavlovsk-Kamchatsky', route: 'Antur boat' },
    'video-sea-tour-2026-05-30': { alt: 'Video from a Kamchatka sea tour', route: 'Route video' },
    'video-ocean-route-2026-05-23': { alt: 'Video from an ocean route near the Kamchatka coast', route: 'Route video' },
    'video-boat-moment-2026-05-27': { alt: 'Video from the Antur boat during a sea trip', route: 'Antur boat' },
    'video-crab-safari-2026-05-30': { alt: 'Video from a Kamchatka crab safari', route: 'Crab safari' },
    'video-sea-landscape-2026-05-30': { alt: 'Video of the sea landscape on a Kamchatka route', route: 'Sea landscape' },
    'video-ocean-wildlife-2026-05-30': { alt: 'Video of Kamchatka ocean wildlife', route: 'Ocean video' }
  },
  zh: {
    'photo-captain-helm-2026-06-24': { alt: 'Antur 船长在驾驶舱掌舵，背景是堪察加的岩壁', route: '海上观光' },
    'photo-crab-catch-2026-06-24': { alt: '帝王蟹体验中客人手里捧着新鲜螃蟹', route: '帝王蟹体验' },
    'photo-snow-crab-urchin-2026-06-24': { alt: '雪蟹和海胆，背景是堪察加海域', route: '帝王蟹体验' },
    'photo-seafood-dinner-deck-2026-06-24': { alt: '日落时甲板上摆放着螃蟹、海胆和葡萄酒的餐桌', route: '出海之后' },
    'photo-sea-urchins-platter-2026-06-24': { alt: 'Antur 船上一盘新鲜的海胆', route: '海鲜美味' },
    'photo-deck-table-cliffs-2026-06-24': { alt: '甲板上摆好的餐桌，背景是堪察加翠绿的岩壁', route: '出海之后' },
    'photo-sea-cliff-cave-2026-06-24': { alt: '堪察加水边带有岩洞的高耸海岸岩壁', route: '海上观光' },
    'photo-rock-passage-waves-2026-06-24': { alt: '岩石之间狭窄的水道，伴有海浪和地平线上的雪峰', route: '鲁斯卡亚湾' },
    'photo-sea-stacks-2026-06-24': { alt: '堪察加海岸附近顶部覆盖绿色植被的岩柱', route: '斯塔里奇科夫岛' },
    'photo-orca-2026-05-30': { alt: '海上观光时虎鲸在堪察加海岸附近跃出水面', route: '海上观光' },
    'photo-fishing-catch-2026-05-30': { alt: '堪察加海钓时客人在船上展示收获', route: '深海海钓' },
    'photo-sea-lions-2026-05-30': { alt: '堪察加海岸岩石上休息的海狮', route: '斯塔里奇科夫岛' },
    'photo-kekur-2026-05-30': { alt: '堪察加海上路线中的海中岩柱', route: '阿瓦恰湾' },
    'photo-sea-cave-2026-05-30': { alt: '堪察加海岸岩石中的海蚀拱门', route: '海上观光' },
    'photo-bird-cliffs-2026-05-30': { alt: '斯塔里奇科夫岛附近岩壁上的海鸟', route: '斯塔里奇科夫岛' },
    'photo-crab-deck-2026-05-30': { alt: '帝王蟹体验中船甲板上的螃蟹收获', route: '帝王蟹体验' },
    'photo-crab-tasting-2026-05-30': { alt: '海上行程后享用的堪察加帝王蟹', route: '帝王蟹体验' },
    'photo-ukha-2026-05-30': { alt: '出海后为客人准备的热鱼汤和餐桌', route: '出海之后' },
    'photo-coastal-base-2026-05-30': { alt: '海上观光后供客人休息的温暖用餐区', route: '出海之后' },
    'photo-boat-pier-2026-06-01': { alt: '停靠在彼得罗巴甫洛夫斯克-堪察加码头的 Antur 船', route: 'Antur 船' },
    'video-sea-tour-2026-05-30': { alt: '堪察加海上观光视频', route: '路线视频' },
    'video-ocean-route-2026-05-23': { alt: '堪察加海岸附近海上路线视频', route: '路线视频' },
    'video-boat-moment-2026-05-27': { alt: 'Antur 船出海时的视频', route: 'Antur 船' },
    'video-crab-safari-2026-05-30': { alt: '堪察加帝王蟹体验视频', route: '帝王蟹体验' },
    'video-sea-landscape-2026-05-30': { alt: '堪察加路线中的海上风景视频', route: '海上风景' },
    'video-ocean-wildlife-2026-05-30': { alt: '堪察加海洋野生动物视频', route: '海洋视频' }
  }
} satisfies Record<Exclude<LocaleCode, 'ru'>, Record<string, { alt: string, route: string }>>

const localizeTourMedia = (locale: Exclude<LocaleCode, 'ru'>) =>
  ruTourPhotos.map((item) => {
    const localeText: Record<string, { alt: string, route: string }> = tourMediaText[locale]

    return {
      ...item,
      ...(localeText[item.id] || {})
    }
  })

export const tourPhotosByLocale: Record<LocaleCode, TourPhoto[]> = {
  ru: ruTourPhotos,
  en: localizeTourMedia('en'),
  zh: localizeTourMedia('zh')
}
