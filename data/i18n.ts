import { getLocalizedRoutePath, getRouteOfferBySlug, routeOffers as ruRouteOffers } from './routes'
import { bookingTerms as ruBookingTerms, faq as ruFaq } from './site'
import { reviews as ruReviews, tourPhotos as ruTourPhotos } from './social-proof'
import type { Review, RouteOffer, TourPhoto } from '../types/content'

import { localizePath } from './i18n-base'
import type { LocaleCode } from './i18n-base'

export {
  defaultLocale,
  getLocaleFromPath,
  isLocaleCode,
  localeLabels,
  locales,
  localizedBusiness,
  localizePath,
  stripLocaleFromPath,
  ui,
  withTrailingSlash
} from './i18n-base'
export type { LocaleCode } from './i18n-base'

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
    description: 'A five-hour route to Starichkov Island: cliffs, seabirds, sea fishing, crab safari, freshly cooked crab and snacks on board.',
    highlights: ['Sea fishing', 'Crab safari', 'Freshly cooked crab', 'Snacks on board', 'Shared groups and boat charter', '5-hour route'],
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
    description: '前往斯塔里奇科夫岛的 5 小时路线：海岸岩石、海鸟、海钓、帝王蟹体验、现煮帝王蟹和船上小吃。',
    highlights: ['海钓', '帝王蟹体验', '现煮帝王蟹', '船上小吃', '可拼团或包船', '5 小时路线'],
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
  }
]

const enRouteDetails: Record<string, Partial<RouteOffer>> = {
  rybalka: {
    updatedAt: '2026-07-20',
    seoTitle: 'Kamchatka fishing charter | Coastal boat fishing | Antur',
    seoDescription: 'Private Kamchatka fishing charter from Petropavlovsk-Kamchatsky: 5 or 10 hours, tackle, crew support and space for up to 11 guests.',
    audience: [
      'First-time sea anglers who want crew support with tackle and fishing spots.',
      'Private groups of up to 11 guests looking for a flexible coastal fishing day.',
      'Travellers who want fishing without committing to the longer deep-sea route.'
    ],
    timeline: [
      { title: 'Meet at pier 2', text: 'We confirm the boarding time and meet at 39/2 Industrialnaya Street in Petropavlovsk-Kamchatsky.' },
      { title: 'Coastal fishing', text: 'The captain selects working areas for the actual wind, sea state and group experience; the crew helps with tackle.' },
      { title: 'Return to port', text: 'The 5-hour option suits a first trip, while 10 hours gives the group more time on the water.' }
    ],
    included: ['Private boat for the booked time', 'Captain and crew', 'Basic fishing tackle', 'Snacks on board'],
    notIncluded: ['Transfer to pier 2', 'Personal food and drinks', 'Extra charter time beyond the booked program'],
    bring: ['Windproof warm layer', 'Shoes with a non-slip sole', 'Personal seasickness medicine', 'Charged phone or camera'],
    weather: 'The captain checks the forecast and actual sea state. If the route is unsafe or uncomfortable, we discuss rescheduling or a calmer format.',
    children: 'Children can join when they are comfortable on the water and accompanied by an adult. A shorter trip is usually easier for a first sea experience.',
    meetingPoint: '39/2 Industrialnaya Street, first floor, pier 2, Petropavlovsk-Kamchatsky. The exact boarding time is confirmed after booking.',
    routeFaq: [
      { question: 'Is this a private Kamchatka fishing charter?', answer: 'Yes. The boat is booked for your group for 5 or 10 hours, with space for up to 11 guests.' },
      { question: 'Do I need fishing experience?', answer: 'No. The crew provides basic tackle, explains the setup and helps at the fishing spots.' },
      { question: 'Is a specific catch guaranteed?', answer: 'No. Species and catch depend on the day, depth, weather and selected fishing area.' }
    ]
  },
  'glubokovodnaya-rybalka': {
    updatedAt: '2026-07-20',
    seoTitle: 'Deep-sea fishing charter in Kamchatka | Antur',
    seoDescription: 'Deep-sea fishing charter from Petropavlovsk-Kamchatsky for up to 11 guests: farther ocean areas, 5 or 10 hours, tackle and crew support.',
    audience: ['Anglers who want more time at productive depths', 'Private groups prepared for a longer ocean day', 'Guests who already know they are comfortable offshore'],
    timeline: [
      { title: 'Weather and group check', text: 'Before boarding, the captain confirms wind, visibility, sea state and the experience of the group.' },
      { title: 'Run farther into the ocean', text: 'The route goes beyond the easier coastal format and is adjusted to conditions rather than a fixed point on a map.' },
      { title: 'Fishing at working depths', text: 'The crew prepares tackle and helps guests while the captain monitors conditions throughout the trip.' }
    ],
    included: ['Private boat charter', 'Captain and crew', 'Basic fishing tackle', 'Snacks on board'],
    notIncluded: ['Transfer to the boarding point', 'Guaranteed species or catch size', 'Hours beyond the selected charter'],
    bring: ['Warm waterproof outer layer', 'Non-slip footwear', 'Personal seasickness medicine', 'Dry layer for the return'],
    weather: 'Deep-sea fishing is more sensitive to wind and wave conditions. The captain may reschedule or suggest coastal fishing when the offshore route is not comfortable.',
    children: 'This format is better for older children and adults who already tolerate long sea trips. Families can start with coastal fishing or discuss another suitable format by phone.',
    meetingPoint: 'Pier 2 at 39/2 Industrialnaya Street, Petropavlovsk-Kamchatsky. Departure details are confirmed before the trip.',
    routeFaq: [
      { question: 'How is deep-sea fishing different from coastal fishing?', answer: 'It involves a farther run, working at greater depths and a fuller ocean day.' },
      { question: 'Can beginners book this charter?', answer: 'Yes, but guests should be ready for more time offshore. For a first trip, coastal fishing is usually easier.' },
      { question: 'Can weather change the route?', answer: 'Yes. Offshore safety takes priority, so the captain may shorten, move or reschedule the program.' }
    ]
  },
  'buhta-russkaya': {
    updatedAt: '2026-07-20',
    seoTitle: 'Russkaya Bay tour from Petropavlovsk-Kamchatsky | Prices | Antur',
    seoDescription: 'Ten-hour Russkaya Bay boat tour from Petropavlovsk-Kamchatsky with coastal scenery, fishing, lunch, a possible shore landing and seasonal prices.',
    audience: ['Travellers who want a full day rather than a short bay cruise', 'Guests choosing between a shared departure and a private boat', 'Groups interested in coast, fishing and lunch in one program'],
    timeline: [
      { title: 'Morning departure from Petropavlovsk-Kamchatsky', text: 'The group boards at the confirmed time and heads south-west along the Kamchatka coast.' },
      { title: 'Coastal passage', text: 'Cliffs, small bays and open water shape the route; wildlife may appear but is never guaranteed.' },
      { title: 'Russkaya Bay program', text: 'The plan includes fishing, lunch and a shore landing or crab activity when conditions allow.' },
      { title: 'Evening return', text: 'The boat returns to port after a full sea day of about 10 hours.' }
    ],
    included: ['Ten-hour sea route', 'Captain and crew', 'Fishing', 'Snacks and full lunch', 'Shore landing and crab activity when safe'],
    notIncluded: ['Transfer to the pier', 'Alcohol and personal extras', 'Activities cancelled because of unsafe conditions'],
    bring: ['Windproof warm clothing', 'Comfortable deck footwear', 'Seasickness medicine if needed', 'A spare dry layer'],
    weather: 'Russkaya Bay is a long ocean route. Wind or waves can lead to a change of date or a calmer alternative.',
    children: 'Suitable for children who already tolerate a long day on the water. A suitable format for younger children should be discussed by phone in advance.',
    meetingPoint: 'Antur, 39/2 Industrialnaya Street, pier 2, Petropavlovsk-Kamchatsky. Boarding time is confirmed when booking.',
    routeFaq: [
      { question: 'How do I reach Russkaya Bay?', answer: 'The tourist route goes by boat from Petropavlovsk-Kamchatsky. Transfer to pier 2 is not included.' },
      { question: 'Can I join without advance booking?', answer: 'Do not rely on walk-in availability. Shared departures depend on open seats, group formation and weather.' },
      { question: 'What is the 2026 price?', answer: 'A shared place costs 15,000 ₽ in May-June and 18,000 ₽ in July-September. Private charter prices are shown in the price table.' }
    ]
  },
  'ostrov-starichkov': {
    updatedAt: '2026-07-27',
    seoTitle: 'Starichkov Island boat tour in Kamchatka | Antur',
    seoDescription: 'Five-hour Starichkov Island boat tour from Petropavlovsk-Kamchatsky with cliffs, seabirds, sea fishing, snacks and freshly cooked crab.',
    audience: ['Visitors who want more than a short sightseeing loop but not a ten-hour route', 'Families comfortable with five hours at sea', 'Guests interested in cliffs, seabirds, fishing and freshly cooked crab'],
    timeline: [
      { title: 'Leave Avacha Bay', text: 'The route starts in Petropavlovsk-Kamchatsky and passes the coastal landmarks toward open water.' },
      { title: 'Approach Starichkov Island', text: 'Guests view cliffs and seabird habitat from a respectful distance selected by the captain.' },
      { title: 'Fishing and snacks on board', text: 'Fishing, snacks and freshly cooked crab form the practical middle part of the five-hour program.' }
    ],
    included: ['Five-hour route', 'Captain and crew', 'Sea fishing', 'Snacks on board', 'Freshly cooked crab'],
    notIncluded: ['Transfer to the pier', 'Guaranteed wildlife sightings', 'Extra charter time'],
    bring: ['Warm windproof layer', 'Non-slip footwear', 'Camera with charged battery', 'Personal seasickness medicine'],
    weather: 'The captain confirms whether open-water conditions are suitable. The route can be adjusted or moved to another date.',
    children: 'Many families choose this middle-length route, but the final decision should reflect the child’s sea experience and weather.',
    meetingPoint: 'Pier 2, 39/2 Industrialnaya Street, Petropavlovsk-Kamchatsky. We confirm departure time before boarding.',
    routeFaq: [
      { question: 'Is Starichkov Island a landing tour?', answer: 'The route focuses on views from the water. The captain chooses a safe distance from cliffs and wildlife areas.' },
      { question: 'Are fishing and crab included?', answer: 'They are part of the published program, subject to weather, sea state and safe operating conditions.' },
      { question: 'Is five hours suitable for a first trip?', answer: 'For many guests it is a balanced option. Those worried about seasickness should discuss the conditions and suitable format with us before booking.' }
    ]
  }
}

const zhRouteDetails: Record<string, Partial<RouteOffer>> = {
  rybalka: {
    updatedAt: '2026-07-20',
    seoTitle: '堪察加包船海钓｜彼得罗巴甫洛夫斯克出发｜Antur',
    seoDescription: '从彼得罗巴甫洛夫斯克-堪察加出发的近海包船钓鱼：5 或 10 小时，最多 11 人，提供基础钓具和船员协助。',
    audience: ['第一次体验俄罗斯海钓、需要船员协助的客人', '希望整船出行、人数不超过 11 人的团队', '想先体验较短近海路线的家庭或朋友'],
    timeline: [
      { title: '在 2 号码头集合', text: '预订后确认时间，在彼得罗巴甫洛夫斯克-堪察加工业街 39/2 登船。' },
      { title: '按当天海况选择钓点', text: '船长会结合风浪、能见度和团队经验选择近海区域，船员提供基础钓具并协助操作。' },
      { title: '返回港口', text: '5 小时适合首次体验，10 小时则能在海上安排更充足的钓鱼时间。' }
    ],
    included: ['预订时段内的包船', '船长和船员服务', '基础海钓钓具', '船上小吃'],
    notIncluded: ['前往码头的接送', '个人食品和饮品', '超出预订时段的包船时间'],
    bring: ['防风保暖外套', '防滑鞋', '个人常用晕船药', '充好电的手机或相机'],
    weather: '船长会检查天气预报和实际海况。如不适合安全出海，会沟通改期或选择更平稳的形式。',
    children: '儿童适应海上环境并有成人陪同时可以参加。第一次出海通常建议先选较短时长。',
    meetingPoint: '彼得罗巴甫洛夫斯克-堪察加，工业街 39/2，一层，2 号码头。登船时间会在预订后确认。',
    routeFaq: [
      { question: '这是私人包船海钓吗？', answer: '是。可按团队预订 5 或 10 小时，最多 11 人。' },
      { question: '没有钓鱼经验可以吗？', answer: '可以。船员会提供基础钓具、讲解使用方法并在钓点协助。' },
      { question: '能保证钓到某种鱼吗？', answer: '不能。鱼种和收获取决于当天钓点、深度、天气和海况。' }
    ]
  },
  'glubokovodnaya-rybalka': {
    updatedAt: '2026-07-20',
    seoTitle: '堪察加深海包船钓鱼｜Antur',
    seoDescription: '从彼得罗巴甫洛夫斯克-堪察加出发的深海钓鱼包船：更远海域、5 或 10 小时、最多 11 人，提供基础钓具。',
    audience: ['希望在更深水域投入更多钓鱼时间的客人', '能适应较长远海行程的私人团队', '已经有出海经验并明确以钓鱼为目的的旅行者'],
    timeline: [
      { title: '出发前确认海况', text: '船长会确认风、浪、能见度和团队情况，再决定是否适合远海。' },
      { title: '驶向更远钓点', text: '路线比近海钓鱼更深入太平洋，具体方向会根据当天条件调整。' },
      { title: '在工作水深钓鱼', text: '船员准备基础钓具并协助客人，船长持续关注天气变化。' }
    ],
    included: ['私人包船', '船长和船员', '基础钓具', '船上小吃'],
    notIncluded: ['前往集合点的接送', '保证特定鱼种或收获重量', '超出所选时长的额外时间'],
    bring: ['防水保暖外层', '防滑鞋', '个人晕船药', '备用干燥衣物'],
    weather: '深海路线更受风浪影响。如远海条件不舒适，船长可能建议改期或改为近海钓鱼。',
    children: '更适合已经适应长时间出海的成年人和较大儿童。带年幼儿童出海前请先电话沟通合适的形式。',
    meetingPoint: '彼得罗巴甫洛夫斯克-堪察加工业街 39/2，2 号码头。出发细节会提前确认。',
    routeFaq: [
      { question: '深海钓鱼和近海钓鱼有什么区别？', answer: '深海路线航行更远、工作水深更大，整体海上时间和体力要求也更高。' },
      { question: '新手可以预订吗？', answer: '可以，但需要做好更长远海行程的准备。首次体验通常更适合近海形式。' },
      { question: '天气会改变路线吗？', answer: '会。安全优先，船长可以缩短、调整或改期。' }
    ]
  },
  'buhta-russkaya': {
    updatedAt: '2026-07-20',
    seoTitle: '堪察加鲁斯卡亚湾一日船游｜价格与路线｜Antur',
    seoDescription: '从彼得罗巴甫洛夫斯克-堪察加前往鲁斯卡亚湾的 10 小时海上行程：海岸风景、钓鱼、午餐、视条件上岸及季节价格。',
    audience: ['希望体验完整海上一天而不是短途观光的客人', '在拼团和私人包船之间选择的团队', '希望一次包含海岸景色、钓鱼和午餐的旅行者'],
    timeline: [
      { title: '早晨从城市出发', text: '在确认时间登船，沿堪察加海岸向鲁斯卡亚湾方向航行。' },
      { title: '海岸航行', text: '沿途可见岩壁、小海湾和外海景色；野生动物可能出现，但不能保证。' },
      { title: '鲁斯卡亚湾行程', text: '计划包括钓鱼、午餐，并在条件允许时安排上岸或帝王蟹体验。' },
      { title: '傍晚返回', text: '完整海上行程约 10 小时，傍晚返回港口。' }
    ],
    included: ['10 小时海上路线', '船长和船员', '钓鱼', '小吃和完整午餐', '安全条件允许时上岸及帝王蟹体验'],
    notIncluded: ['前往码头的接送', '酒精饮品和个人消费', '因安全条件取消的可选活动'],
    bring: ['防风保暖衣物', '适合甲板的鞋', '需要时携带晕船药', '备用干燥衣物'],
    weather: '鲁斯卡亚湾属于较长外海路线。风浪不合适时会改期或建议更平稳的替代路线。',
    children: '适合已经能适应长时间海上活动的儿童。带年幼儿童出海前请先电话沟通合适的形式。',
    meetingPoint: 'Antur：彼得罗巴甫洛夫斯克-堪察加工业街 39/2，2 号码头。预订时确认登船时间。',
    routeFaq: [
      { question: '怎样从彼得罗巴甫洛夫斯克前往鲁斯卡亚湾？', answer: '旅游路线从城市乘船前往。到 2 号码头的接送不包含在价格内。' },
      { question: '不提前预订可以参加吗？', answer: '不建议依赖现场名额。拼团出发取决于空位、成团和天气。' },
      { question: '2026 年价格是多少？', answer: '5—6 月拼团 15,000 ₽ / 人，7—9 月 18,000 ₽ / 人；包船价格见页面价目表。' }
    ]
  },
  'ostrov-starichkov': {
    updatedAt: '2026-07-27',
    seoTitle: '堪察加斯塔里奇科夫岛船游｜Antur',
    seoDescription: '从彼得罗巴甫洛夫斯克出发的 5 小时斯塔里奇科夫岛海上路线：海岸岩石、海鸟、海钓、船上小吃和现煮帝王蟹。',
    audience: ['希望比短途观光更丰富、又不想参加 10 小时行程的客人', '能适应 5 小时海上活动的家庭', '关注岩石、海鸟、钓鱼和现煮帝王蟹的旅行者'],
    timeline: [
      { title: '驶出阿瓦恰湾', text: '从彼得罗巴甫洛夫斯克出发，经过海岸标志性景观进入外海。' },
      { title: '接近斯塔里奇科夫岛', text: '船长会选择尊重海鸟栖息地并符合海况的观察距离。' },
      { title: '钓鱼和船上小吃', text: '海钓、船上小吃和现煮帝王蟹构成 5 小时行程的重要部分。' }
    ],
    included: ['5 小时路线', '船长和船员', '海钓', '船上小吃', '现煮帝王蟹'],
    notIncluded: ['前往码头的接送', '保证看到野生动物', '额外包船时间'],
    bring: ['防风保暖层', '防滑鞋', '充好电的相机', '个人晕船药'],
    weather: '船长会确认外海条件是否适合。路线可能调整或改期。',
    children: '许多家庭会选择这条中等时长路线，但仍需结合孩子的出海经验和当天海况。',
    meetingPoint: '彼得罗巴甫洛夫斯克-堪察加工业街 39/2，2 号码头。登船时间提前确认。',
    routeFaq: [
      { question: '会登上斯塔里奇科夫岛吗？', answer: '路线以海上观察为主，船长会选择远离岩壁和野生动物区域的安全距离。' },
      { question: '钓鱼和帝王蟹包含吗？', answer: '属于公布的行程内容，但仍取决于天气、海况和安全条件。' },
      { question: '5 小时适合第一次出海吗？', answer: '对许多客人来说是平衡选择；担心晕船时请在预订前电话沟通当天海况和合适形式。' }
    ]
  }
}

const applyRouteDetails = (offers: RouteOffer[], details: Record<string, Partial<RouteOffer>>) =>
  offers.map((offer) => ({ ...offer, ...details[offer.slug] }))

export const routeOffersByLocale: Record<LocaleCode, RouteOffer[]> = {
  ru: ruRouteOffers,
  en: applyRouteDetails(enRouteOffers, enRouteDetails),
  zh: applyRouteDetails(zhRouteOffers, zhRouteDetails)
}

export const faqByLocale = {
  ru: ruFaq,
  en: [
    {
      question: 'When is the departure decision made, and what happens in bad weather?',
      answer: 'The captain makes the final decision one day before departure. Wind, high waves or precipitation may change the route or date, and guests are notified the day before.'
    },
    {
      question: 'If the trip is cancelled because of weather, do I lose the prepayment?',
      answer: 'No. We first agree on another date or route. If neither option works, we return the prepayment within one day or on the next business day.'
    },
    {
      question: 'What documents are required for the trip?',
      answer: 'Each passenger needs a passport. There are no customs procedures or separate restrictions for foreign guests. Contact Antur at least one day in advance so the team can handle the necessary clearances.'
    },
    {
      question: 'Can I join without fishing experience?',
      answer: 'Yes. The crew will explain the tackle and help on board. You can come for your first sea fishing trip or choose a more serious deep-sea format.'
    },
    {
      question: 'What if I get seasick?',
      answer: 'Tell us in advance and bring your usual seasickness medicine. Call us before booking so we can discuss the conditions and a suitable trip format.'
    },
    {
      question: 'What food or treats are included?',
      answer: 'Fishing and crab safari trips include snacks on board. On Starichkov Island, we serve snacks and freshly cooked crab on board. Russkaya Bay includes snacks and a full lunch. You can bring personal food and drinks additionally.'
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
      answer: 'Yes. A 1,000 ₽ prepayment reserves a seat. Guests may cancel at any time, but the prepayment is not refunded when the guest cancels. We state this condition in the booking message.'
    },
    {
      question: 'Are whales and orcas guaranteed?',
      answer: 'No, this is wildlife. Routes pass through waters where sightings are possible, but whales or orcas cannot be promised.'
    },
    {
      question: 'What is the fastest way to book?',
      answer: 'A manager takes calls 24 hours a day. If we miss your call, message us on WhatsApp or MAX so we can confirm the date, route and current price.'
    }
  ],
  zh: [
    {
      question: '何时决定是否出海，天气不好怎么办？',
      answer: '船长会在出发前一天作出最终决定。风、大浪或降水可能导致改线或改期，我们会在前一天通知客人。'
    },
    {
      question: '如果因天气取消出海，预付款会损失吗？',
      answer: '不会。我们会先协商新的日期或其他路线；如都不合适，会在一天内或下一个工作日退还预付款。'
    },
    {
      question: '出海需要哪些证件？',
      answer: '每位乘客都需要护照。客人无需办理海关手续，外国客人也没有单独限制。请至少提前一天联系 Antur，由团队办理所需协调。'
    },
    {
      question: '没有钓鱼经验可以参加吗？',
      answer: '可以。船员会讲解钓具并在船上协助。可以作为第一次海钓体验，也可以选择更深入的深海钓鱼形式。'
    },
    {
      question: '如果晕船怎么办？',
      answer: '请提前告知，并携带自己常用的晕船药。预订前请来电沟通当天海况和合适的出海形式。'
    },
    {
      question: '餐食和招待包含什么？',
      answer: '海钓和帝王蟹体验行程包含船上小吃。斯塔里奇科夫岛行程会提供小吃和船上现煮帝王蟹。鲁斯卡亚湾包含小吃和完整午餐。也可以额外自带个人食品和饮品。'
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
      answer: '需要。预留名额需支付 1,000 ₽ 预付款。客人可以随时取消，但因客人主动取消时预付款不退；该条件会写在预订消息中。'
    },
    {
      question: '一定能看到鲸鱼或虎鲸吗？',
      answer: '不能保证，这是野生自然环境。路线会经过有机会遇见鲸鱼或虎鲸的海域，但无法承诺一定出现。'
    },
    {
      question: '最快怎样预订？',
      answer: '经理全天 24 小时接听电话。如未接通，请通过 WhatsApp 或 MAX 留言，以便确认日期、路线和当前价格。'
    }
  ]
}

export const bookingTermsByLocale = {
  ru: ruBookingTerms,
  en: [
    'Children under 5 join free of charge when accompanied by parents or responsible adults.',
    'Birthday guests, children under 12, and repeat or next-trip bookings receive a 10% discount.',
    'A 1,000 ₽ prepayment is required to reserve a seat. Guests may cancel at any time, but the prepayment is not refunded when the guest cancels. We state this condition in the booking message.',
    'If weather cancels the trip, we first agree on another date or route. If neither option works, we return the prepayment within one day or on the next business day.',
    'All passengers and crew members are insured.'
  ],
  zh: [
    '5 岁以下儿童在父母或负责人陪同下免费。',
    '生日客人、12 岁以下儿童，以及再次预订或下一次行程可享 10% 优惠。',
    '预留名额需支付 1,000 ₽ 预付款。客人可以随时取消，但因客人主动取消时预付款不退；该条件会写在预订消息中。',
    '如因天气取消，会先协商改期或其他路线；如都不合适，会在一天内或下一个工作日退还预付款。',
    '所有乘客和船员均已投保。'
  ]
} satisfies Record<LocaleCode, string[]>

// Переводы отзывов ключуются по id (не по индексу), чтобы добавление или
// переупорядочивание ruReviews не ломало соответствие переводов.
const reviewText: Record<Exclude<LocaleCode, 'ru'>, Record<string, { name: string, route: string, text: string, source?: string }>> = {
  en: {
    'review-yandex-021': { name: 'Skripnikova I.', route: 'Russkaya Bay', source: 'Yandex Maps', text: 'Our fantastic trip with Antur will stay with me forever. I chose the Russkaya Bay tour and loved everything. The organization was first-class.' },
    'review-yandex-018': { name: 'Ilona', route: 'Sea tour', source: 'Yandex Maps', text: 'It was such a warm, heartfelt trip. Thank you so much. Whales, nature and fishing — it had everything.' },
    'review-yandex-019': { name: 'Anna', route: 'Russkaya Bay', source: 'Yandex Maps', text: 'Yesterday, 9 August, we took a trip to Russkaya Bay — it was excellent. A huge thank you to captain Alexander and Marina for a wonderful day. We saw whales, sea lions and a family of sea otters. I especially want to mention the lunch landing: the place is incredible. Simply amazing, with so many emotions. Highly recommended.' },
    'review-yandex-020': { name: 'Protsenko S.', route: 'Sea tour', source: 'Yandex Maps', text: 'A huge thank you to Alexander for yesterday’s sea trip. Everything was fantastic and I really enjoyed it. I will recommend you to all my friends and acquaintances.' },
    'review-yandex-017': { name: 'Evgeniya Chudakova', route: 'Starichkov Island', source: 'Yandex Maps', text: 'Today we had a very interesting and eventful trip to Starichkov Island on a cosy, comfortable boat with a wonderful captain. We learned and saw many new things and enjoyed a delicious meal. The whole family was delighted. Alexander, from now on we will only take sea trips with you.' },
    'review-yandex-016': { name: 'Elena Zadorozhnayay', route: 'Starichkov Island', source: 'Yandex Maps', text: 'Today my family and I took a wonderful Antur sea trip to Starichkov Island. From the morning we were welcomed with a thoughtfully prepared breakfast and fragrant ginger tea. The boat was clean and tidy, with a cosy, intimate atmosphere. Special thanks to captain Alexander: he is not only a professional who knows the bay, he loves his work and shares that passion with his guests. Many thanks to Alexander and the whole team for a wonderful adventure.' },
    'review-yandex-015': { name: 'Vera P.', route: 'Starichkov Island', source: 'Yandex Maps', text: 'I took an Antur sea trip to Starichkov Island on 28 July 2026. Everything was wonderful! The boat was clean and new, with a warm enclosed cabin and large panoramic windows. We prepared the crab pots ourselves and went fishing — everyone had a catch. Then we heard that orcas had entered the bay and set off on a real photo hunt. The captain explained and showed us everything. The trip ended with freshly cooked crab and a delicious dinner. It all felt warm and welcoming. The captain is a true professional who clearly loves his work. I highly recommend Antur.' },
    'review-yandex-013': { name: 'Anna K.', route: 'Sea tour', source: 'Yandex Maps', text: 'Thank you for an excellent trip! We loved being able to see all the beautiful places up close. We saw animals and birds, caught crab and enjoyed a delicious meal. Anyone who wants to fish can use the spinning rods on board. We also listened to an audio tour with details about the sights. We recommend this wonderful day at sea.' },
    'review-yandex-012': { name: 'Irina', route: 'Sea tour', source: 'Yandex Maps', text: 'Thank you for a wonderful trip! We rested both body and soul. The beauty is indescribable. Excellent service, a delicious lunch, and interesting, heartfelt stories from the captain. Definitely recommended!' },
    'review-yandex-014': { name: 'Tatyana', route: 'Sea tour', source: 'Yandex Maps', text: 'I want to express my heartfelt thanks to Marina and captain Alexander for this wonderful opportunity to take a sea trip. We had great company and the best crab and fish catchers. We enjoyed an amazing journey and a delicious lunch. Thank you so much for a wonderful day.' },
    'review-yandex-010': { name: 'Romanovdv19960811', route: 'Sea tour', source: 'Yandex Maps', text: 'A wonderful sea trip aboard the Antur boat! Captain Alexander is a master of his craft and a genuinely warm person. He taught us how to catch crab and fish, then cooked the crab superbly — the whole group ate their fill. He showed us wonderful places other guides never reach, and even found orcas, which were not part of the programme. Huge thanks for the organization! We recommend it to everyone, you will not regret it.' },
    'review-2gis-025': { name: 'Anzhela', route: 'Sea tour', source: '2GIS', text: 'Everything was wonderful, I recommend it! The captain is attentive, the trip is truly exciting, we caught fish and crab and enjoyed the beautiful views of our marvellous Kamchatka.' },
    'review-yandex-011': { name: 'Svetlana B.', route: 'Sea tour', source: 'Yandex Maps', text: 'I highly recommend a sea trip with Alexander and Marina. The scenery we passed was unforgettable, we caught crab and fish ourselves — that thrill is impossible to describe. Alexander is an excellent guide, and special thanks to Marina for the service: the boat had everything for snacks. A wonderful trip, I really recommend Antur. Svetlana and Olga.' },
    'review-yandex-009': { name: 'Elena P.', route: 'Sea tour', source: 'Yandex Maps', text: 'We absolutely loved the trip! We have been out at sea many times, but this one was simply the best. The captain is a true professional and a wonderful storyteller, and the atmosphere was genuinely warm. Our friends from Krasnodar are still impressed and say it was the best thing they saw in Kamchatka.' },
    'review-yandex-001': { name: 'Victoria K.', route: 'Sea tour', source: 'Yandex Maps', text: 'Many thanks to ANTUR and our wonderful captain Alexander for a sea of positive impressions, beautiful views, emotions and treats. Everything went wonderfully!' },
    'review-yandex-002': { name: 'Zhanna M.', route: 'Sea tour', source: 'Yandex Maps', text: 'A huge thank you to Alexander for the sea journey — everything went superbly! Everything was organized at the highest level and thought through to the smallest detail, an engaging route and stunning local nature. Kamchatka won our hearts!' },
    'review-yandex-003': { name: 'Yulia Nikolaeva', route: 'Sea tour', source: 'Yandex Maps', text: 'We really enjoyed the sea trip! Great service and an attentive captain. We admired the views and ate well. Many thanks for the emotions, I recommend it to everyone!' },
    'review-yandex-004': { name: 'Anastasia N.', route: 'Russkaya Bay', source: 'Yandex Maps', text: 'Huge thanks to Marina and Alexander for the chance to take this sea trip. We enjoyed the beauty, heard the legends, rested in body and soul — and most importantly, I became a bride on board the Antur boat! Thank you so much for the help with the arrangements, the hospitality, the warm atmosphere and the incredible impressions. We will definitely come back!' },
    'review-yandex-005': { name: 'Ludmila Ruban', route: 'Russkaya Bay', source: 'Yandex Maps', text: 'Kamchatka can be rediscovered endlessly. Our sea trip on 9 July 2026 aboard Antur to Russkaya Bay was wonderful, with the experienced captain Alexander. Everything was honest and clear: insurance, fishing, lunch with fish soup, pancakes for snacks and fish sandwiches. He showed us the beauty of Avacha Bay and its smaller coves, the Three Brothers rocks and Starichkov Island. We saw seabird colonies, orcas, sea otters and sea lions. Sunlight followed the snow-white ridgelines throughout the trip. Memories for a lifetime. Many thanks to Alexander and Marina for a wonderful day. Ludmila and Vika.' },
    'review-yandex-007': { name: 'Valentina Sorokina', route: 'Sea tour', source: 'Yandex Maps', text: 'There is one huge downside: I cannot afford to do this as often as I would like. Everything else is a plus. Alexander, the captain, and Marina, the deckhand, are the biggest pluses. Wonderful company, good weather and very beautiful locations. Crab hunting and a crab feast by the cliffs. There is too much to tell. We loved it and sincerely wish everyone the same experience!' },
    'review-yandex-008': { name: 'Olga M.', route: 'Sea tour', source: 'Yandex Maps', text: 'This was my best sea journey! So many beautiful places and photos, plus incredibly delicious fresh crab. Highly recommended!' },
    'review-2gis-001': { name: 'Oleg Filimonenko', route: 'Coastal fishing', source: '2GIS', text: 'Thanks to the captain of ANTUR for an exciting trip and fishing!' },
    'review-2gis-002': { name: 'Pavel Pavlovsky', route: 'Coastal fishing', source: '2GIS', text: 'We went sea fishing as a group of 6 and were very happy with it. We caught many kinds of fish: flounder, cod, halibut, pollock, greenling and of course sculpin. The crab safari simply delighted us — we ate our fill of crab and even took some home. Alexander is an experienced captain, there was no reason to worry: he told us many interesting things and showed us beautiful places. The boat is brand new, very spacious, with a restroom and a comfortable saloon with panoramic windows. Huge thanks to Alexander for an awesome fishing trip!' },
    'review-2gis-003': { name: 'Alexander Basalaev', route: 'Coastal fishing', source: '2GIS', text: 'My wife and I went fishing with Alexander, the captain of a very comfortable boat. A very communicative, responsible and caring person. He knows the fishing spots perfectly: we reached the point and the bites started one after another. There was a lot of cod, greenling and perch, with some flounder and Atka mackerel too. I definitely recommend Alexander and his boat for fishing and more — he runs sightseeing trips to scenic places beyond the bay gates, including Russkaya Bay.' },
    'review-2gis-004': { name: 'Egor Kiselev', route: 'Deep-sea fishing', source: '2GIS', text: 'Our fishing trip went just wonderfully: the captain, the boat and the tackle were all top notch. The atmosphere was very friendly, and the stories about Kamchatka added a special flavor. Alexander proved himself a true professional: he helped everyone and showed how to set up the tackle properly. The fish bit with incredible frequency, sometimes two at once. At the end the captain estimated the catch — no less than fifty kilograms. I definitely recommend it to anyone who wants a great time and to enjoy nature!' },
    'review-2gis-005': { name: 'Sergey Smyvalov', route: 'Deep-sea fishing', source: '2GIS', text: 'The fishing and the route itself beyond the gates of Avacha Bay are pure excitement and delight! A convenient route, a comfortable boat, everything thought through to the smallest detail. The bites are so good you forget about everything. Plus gorgeous views and the most delicious seafood, cooked in the fresh air right on board. It is definitely worth trying for everyone. Thank you, Alexander!' },
    'review-2gis-006': { name: 'Zhanslu Zh.I.', route: 'Sea tour', source: '2GIS', text: 'A wonderful sea trip! A sea of emotions and impressions! Thank you Alexander — a very responsive and positive person; I got a sea of emotions not only from the beautiful places but also from the good company. We reached the Three Brothers rocks, the Devil\'s Finger, Tikhaya Bay and much more. There are different routes to choose from. Thank you again for a wonderful sea trip.' },
    'review-2gis-007': { name: 'Daria Grigorchuk', route: 'Sea tour', source: '2GIS', text: 'Thank you so much, we loved everything! Captain Alexander led the excursion wonderfully. Very beautiful places — I recommend everyone to visit here.' },
    'review-2gis-008': { name: 'Marlena Ohannisyan', route: 'Starichkov Island', source: '2GIS', text: 'A new Antur boat, a warm-hearted captain, tasty treats, a splendid trip to the beautiful views of Kamchatka! Fishing and a fresh catch — every pleasure guaranteed. The warm welcome and kindness of the Antur team are impressive. Thank you, captain Alexander, for our journey!' },
    'review-2gis-009': { name: 'Irina Grishchenko', route: 'Starichkov Island', source: '2GIS', text: 'We went on the sea trip with our close-knit group of girls. We were very happy! The new small cozy boat is just perfect for your own company. Sea air, beautiful scenery, the sounds of water and birds — the best way to escape the city bustle. A hospitable captain with great experience. We were treated to freshly caught delicacies: crab and sea urchin roe, aromatic tea, coffee and snacks. Highly recommend!' },
    'review-2gis-010': { name: 'Ilya Grishchenko', route: 'Russkaya Bay', source: '2GIS', text: 'We went on the Antur. The boat is small, for 11 people — just right, no crowding, everyone fit comfortably. The nature is unreal: cliffs, water, birds. The captain did great, brought us close to the shore and showed all the beautiful spots. The fishing was a joy — we cast and it started right away, everyone came back with a catch. And the crabs — delicious, boiled fresh, eaten right on deck. If you want to get out to sea without fuss and with purpose, Antur is a good choice.' },
    'review-2gis-011': { name: 'Anastasia Staritsyna', route: 'Russkaya Bay', source: '2GIS', text: 'It was a real adventure that exceeded all expectations. From the very start you could feel the captain\'s professionalism. The fishing and crabbing themselves were top notch — we came back with an amazing catch. But the main thing is the atmosphere of warmth and care: breakfast and lunch were simply magnificent, real home cooking in the middle of the sea. The highlight was the crab cooked by Alexander himself. Huge thanks for this unforgettable day!' },
    'review-2gis-012': { name: 'Aynura', route: 'Sea tour', source: '2GIS', text: 'The trip was wonderful, it was unforgettable! In a few hours I saw stunning views. Wind in the face, spray of the waves, cries of the gulls — a feeling of complete freedom. The boat maneuvered skillfully between the cliffs, with not a soul around, just nature. The boat is comfortable, the captain a professional with a sense of humor. Thank you for the emotions! I definitely recommend it!' },
    'review-2gis-013': { name: 'Irina R.', route: 'Sea tour', source: '2GIS', text: 'We happened to set off on a sea journey — it was the most unforgettable impressions and vivid emotions. A clean, comfortable vessel, a friendly atmosphere and very tasty treats. We were incredibly lucky with the weather: we saw the beauty of Kamchatka, wild birds and sea creatures, and enjoyed it to the fullest. We are grateful to you for this wonderful day!' },
    'review-2gis-014': { name: 'Maxim Shishkanov', route: 'Russkaya Bay', source: '2GIS', text: 'If you are planning a sea trip in Kamchatka, go with the Antur team. Our trip to Russkaya Bay exceeded every expectation. Kamchatka’s nature is unreal, and this level of organization makes the journey pure enjoyment.' },
    'review-2gis-015': { name: 'Ekaterina', route: 'Sea tour', source: '2GIS', text: 'We had a free day, and Alexander quickly arranged a wonderful trip to the Three Brothers rocks. Everything was excellent!' },
    'review-2gis-016': { name: 'Valentina Sorokina', route: 'Sea tour', source: '2GIS', text: 'This was an incredible trip. Everything was amazing: Marina, Alexander, our wonderful group, the gulls, fish and crab. I want to go again!' },
    'review-2gis-017': { name: 'Vasily Vasilyevich', route: 'Sea tour', source: '2GIS', text: 'An excellent holiday. The captain is a true professional and guide in one. A fast boat, beautiful views and a warm welcome on board.' },
    'review-2gis-018': { name: 'Irina', route: 'Sea tour', source: '2GIS', text: 'A clean, cozy boat with everything needed for fishing and relaxation. The views are mesmerizing. The trip gave us wonderful photos and emotions.' },
    'review-2gis-019': { name: 'Zen Gi Kim', route: 'Sea tour', source: '2GIS', text: 'Alexander, thank you for yesterday’s trip to the Three Brothers. It was wonderful!' },
    'review-2gis-020': { name: 'Ekaterina Belousova', route: 'Sea tour', source: '2GIS', text: 'Alexander, thank you. A wonderful sea trip, delicious tea, interesting stories and a great excursion. I will recommend it to everyone!' },
    'review-2gis-021': { name: 'City resident', route: 'Sea tour', source: '2GIS', text: 'The trip was excellent! Professionalism and customer care were at the highest level. Thank you.' },
    'review-2gis-022': { name: 'Stanislav Gerus', route: 'Sea tour', source: '2GIS', text: 'Alexander, thank you very much!' },
    'review-2gis-023': { name: 'Ivan Poletakhin', route: 'Coastal fishing', source: '2GIS', text: 'We had a great time. We will go again on Saturday. We caught a lot of fish and my wife was happy!' },
    'review-2gis-024': { name: 'Alexey Vishnyakov', route: 'Coastal fishing', source: '2GIS', text: 'Excellent fishing. Everything was first-class. Thank you, Alexander!' }
  },
  zh: {
    'review-yandex-021': { name: 'Skripnikova I.', route: '鲁斯卡亚湾', source: 'Yandex 地图', text: '这次精彩的 Antur 行程会永远留在我的记忆中。我选择了鲁斯卡亚湾路线，一切都很喜欢，组织安排非常专业。' },
    'review-yandex-018': { name: 'Ilona', route: '海上观光', source: 'Yandex 地图', text: '这是一次温暖又真诚的行程，非常感谢。鲸鱼、自然风光和钓鱼全都体验到了。' },
    'review-yandex-019': { name: 'Anna', route: '鲁斯卡亚湾', source: 'Yandex 地图', text: '昨天 8 月 9 日，我们参加了前往鲁斯卡亚湾的行程，体验非常棒。非常感谢 Alexander 船长和 Marina 带来美好的一天。我们看到了鲸鱼、海狮和一家海獭。尤其值得一提的是上岸午餐的地点，那里美得不可思议，带来了满满的感动。非常推荐。' },
    'review-yandex-020': { name: 'Protsenko S.', route: '海上观光', source: 'Yandex 地图', text: '非常感谢 Alexander 带领我们参加昨天的海上之行。一切都很棒，我非常喜欢。我会把你们推荐给所有朋友和熟人。' },
    'review-yandex-017': { name: '叶夫根尼娅·丘达科娃', route: '斯塔里奇科夫岛', source: 'Yandex 地图', text: '今天我们乘坐舒适温馨的船，在一位出色船长的带领下前往斯塔里奇科夫岛，行程丰富又有趣。我们看到了许多新鲜事物，也学到了很多，还享用了美味的餐食。全家人都非常满意。Alexander，以后我们的海上之行只选择你们。' },
    'review-yandex-016': { name: 'Elena Zadorozhnayay', route: '斯塔里奇科夫岛', source: 'Yandex 地图', text: '今天我和家人乘坐 Antur 前往斯塔里奇科夫岛，度过了一次美好的海上之行。一早迎接我们的是精心准备的早餐和香气四溢的姜茶。船上干净整洁，氛围舒适而温馨。特别感谢 Alexander 船长：他不仅是熟悉海湾的专业人士，更真心热爱自己的工作，并把这份热爱传递给客人。感谢 Alexander 和整个团队带来这次精彩的体验。' },
    'review-yandex-015': { name: '维拉 P.', route: '斯塔里奇科夫岛', source: 'Yandex 地图', text: '2026 年 7 月 28 日，我乘坐 Antur 前往斯塔里奇科夫岛。一切都非常精彩！船只干净崭新，有温暖的封闭船舱和大型全景窗。我们亲手准备蟹笼并钓鱼，每个人都有收获。后来听说虎鲸进入海湾，我们又开始了一场真正的摄影追踪。船长一路讲解并指引我们观察。行程以刚煮好的帝王蟹和美味晚餐收尾，氛围非常温馨。船长是真正的专业人士，能看出他真心热爱这份工作。强烈推荐 Antur！' },
    'review-yandex-013': { name: '安娜 K.', route: '海上观光', source: 'Yandex 地图', text: '感谢这次精彩的出海！我们很喜欢能够近距离欣赏所有美景。我们看到了动物和鸟类，捕了蟹，还享用了美味的餐食。想钓鱼的客人可以使用船上的路亚竿。我们还听了详细介绍景点的语音导览。推荐这次美好的海上休闲体验。' },
    'review-yandex-012': { name: '伊琳娜', route: '海上观光', source: 'Yandex 地图', text: '感谢这次美妙的行程！身心都得到了放松，美景难以言表。服务很好，午餐非常美味，船长的讲解有趣又真诚。绝对推荐！' },
    'review-yandex-014': { name: '塔季扬娜', route: '海上观光', source: 'Yandex 地图', text: '由衷感谢 Marina 和 Alexander 船长，让我们有机会参加这次美好的海上之行。同行伙伴很棒，捕蟹和钓鱼的过程也充满乐趣。我们享受了精彩的旅程和美味的午餐。非常感谢你们带来这美好的一天。' },
    'review-yandex-010': { name: 'Romanovdv19960811', route: '海上观光', source: 'Yandex 地图', text: '乘坐 Antur 的海上之行非常精彩！Alexander 船长技术娴熟，也是一位真诚热情的人。他教我们捕蟹和钓鱼，还把螃蟹烹制得非常美味，全团都吃得很满足。他带我们去了其他向导到不了的美丽地点，甚至还让我们看到了原本不在行程中的虎鲸。非常感谢你们的安排！推荐给大家，绝对不会失望。' },
    'review-2gis-025': { name: '安热拉', route: '海上观光', source: '2GIS', text: '一切都很棒，推荐！船长很细心，行程非常精彩，我们钓了鱼、捕了蟹，还欣赏了堪察加的绝美风景。' },
    'review-yandex-011': { name: '斯维特兰娜 B.', route: '海上观光', source: 'Yandex 地图', text: '非常推荐和 Alexander、Marina 一起的海上之行。沿途的景色令人难忘，我们还亲手捕蟹钓鱼，那份激动难以言表。Alexander 是很棒的讲解员，也要特别感谢 Marina 的贴心服务，船上点心一应俱全。非常美好的行程，真心推荐 Antur。斯维特兰娜和奥尔加。' },
    'review-yandex-009': { name: 'Elena P.', route: '海上观光', source: 'Yandex 地图', text: '我们对这次出海非常满意！虽然以前也多次出海，但这次体验尤其精彩。船长专业又善于讲解，整个行程十分温馨。我们来自克拉斯诺达尔的朋友至今仍印象深刻，并说这是他们在堪察加看到的最棒景色。' },
    'review-yandex-001': { name: '维多利亚 K.', route: '海上观光', source: 'Yandex 地图', text: '非常感谢 ANTUR 和我们出色的船长 Alexander，带来满满的正能量、美丽的景色、感动和美食。一切都非常完美！' },
    'review-yandex-002': { name: '然娜 M.', route: '海上观光', source: 'Yandex 地图', text: '非常感谢 Alexander 的海上之旅——一切都棒极了！组织得非常专业，每个细节都考虑周到，路线引人入胜，当地自然风光令人惊叹。堪察加征服了我们的心！' },
    'review-yandex-003': { name: '尤利娅·尼科拉耶娃', route: '海上观光', source: 'Yandex 地图', text: '海上之行非常愉快！服务很好，船长很细心。我们饱览美景，也吃得很好。非常感谢这些感动，推荐给大家！' },
    'review-yandex-004': { name: '阿纳斯塔西娅 N.', route: '鲁斯卡亚湾', source: 'Yandex 地图', text: '非常感谢 Marina 和 Alexander 让我们有机会参加这次海上之行。我们饱览美景，聆听传说，身心都得到放松——最重要的是，我在 Antur 的船上成为了新娘！非常感谢你们在筹备上的帮助、热情的款待、温馨的氛围和难忘的体验。我们一定还会再来！' },
    'review-yandex-005': { name: '柳德米拉·鲁班', route: '鲁斯卡亚湾', source: 'Yandex 地图', text: '堪察加值得一次又一次重新发现。2026 年 7 月 9 日，我们乘坐 Antur 前往鲁斯卡亚湾，经验丰富的 Alexander 船长让旅程十分精彩。保险、钓鱼、鱼汤午餐、薄饼点心和鱼肉三明治都安排得清楚周到。我们看到了阿瓦恰湾及周边小海湾、三兄弟岩和斯塔里奇科夫岛，还遇到了海鸟群、虎鲸、海獭和海狮。阳光一路掠过雪白山脊，留下终生难忘的回忆。非常感谢 Alexander 和 Marina。' },
    'review-yandex-007': { name: '瓦莲京娜·索罗金娜', route: '海上观光', source: 'Yandex 地图', text: '只有一个很大的缺点：我没法像自己希望的那样经常参加。除此之外全是优点。船长 Alexander 和船员 Marina 是最大的亮点。同行伙伴很棒，天气很好，地点也非常美。还有捕蟹和岩石旁的帝王蟹盛宴。精彩之处说不完。我们非常喜欢，也真心希望每个人都能体验！' },
    'review-yandex-008': { name: '奥尔加 M.', route: '海上观光', source: 'Yandex 地图', text: '这是我最棒的一次海上旅行！看到了很多美丽的地方，拍了许多照片，还品尝了非常鲜美的帝王蟹。推荐！' },
    'review-2gis-001': { name: '奥列格·菲利莫年科', route: '近海海钓', source: '2GIS', text: '感谢 ANTUR 船长带来精彩的出海和钓鱼！' },
    'review-2gis-002': { name: '帕维尔·巴甫洛夫斯基', route: '近海海钓', source: '2GIS', text: '我们一行 6 人出海钓鱼，非常满意。我们钓到了各种鱼：比目鱼、鳕鱼、大比目鱼、狭鳕、六线鱼，当然还有杜父鱼。帝王蟹体验让我们非常惊喜——吃饱了蟹，还带了一些回家。Alexander 是经验丰富的船长，完全不用担心：他讲了很多有趣的内容，也带我们看了美景。船是全新的，非常宽敞，配有卫生间，客舱舒适，还有全景窗。非常感谢 Alexander 带来这么棒的钓鱼之行！' },
    'review-2gis-003': { name: '亚历山大·巴萨拉耶夫', route: '近海海钓', source: '2GIS', text: '我和妻子跟随一艘非常舒适的船的船长 Alexander 去钓鱼。他非常健谈、负责、热心。他对鱼点了如指掌：我们一到位置，鱼就一条接一条地咬钩。钓到很多鳕鱼、六线鱼和鲈鱼，还有比目鱼和远东多线鱼。我绝对推荐 Alexander 和他的船，不仅可以钓鱼——他还会带客人去海湾口外的风景胜地观光，包括鲁斯卡亚湾。' },
    'review-2gis-004': { name: '叶戈尔·基谢廖夫', route: '深海海钓', source: '2GIS', text: '我们的钓鱼之行非常棒：船长、船只和钓具都是一流的。气氛非常友好，关于堪察加的故事更增添了特别的韵味。Alexander 展现了真正的专业：他帮助每个人，示范如何正确调试钓具。鱼咬钩频率高得惊人，有时一次两条。最后船长估算渔获——不少于五十公斤。我绝对推荐给想要愉快度过时光、享受大自然的每个人！' },
    'review-2gis-005': { name: '谢尔盖·斯梅瓦洛夫', route: '深海海钓', source: '2GIS', text: '在阿瓦恰湾口外的钓鱼和这条路线本身，纯粹是刺激与享受！路线方便，船只舒适，每个细节都考虑周到。鱼咬钩咬到让你忘掉一切。再加上绝美的景色和最美味的海鲜，就在船上的新鲜空气中烹制。绝对值得每个人来试试。谢谢你，Alexander！' },
    'review-2gis-006': { name: '然斯露 Zh.I.', route: '海上观光', source: '2GIS', text: '一次美妙的海上之行！满满的情绪与体验！感谢 Alexander——一位非常热心、积极的人，我不仅从美景中，也从愉快的同伴中收获了满满的感动。我们到了三兄弟岩、魔鬼之指、季哈亚湾等许多地方。有不同的路线可供选择。再次感谢这次美妙的海上之行。' },
    'review-2gis-007': { name: '达里娅·格里戈尔丘克', route: '海上观光', source: '2GIS', text: '非常感谢，一切都很喜欢！Alexander 船长把这次行程带得非常好。地方非常美，推荐大家都来这里。' },
    'review-2gis-008': { name: '玛莲娜·奥汉尼相', route: '斯塔里奇科夫岛', source: '2GIS', text: '全新的 Antur 船、贴心的船长、美味的款待，一次前往堪察加美景的精彩出行！钓鱼和新鲜的渔获——各种乐趣应有尽有。Antur 团队热情的接待和真诚让人印象深刻。感谢 Alexander 船长带来的这次旅程！' },
    'review-2gis-009': { name: '伊琳娜·格里先科', route: '斯塔里奇科夫岛', source: '2GIS', text: '我们一群要好的姐妹一起参加了海上之行，非常满意！全新的小巧温馨的船非常适合自己的小团体。海风、美丽的景色、水声和鸟鸣——是逃离城市喧嚣的最佳方式。船长热情好客且经验丰富。我们享用了刚捕获的美味：帝王蟹和海胆籽、香浓的茶、咖啡和小吃。非常推荐！' },
    'review-2gis-010': { name: '伊利亚·格里先科', route: '鲁斯卡亚湾', source: '2GIS', text: '我们乘坐了 Antur。船不大，11 人——刚刚好，不拥挤，大家都坐得很舒适。大自然美得不真实：岩石、海水、海鸟。船长很棒，把船开到靠近岸边，带我们看了所有美景。钓鱼很令人高兴——刚下钩就上鱼，大家都满载而归。还有帝王蟹——太美味了，现煮，就在甲板上吃。如果你想轻松又充实地出海，Antur 是个好选择。' },
    'review-2gis-011': { name: '阿纳斯塔西娅·斯塔里岑娜', route: '鲁斯卡亚湾', source: '2GIS', text: '这是一次超出所有期待的真正冒险。从一开始就能感受到船长的专业。钓鱼和捕蟹本身都是一流的——我们带着惊人的渔获回来。但最重要的是那种温暖和关怀的氛围：早餐和午餐都非常精彩，是大海中央真正的家常美食。高潮是 Alexander 亲手烹制的帝王蟹。非常感谢这难忘的一天！' },
    'review-2gis-012': { name: '艾努拉', route: '海上观光', source: '2GIS', text: '这次出行非常美好，令人难忘！几个小时里我看到了惊艳的景色。风拂面庞、浪花飞溅、海鸥鸣叫——一种完全自由的感觉。船在岩石间灵巧地穿行，周围空无一人，只有大自然。船很舒适，船长很专业，又有幽默感。感谢这些感动！绝对推荐！' },
    'review-2gis-013': { name: '伊琳娜 R.', route: '海上观光', source: '2GIS', text: '我们有机会踏上一次海上之旅——那是最难忘的体验和鲜活的情绪。干净舒适的船只、友好的氛围和非常美味的款待。我们的天气运气好极了：看到了堪察加的美景、野生鸟类和海洋生物，尽情享受。感谢你们带来这美好的一天！' },
    'review-2gis-014': { name: '马克西姆·希什卡诺夫', route: '鲁斯卡亚湾', source: '2GIS', text: '如果你计划在堪察加出海，Antur 团队非常值得选择。我们的鲁斯卡亚湾之行超出所有期待。堪察加的自然风光令人难以置信，这样周到的组织让整个旅程格外轻松愉快。' },
    'review-2gis-015': { name: '叶卡捷琳娜', route: '海上观光', source: '2GIS', text: '我们正好有一天空闲，Alexander 很快就为我们安排了前往三兄弟岩的精彩行程。一切都非常棒！' },
    'review-2gis-016': { name: '瓦伦京娜·索罗金娜', route: '海上观光', source: '2GIS', text: '这是一次令人难忘的旅程。Marina、Alexander、同行伙伴、海鸥、鱼儿和帝王蟹，一切都很精彩。我还想再去！' },
    'review-2gis-017': { name: '瓦西里·瓦西里耶维奇', route: '海上观光', source: '2GIS', text: '非常棒的休闲体验。船长既是向导，也是真正的专业人士。快艇、美丽风景和热情接待都令人印象深刻。' },
    'review-2gis-018': { name: '伊琳娜', route: '海上观光', source: '2GIS', text: '船干净舒适，钓鱼和休闲所需的一切都很齐全。周围景色令人着迷，这次行程给我们留下了精彩照片和美好回忆。' },
    'review-2gis-019': { name: 'Zen Gi Kim', route: '海上观光', source: '2GIS', text: 'Alexander，谢谢昨天带我们前往三兄弟岩。行程非常精彩！' },
    'review-2gis-020': { name: '叶卡捷琳娜·别洛乌索娃', route: '海上观光', source: '2GIS', text: 'Alexander，谢谢。海上行程很精彩，茶很好喝，讲解也很有趣。我会推荐给大家！' },
    'review-2gis-021': { name: '当地居民', route: '海上观光', source: '2GIS', text: '行程非常精彩！专业度和服务意识都处于很高水平。谢谢！' },
    'review-2gis-022': { name: '斯坦尼斯拉夫·格鲁斯', route: '海上观光', source: '2GIS', text: 'Alexander，非常感谢！' },
    'review-2gis-023': { name: '伊万·波列塔欣', route: '近海钓鱼', source: '2GIS', text: '我们玩得很开心，星期六还会再去。钓到了很多鱼，我妻子也非常高兴！' },
    'review-2gis-024': { name: '阿列克谢·维什尼亚科夫', route: '近海钓鱼', source: '2GIS', text: '钓鱼体验非常棒，一切都很专业。谢谢 Alexander！' }
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
    'photo-crab-shore-russkaya-2026-08-02': { alt: 'Guests holding a tray of freshly cooked crab on the shore in Russkaya Bay', route: 'Russkaya Bay', caption: 'Freshly cooked crab during the shore stop on 2 August 2026.' },
    'photo-fishing-catch-cliffs-2026-08-02': { alt: 'Guest showing her fresh catch on the boat deck against coastal cliffs', route: 'Russkaya Bay', caption: 'Fishing near the coastal cliffs during the trip on 2 August 2026.' },
    'photo-sea-lions-boat-view-2026-08-02': { alt: 'Guests watching a large sea lion rookery on the rocks from the bow of the boat', route: 'Russkaya Bay', caption: 'Watching sea lions from the boat on 2 August 2026.' },
    'photo-guests-shore-lunch-2026-08-02': { alt: 'Group of guests at a set table in the shore camp after the sea trip', route: 'Russkaya Bay', caption: 'Guests having lunch on the shore on 2 August 2026.' },
    'photo-ukha-shore-base-2026-08-02': { alt: 'Fresh fish soup in a large pot at the shore base in Russkaya Bay', route: 'Russkaya Bay', caption: 'Fish soup made from the fresh catch for lunch on 2 August 2026.' },
    'photo-crab-feast-deck-2026-07-29': { alt: 'Guests in rain ponchos raising their glasses at a crab table on the boat deck', route: 'Crab safari', caption: 'Crab table on deck on a rainy day, 29 July 2026.' },
    'video-sea-lions-colony-2026-07-29': { alt: 'Sea lion rookery on the coastal rocks filmed from the boat in Kamchatka', route: 'Russkaya Bay', caption: 'Sea lions on the rocks during the trip on 29 July 2026.' },
    'photo-sea-lions-rookery-2026-07-29': { alt: 'Guests photographing a sea lion rookery on the coastal rocks during a sea tour', route: 'Sea tour', caption: 'Sea lion rookery on the rocks during the trip on 29 July 2026.' },
    'video-bird-cliff-grotto-2026-07-29': { alt: 'The boat passing between sheer cliffs with a grotto and seabird colonies', route: 'Russkaya Bay', caption: 'Passing between cliffs with seabird colonies on 29 July 2026.' },
    'photo-crab-platter-rain-2026-07-29': { alt: 'Platter of crab legs on the boat table with guests in rain ponchos around it', route: 'Crab safari', caption: 'Freshly cooked crab on deck on 29 July 2026.' },
    'video-ocean-passage-2026-07-29': { alt: 'The boat crossing open water along the Kamchatka coast', route: 'Russkaya Bay', caption: 'Open-water crossing along the coast on 29 July 2026.' },
    'photo-kekury-boat-2026-07-29': { alt: 'Boat approaching rock stacks with bird colonies near the Kamchatka coast', route: 'Sea tour', caption: 'Approaching the coastal rock stacks on 29 July 2026.' },
    'photo-shore-lunch-camp-2026-07-29': { alt: 'Guests having lunch at a set table on the shore next to the camp after a sea trip', route: 'After the trip', caption: 'Lunch on the shore after the sea trip on 29 July 2026.' },
    'photo-shore-ukha-table-2026-07-29': { alt: 'Fresh fish soup and appetizers on a shore table after a Kamchatka sea tour', route: 'After the trip', caption: 'Fresh fish soup and appetizers on the shore on 29 July 2026.' },
    'photo-crab-tray-2026-07-07': { alt: 'Guest holding a tray of cooked crab after a Kamchatka sea trip', route: 'Russkaya Bay', caption: 'Fresh crab after the sea trip on 7 July 2026.' },
    'video-sea-lions-2026-07-10': { alt: 'Sea lions on coastal rocks during a Kamchatka sea tour', route: 'Russkaya Bay', caption: 'Sea lions on coastal rocks during the trip on 10 July 2026.' },
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
    'photo-kekur-2026-05-30': { alt: 'Ocean rock stack on a Kamchatka sea tour route', route: 'Sea tour' },
    'photo-sea-cave-2026-05-30': { alt: 'Sea arch in the cliffs near the Kamchatka coast', route: 'Sea tour' },
    'photo-bird-cliffs-2026-05-30': { alt: 'Sea birds on the cliffs near Starichkov Island', route: 'Starichkov Island' },
    'photo-crab-deck-2026-05-30': { alt: 'Crab catch on the boat deck during a crab safari', route: 'Crab safari' },
    'photo-crab-tasting-2026-05-30': { alt: 'Kamchatka crab served after the sea tour', route: 'Crab safari' },
    'photo-ukha-2026-05-30': { alt: 'Hot fish soup and a guest table after a sea trip', route: 'After the trip' },
    'photo-coastal-base-2026-05-30': { alt: 'Warm guest area with tables after a sea tour', route: 'After the trip' },
    'photo-boat-pier-2026-06-01': { alt: 'Antur boat at the pier in Petropavlovsk-Kamchatsky', route: 'Antur boat' },
    'video-sea-tour-2026-05-30': { alt: 'Video from a Kamchatka sea tour', route: 'Russkaya Bay' },
    'video-ocean-route-2026-05-23': { alt: 'Video from an ocean route near the Kamchatka coast', route: 'Russkaya Bay' },
    'video-boat-moment-2026-05-27': { alt: 'Video from the Antur boat during a sea trip', route: 'Russkaya Bay' },
    'video-crab-safari-2026-05-30': { alt: 'Video from a Kamchatka crab safari', route: 'Crab safari' },
    'video-sea-landscape-2026-05-30': { alt: 'Video of the sea landscape on a Kamchatka route', route: 'Russkaya Bay' },
    'video-ocean-wildlife-2026-05-30': { alt: 'Video of Kamchatka ocean wildlife', route: 'Russkaya Bay' }
  },
  zh: {
    'photo-crab-shore-russkaya-2026-08-02': { alt: '客人在鲁斯卡亚湾岸边端着刚煮好的帝王蟹', route: '鲁斯卡亚湾', caption: '2026 年 8 月 2 日岸上停留时品尝刚煮好的帝王蟹。' },
    'photo-fishing-catch-cliffs-2026-08-02': { alt: '客人在海岸岩壁前的甲板上展示刚钓到的鱼', route: '鲁斯卡亚湾', caption: '2026 年 8 月 2 日行程中在海岸岩壁附近钓鱼。' },
    'photo-sea-lions-boat-view-2026-08-02': { alt: '客人从船头观看岩石上大型海狮栖息地', route: '鲁斯卡亚湾', caption: '2026 年 8 月 2 日从船上观察海狮。' },
    'photo-guests-shore-lunch-2026-08-02': { alt: '出海后，一组客人在岸边营地的餐桌旁用餐', route: '鲁斯卡亚湾', caption: '2026 年 8 月 2 日客人在岸边享用午餐。' },
    'photo-ukha-shore-base-2026-08-02': { alt: '鲁斯卡亚湾岸边基地大锅里的新鲜鱼汤', route: '鲁斯卡亚湾', caption: '2026 年 8 月 2 日用新鲜渔获为客人午餐制作的鱼汤。' },
    'photo-crab-feast-deck-2026-07-29': { alt: '客人穿着雨衣，在船舱甲板的螃蟹餐桌旁举杯', route: '帝王蟹体验', caption: '2026 年 7 月 29 日雨天甲板上的螃蟹大餐。' },
    'video-sea-lions-colony-2026-07-29': { alt: '在堪察加船上拍摄的海岸岩石海狮群', route: '鲁斯卡亚湾', caption: '2026 年 7 月 29 日出海时岩石上的海狮。' },
    'photo-sea-lions-rookery-2026-07-29': { alt: '海上观光途中，客人拍摄海岸岩石上的海狮群', route: '海上观光', caption: '2026 年 7 月 29 日出海时看到的岩石海狮群。' },
    'video-bird-cliff-grotto-2026-07-29': { alt: '船只穿过带有岩洞和海鸟栖息地的陡峭岩壁', route: '鲁斯卡亚湾', caption: '2026 年 7 月 29 日穿越海鸟栖息的岩壁水道。' },
    'photo-crab-platter-rain-2026-07-29': { alt: '船上餐桌上的蟹腿拼盘，周围是穿着雨衣的客人', route: '帝王蟹体验', caption: '2026 年 7 月 29 日甲板上刚煮好的螃蟹。' },
    'video-ocean-passage-2026-07-29': { alt: '船只沿堪察加海岸在开阔水域航行', route: '鲁斯卡亚湾', caption: '2026 年 7 月 29 日沿海岸的开阔海域航程。' },
    'photo-kekury-boat-2026-07-29': { alt: '船只驶近堪察加海岸附近有海鸟栖息的岩柱', route: '海上观光', caption: '2026 年 7 月 29 日驶近沿岸岩柱。' },
    'photo-shore-lunch-camp-2026-07-29': { alt: '出海归来后，客人在营地旁的岸边餐桌用餐', route: '出海之后', caption: '2026 年 7 月 29 日出海后在岸边享用午餐。' },
    'photo-shore-ukha-table-2026-07-29': { alt: '堪察加出海后岸边餐桌上的新鲜鱼汤和前菜', route: '出海之后', caption: '2026 年 7 月 29 日岸边的新鲜鱼汤和前菜。' },
    'photo-crab-tray-2026-07-07': { alt: '堪察加出海后，客人端着一盘煮好的螃蟹', route: '鲁斯卡亚湾', caption: '2026 年 7 月 7 日出海后享用的新鲜螃蟹。' },
    'video-sea-lions-2026-07-10': { alt: '堪察加海上观光途中，海狮聚集在海岸岩石上', route: '鲁斯卡亚湾', caption: '2026 年 7 月 10 日出海时看到的岩石海狮群。' },
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
    'photo-kekur-2026-05-30': { alt: '堪察加海上路线中的海中岩柱', route: '海上观光' },
    'photo-sea-cave-2026-05-30': { alt: '堪察加海岸岩石中的海蚀拱门', route: '海上观光' },
    'photo-bird-cliffs-2026-05-30': { alt: '斯塔里奇科夫岛附近岩壁上的海鸟', route: '斯塔里奇科夫岛' },
    'photo-crab-deck-2026-05-30': { alt: '帝王蟹体验中船甲板上的螃蟹收获', route: '帝王蟹体验' },
    'photo-crab-tasting-2026-05-30': { alt: '海上行程后享用的堪察加帝王蟹', route: '帝王蟹体验' },
    'photo-ukha-2026-05-30': { alt: '出海后为客人准备的热鱼汤和餐桌', route: '出海之后' },
    'photo-coastal-base-2026-05-30': { alt: '海上观光后供客人休息的温暖用餐区', route: '出海之后' },
    'photo-boat-pier-2026-06-01': { alt: '停靠在彼得罗巴甫洛夫斯克-堪察加码头的 Antur 船', route: 'Antur 船' },
    'video-sea-tour-2026-05-30': { alt: '堪察加海上观光视频', route: '鲁斯卡亚湾' },
    'video-ocean-route-2026-05-23': { alt: '堪察加海岸附近海上路线视频', route: '鲁斯卡亚湾' },
    'video-boat-moment-2026-05-27': { alt: 'Antur 船出海时的视频', route: '鲁斯卡亚湾' },
    'video-crab-safari-2026-05-30': { alt: '堪察加帝王蟹体验视频', route: '帝王蟹体验' },
    'video-sea-landscape-2026-05-30': { alt: '堪察加路线中的海上风景视频', route: '鲁斯卡亚湾' },
    'video-ocean-wildlife-2026-05-30': { alt: '堪察加海洋野生动物视频', route: '鲁斯卡亚湾' }
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
