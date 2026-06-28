import type { RouteOffer } from '~/types/content'

export const routeOffers: RouteOffer[] = [
  {
    slug: 'rybalka',
    title: 'Прибрежная рыбалка в океане',
    kicker: 'Аренда катера',
    duration: '5 или 10 часов',
    price: 'от 65 000 ₽',
    description:
      'Выход для компании до 6 человек: рыбалка у камчатского побережья, подготовленные снасти и возможность добавить крабовое сафари по согласованию с капитаном.',
    highlights: ['Группа не более 6 человек', 'Снасти предоставляются', 'Крабовое сафари - по согласованию с капитаном'],
    priceOptions: [
      { season: 'май - сентябрь', format: '5 часов, группа до 6 человек', price: '65 000 ₽' },
      { season: 'май - сентябрь', format: '10 часов, группа до 6 человек', price: '130 000 ₽' },
      { season: 'май - сентябрь', format: 'Продление аренды катера', price: '5 000 ₽ / час' }
    ],
    image: '/images/fishing-deck.jpg',
    imageAlt: 'Снасти на палубе катера во время морской рыбалки',
    pageImage: '/images/fishing-deck.jpg',
    pageImageAlt: 'Снасти на палубе катера во время морской рыбалки',
    imageCredit: {
      label: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Fishing_time_at_sea.jpg'
    },
    featured: true
  },
  {
    slug: 'glubokovodnaya-rybalka',
    title: 'Глубоководная рыбалка в океане',
    kicker: 'Аренда катера',
    duration: '5 или 10 часов',
    price: 'от 85 000 ₽',
    description:
      'Маршрут дальше в океан для тех, кто едет именно за рыбалкой: больше времени на воде, глубины серьезнее, день насыщеннее.',
    highlights: ['Группа не более 6 человек', 'Снасти предоставляются', 'Крабовое сафари - по согласованию с капитаном'],
    priceOptions: [
      { season: 'май - сентябрь', format: '5 часов, группа до 6 человек', price: '85 000 ₽' },
      { season: 'май - сентябрь', format: '10 часов, группа до 6 человек', price: '170 000 ₽' },
      { season: 'май - сентябрь', format: 'Продление аренды катера', price: '5 000 ₽ / час' }
    ],
    image: '/images/fishing-deck.jpg',
    imageAlt: 'Снасти на палубе катера во время глубоководной рыбалки',
    pageImage: '/images/location-avacha-boat.jpg',
    pageImageAlt: 'Океанский вид у берегов Камчатки',
    imageCredit: {
      label: 'kuhnmi / Wikimedia Commons, CC BY 2.0',
      url: 'https://commons.wikimedia.org/wiki/File:Kamchatka_Boat_in_Avachinsky_Bay_(17609611065).jpg'
    }
  },
  {
    slug: 'buhta-russkaya',
    title: 'Бухта Русская',
    kicker: '10 часов',
    duration: '10 часов',
    price: 'от 15 000 ₽ / чел.',
    description:
      'Большой морской день с заходом в Бухту Русскую, высадкой на берег, рыбалкой и крабовым сафари.',
    highlights: ['Крабовое сафари', 'Рыбалка 10 часов', 'Заход и высадка на берег', 'Сборные группы и аренда катера'],
    priceOptions: [
      { season: 'май - июнь', format: 'Сборная группа', price: '15 000 ₽ / чел.' },
      { season: 'май - июнь', format: 'Аренда катера, группа до 8 человек', price: '120 000 ₽' },
      { season: 'май - июнь', format: 'Аренда катера, группа до 10 человек', price: '150 000 ₽' },
      { season: 'июль - сентябрь', format: 'Сборная группа', price: '18 000 ₽ / чел.' },
      { season: 'июль - сентябрь', format: 'Аренда катера, группа до 8 человек', price: '135 000 ₽' },
      { season: 'июль - сентябрь', format: 'Аренда катера, группа до 10 человек', price: '170 000 ₽' }
    ],
    image: '/images/hero-kamchatka-boat.jpg',
    imageAlt: 'Катер в океане у побережья Камчатки',
    pageImage: '/images/location-buhta-russkaya.jpg',
    pageImageAlt: 'Пляж мыса Кекурный в Бухте Русской на Камчатке',
    imageCredit: {
      label: 'tanysolovey / Wikimedia Commons, CC BY-SA 2.0',
      url: 'https://commons.wikimedia.org/wiki/File:Cape_of_Kekurny_Beach_in_the_Bukhta_Russkaya_of_Kamchatka.jpg'
    }
  },
  {
    slug: 'ostrov-starichkov',
    title: 'Остров Старичков',
    kicker: '5 часов',
    duration: '5 часов',
    price: 'от 7 000 ₽ / чел.',
    description:
      'Пятичасовой маршрут к острову Старичков: скалы, птицы, морская рыбалка и крабовое сафари в одном выходе.',
    highlights: ['Морская рыбалка', 'Крабовое сафари', 'Сборные группы и аренда катера', 'Маршрут на 5 часов'],
    priceOptions: [
      { season: 'май - июнь', format: 'Сборная группа', price: '7 000 ₽ / чел.' },
      { season: 'май - июнь', format: 'Аренда катера, группа до 8 человек', price: '56 000 ₽' },
      { season: 'май - июнь', format: 'Аренда катера, группа до 10 человек', price: '70 000 ₽' },
      { season: 'июль - сентябрь', format: 'Сборная группа', price: '8 500 ₽ / чел.' },
      { season: 'июль - сентябрь', format: 'Аренда катера, группа до 8 человек', price: '68 000 ₽' },
      { season: 'июль - сентябрь', format: 'Аренда катера, группа до 10 человек', price: '85 000 ₽' }
    ],
    image: '/images/crab-tasting.jpg',
    imageAlt: 'Крабовая дегустация на борту у берегов Камчатки',
    pageImage: '/images/location-starichkov.jpg',
    pageImageAlt: 'Остров Старичков и прибрежные скалы на Камчатке',
    imageCredit: {
      label: 'DoctisDM / Wikimedia Commons, CC BY-SA 4.0',
      url: 'https://commons.wikimedia.org/wiki/File:%D0%92%D0%B8%D0%B4_%D0%BD%D0%B0_%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B2_%D0%A1%D1%82%D0%B0%D1%80%D0%B8%D1%87%D0%BA%D0%BE%D0%B2,_%D0%BA%D0%B5%D0%BA%D1%83%D1%80_%D0%9A%D0%B0%D1%80%D0%B0%D1%83%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%B8_%D0%BA%D0%B5%D0%BA%D1%83%D1%80_%D0%A7%D0%B0%D1%81%D0%BE%D0%B2%D0%BE%D0%B9.jpg'
    }
  },
  {
    slug: 'avachinskaya-buhta',
    title: 'Обзорная экскурсия по Авачинской бухте',
    kicker: '2,5 часа',
    duration: '2,5 часа',
    price: '5 000 ₽ / чел.',
    description:
      'Спокойный обзорный выход по Авачинской бухте: кекуры Три брата, бухта Тихая и виды на город с воды.',
    highlights: ['Кекуры Три брата', 'Бухта Тихая', 'Группа не менее 8 человек', 'Май - сентябрь'],
    priceOptions: [
      { season: 'май - сентябрь', format: 'Группа не менее 8 человек', price: '5 000 ₽ / чел.' }
    ],
    image: '/images/antur-kamchatka-three-brothers-avacha-2026-06-26.jpg',
    imageAlt: 'Кекуры Три брата в Авачинской бухте',
    pageImage: '/images/antur-kamchatka-three-brothers-avacha-2026-06-26.jpg',
    pageImageAlt: 'Кекуры Три брата в Авачинской бухте'
  }
]
