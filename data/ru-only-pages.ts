export const ruOnlySeoLandingLinks = [
  { slug: 'krabovoe-safari-kamchatka', title: 'Крабовое сафари на Камчатке' },
  { slug: 'arenda-katera-kamchatka', title: 'Аренда катера на Камчатке для морского выхода' },
  { slug: 'morskie-progulki-petropavlovsk-kamchatskiy', title: 'Морские прогулки из Петропавловска-Камчатского' },
  { slug: 'morskie-progulki-kamchatka-2026', title: 'Морские прогулки на Камчатке в сезоне 2026' }
]

export const ruOnlyInfoPageLinks = [
  { slug: 'o-kompanii', title: 'Антур: морские прогулки и рыбалка на Камчатке' },
  { slug: 'bezopasnost-na-more', title: 'Безопасность на морских прогулках на Камчатке' }
]

export const ruOnlyPagePaths = new Set([
  ...ruOnlySeoLandingLinks.map((item) => `/${item.slug}`),
  ...ruOnlyInfoPageLinks.map((item) => `/${item.slug}`)
])
