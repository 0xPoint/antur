import type { LocaleCode } from './i18n-base'

// Update this date only when the public preparation content changes.
export const seasonPreparation = {
  year: 2027,
  updatedAt: '2026-11-02'
} as const

export const seasonContent = {
  ru: {
    label: 'Лето 2027',
    title: 'Готовимся к морскому сезону 2027',
    lead: 'Планируете отпуск на Камчатке следующим летом? Уже можно обсудить морской день: прогулку к острову Старичков, Бухту Русскую или рыбалку для своей компании.',
    conditions: 'Поможем выбрать подходящий формат морского дня и ответим на вопросы о поездке.',
    cta: 'Обсудить поездку на лето 2027',
    context: 'Планирование поездки на лето 2027',
    contactLead: 'Расскажите, в каком месяце планируете поездку, сколько будет гостей и будут ли дети. Поможем выбрать маршрут и уточним условия сезона 2027.',
    message: 'Здравствуйте! Планируем поездку на Камчатку летом 2027. Интересует: {context}.\nМесяц поездки: \nКоличество гостей: \nДети и их возраст: \nПоможете выбрать маршрут и уточнить программу и стоимость?',
    steps: [
      { title: 'Выберите морской день', text: 'Короткая прогулка, целый день в Бухте Русской или рыбалка — начните с маршрута, который подходит вашей компании.' },
      { title: 'Обсудите поездку заранее', text: 'Сообщите месяц, число гостей и пожелания. Программу, цену и порядок подтверждения согласуем с вами отдельно.' },
      { title: 'Оставьте запас на погоду', text: 'Заложите резервный день в отпуске: фактический выход и маршрут зависят от погоды и решения капитана.' }
    ],
    archiveTitle: 'Сезон 2026 — в фотографиях гостей и команды',
    archiveText: 'Посмотрите, как проходили морские выходы: катер, виды с борта, рыбалка и отдых. Даты съёмки сохранены; встречи с животными и уловы в новой поездке могут отличаться.',
    archiveLink: 'Посмотреть фото и видео 2026',
    guidesLink: 'Гайды для подготовки к поездке',
    faq: [
      { question: 'Можно ли уже обсудить поездку на лето 2027?', answer: 'Да. Позвоните или напишите нам: укажите желаемый месяц, число гостей, возраст детей и интересующий маршрут. Менеджер поможет с выбором и уточнит подтверждённые условия.' },
      { question: 'Цены на сайте действуют на сезон 2027?', answer: 'Цены и условия указаны на страницах маршрутов. Менеджер поможет подобрать маршрут и ответит на вопросы перед бронированием.' },
      { question: 'Как заложить морскую прогулку в отпуск?', answer: 'Обсудите маршрут заранее и оставьте резервный день на случай переноса из-за погоды. Возможность выхода подтверждается менеджером с учётом решения капитана.' }
    ]
  },
  en: {
    label: 'Summer 2027',
    title: 'Preparing for the 2027 sea season',
    lead: 'Planning a Kamchatka holiday next summer? Talk to us about a sea day: Starichkov Island, Russkaya Bay or a fishing trip for your group.',
    conditions: 'Our manager will help you choose a sea trip and answer your questions.',
    cta: 'Plan your summer 2027 trip',
    context: 'Planning a summer 2027 trip',
    contactLead: 'Tell us your travel month, group size and whether children will join. We will help you choose a route and check the terms for 2027.',
    message: 'Hello! We are planning a Kamchatka trip in summer 2027. Interested in: {context}.\nTravel month: \nNumber of guests: \nChildren and ages: \nCould you help us choose a route and confirm the program and price?',
    steps: [
      { title: 'Choose your sea day', text: 'Start with a shorter tour, a full day to Russkaya Bay or a fishing trip for your group.' },
      { title: 'Discuss your plans early', text: 'Share your travel month, group size and preferences. We will agree on the program, price and confirmation process with you.' },
      { title: 'Allow for the weather', text: 'Keep a spare day in your itinerary: departures and routes depend on sea conditions and the captain’s decision.' }
    ],
    archiveTitle: 'The 2026 season in photos from guests and crew',
    archiveText: 'See the boat, coastal views, fishing and time on board. Original dates are preserved; wildlife sightings and catches may differ on your trip.',
    archiveLink: 'View 2026 photos and videos',
    guidesLink: 'Trip preparation guides',
    faq: [
      { question: 'Can we discuss a summer 2027 trip now?', answer: 'Yes. Call or message us with your preferred month, group size, children’s ages and route. Our manager will help you choose and explain the confirmed terms.' },
      { question: 'Do the listed prices apply to 2027?', answer: 'Prices and terms are listed on the route pages. Our manager can help you choose and answer questions before booking.' },
      { question: 'How should we fit a sea trip into our holiday?', answer: 'Discuss the route early and leave a spare day in case of a weather-related change. The manager confirms whether a trip can go ahead based on the captain’s decision.' }
    ]
  },
  zh: {
    label: '2027 年夏季',
    title: '我们正在筹备 2027 年海上旅游季',
    lead: '计划明年夏天来堪察加度假？现在就可以咨询海上行程：斯塔里奇科夫岛、鲁斯卡亚湾，或适合您团队的海钓。',
    conditions: '经理会帮助您选择海上行程，并回答您的旅行问题。',
    cta: '咨询 2027 年夏季行程',
    context: '计划 2027 年夏季旅行',
    contactLead: '请告诉我们出行月份、人数以及是否有儿童。我们会帮助您选择路线，并确认 2027 年的行程条件。',
    message: '您好！我们计划在 2027 年夏天去堪察加。感兴趣的行程：{context}。\n出行月份：\n人数：\n儿童及年龄：\n请帮我们选择路线并确认行程和价格。',
    steps: [
      { title: '选择海上一日行程', text: '可以选择较短的观光行程、鲁斯卡亚湾一日游，或适合您团队的海钓。' },
      { title: '提前沟通旅行计划', text: '告诉我们出行月份、人数和需求。行程、价格及确认方式将与您单独商定。' },
      { title: '为天气预留时间', text: '请在假期中预留一天备用时间：实际出航和路线取决于海况及船长的决定。' }
    ],
    archiveTitle: '客人和船员镜头中的 2026 年旅游季',
    archiveText: '了解船只、沿海风景、海钓和船上时光。照片保留原始拍摄日期；您旅行时看到的动物和渔获可能不同。',
    archiveLink: '查看 2026 年照片和视频',
    guidesLink: '旅行准备指南',
    faq: [
      { question: '现在可以咨询 2027 年夏季行程吗？', answer: '可以。请来电或留言，告诉我们计划月份、人数、儿童年龄及感兴趣的路线。经理会帮助您选择，并说明已确认的条件。' },
      { question: '网站上的价格适用于 2027 年吗？', answer: '价格和条款列在路线页面上。预订前经理可以帮助您选择路线并回答问题。' },
      { question: '如何在假期中安排行程？', answer: '请提前沟通路线，并预留一天以应对因天气导致的调整。经理将根据船长的决定确认能否出航。' }
    ]
  }
} satisfies Record<LocaleCode, {
  label: string; title: string; lead: string; conditions: string; cta: string; context: string
  contactLead: string; message: string; steps: { title: string; text: string }[]
  archiveTitle: string; archiveText: string; archiveLink: string; guidesLink: string
  faq: { question: string; answer: string }[]
}>
