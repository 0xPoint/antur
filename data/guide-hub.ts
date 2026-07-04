import {
  guidePages,
  guideServiceLinks,
  type GuidePageFaq,
  type GuidePageLink
} from './guide-pages'

export interface GuideHubPanel {
  title: string
  text: string
}

export interface GuideHubSection {
  eyebrow: string
  title: string
  description: string
  slugs: string[]
}

export interface GuideHubPage {
  path: string
  eyebrow: string
  breadcrumbTitle: string
  title: string
  description: string
  seoTitle: string
  seoDescription: string
  updatedAt: string
  heroImage: string
  heroAlt: string
  ctaLabel: string
  ctaContext: string
  panels: GuideHubPanel[]
  sections: GuideHubSection[]
  serviceLinks: GuidePageLink[]
  faq: GuidePageFaq[]
}

const updatedAt = guidePages.reduce((latest, page) => page.updatedAt > latest ? page.updatedAt : latest, '2026-07-03')

export const guideHubPage: GuideHubPage = {
  path: '/guides/',
  eyebrow: 'Гайды',
  breadcrumbTitle: 'Гайды',
  title: 'Гайды и советы перед выходом в море на Камчатке',
  description:
    'Собрали короткие практичные материалы: когда ехать, что взять на борт, как выбрать маршрут, что ждать от рыбалки и как подготовиться к морскому дню на Камчатке.',
  seoTitle: 'Гайды о морских прогулках и рыбалке на Камчатке | Антур',
  seoDescription:
    'Полезные гайды о морских прогулках и рыбалке на Камчатке: сезон, киты, вещи в море, дети на борту, укачивание, маршруты и выбор рыбалки.',
  updatedAt,
  heroImage: '/images/antur-kamchatka-captain-helm-2026-06-24.jpg',
  heroAlt: 'Капитан Антур за штурвалом катера во время выхода в море на Камчатке',
  ctaLabel: 'Подобрать маршрут',
  ctaContext: 'Гайды и советы перед выходом в море на Камчатке',
  panels: [
    {
      title: 'Все важные вопросы до бронирования',
      text: 'В одном разделе собраны материалы про сезон, подготовку, детей на борту, укачивание, китов и форматы рыбалки.'
    },
    {
      title: 'Статьи разбиты по задаче',
      text: 'Отдельно можно открыть подготовку к поездке, комфорт на воде и разбор конкретных морских маршрутов Камчатки.'
    },
    {
      title: 'Из каждого гайда есть переход в нужный маршрут',
      text: 'Информационные страницы не висят отдельно: они ведут в морские прогулки, рыбалку, аренду катера и сезонные посадочные страницы.'
    }
  ],
  sections: [
    {
      eyebrow: 'Планирование',
      title: 'Когда ехать и как заложить поездку',
      description: 'Материалы для тех, кто только планирует даты, маршрут и ожидания от сезона на Камчатке.',
      slugs: [
        'kogda-luchshe-ehat-na-kamchatku',
        'kogda-poyavlyayutsya-kosatki',
        'kak-podgotovitsya-turistu-iz-moskvy'
      ]
    },
    {
      eyebrow: 'Подготовка',
      title: 'Что взять с собой и как чувствовать себя спокойнее',
      description: 'Короткие прикладные советы перед выходом на воду: одежда, дети, укачивание и базовый комфорт на борту.',
      slugs: [
        'chto-vzyat-na-morskuyu-progulku',
        'chto-delat-esli-ukachivaet',
        'morskaya-progulka-s-detmi'
      ]
    },
    {
      eyebrow: 'Маршруты',
      title: 'Как выбрать морской формат и рыбалку',
      description: 'Разбор того, что ждет на маршрутах, какую рыбу ловят и чем отличается глубоководный формат от прибрежного.',
      slugs: [
        'top-5-morskih-marshrutov-kamchatki',
        'kak-prohodit-vyhod-v-buhtu-russkaya',
        'kakuyu-rybu-mozhno-poymat',
        'glubokovodnaya-i-pribrezhnaya-rybalka',
        'fotootchet-sezona-i-luchshie-ulovy'
      ]
    }
  ],
  serviceLinks: [
    guideServiceLinks.seaTours,
    guideServiceLinks.fishingHub,
    guideServiceLinks.charter,
    guideServiceLinks.whales,
    guideServiceLinks.gallery
  ],
  faq: [
    {
      question: 'Зачем нужен отдельный хаб с гайдами?',
      answer: 'Так полезные статьи не прячутся в футере списком, а собраны в понятный раздел по темам: планирование, подготовка и выбор маршрута.'
    },
    {
      question: 'Можно ли по гайдам сразу выбрать подходящий выход?',
      answer: 'Да. Внутри материалов и на этой странице есть переходы в морские прогулки, рыбалку, аренду катера и сезонные страницы.'
    },
    {
      question: 'Гайды подходят только для новичков?',
      answer: 'Нет. Часть материалов помогает впервые выйти в море, а часть нужна тем, кто выбирает между Бухтой Русской, рыбалкой, китами и разными форматами катера.'
    }
  ]
}
