import type { LocaleCode } from './i18n-base'

type RouteGroup = 'sea' | 'fishing'
type RouteSlug =
  | 'rybalka'
  | 'glubokovodnaya-rybalka'
  | 'buhta-russkaya'
  | 'ostrov-starichkov'
  | 'avachinskaya-buhta'

type RouteLinkRecord = {
  slug: RouteSlug
  group: RouteGroup
  matchSlugs: string[]
  titles: Record<LocaleCode, string>
  paths: Record<LocaleCode, string>
}

export type LocalizedRouteLink = {
  slug: RouteSlug
  group: RouteGroup
  matchSlugs: string[]
  title: string
  path: string
}

const routeLinkRecords: RouteLinkRecord[] = [
  {
    slug: 'rybalka',
    group: 'fishing',
    matchSlugs: ['rybalka', 'morskaya-rybalka'],
    titles: {
      ru: 'Прибрежная рыбалка в океане',
      en: 'Coastal ocean fishing',
      zh: '近海海钓'
    },
    paths: {
      ru: '/rybalka/morskaya-rybalka/',
      en: '/en/routes/rybalka/',
      zh: '/zh/routes/rybalka/'
    }
  },
  {
    slug: 'glubokovodnaya-rybalka',
    group: 'fishing',
    matchSlugs: ['glubokovodnaya-rybalka'],
    titles: {
      ru: 'Глубоководная рыбалка в океане',
      en: 'Deep-sea ocean fishing',
      zh: '深海海钓'
    },
    paths: {
      ru: '/rybalka/glubokovodnaya-rybalka/',
      en: '/en/routes/glubokovodnaya-rybalka/',
      zh: '/zh/routes/glubokovodnaya-rybalka/'
    }
  },
  {
    slug: 'buhta-russkaya',
    group: 'sea',
    matchSlugs: ['buhta-russkaya'],
    titles: {
      ru: 'Бухта Русская',
      en: 'Russkaya Bay',
      zh: '鲁斯卡亚湾'
    },
    paths: {
      ru: '/morskie-progulki/buhta-russkaya/',
      en: '/en/routes/buhta-russkaya/',
      zh: '/zh/routes/buhta-russkaya/'
    }
  },
  {
    slug: 'ostrov-starichkov',
    group: 'sea',
    matchSlugs: ['ostrov-starichkov'],
    titles: {
      ru: 'Остров Старичков',
      en: 'Starichkov Island',
      zh: '斯塔里奇科夫岛'
    },
    paths: {
      ru: '/morskie-progulki/ostrov-starichkov/',
      en: '/en/routes/ostrov-starichkov/',
      zh: '/zh/routes/ostrov-starichkov/'
    }
  },
  {
    slug: 'avachinskaya-buhta',
    group: 'sea',
    matchSlugs: ['avachinskaya-buhta'],
    titles: {
      ru: 'Авачинская бухта',
      en: 'Avacha Bay sightseeing tour',
      zh: '阿瓦恰湾观光游'
    },
    paths: {
      ru: '/morskie-progulki/avachinskaya-buhta/',
      en: '/en/routes/avachinskaya-buhta/',
      zh: '/zh/routes/avachinskaya-buhta/'
    }
  }
]

const localizeRouteLinks = (locale: LocaleCode): LocalizedRouteLink[] =>
  routeLinkRecords.map((item) => ({
    slug: item.slug,
    group: item.group,
    matchSlugs: item.matchSlugs,
    title: item.titles[locale],
    path: item.paths[locale]
  }))

export const routeLinksByLocale: Record<LocaleCode, LocalizedRouteLink[]> = {
  ru: localizeRouteLinks('ru'),
  en: localizeRouteLinks('en'),
  zh: localizeRouteLinks('zh')
}

export const getLocalizedRoutePathBySlug = (slug: string, locale: LocaleCode) =>
  routeLinkRecords.find((item) => item.slug === slug)?.paths[locale]

export const findRouteLinkByPath = (path: string, routeSlug = '') =>
  routeLinkRecords.find((item) =>
    item.matchSlugs.includes(routeSlug) ||
    Object.values(item.paths).includes(path)
  )
