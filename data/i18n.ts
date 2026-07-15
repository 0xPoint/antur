import { getLocalizedRoutePath, getRouteOfferBySlug, routeOffers as ruRouteOffers } from './routes'
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

export const withTrailingSlash = (path: string) => {
  const [pathWithQuery, hash = ''] = path.split('#')
  const [pathname, query = ''] = pathWithQuery.split('?')
  const normalizedPathname = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`

  return `${normalizedPathname}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`
}

export const stripLocaleFromPath = (path: string) => {
  const [pathWithQuery, hash = ''] = path.split('#')
  const [pathname, query = ''] = pathWithQuery.split('?')
  const segments = pathname.split('/').filter(Boolean)

  if (isLocaleCode(segments[0])) {
    segments.shift()
  }

  const cleanPath = segments.length ? `/${segments.join('/')}` : '/'
  return withTrailingSlash(`${cleanPath}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`)
}

export const localizePath = (path: string, locale: LocaleCode) => {
  const cleanPath = stripLocaleFromPath(path)
  const [pathWithQuery, hash = ''] = cleanPath.split('#')

  if (!prefixedLocales.has(locale)) {
    return cleanPath
  }

  const localizedPath = pathWithQuery === '/' ? `/${locale}/` : `/${locale}${pathWithQuery}`
  return `${localizedPath}${hash ? `#${hash}` : ''}`
}

export const localeLabels = Object.fromEntries(locales.map((locale) => [locale.code, locale.label])) as Record<LocaleCode, string>

export const localizedBusiness = {
  ru: {
    brand: 'Антур',
    tagline: 'sea tours kamchatka',
    legalName: 'ИП Хавилов А. Г.',
    region: 'Петропавловск-Камчатский',
    address: 'Петропавловск-Камчатский, Индустриальная улица, 39/2',
    mapEyebrow: 'Адрес и посадка',
    mapTitle: 'Антур на карте Петропавловска-Камчатского',
    mapDescription: 'Адрес Антур: Индустриальная улица, 39/2, 1 этаж, пирс №2. Точное место посадки на катер и время выхода подтверждаем при бронировании.',
    mapLink: 'Открыть в 2GIS',
    mapYandexLink: 'Открыть в Яндекс Картах',
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
    address: '39/2 Industrialnaya Street, Petropavlovsk-Kamchatsky',
    mapEyebrow: 'Address and boarding',
    mapTitle: 'Antur on the Petropavlovsk-Kamchatsky map',
    mapDescription: 'Antur address: 39/2 Industrialnaya Street, first floor, pier 2. We confirm the exact boat boarding point and departure time when booking.',
    mapLink: 'Open in 2GIS',
    mapYandexLink: 'Open in Yandex Maps',
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
    address: '彼得罗巴甫洛夫斯克-堪察加，工业街 39/2',
    mapEyebrow: '地址与登船',
    mapTitle: '彼得罗巴甫洛夫斯克-堪察加地图上的 Antur',
    mapDescription: 'Antur 地址：工业街 39/2，一层，2 号码头。具体登船点和出发时间会在预订时确认。',
    mapLink: '在 2GIS 中打开',
    mapYandexLink: '在 Yandex 地图中打开',
    mapLabel: 'Antur 集合点互动地图',
    mapAlt: '彼得罗巴甫洛夫斯克-堪察加 Antur 集合点地图',
    mapCardTitle: 'Antur 集合点',
    mapCardPlace: '彼得罗巴甫洛夫斯克-堪察加'
  }
} satisfies Record<LocaleCode, Record<string, string>>

const localizedRouteBase = (slug: string, locale: LocaleCode, categoryTitle: string) => {
  const ruOffer = getRouteOfferBySlug(slug)

  return {
    path: getLocalizedRoutePath(slug, locale),
    pathSlug: ruOffer.pathSlug,
    categoryTitle,
    categoryPath: localizePath('/#routes', locale),
    relatedSlugs: ruOffer.relatedSlugs,
    updatedAt: ruOffer.updatedAt,
    imageCredit: ruOffer.imageCredit
  }
}

export const ui = {
  ru: {
    skip: 'Перейти к содержанию',
    homeAria: 'Антур, на главную',
    navAria: 'Разделы сайта',
    nav: { home: 'Главная', routes: 'Морские прогулки', fishing: 'Рыбалка', charter: 'Катер', gallery: 'Фото', reviews: 'Отзывы', booking: 'Бронь', seaRoutesLabel: 'Маршруты морских прогулок', fishingRoutesLabel: 'Разделы рыбалки', menuOpen: 'Открыть меню', menuClose: 'Закрыть меню' },
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
      lead: 'Выходы в Тихий океан из Петропавловска-Камчатского: сборные группы от 5 000 ₽ / чел., аренда катера для рыбалки, крабовое сафари, Бухта Русская и остров Старичков. Работаем официально, пассажиры застрахованы.',
      routes: 'Смотреть маршруты',
      note: 'Ответим по датам, погоде и маршруту',
      imageAlt: 'Косатки выпрыгивают из воды',
      context: 'Бронирование из первого экрана'
    },
    home: {
      seoTitle: 'Морские прогулки и рыбалка на Камчатке | Антур',
      seoDescription: 'Морские прогулки, глубоководная рыбалка, Бухта Русская, остров Старичков и крабовое сафари из Петропавловска-Камчатского. Официальная деятельность, гости застрахованы.',
      routesEyebrow: 'Маршруты и цены',
      routesTitle: 'Выберите маршрут',
      details: 'Подробнее',
      introEyebrow: 'Камчатка с воды',
      introTitle: 'Море, вулканы и маршруты с характером',
      introText: 'Подберем маршрут под вашу компанию: короткая прогулка по бухте, рыбалка в океане, выход к острову Старичков или длинный день с Бухтой Русской, крабом и остановками на берегу.',
      introAlt: 'Скалы Камчатки со стороны океана',
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
      bookingTitle: 'Подберем дату и маршрут',
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
      reviewOriginalLink: 'показать оригинал',
      reviewMoreLink: 'читать полностью',
      reviewCollapseLink: 'свернуть',
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
      audience: 'Кому подойдет',
      timeline: 'Как проходит выход',
      includedDetails: 'Что входит',
      notIncluded: 'Что не входит',
      bring: 'Что взять с собой',
      weather: 'Погода и перенос',
      children: 'Можно ли с детьми',
      meetingPoint: 'Точка сбора',
      routePhotos: 'Фото с маршрута',
      routeReviews: 'Отзывы по маршруту',
      routeFaq: 'Вопросы по маршруту',
      otherRoutes: 'Другие маршруты',
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
    nav: { home: 'Home', routes: 'Sea tours', fishing: 'Fishing', charter: 'Charter', gallery: 'Photos', reviews: 'Reviews', booking: 'Booking', seaRoutesLabel: 'Sea tour routes', fishingRoutesLabel: 'Fishing routes', menuOpen: 'Open menu', menuClose: 'Close menu' },
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
      lead: 'Pacific Ocean boat trips from Petropavlovsk-Kamchatsky: shared groups from 5,000 ₽ per guest, boat charter for fishing, crab safari, Russkaya Bay and Starichkov Island. Official operator, passengers are insured.',
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
      reviewOriginalLink: 'show original',
      reviewMoreLink: 'read full review',
      reviewCollapseLink: 'collapse',
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
      audience: 'Who it suits',
      timeline: 'How the trip goes',
      includedDetails: 'What is included',
      notIncluded: 'What is not included',
      bring: 'What to bring',
      weather: 'Weather and rescheduling',
      children: 'Children on board',
      meetingPoint: 'Meeting point',
      routePhotos: 'Route photos',
      routeReviews: 'Route reviews',
      routeFaq: 'Route questions',
      otherRoutes: 'Other routes',
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
    nav: { home: '首页', routes: '海上观光', fishing: '海钓', charter: '包船', gallery: '照片', reviews: '评价', booking: '预订', seaRoutesLabel: '海上观光路线', fishingRoutesLabel: '海钓路线', menuOpen: '打开菜单', menuClose: '关闭菜单' },
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
      lead: '从彼得罗巴甫洛夫斯克-堪察加出发进入太平洋：拼团 5,000 ₽ / 人起，也可包船海钓、帝王蟹体验、鲁斯卡亚湾和斯塔里奇科夫岛。正规运营，乘客已投保。',
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
      reviewOriginalLink: '查看原文',
      reviewMoreLink: '阅读全文',
      reviewCollapseLink: '收起',
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
      audience: '适合人群',
      timeline: '行程怎样进行',
      includedDetails: '包含内容',
      notIncluded: '不包含',
      bring: '建议携带',
      weather: '天气与改期',
      children: '儿童同行',
      meetingPoint: '集合点',
      routePhotos: '路线照片',
      routeReviews: '路线评价',
      routeFaq: '路线问题',
      otherRoutes: '其他路线',
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
    ...localizedRouteBase('rybalka', 'en', 'Fishing'),
    title: 'Coastal ocean fishing',
    kicker: 'Boat charter',
    duration: '5 or 10 hours',
    price: 'from 65,000 ₽',
    description: 'A trip for up to 11 guests: fishing near the Kamchatka coast, tackle on board and a crab safari when weather and sea conditions allow.',
    highlights: ['Group of up to 11 guests', 'Fishing tackle is provided', 'Snacks on board', 'Crab safari when conditions allow'],
    priceOptions: [
      { season: 'May - September', format: '5 hours, group up to 11 guests', price: '65,000 ₽' },
      { season: 'May - September', format: '10 hours, group up to 11 guests', price: '130,000 ₽' },
      { season: 'May - September', format: 'Extra boat charter time', price: '5,000 ₽ / hour' }
    ],
    image: '/images/fishing-deck.jpg',
    imageAlt: 'Fishing tackle on the deck during a sea fishing trip',
    pageImage: '/images/fishing-deck.jpg',
    pageImageAlt: 'Fishing tackle on the deck during a sea fishing trip',
    featured: true
  },
  {
    slug: 'glubokovodnaya-rybalka',
    ...localizedRouteBase('glubokovodnaya-rybalka', 'en', 'Fishing'),
    title: 'Deep-sea ocean fishing',
    kicker: 'Boat charter',
    duration: '5 or 10 hours',
    price: 'from 85,000 ₽',
    description: 'A route farther into the ocean for guests who come specifically for fishing: more time on the water, productive depths and a fuller sea day.',
    highlights: ['Group of up to 11 guests', 'Fishing tackle is provided', 'Snacks on board', 'Crab safari when conditions allow'],
    priceOptions: [
      { season: 'May - September', format: '5 hours, group up to 11 guests', price: '85,000 ₽' },
      { season: 'May - September', format: '10 hours, group up to 11 guests', price: '170,000 ₽' },
      { season: 'May - September', format: 'Extra boat charter time', price: '5,000 ₽ / hour' }
    ],
    image: '/images/fishing-deck.jpg',
    imageAlt: 'Fishing tackle on the deck during a deep-sea fishing trip',
    pageImage: '/images/location-avacha-boat.jpg',
    pageImageAlt: 'Ocean view near the Kamchatka coast'
  },
  {
    slug: 'buhta-russkaya',
    ...localizedRouteBase('buhta-russkaya', 'en', 'Sea tours'),
    title: 'Russkaya Bay',
    kicker: '10 hours',
    duration: '10 hours',
    price: 'from 15,000 ₽ / guest',
    description: 'A full sea day to Russkaya Bay with a shore landing, fishing, crab safari, snacks and a full lunch on board.',
    highlights: ['Crab safari', '10-hour fishing route', 'Snacks and lunch on board', 'Bay entrance and shore landing', 'Shared groups and boat charter'],
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
    pageImageAlt: 'Cape Kekurny beach in Russkaya Bay, Kamchatka'
  },
  {
    slug: 'ostrov-starichkov',
    ...localizedRouteBase('ostrov-starichkov', 'en', 'Sea tours'),
    title: 'Starichkov Island',
    kicker: '5 hours',
    duration: '5 hours',
    price: 'from 7,000 ₽ / guest',
    description: 'A five-hour route to Starichkov Island: cliffs, seabirds, sea fishing, crab safari, freshly cooked crab, snacks and a full lunch in one trip.',
    highlights: ['Sea fishing', 'Crab safari', 'Freshly cooked crab', 'Snacks and lunch on board', 'Shared groups and boat charter', '5-hour route'],
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
    pageImageAlt: 'Starichkov Island and coastal cliffs in Kamchatka'
  },
  {
    slug: 'avachinskaya-buhta',
    ...localizedRouteBase('avachinskaya-buhta', 'en', 'Sea tours'),
    title: 'Avacha Bay sightseeing tour',
    kicker: '2.5 hours',
    duration: '2.5 hours',
    price: '5,000 ₽ / guest',
    description: 'A calm sightseeing trip through Avacha Bay: Three Brothers rocks, Tikhaya Bay and city views from the water.',
    highlights: ['Three Brothers rocks', 'Tikhaya Bay', 'Snacks on board', 'Group of at least 8 guests', 'May - September'],
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
    ...localizedRouteBase('rybalka', 'zh', '海钓'),
    title: '近海海钓',
    kicker: '包船',
    duration: '5 或 10 小时',
    price: '65,000 ₽ 起',
    description: '适合最多 11 人的出海行程：在堪察加海岸附近钓鱼，船上提供钓具；天气和海况合适时可加入帝王蟹体验。',
    highlights: ['最多 11 人成团', '提供钓具', '船上小吃', '条件合适时可体验帝王蟹'],
    priceOptions: [
      { season: '5 月 - 9 月', format: '5 小时，最多 11 人', price: '65,000 ₽' },
      { season: '5 月 - 9 月', format: '10 小时，最多 11 人', price: '130,000 ₽' },
      { season: '5 月 - 9 月', format: '包船延长时间', price: '5,000 ₽ / 小时' }
    ],
    image: '/images/fishing-deck.jpg',
    imageAlt: '海钓时船甲板上的钓具',
    pageImage: '/images/fishing-deck.jpg',
    pageImageAlt: '海钓时船甲板上的钓具',
    featured: true
  },
  {
    slug: 'glubokovodnaya-rybalka',
    ...localizedRouteBase('glubokovodnaya-rybalka', 'zh', '海钓'),
    title: '深海海钓',
    kicker: '包船',
    duration: '5 或 10 小时',
    price: '85,000 ₽ 起',
    description: '更深入太平洋的钓鱼路线，适合专程来海钓的客人：水上时间更长、钓点更深入、海上一天更充实。',
    highlights: ['最多 11 人成团', '提供钓具', '船上小吃', '条件合适时可体验帝王蟹'],
    priceOptions: [
      { season: '5 月 - 9 月', format: '5 小时，最多 11 人', price: '85,000 ₽' },
      { season: '5 月 - 9 月', format: '10 小时，最多 11 人', price: '170,000 ₽' },
      { season: '5 月 - 9 月', format: '包船延长时间', price: '5,000 ₽ / 小时' }
    ],
    image: '/images/fishing-deck.jpg',
    imageAlt: '深海钓鱼时船甲板上的钓具',
    pageImage: '/images/location-avacha-boat.jpg',
    pageImageAlt: '堪察加海岸附近的海景'
  },
  {
    slug: 'buhta-russkaya',
    ...localizedRouteBase('buhta-russkaya', 'zh', '海上观光'),
    title: '鲁斯卡亚湾',
    kicker: '10 小时',
    duration: '10 小时',
    price: '15,000 ₽ / 人起',
    description: '前往鲁斯卡亚湾的一整天海上行程，包含上岸停留、钓鱼、帝王蟹体验、船上小吃和完整午餐。',
    highlights: ['帝王蟹体验', '10 小时钓鱼行程', '船上小吃和午餐', '进入海湾并上岸停留', '可拼团或包船'],
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
    pageImageAlt: '堪察加鲁斯卡亚湾克库尔尼角海滩'
  },
  {
    slug: 'ostrov-starichkov',
    ...localizedRouteBase('ostrov-starichkov', 'zh', '海上观光'),
    title: '斯塔里奇科夫岛',
    kicker: '5 小时',
    duration: '5 小时',
    price: '7,000 ₽ / 人起',
    description: '前往斯塔里奇科夫岛的 5 小时路线：海岸岩石、海鸟、海钓、帝王蟹体验、现煮帝王蟹、小吃和完整午餐都在一次行程中。',
    highlights: ['海钓', '帝王蟹体验', '现煮帝王蟹', '船上小吃和午餐', '可拼团或包船', '5 小时路线'],
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
    pageImageAlt: '堪察加斯塔里奇科夫岛和海岸岩石'
  },
  {
    slug: 'avachinskaya-buhta',
    ...localizedRouteBase('avachinskaya-buhta', 'zh', '海上观光'),
    title: '阿瓦恰湾观光游',
    kicker: '2.5 小时',
    duration: '2.5 小时',
    price: '5,000 ₽ / 人',
    description: '轻松的阿瓦恰湾观光路线：三兄弟岩、季哈亚湾，以及从海上看城市景色。',
    highlights: ['三兄弟岩', '季哈亚湾', '船上小吃', '至少 8 人成团', '5 月 - 9 月'],
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
      question: 'If the trip is cancelled because of weather, do I lose the prepayment?',
      answer: 'No. If we reschedule because the weather or sea state is unsafe, we discuss another date or format. The non-refundable rule applies when the guest cancels a reserved seat.'
    },
    {
      question: 'Can I join without fishing experience?',
      answer: 'Yes. The crew will explain the tackle and help on board. You can come for your first sea fishing trip or choose a more serious deep-sea format.'
    },
    {
      question: 'What if I get seasick?',
      answer: 'Tell us in advance and bring your usual seasickness medicine. For a first trip, choose Avacha Bay or Starichkov Island instead of a long ocean route.'
    },
    {
      question: 'What food or treats are included?',
      answer: 'Short trips - fishing, Avacha Bay sightseeing and crab safari - include snacks on board. On Starichkov Island, we serve snacks, a full lunch and freshly cooked crab on board. Russkaya Bay includes snacks and a full lunch. You can bring personal food and drinks additionally.'
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
      answer: 'Yes. A 1,000 ₽ prepayment reserves a seat. If the guest cancels the trip, the prepayment is not refunded.'
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
      question: '如果因天气取消出海，预付款会损失吗？',
      answer: '不会。如果因天气或海况不安全由我们建议改期，会协商新的日期或行程形式。预付款不退仅适用于客人主动取消已预留名额。'
    },
    {
      question: '没有钓鱼经验可以参加吗？',
      answer: '可以。船员会讲解钓具并在船上协助。可以作为第一次海钓体验，也可以选择更深入的深海钓鱼形式。'
    },
    {
      question: '如果晕船怎么办？',
      answer: '请提前告知，并携带自己常用的晕船药。第一次出海建议选择阿瓦恰湾或斯塔里奇科夫岛，而不是较长的远海路线。'
    },
    {
      question: '餐食和招待包含什么？',
      answer: '短途行程，包括海钓、阿瓦恰湾观光和帝王蟹体验，船上包含小吃。斯塔里奇科夫岛行程会提供小吃、完整午餐和船上现煮帝王蟹。鲁斯卡亚湾包含小吃和完整午餐。也可以额外自带个人食品和饮品。'
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
      answer: '需要。预留名额需支付 1,000 ₽ 预付款。如客人主动取消行程，预付款不退。'
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
    'A 1,000 ₽ prepayment is required to reserve a seat. If the guest cancels the trip, the prepayment is not refunded.',
    'All passengers and crew members are insured.'
  ],
  zh: [
    '5 岁以下儿童在父母或负责人陪同下免费。',
    '生日客人、12 岁以下儿童，以及再次预订或下一次行程可享 10% 优惠。',
    '预留名额需支付 1,000 ₽ 预付款。如客人主动取消行程，预付款不退。',
    '所有乘客和船员均已投保。'
  ]
} satisfies Record<LocaleCode, string[]>

// Переводы отзывов ключуются по id (не по индексу), чтобы добавление или
// переупорядочивание ruReviews не ломало соответствие переводов.
const reviewText: Record<Exclude<LocaleCode, 'ru'>, Record<string, { name: string, route: string, text: string, source?: string }>> = {
  en: {
    'review-yandex-001': { name: 'Victoria K.', route: 'Sea tour', source: 'Yandex Maps', text: 'Many thanks to ANTUR and our wonderful captain Alexander for a sea of positive impressions, beautiful views, emotions and treats. Everything went wonderfully!' },
    'review-yandex-002': { name: 'Zhanna M.', route: 'Sea tour', source: 'Yandex Maps', text: 'A huge thank you to Alexander for the sea journey — everything went superbly! Everything was organized at the highest level and thought through to the smallest detail, an engaging route and stunning local nature. Kamchatka won our hearts!' },
    'review-yandex-003': { name: 'Yulia Nikolaeva', route: 'Avacha Bay', source: 'Yandex Maps', text: 'We really enjoyed the sea trip! Great service and an attentive captain. We admired the views and ate well. Many thanks for the emotions, I recommend it to everyone!' },
    'review-yandex-004': { name: 'Anastasia N.', route: 'Russkaya Bay', source: 'Yandex Maps', text: 'Huge thanks to Marina and Alexander for the chance to take this sea trip. We enjoyed the beauty, heard the legends, rested in body and soul — and most importantly, I became a bride on board the Antur boat! Thank you so much for the help with the arrangements, the hospitality, the warm atmosphere and the incredible impressions. We will definitely come back!' },
    'review-yandex-005': { name: 'Ludmila Ruban', route: 'Russkaya Bay', source: 'Yandex Maps', text: 'Kamchatka can be rediscovered endlessly. Our sea trip on 9 July 2026 aboard Antur to Russkaya Bay was wonderful, with the experienced captain Alexander. Everything was honest and clear: insurance, fishing, lunch with fish soup, pancakes for snacks and fish sandwiches. He showed us the beauty of Avacha Bay and its smaller coves, the Three Brothers rocks and Starichkov Island. We saw seabird colonies, orcas, sea otters and sea lions. Sunlight followed the snow-white ridgelines throughout the trip. Memories for a lifetime. Many thanks to Alexander and Marina for a wonderful day. Ludmila and Vika.' },
    'review-2gis-001': { name: 'Oleg Filimonenko', route: 'Coastal fishing', source: '2GIS', text: 'Thanks to the captain of ANTUR for an exciting trip and fishing!' },
    'review-2gis-002': { name: 'Pavel Pavlovsky', route: 'Coastal fishing', source: '2GIS', text: 'We went sea fishing as a group of 6 and were very happy with it. We caught many kinds of fish: flounder, cod, halibut, pollock, greenling and of course sculpin. The crab safari simply delighted us — we ate our fill of crab and even took some home. Alexander is an experienced captain, there was no reason to worry: he told us many interesting things and showed us beautiful places. The boat is brand new, very spacious, with a restroom and a comfortable saloon with panoramic windows. Huge thanks to Alexander for an awesome fishing trip!' },
    'review-2gis-003': { name: 'Alexander Basalaev', route: 'Coastal fishing', source: '2GIS', text: 'My wife and I went fishing with Alexander, the captain of a very comfortable boat. A very communicative, responsible and caring person. He knows the fishing spots perfectly: we reached the point and the bites started one after another. There was a lot of cod, greenling and perch, with some flounder and Atka mackerel too. I definitely recommend Alexander and his boat for fishing and more — he runs sightseeing trips to scenic places beyond the bay gates, including Russkaya Bay.' },
    'review-2gis-004': { name: 'Egor Kiselev', route: 'Deep-sea fishing', source: '2GIS', text: 'Our fishing trip went just wonderfully: the captain, the boat and the tackle were all top notch. The atmosphere was very friendly, and the stories about Kamchatka added a special flavor. Alexander proved himself a true professional: he helped everyone and showed how to set up the tackle properly. The fish bit with incredible frequency, sometimes two at once. At the end the captain estimated the catch — no less than fifty kilograms. I definitely recommend it to anyone who wants a great time and to enjoy nature!' },
    'review-2gis-005': { name: 'Sergey Smyvalov', route: 'Deep-sea fishing', source: '2GIS', text: 'The fishing and the route itself beyond the gates of Avacha Bay are pure excitement and delight! A convenient route, a comfortable boat, everything thought through to the smallest detail. The bites are so good you forget about everything. Plus gorgeous views and the most delicious seafood, cooked in the fresh air right on board. It is definitely worth trying for everyone. Thank you, Alexander!' },
    'review-2gis-006': { name: 'Zhanslu Zh.I.', route: 'Avacha Bay', source: '2GIS', text: 'A wonderful sea trip! A sea of emotions and impressions! Thank you Alexander — a very responsive and positive person; I got a sea of emotions not only from the beautiful places but also from the good company. We reached the Three Brothers rocks, the Devil\'s Finger, Tikhaya Bay and much more. There are different routes to choose from. Thank you again for a wonderful sea trip.' },
    'review-2gis-007': { name: 'Daria Grigorchuk', route: 'Avacha Bay', source: '2GIS', text: 'Thank you so much, we loved everything! Captain Alexander led the excursion wonderfully. Very beautiful places — I recommend everyone to visit here.' },
    'review-2gis-008': { name: 'Marlena Ohannisyan', route: 'Starichkov Island', source: '2GIS', text: 'A new Antur boat, a warm-hearted captain, tasty treats, a splendid trip to the beautiful views of Kamchatka! Fishing and a fresh catch — every pleasure guaranteed. The warm welcome and kindness of the Antur team are impressive. Thank you, captain Alexander, for our journey!' },
    'review-2gis-009': { name: 'Irina Grishchenko', route: 'Starichkov Island', source: '2GIS', text: 'We went on the sea trip with our close-knit group of girls. We were very happy! The new small cozy boat is just perfect for your own company. Sea air, beautiful scenery, the sounds of water and birds — the best way to escape the city bustle. A hospitable captain with great experience. We were treated to freshly caught delicacies: crab and sea urchin roe, aromatic tea, coffee and snacks. Highly recommend!' },
    'review-2gis-010': { name: 'Ilya Grishchenko', route: 'Russkaya Bay', source: '2GIS', text: 'We went on the Antur. The boat is small, for 11 people — just right, no crowding, everyone fit comfortably. The nature is unreal: cliffs, water, birds. The captain did great, brought us close to the shore and showed all the beautiful spots. The fishing was a joy — we cast and it started right away, everyone came back with a catch. And the crabs — delicious, boiled fresh, eaten right on deck. If you want to get out to sea without fuss and with purpose, Antur is a good choice.' },
    'review-2gis-011': { name: 'Anastasia Staritsyna', route: 'Russkaya Bay', source: '2GIS', text: 'It was a real adventure that exceeded all expectations. From the very start you could feel the captain\'s professionalism. The fishing and crabbing themselves were top notch — we came back with an amazing catch. But the main thing is the atmosphere of warmth and care: breakfast and lunch were simply magnificent, real home cooking in the middle of the sea. The highlight was the crab cooked by Alexander himself. Huge thanks for this unforgettable day!' },
    'review-2gis-012': { name: 'Aynura', route: 'Sea tour', source: '2GIS', text: 'The trip was wonderful, it was unforgettable! In a few hours I saw stunning views. Wind in the face, spray of the waves, cries of the gulls — a feeling of complete freedom. The boat maneuvered skillfully between the cliffs, with not a soul around, just nature. The boat is comfortable, the captain a professional with a sense of humor. Thank you for the emotions! I definitely recommend it!' },
    'review-2gis-013': { name: 'Irina R.', route: 'Sea tour', source: '2GIS', text: 'We happened to set off on a sea journey — it was the most unforgettable impressions and vivid emotions. A clean, comfortable vessel, a friendly atmosphere and very tasty treats. We were incredibly lucky with the weather: we saw the beauty of Kamchatka, wild birds and sea creatures, and enjoyed it to the fullest. We are grateful to you for this wonderful day!' },
    'review-2gis-014': { name: 'Maxim Shishkanov', route: 'Russkaya Bay', source: '2GIS', text: 'If you are planning a sea trip in Kamchatka, go with the Antur team. Our trip to Russkaya Bay exceeded every expectation. Kamchatka’s nature is unreal, and this level of organization makes the journey pure enjoyment.' }
  },
  zh: {
    'review-yandex-001': { name: '维多利亚 K.', route: '海上观光', source: 'Yandex 地图', text: '非常感谢 ANTUR 和我们出色的船长 Alexander，带来满满的正能量、美丽的景色、感动和美食。一切都非常完美！' },
    'review-yandex-002': { name: '然娜 M.', route: '海上观光', source: 'Yandex 地图', text: '非常感谢 Alexander 的海上之旅——一切都棒极了！组织得非常专业，每个细节都考虑周到，路线引人入胜，当地自然风光令人惊叹。堪察加征服了我们的心！' },
    'review-yandex-003': { name: '尤利娅·尼科拉耶娃', route: '阿瓦恰湾', source: 'Yandex 地图', text: '海上之行非常愉快！服务很好，船长很细心。我们饱览美景，也吃得很好。非常感谢这些感动，推荐给大家！' },
    'review-yandex-004': { name: '阿纳斯塔西娅 N.', route: '鲁斯卡亚湾', source: 'Yandex 地图', text: '非常感谢 Marina 和 Alexander 让我们有机会参加这次海上之行。我们饱览美景，聆听传说，身心都得到放松——最重要的是，我在 Antur 的船上成为了新娘！非常感谢你们在筹备上的帮助、热情的款待、温馨的氛围和难忘的体验。我们一定还会再来！' },
    'review-yandex-005': { name: '柳德米拉·鲁班', route: '鲁斯卡亚湾', source: 'Yandex 地图', text: '堪察加值得一次又一次重新发现。2026 年 7 月 9 日，我们乘坐 Antur 前往鲁斯卡亚湾，经验丰富的 Alexander 船长让旅程十分精彩。保险、钓鱼、鱼汤午餐、薄饼点心和鱼肉三明治都安排得清楚周到。我们看到了阿瓦恰湾及周边小海湾、三兄弟岩和斯塔里奇科夫岛，还遇到了海鸟群、虎鲸、海獭和海狮。阳光一路掠过雪白山脊，留下终生难忘的回忆。非常感谢 Alexander 和 Marina。' },
    'review-2gis-001': { name: '奥列格·菲利莫年科', route: '近海海钓', source: '2GIS', text: '感谢 ANTUR 船长带来精彩的出海和钓鱼！' },
    'review-2gis-002': { name: '帕维尔·巴甫洛夫斯基', route: '近海海钓', source: '2GIS', text: '我们一行 6 人出海钓鱼，非常满意。我们钓到了各种鱼：比目鱼、鳕鱼、大比目鱼、狭鳕、六线鱼，当然还有杜父鱼。帝王蟹体验让我们非常惊喜——吃饱了蟹，还带了一些回家。Alexander 是经验丰富的船长，完全不用担心：他讲了很多有趣的内容，也带我们看了美景。船是全新的，非常宽敞，配有卫生间，客舱舒适，还有全景窗。非常感谢 Alexander 带来这么棒的钓鱼之行！' },
    'review-2gis-003': { name: '亚历山大·巴萨拉耶夫', route: '近海海钓', source: '2GIS', text: '我和妻子跟随一艘非常舒适的船的船长 Alexander 去钓鱼。他非常健谈、负责、热心。他对鱼点了如指掌：我们一到位置，鱼就一条接一条地咬钩。钓到很多鳕鱼、六线鱼和鲈鱼，还有比目鱼和远东多线鱼。我绝对推荐 Alexander 和他的船，不仅可以钓鱼——他还会带客人去海湾口外的风景胜地观光，包括鲁斯卡亚湾。' },
    'review-2gis-004': { name: '叶戈尔·基谢廖夫', route: '深海海钓', source: '2GIS', text: '我们的钓鱼之行非常棒：船长、船只和钓具都是一流的。气氛非常友好，关于堪察加的故事更增添了特别的韵味。Alexander 展现了真正的专业：他帮助每个人，示范如何正确调试钓具。鱼咬钩频率高得惊人，有时一次两条。最后船长估算渔获——不少于五十公斤。我绝对推荐给想要愉快度过时光、享受大自然的每个人！' },
    'review-2gis-005': { name: '谢尔盖·斯梅瓦洛夫', route: '深海海钓', source: '2GIS', text: '在阿瓦恰湾口外的钓鱼和这条路线本身，纯粹是刺激与享受！路线方便，船只舒适，每个细节都考虑周到。鱼咬钩咬到让你忘掉一切。再加上绝美的景色和最美味的海鲜，就在船上的新鲜空气中烹制。绝对值得每个人来试试。谢谢你，Alexander！' },
    'review-2gis-006': { name: '然斯露 Zh.I.', route: '阿瓦恰湾', source: '2GIS', text: '一次美妙的海上之行！满满的情绪与体验！感谢 Alexander——一位非常热心、积极的人，我不仅从美景中，也从愉快的同伴中收获了满满的感动。我们到了三兄弟岩、魔鬼之指、季哈亚湾等许多地方。有不同的路线可供选择。再次感谢这次美妙的海上之行。' },
    'review-2gis-007': { name: '达里娅·格里戈尔丘克', route: '阿瓦恰湾', source: '2GIS', text: '非常感谢，一切都很喜欢！Alexander 船长把这次行程带得非常好。地方非常美，推荐大家都来这里。' },
    'review-2gis-008': { name: '玛莲娜·奥汉尼相', route: '斯塔里奇科夫岛', source: '2GIS', text: '全新的 Antur 船、贴心的船长、美味的款待，一次前往堪察加美景的精彩出行！钓鱼和新鲜的渔获——各种乐趣应有尽有。Antur 团队热情的接待和真诚让人印象深刻。感谢 Alexander 船长带来的这次旅程！' },
    'review-2gis-009': { name: '伊琳娜·格里先科', route: '斯塔里奇科夫岛', source: '2GIS', text: '我们一群要好的姐妹一起参加了海上之行，非常满意！全新的小巧温馨的船非常适合自己的小团体。海风、美丽的景色、水声和鸟鸣——是逃离城市喧嚣的最佳方式。船长热情好客且经验丰富。我们享用了刚捕获的美味：帝王蟹和海胆籽、香浓的茶、咖啡和小吃。非常推荐！' },
    'review-2gis-010': { name: '伊利亚·格里先科', route: '鲁斯卡亚湾', source: '2GIS', text: '我们乘坐了 Antur。船不大，11 人——刚刚好，不拥挤，大家都坐得很舒适。大自然美得不真实：岩石、海水、海鸟。船长很棒，把船开到靠近岸边，带我们看了所有美景。钓鱼很令人高兴——刚下钩就上鱼，大家都满载而归。还有帝王蟹——太美味了，现煮，就在甲板上吃。如果你想轻松又充实地出海，Antur 是个好选择。' },
    'review-2gis-011': { name: '阿纳斯塔西娅·斯塔里岑娜', route: '鲁斯卡亚湾', source: '2GIS', text: '这是一次超出所有期待的真正冒险。从一开始就能感受到船长的专业。钓鱼和捕蟹本身都是一流的——我们带着惊人的渔获回来。但最重要的是那种温暖和关怀的氛围：早餐和午餐都非常精彩，是大海中央真正的家常美食。高潮是 Alexander 亲手烹制的帝王蟹。非常感谢这难忘的一天！' },
    'review-2gis-012': { name: '艾努拉', route: '海上观光', source: '2GIS', text: '这次出行非常美好，令人难忘！几个小时里我看到了惊艳的景色。风拂面庞、浪花飞溅、海鸥鸣叫——一种完全自由的感觉。船在岩石间灵巧地穿行，周围空无一人，只有大自然。船很舒适，船长很专业，又有幽默感。感谢这些感动！绝对推荐！' },
    'review-2gis-013': { name: '伊琳娜 R.', route: '海上观光', source: '2GIS', text: '我们有机会踏上一次海上之旅——那是最难忘的体验和鲜活的情绪。干净舒适的船只、友好的氛围和非常美味的款待。我们的天气运气好极了：看到了堪察加的美景、野生鸟类和海洋生物，尽情享受。感谢你们带来这美好的一天！' },
    'review-2gis-014': { name: '马克西姆·希什卡诺夫', route: '鲁斯卡亚湾', source: '2GIS', text: '如果你计划在堪察加出海，Antur 团队非常值得选择。我们的鲁斯卡亚湾之行超出所有期待。堪察加的自然风光令人难以置信，这样周到的组织让整个旅程格外轻松愉快。' }
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
    'photo-crab-tray-2026-07-07': { alt: 'Guest holding a tray of cooked crab after a Kamchatka sea trip', route: 'Russkaya Bay', caption: 'Fresh crab after the sea trip on 7 July 2026.' },
    'video-sea-lions-2026-07-10': { alt: 'Sea lions on coastal rocks during a Kamchatka sea tour', route: 'Sea tour', caption: 'Sea lions on coastal rocks during the trip on 10 July 2026.' },
    'video-orcas-2026-07-07': { alt: 'Orcas near the Kamchatka coast during a sea tour', route: 'Russkaya Bay', caption: 'Orcas near the Kamchatka coast during the trip on 7 July 2026.' },
    'video-coastal-route-2026-07-07': { alt: 'Cliffs and snow-covered slopes on a sea route along Kamchatka', route: 'Russkaya Bay', caption: 'Cliffs and snow-covered slopes on the long sea route on 7 July 2026.' },
    'video-fishing-trip-2026-07-03': { alt: 'Guests fishing from the Antur boat in Avacha Gulf', route: 'Coastal fishing', caption: 'Fishing from the boat in Avacha Gulf on 3 July 2026.' },
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
    'photo-crab-tray-2026-07-07': { alt: '堪察加出海后，客人端着一盘煮好的螃蟹', route: '鲁斯卡亚湾', caption: '2026 年 7 月 7 日出海后享用的新鲜螃蟹。' },
    'video-sea-lions-2026-07-10': { alt: '堪察加海上观光途中，海狮聚集在海岸岩石上', route: '海上观光', caption: '2026 年 7 月 10 日出海时看到的岩石海狮群。' },
    'video-orcas-2026-07-07': { alt: '海上观光时，虎鲸出现在堪察加海岸附近', route: '鲁斯卡亚湾', caption: '2026 年 7 月 7 日出海时在堪察加海岸附近遇到虎鲸。' },
    'video-coastal-route-2026-07-07': { alt: '堪察加沿海航线上的峭壁和雪坡', route: '鲁斯卡亚湾', caption: '2026 年 7 月 7 日长线航程中的峭壁和雪坡。' },
    'video-fishing-trip-2026-07-03': { alt: '客人在阿瓦恰湾的 Antur 船上钓鱼', route: '近海海钓', caption: '2026 年 7 月 3 日在阿瓦恰湾乘船钓鱼。' },
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
} satisfies Record<Exclude<LocaleCode, 'ru'>, Record<string, { alt: string, route: string, caption?: string }>>

const localizeTourMedia = (locale: Exclude<LocaleCode, 'ru'>) =>
  ruTourPhotos.map((item) => {
    const localeText: Record<string, { alt: string, route: string, caption?: string }> = tourMediaText[locale]

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
