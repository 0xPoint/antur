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

export const ui = {
  ru: {
    skip: 'Перейти к содержанию',
    homeAria: 'Антур, на главную',
    navAria: 'Разделы сайта',
    nav: { home: 'Главная', routes: 'Морские прогулки', fishing: 'Рыбалка', charter: 'Катер', gallery: 'Фото', reviews: 'Отзывы', booking: 'Бронь', seaRoutesLabel: 'Маршруты морских прогулок', fishingRoutesLabel: 'Разделы рыбалки', menuOpen: 'Открыть меню', menuClose: 'Закрыть меню' },
    contact: {
      cta: 'Связаться',
      book: 'Планировать поездку',
      bookTrip: 'Забронировать выход',
      bookContext: 'Вопрос с сайта',
      mobileContext: 'Вопрос с мобильной версии',
      close: 'Закрыть окно связи',
      eyebrow: 'Связь',
      title: 'Как удобнее связаться?',
      lead: 'Позвоните: уточним возможность выхода с учетом погоды, согласований и состава группы. Если не ответили, напишите в WhatsApp или MAX.',
      availabilityNote: 'Позвоните: уточним возможность выхода с учетом погоды, согласований и состава группы. Менеджер принимает звонки круглосуточно. Если не ответили, напишите в WhatsApp или MAX.',
      options: 'Быстрые варианты связи',
      call: 'Позвонить',
      whatsapp: 'Написать в WhatsApp',
      max: 'Написать в MAX'
    },
    seasonBanner: { close: 'Закрыть уведомление о сезоне 2027' },
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
      note: 'Поможем спланировать морской день на лето 2027',
      imageAlt: 'Косатки выпрыгивают из воды',
      context: 'Планирование лета 2027 с первого экрана'
    },
    home: {
      seoTitle: 'Морские прогулки и рыбалка на Камчатке — сезон 2027 | Антур',
      seoDescription: 'Готовимся к сезону 2027: морские прогулки в Бухту Русскую, к острову Старичков и рыбалка на Камчатке. Поможем выбрать маршрут; условия уточнит менеджер.',
      routesEyebrow: 'Маршруты и цены',
      routesTitle: 'Выберите маршрут',
      details: 'Подробнее',
      introEyebrow: 'Камчатка с воды',
      introTitle: 'Море, вулканы и маршруты с характером',
      introText: 'Подберем маршрут под вашу компанию: короткая прогулка по бухте, рыбалка в океане, выход к острову Старичков или длинный день с Бухтой Русской, крабом и остановками на берегу.',
      introAlt: 'Скалы Камчатки со стороны океана',
      galleryEyebrow: 'Сезон 2026',
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
      bookingEyebrow: 'Лето 2027',
      bookingTitle: 'Начните с выбора морского дня',
      bookingText: 'Напишите или позвоните: уточним маршрут, сезонную цену, состав группы и прогноз. Для бронирования места нужна предоплата 1 000 ₽.',
      bookingButton: 'Обсудить поездку',
      bookingContext: 'Планирование поездки на лето 2027',
      bookingAlt: 'Крабовая дегустация на борту',
      maxChannelEyebrow: 'Антур в MAX',
      maxChannelTitle: 'Следите за обновлениями в нашем канале',
      maxChannelText: 'Следите за подготовкой к сезону 2027 в канале Антур: будем делиться новостями и подтверждёнными условиями морских выходов.',
      maxChannelButton: 'Перейти в канал в MAX',
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
      seoDescription: 'Реальные фото и видео сезона 2026: морские прогулки, рыбалка и природа Камчатки. Посмотрите маршруты перед поездкой летом 2027.',
      eyebrow: 'Архив сезона 2026',
      title: 'Фото из морских выходов',
      lead: 'Фото и видео реальных выходов сезона 2026. Посмотрите катер, маршруты и жизнь на борту перед поездкой летом 2027. Даты съёмки сохранены; встречи с животными и уловы не гарантированы.',
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
      book: 'Plan a trip',
      bookTrip: 'Book a trip',
      bookContext: 'Question from the website',
      mobileContext: 'Question from the mobile version',
      close: 'Close contact dialog',
      eyebrow: 'Contact',
      title: 'How would you like to contact us?',
      lead: 'Call us to confirm whether the trip can go ahead for the weather, required clearances and group size. If we miss your call, message us on WhatsApp or MAX.',
      availabilityNote: 'A manager takes calls 24 hours a day. Call to confirm the weather, required clearances and group size; if we miss your call, message us on WhatsApp or MAX.',
      options: 'Quick contact options',
      call: 'Call',
      whatsapp: 'Message on WhatsApp',
      max: 'Message on MAX'
    },
    seasonBanner: { close: 'Close the 2027 season notice' },
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
      note: 'We will help you plan a sea day for summer 2027',
      imageAlt: 'Orcas jumping out of the water',
      context: 'Summer 2027 planning from the home page'
    },
    home: {
      seoTitle: 'Kamchatka sea tours and fishing — summer 2027 | Antur',
      seoDescription: 'Preparing for summer 2027: Kamchatka sea tours to Russkaya Bay and Starichkov Island, and fishing trips. Contact Antur to discuss your route and terms.',
      routesEyebrow: 'Routes and prices',
      routesTitle: 'Choose your sea trip format',
      details: 'Details',
      introEyebrow: 'Kamchatka from the sea',
      introTitle: 'Ocean, volcanoes and routes with character',
      introText: 'We will choose a format for your group: a short bay tour, ocean fishing, Starichkov Island or a full day to Russkaya Bay with crab, fishing and shore stops.',
      introAlt: 'Kamchatka cliffs seen from the ocean',
      galleryEyebrow: '2026 season',
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
      bookingEyebrow: 'Summer 2027',
      bookingTitle: 'Start by choosing your sea day',
      bookingText: 'Message or call us: we will confirm the route, seasonal price, group size and forecast. A 1,000 ₽ prepayment is required to reserve a seat.',
      bookingButton: 'Discuss your trip',
      bookingContext: 'Planning a summer 2027 trip',
      bookingAlt: 'Crab tasting on board',
      maxChannelEyebrow: 'Antur on MAX',
      maxChannelTitle: 'Follow Antur updates',
      maxChannelText: 'Follow Antur on MAX for preparation updates and confirmed terms for the 2027 sea season.',
      maxChannelButton: 'Open the MAX channel',
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
      seoDescription: 'Real photos and videos from the 2026 Kamchatka sea season. Explore the routes, boat and fishing before planning your summer 2027 trip.',
      eyebrow: '2026 season archive',
      title: 'Photos from sea trips',
      lead: 'Photos and videos from real trips in 2026. Explore the boat, routes and life on board before your summer 2027 visit. Original dates are preserved; sightings and catches are never guaranteed.',
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
      book: '计划旅行',
      bookTrip: '预订出海',
      bookContext: '网站咨询',
      mobileContext: '移动端咨询',
      close: '关闭联系窗口',
      eyebrow: '联系',
      title: '怎样联系更方便？',
      lead: '请来电确认天气、所需协调事项和团队人数是否适合出海。如未接通，请通过 WhatsApp 或 MAX 留言。',
      availabilityNote: '经理全天 24 小时接听电话。请来电确认天气、所需协调事项和团队人数；如未接通，请通过 WhatsApp 或 MAX 留言。',
      options: '快速联系方式',
      call: '电话联系',
      whatsapp: '通过 WhatsApp 联系',
      max: '通过 MAX 联系'
    },
    seasonBanner: { close: '关闭 2027 年旅游季提醒' },
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
      note: '帮助您安排 2027 年夏季海上行程',
      imageAlt: '虎鲸跃出水面',
      context: '首页 2027 年夏季旅行咨询'
    },
    home: {
      seoTitle: '堪察加海上观光与海钓 — 2027 年夏季 | Antur',
      seoDescription: '我们正在筹备 2027 年旅游季：鲁斯卡亚湾、斯塔里奇科夫岛观光和堪察加海钓。请联系 Antur 咨询路线和行程条件。',
      routesEyebrow: '路线与价格',
      routesTitle: '选择出海形式',
      details: '了解详情',
      introEyebrow: '从海上看堪察加',
      introTitle: '海洋、火山与有性格的路线',
      introText: '我们会按您的团队选择形式：短途海湾观光、海钓、斯塔里奇科夫岛，或前往鲁斯卡亚湾的一整天行程，包含帝王蟹、钓鱼和岸上停留。',
      introAlt: '从海上看到的堪察加海岸岩石',
      galleryEyebrow: '2026 年旅游季',
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
      bookingEyebrow: '2027 年夏季',
      bookingTitle: '从选择海上行程开始',
      bookingText: '请发消息或电话联系我们：我们会确认路线、季节价格、团队人数和天气预报。预留名额需支付 1,000 ₽ 预付款。',
      bookingButton: '咨询旅行计划',
      bookingContext: '计划 2027 年夏季旅行',
      bookingAlt: '船上的帝王蟹品尝',
      maxChannelEyebrow: 'MAX 上的 Antur',
      maxChannelTitle: '关注 Antur 的最新动态',
      maxChannelText: '关注 Antur 的 MAX 频道，了解 2027 年旅游季的筹备进展和已确认的出海条件。',
      maxChannelButton: '打开 MAX 频道',
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
      seoDescription: '堪察加 2026 年海上旅游季的真实照片和视频。计划 2027 年夏季旅行前，了解路线、船只和海钓。',
      eyebrow: '2026 年旅游季影像',
      title: '出海照片',
      lead: '来自 2026 年真实出海行程的照片和视频。在计划 2027 年夏季旅行前，了解船只、路线和船上时光。保留原始拍摄日期；不保证动物观赏和渔获。',
      dateLocale: 'zh-CN'
    }
  }
} satisfies Record<LocaleCode, Record<string, any>>
