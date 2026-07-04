export const ruOnlySeoLandingLinks = [
  { path: '/morskie-progulki/', title: 'Морские прогулки на Камчатке' },
  { path: '/morskie-progulki/krabovoe-safari/', title: 'Крабовое сафари на Камчатке' },
  { path: '/rybalka/', title: 'Рыбалка на Камчатке' },
  { path: '/rybalka/sezon-rybalki/', title: 'Сезон рыбалки на Камчатке' },
  { path: '/arenda-katera/', title: 'Аренда катера на Камчатке для морского выхода' },
  { path: '/kity-na-kamchatke/', title: 'Киты на Камчатке' },
  { path: '/morskie-progulki-petropavlovsk-kamchatskiy/', title: 'Морские прогулки из Петропавловска-Камчатского' }
]

export const ruOnlyInfoPageLinks = [
  { path: '/o-kompanii/', title: 'Антур: морские прогулки и рыбалка на Камчатке' },
  { path: '/bezopasnost-na-more/', title: 'Безопасность на морских прогулках на Камчатке' }
]

export const ruOnlyGuideLinks = [
  { path: '/guides/', title: 'Гайды и советы перед выходом в море' },
  { path: '/guides/kogda-luchshe-ehat-na-kamchatku/', title: 'Когда лучше ехать на Камчатку' },
  { path: '/guides/chto-vzyat-na-morskuyu-progulku/', title: 'Что взять на морскую прогулку' },
  { path: '/guides/chto-delat-esli-ukachivaet/', title: 'Что делать, если укачивает' },
  { path: '/guides/kogda-poyavlyayutsya-kosatki/', title: 'Когда появляются косатки на Камчатке' },
  { path: '/guides/kakuyu-rybu-mozhno-poymat/', title: 'Какую рыбу можно поймать на Камчатке' },
  { path: '/guides/glubokovodnaya-i-pribrezhnaya-rybalka/', title: 'Глубоководная и прибрежная рыбалка' },
  { path: '/guides/kak-prohodit-vyhod-v-buhtu-russkaya/', title: 'Как проходит выход в Бухту Русскую' },
  { path: '/guides/morskaya-progulka-s-detmi/', title: 'Морская прогулка с детьми' },
  { path: '/guides/kak-podgotovitsya-turistu-iz-moskvy/', title: 'Как подготовиться туристу из Москвы' },
  { path: '/guides/top-5-morskih-marshrutov-kamchatki/', title: 'Топ-5 морских маршрутов Камчатки' },
  { path: '/guides/fotootchet-sezona-i-luchshie-ulovy/', title: 'Фотоотчет сезона и лучшие уловы' }
]

export const ruOnlyPagePaths = new Set([
  ...ruOnlySeoLandingLinks.map((item) => item.path),
  ...ruOnlyInfoPageLinks.map((item) => item.path),
  ...ruOnlyGuideLinks.map((item) => item.path)
])
