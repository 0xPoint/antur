import {
  guidePages,
  guideServiceLinks,
  type GuidePageFaq,
  type GuidePageLink
} from './guide-pages'
import { scheduledGuides } from './.generated-scheduled-guides'

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
  sections: GuideHubSection[]
  serviceLinks: GuidePageLink[]
  faq: GuidePageFaq[]
}

const updatedAt = guidePages.reduce((latest, page) => [latest, page.updatedAt, page.publishedAt?.slice(0, 10) || ''].sort().at(-1)!, '2026-11-18')

export const guideHubPage: GuideHubPage = {
  path: '/guides/',
  eyebrow: 'Перед поездкой',
  breadcrumbTitle: 'Полезные советы',
  title: 'Полезные советы для морской прогулки на Камчатке',
  description:
    'Собрали короткие практичные материалы: когда ехать, что взять на борт, как выбрать маршрут, что ждать от рыбалки и как подготовиться к морскому дню на Камчатке.',
  seoTitle: 'Полезные советы о морских прогулках и рыбалке на Камчатке | Антур',
  seoDescription:
    'Советы перед морской прогулкой и рыбалкой на Камчатке: когда ехать, что взять, как выбрать маршрут и подготовиться к выходу с детьми.',
  updatedAt,
  heroImage: '/images/antur-kamchatka-captain-helm-2026-06-24.jpg',
  heroAlt: 'Капитан Антур за штурвалом катера во время выхода в море на Камчатке',
  ctaLabel: 'Подобрать маршрут',
  ctaContext: 'Советы перед морской прогулкой на Камчатке',
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
      question: 'Как выбрать морскую прогулку?',
      answer: 'Подумайте, сколько времени хотите провести в море и что интереснее: короткая прогулка, большой маршрут или рыбалка. Менеджер поможет подобрать вариант для вашей компании.'
    },
    {
      question: 'Что взять с собой на катер?',
      answer: 'Возьмите паспорт, тёплую одежду и удобную обувь. Перед выходом уточните у команды, что понадобится с учётом погоды и выбранного маршрута.'
    },
    {
      question: 'Можно ли увидеть китов и косаток?',
      answer: 'Встречи в море возможны, но дикие животные не появляются по расписанию. Перед поездкой можно уточнить у экипажа, какие наблюдения были в последнее время.'
    }
  ]
}

for (const entry of scheduledGuides) {
  guideHubPage.sections.find((section) => section.eyebrow === entry.hubSection)?.slugs.push(entry.page.slug)
}
