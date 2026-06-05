import type { Review, TourPhoto } from '~/types/content'

export const reviews: Review[] = [
  {
    id: 'review-001',
    name: 'Андрей М.',
    route: 'Глубоководная рыбалка',
    date: '2025-08-17',
    rating: 5,
    text:
      'Ехали за рыбалкой, а получили большой день в море. Команда спокойно объяснила, как работать со снастями, помогала на точках. Уха после выхода была отдельным удовольствием.'
  },
  {
    id: 'review-002',
    name: 'Марина и Илья',
    route: 'Бухта Русская',
    date: '2025-07-29',
    rating: 5,
    text:
      'Понравился темп: без спешки, но день получился очень насыщенным. Высадка, краб, рыбалка и виды на бухту запомнились сильнее, чем ожидали.'
  },
  {
    id: 'review-003',
    name: 'Сергей П.',
    route: 'Остров Старичков',
    date: '2025-06-12',
    rating: 5,
    text:
      'Брали короткий выход к Старичкову. Экипаж внимательный: помогли с посадкой, подсказали, где лучше фотографировать, детям было спокойно. Краб свежий, очень вкусный.'
  },
  {
    id: 'review-004',
    name: 'Екатерина Н.',
    route: 'Авачинская бухта',
    date: '2025-09-03',
    rating: 5,
    text:
      'Для первого знакомства с Камчаткой с воды формат подошел идеально. Капитан заранее предупредил по одежде и погоде, на борту было чисто и все понятно организовано.'
  },
  {
    id: 'review-005',
    name: 'Дмитрий К.',
    route: 'Прибрежная рыбалка',
    date: '2025-08-04',
    rating: 5,
    text:
      'Я новичок в морской рыбалке, но команда сразу включилась: дали снасти, показали, как работать, спокойно помогали весь выход. Улов был, эмоций еще больше.'
  },
  {
    id: 'review-006',
    name: 'Ольга Р.',
    route: 'Бухта Русская',
    date: '2025-07-18',
    rating: 5,
    text:
      'Больше всего понравилась честность по погоде: заранее объяснили, куда пойдем и почему. Обед с морепродуктами после прогулки был простой, свежий и очень вкусный.'
  },
  {
    id: 'review-007',
    name: 'Павел С.',
    route: 'Глубоководная рыбалка',
    date: '2025-08-22',
    rating: 5,
    text:
      'Отличный выход для тех, кто едет именно рыбачить. Хороший катер, опытный экипаж, понятная организация и много настоящего моря.'
  },
  {
    id: 'review-008',
    name: 'Анна В.',
    route: 'Остров Старичков',
    date: '2025-06-25',
    rating: 5,
    text:
      'Птицы, скалы, океан и краб на борту - за пять часов получилось очень насыщенно. Отдельное спасибо за заботу о родителях и детях.'
  },
  {
    id: 'review-009',
    name: 'Михаил и Татьяна',
    route: 'Авачинская бухта',
    date: '2025-09-11',
    rating: 5,
    text:
      'Короткий маршрут оказался не просто обзорным. Три брата с воды выглядят мощно, а экипаж вел прогулку спокойно: без суеты, с нормальными объяснениями и паузами для фото.'
  },
  {
    id: 'review-010',
    name: 'Ирина Л.',
    route: 'Бухта Русская',
    date: '2025-08-31',
    rating: 5,
    text:
      'Запомнилась не только природа, но и люди на борту. Теплое отношение, вкусная уха, краб, горячий чай - видно, что о группе действительно заботятся.'
  }
]

export const tourPhotos: TourPhoto[] = [
  {
    id: 'photo-orca-2026-05-30',
    src: '/images/antur-kamchatka-orca-2026-05-30.jpg',
    alt: 'Косатка выходит из воды у берегов Камчатки во время морской прогулки',
    route: 'Морская прогулка',
    date: '2026-05-30'
  },
  {
    id: 'photo-fishing-catch-2026-05-30',
    src: '/images/antur-kamchatka-fishing-catch-2026-05-30.jpg',
    alt: 'Гость с уловом на борту катера во время морской рыбалки на Камчатке',
    route: 'Глубоководная рыбалка',
    date: '2026-05-30'
  },
  {
    id: 'photo-sea-lions-2026-05-30',
    src: '/images/antur-kamchatka-sea-lions-rocks-2026-05-30.jpg',
    alt: 'Сивучи отдыхают на скалах у камчатского побережья',
    route: 'Остров Старичков',
    date: '2026-05-30'
  },
  {
    id: 'photo-kekur-2026-05-30',
    src: '/images/antur-kamchatka-kekur-ocean-2026-05-30.jpg',
    alt: 'Кекур в океане на маршруте морской прогулки по Камчатке',
    route: 'Авачинская бухта',
    date: '2026-05-30'
  },
  {
    id: 'photo-sea-cave-2026-05-30',
    src: '/images/antur-kamchatka-sea-cave-2026-05-30.jpg',
    alt: 'Морская арка в скалах у побережья Камчатки',
    route: 'Морская прогулка',
    date: '2026-05-30'
  },
  {
    id: 'photo-bird-cliffs-2026-05-30',
    src: '/images/antur-kamchatka-bird-cliffs-2026-05-30.jpg',
    alt: 'Морские птицы на скалах у острова Старичков',
    route: 'Остров Старичков',
    date: '2026-05-30'
  },
  {
    id: 'photo-crab-deck-2026-05-30',
    src: '/images/antur-kamchatka-crab-safari-deck-2026-05-30.jpg',
    alt: 'Крабовый улов на палубе катера во время крабового сафари',
    route: 'Крабовое сафари',
    date: '2026-05-30'
  },
  {
    id: 'photo-crab-tasting-2026-05-30',
    src: '/images/antur-kamchatka-crab-tasting-2026-05-30.jpg',
    alt: 'Камчатский краб на столах после морской прогулки',
    route: 'Крабовое сафари',
    date: '2026-05-30'
  },
  {
    id: 'photo-ukha-2026-05-30',
    src: '/images/antur-kamchatka-ukha-after-tour-2026-05-30.jpg',
    alt: 'Горячая уха и стол для гостей после морского выхода',
    route: 'После выхода',
    date: '2026-05-30'
  },
  {
    id: 'photo-coastal-base-2026-05-30',
    src: '/images/antur-kamchatka-coastal-base-2026-05-30.jpg',
    alt: 'Теплая зона отдыха со столами для гостей после морской прогулки',
    route: 'После выхода',
    date: '2026-05-30'
  },
  {
    id: 'photo-boat-pier-2026-06-01',
    src: '/images/antur-kamchatka-boat-pier-2026-06-01.jpg',
    alt: 'Катер Антур у причала в Петропавловске-Камчатском',
    route: 'Катер Антур',
    date: '2026-06-01'
  },
  {
    id: 'video-sea-tour-2026-05-30',
    kind: 'video',
    src: '/videos/antur-kamchatka-sea-tour-2026-05-30.mp4',
    videoSrc: '/videos/antur-kamchatka-sea-tour-2026-05-30.mp4',
    alt: 'Видео морской прогулки по Камчатке',
    route: 'Видео с маршрута',
    date: '2026-05-30'
  },
  {
    id: 'video-ocean-route-2026-05-23',
    kind: 'video',
    src: '/videos/antur-kamchatka-ocean-route-2026-05-23.mp4',
    videoSrc: '/videos/antur-kamchatka-ocean-route-2026-05-23.mp4',
    alt: 'Видео морского маршрута у побережья Камчатки',
    route: 'Видео с маршрута',
    date: '2026-05-23'
  },
  {
    id: 'video-boat-moment-2026-05-27',
    kind: 'video',
    src: '/videos/antur-kamchatka-boat-moment-2026-05-27.mp4',
    videoSrc: '/videos/antur-kamchatka-boat-moment-2026-05-27.mp4',
    alt: 'Видео с катера Антур во время морского выхода',
    route: 'Катер Антур',
    date: '2026-05-27'
  },
  {
    id: 'video-crab-safari-2026-05-30',
    kind: 'video',
    src: '/videos/antur-kamchatka-crab-safari-2026-05-30.mp4',
    videoSrc: '/videos/antur-kamchatka-crab-safari-2026-05-30.mp4',
    alt: 'Видео крабового сафари на Камчатке',
    route: 'Крабовое сафари',
    date: '2026-05-30'
  },
  {
    id: 'video-sea-landscape-2026-05-30',
    kind: 'video',
    src: '/videos/antur-kamchatka-sea-landscape-2026-05-30.mp4',
    videoSrc: '/videos/antur-kamchatka-sea-landscape-2026-05-30.mp4',
    alt: 'Видео морского пейзажа на маршруте по Камчатке',
    route: 'Морской пейзаж',
    date: '2026-05-30'
  },
  {
    id: 'video-ocean-wildlife-2026-05-30',
    kind: 'video',
    src: '/videos/antur-kamchatka-ocean-wildlife-2026-05-30.mp4',
    videoSrc: '/videos/antur-kamchatka-ocean-wildlife-2026-05-30.mp4',
    alt: 'Видео встречи с морской природой Камчатки',
    route: 'Видео с океана',
    date: '2026-05-30'
  }
]
