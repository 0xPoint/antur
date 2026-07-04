import type { LocaleCode } from './i18n-base'

export interface PrivacySection {
  heading: string
  paragraphs?: string[]
  items?: string[]
}

export interface PrivacyContent {
  seoTitle: string
  seoDescription: string
  eyebrow: string
  title: string
  linkLabel: string
  updatedLabel: string
  updatedDate: string
  intro: string[]
  sections: PrivacySection[]
}

const phone = '+7 (914) 025-39-72'
const email = 'marisha720@yandex.ru'

export const privacyByLocale: Record<LocaleCode, PrivacyContent> = {
  ru: {
    seoTitle: 'Политика конфиденциальности | Антур',
    seoDescription:
      'Политика обработки персональных данных пользователей сайта Антур: какие данные собираются, цели обработки, cookie и Яндекс.Метрика, права пользователя.',
    eyebrow: 'Правовая информация',
    title: 'Политика конфиденциальности',
    linkLabel: 'Политика конфиденциальности',
    updatedLabel: 'Дата вступления в силу',
    updatedDate: '24 июня 2026 г.',
    intro: [
      'Настоящая Политика конфиденциальности (далее — Политика) определяет порядок обработки и защиты персональных данных пользователей сайта anturkamchatka.ru (далее — Сайт).',
      'Использование Сайта означает согласие пользователя с настоящей Политикой и условиями обработки персональных данных. В случае несогласия пользователь должен воздержаться от использования Сайта.',
      'Обработка персональных данных осуществляется в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».'
    ],
    sections: [
      {
        heading: '1. Оператор персональных данных',
        items: [
          'Индивидуальный предприниматель Хавилов А. Г.',
          'ИНН: 410500435293',
          'ОГРНИП: 325410000014840',
          'Дата регистрации: 30.09.2025',
          'Адрес: Камчатский край, г. Петропавловск-Камчатский',
          `Телефон: ${phone}`,
          `E-mail: ${email}`
        ]
      },
      {
        heading: '2. Какие данные обрабатываются',
        paragraphs: ['Оператор обрабатывает следующие данные:'],
        items: [
          'имя, которое пользователь указывает при обращении;',
          'номер телефона;',
          'адрес электронной почты (при наличии);',
          'содержание заявки, обращения или сообщения, направленного через формы Сайта или мессенджеры;',
          'данные, автоматически передаваемые при использовании Сайта: IP-адрес, данные cookie, сведения о браузере и устройстве, дата и время доступа, адрес запрашиваемой страницы, источник перехода;',
          'данные о поведении пользователя на Сайте, собираемые сервисом веб-аналитики, в том числе записи действий на странице через Вебвизор (перемещения курсора, клики, прокрутка, факт заполнения полей форм).'
        ]
      },
      {
        heading: '3. Цели обработки',
        items: [
          'обработка заявок и бронирований морских прогулок и экскурсий;',
          'связь с пользователем и предоставление запрошенной информации;',
          'исполнение договора об оказании услуг;',
          'улучшение работы Сайта, анализ посещаемости и поведения пользователей;',
          'выполнение требований законодательства Российской Федерации.'
        ]
      },
      {
        heading: '4. Правовые основания',
        items: [
          'согласие пользователя на обработку персональных данных, выражаемое при использовании Сайта и отправке обращений;',
          'заключение и исполнение договора, стороной которого является пользователь;',
          'Федеральный закон № 152-ФЗ и иные нормативные правовые акты Российской Федерации.'
        ]
      },
      {
        heading: '5. Cookie и веб-аналитика (Яндекс.Метрика)',
        paragraphs: [
          'Сайт использует cookie — небольшие файлы, сохраняемые в браузере пользователя, для обеспечения работы Сайта, запоминания выбранного языка и сбора статистики.',
          'Для анализа посещаемости Сайт использует сервис Яндекс.Метрика, предоставляемый ООО «ЯНДЕКС». Сервис применяет cookie, а также технологии Вебвизора и карты кликов для записи и анализа действий пользователей на страницах. Собранные данные обрабатываются на стороне ООО «ЯНДЕКС» в соответствии с условиями использования сервиса.',
          'Пользователь может отказаться от cookie и веб-аналитики, изменив настройки браузера или используя соответствующие расширения. Это может повлиять на работу отдельных функций Сайта.'
        ]
      },
      {
        heading: '6. Передача третьим лицам',
        paragraphs: ['Оператор не продаёт персональные данные. Передача возможна только в следующих случаях:'],
        items: [
          'передача сервису веб-аналитики ООО «ЯНДЕКС» в техническом и обезличенном виде;',
          'использование сторонних сервисов доставки сообщений и заявок (сервисы электронной почты, мессенджеры WhatsApp, MAX), когда пользователь сам инициирует обращение через них;',
          'случаи, предусмотренные законодательством Российской Федерации (по запросу уполномоченных государственных органов).'
        ]
      },
      {
        heading: '7. Сроки хранения',
        paragraphs: [
          'Персональные данные хранятся не дольше, чем этого требуют цели обработки, или до момента отзыва пользователем согласия. После достижения целей обработки или отзыва согласия данные удаляются либо обезличиваются, если иное не предусмотрено законодательством.'
        ]
      },
      {
        heading: '8. Права пользователя',
        paragraphs: ['Пользователь вправе:'],
        items: [
          'получать информацию об обработке своих персональных данных;',
          'требовать уточнения, блокирования или удаления данных, если они неполны, устарели, неточны или обрабатываются с нарушением закона;',
          'отозвать согласие на обработку персональных данных;',
          'обжаловать действия Оператора в Роскомнадзоре или в судебном порядке.'
        ]
      },
      {
        heading: '9. Защита данных',
        paragraphs: [
          'Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования и распространения.'
        ]
      },
      {
        heading: '10. Изменения Политики',
        paragraphs: [
          'Оператор вправе изменять настоящую Политику. Новая редакция вступает в силу с момента её размещения на Сайте, если иное не предусмотрено новой редакцией. Действующая редакция всегда доступна на этой странице.'
        ]
      },
      {
        heading: '11. Контакты',
        paragraphs: ['По вопросам обработки персональных данных, для запроса, изменения или удаления данных и отзыва согласия обращайтесь к Оператору:'],
        items: [`Телефон: ${phone}`, `E-mail: ${email}`]
      }
    ]
  },
  en: {
    seoTitle: 'Privacy Policy | Antur',
    seoDescription:
      'How Antur processes personal data of website users: what data is collected, purposes, cookies and Yandex Metrica, and user rights.',
    eyebrow: 'Legal information',
    title: 'Privacy Policy',
    linkLabel: 'Privacy Policy',
    updatedLabel: 'Effective date',
    updatedDate: '24 June 2026',
    intro: [
      'This Privacy Policy (the “Policy”) defines how personal data of users of the website anturkamchatka.ru (the “Website”) is processed and protected.',
      'Using the Website means the user agrees with this Policy and the terms of personal data processing. If the user does not agree, they should refrain from using the Website.',
      'Personal data is processed in accordance with Federal Law No. 152-FZ of 27 July 2006 “On Personal Data”. The Russian-language version of this Policy is legally binding; this translation is provided for convenience.'
    ],
    sections: [
      {
        heading: '1. Data operator',
        items: [
          'Individual Entrepreneur A. G. Khavilov',
          'INN (Taxpayer ID): 410500435293',
          'OGRNIP (Registration No.): 325410000014840',
          'Registration date: 30.09.2025',
          'Address: Kamchatka Krai, Petropavlovsk-Kamchatsky',
          `Phone: ${phone}`,
          `E-mail: ${email}`
        ]
      },
      {
        heading: '2. What data is processed',
        paragraphs: ['The operator processes the following data:'],
        items: [
          'the name the user provides when contacting us;',
          'phone number;',
          'e-mail address (if provided);',
          'the content of a request or message sent via the Website forms or messengers;',
          'data transferred automatically when using the Website: IP address, cookie data, browser and device information, date and time of access, the requested page, and the referral source;',
          'data on the user’s behaviour on the Website collected by the web-analytics service, including on-page session recordings via Webvisor (cursor movement, clicks, scrolling, the fact that form fields were filled in).'
        ]
      },
      {
        heading: '3. Purposes of processing',
        items: [
          'handling requests and bookings for sea tours and excursions;',
          'communicating with the user and providing requested information;',
          'performing the service agreement;',
          'improving the Website and analysing traffic and user behaviour;',
          'complying with the requirements of the legislation of the Russian Federation.'
        ]
      },
      {
        heading: '4. Legal grounds',
        items: [
          'the user’s consent to personal data processing, given when using the Website and sending requests;',
          'conclusion and performance of an agreement to which the user is a party;',
          'Federal Law No. 152-FZ and other legal acts of the Russian Federation.'
        ]
      },
      {
        heading: '5. Cookies and web analytics (Yandex Metrica)',
        paragraphs: [
          'The Website uses cookies — small files stored in the user’s browser — to operate the Website, remember the selected language and collect statistics.',
          'For traffic analysis the Website uses Yandex Metrica, provided by YANDEX LLC. The service uses cookies as well as Webvisor and click-map technologies to record and analyse user actions on pages. The collected data is processed by YANDEX LLC under its terms of use.',
          'The user may decline cookies and web analytics by changing browser settings or using relevant extensions. This may affect some Website features.'
        ]
      },
      {
        heading: '6. Transfer to third parties',
        paragraphs: ['The operator does not sell personal data. Transfer is possible only in the following cases:'],
        items: [
          'transfer to the web-analytics service YANDEX LLC in a technical and anonymised form;',
          'use of third-party services for delivering messages and requests (e-mail services, WhatsApp and MAX messengers) when the user initiates contact through them;',
          'cases provided for by the legislation of the Russian Federation (at the request of authorised state bodies).'
        ]
      },
      {
        heading: '7. Retention periods',
        paragraphs: [
          'Personal data is stored no longer than required by the purposes of processing or until the user withdraws consent. Once the purposes are achieved or consent is withdrawn, the data is deleted or anonymised, unless otherwise required by law.'
        ]
      },
      {
        heading: '8. User rights',
        paragraphs: ['The user has the right to:'],
        items: [
          'obtain information about the processing of their personal data;',
          'request clarification, blocking or deletion of data that is incomplete, outdated, inaccurate or processed in violation of the law;',
          'withdraw consent to the processing of personal data;',
          'appeal the operator’s actions to Roskomnadzor or in court.'
        ]
      },
      {
        heading: '9. Data protection',
        paragraphs: [
          'The operator takes the necessary legal, organisational and technical measures to protect personal data from unlawful or accidental access, destruction, alteration, blocking, copying and distribution.'
        ]
      },
      {
        heading: '10. Changes to the Policy',
        paragraphs: [
          'The operator may amend this Policy. A new version takes effect once published on the Website, unless otherwise stated in the new version. The current version is always available on this page.'
        ]
      },
      {
        heading: '11. Contacts',
        paragraphs: ['For matters related to personal data processing, or to request, change or delete data and withdraw consent, contact the operator:'],
        items: [`Phone: ${phone}`, `E-mail: ${email}`]
      }
    ]
  },
  zh: {
    seoTitle: '隐私政策 | Antur',
    seoDescription:
      'Antur 如何处理网站用户的个人数据：收集哪些数据、处理目的、Cookie 与 Yandex Metrica，以及用户权利。',
    eyebrow: '法律信息',
    title: '隐私政策',
    linkLabel: '隐私政策',
    updatedLabel: '生效日期',
    updatedDate: '2026 年 6 月 24 日',
    intro: [
      '本隐私政策（以下简称“政策”）规定了网站 anturkamchatka.ru（以下简称“网站”）用户个人数据的处理与保护方式。',
      '使用本网站即表示用户同意本政策及个人数据处理条款。如不同意，用户应停止使用本网站。',
      '个人数据依据 2006 年 7 月 27 日第 152-FZ 号联邦法《个人数据法》进行处理。本政策以俄文版本为法律准据，本译文仅供参考。'
    ],
    sections: [
      {
        heading: '1. 数据运营者',
        items: [
          '个体经营者 A. G. Khavilov',
          '纳税人识别号（INN）：410500435293',
          '注册号（OGRNIP）：325410000014840',
          '注册日期：30.09.2025',
          '地址：堪察加边疆区，彼得罗巴甫洛夫斯克-堪察加',
          `电话：${phone}`,
          `电子邮箱：${email}`
        ]
      },
      {
        heading: '2. 处理哪些数据',
        paragraphs: ['运营者处理以下数据：'],
        items: [
          '用户联系时提供的姓名；',
          '电话号码；',
          '电子邮箱（如提供）；',
          '通过网站表单或即时通讯软件发送的申请、咨询或信息内容；',
          '使用网站时自动传输的数据：IP 地址、Cookie 数据、浏览器与设备信息、访问日期与时间、所请求的页面及来源；',
          '由网络分析服务收集的用户在网站上的行为数据，包括通过 Webvisor 进行的页面操作记录（光标移动、点击、滚动、表单字段的填写情况）。'
        ]
      },
      {
        heading: '3. 处理目的',
        items: [
          '处理海上观光和游览的申请与预订；',
          '与用户沟通并提供所需信息；',
          '履行服务合同；',
          '改进网站、分析访问量与用户行为；',
          '遵守俄罗斯联邦法律的要求。'
        ]
      },
      {
        heading: '4. 法律依据',
        items: [
          '用户在使用网站和发送咨询时表示的个人数据处理同意；',
          '签订并履行以用户为一方的合同；',
          '第 152-FZ 号联邦法及俄罗斯联邦其他法律法规。'
        ]
      },
      {
        heading: '5. Cookie 与网络分析（Yandex Metrica）',
        paragraphs: [
          '本网站使用 Cookie（存储在用户浏览器中的小文件）以保证网站运行、记住所选语言并收集统计数据。',
          '为分析访问量，本网站使用由 YANDEX 有限责任公司提供的 Yandex Metrica 服务。该服务使用 Cookie 以及 Webvisor 和点击热图技术来记录和分析用户在页面上的操作。所收集的数据由 YANDEX 有限责任公司按其使用条款处理。',
          '用户可通过更改浏览器设置或使用相关扩展程序拒绝 Cookie 和网络分析。这可能影响网站的部分功能。'
        ]
      },
      {
        heading: '6. 向第三方传输',
        paragraphs: ['运营者不出售个人数据。仅在以下情况下可能传输：'],
        items: [
          '以技术性、匿名化形式传输给网络分析服务 YANDEX 有限责任公司；',
          '当用户主动通过第三方服务联系时，使用其传递信息与申请（电子邮件服务、WhatsApp 与 MAX 即时通讯）；',
          '俄罗斯联邦法律规定的情形（应授权国家机关的要求）。'
        ]
      },
      {
        heading: '7. 保存期限',
        paragraphs: [
          '个人数据的保存时间不超过处理目的所需，或至用户撤回同意为止。在达到处理目的或撤回同意后，除法律另有规定外，数据将被删除或匿名化。'
        ]
      },
      {
        heading: '8. 用户权利',
        paragraphs: ['用户有权：'],
        items: [
          '获取有关其个人数据处理的信息；',
          '要求更正、封锁或删除不完整、过时、不准确或违法处理的数据；',
          '撤回对个人数据处理的同意；',
          '就运营者的行为向 Roskomnadzor（俄罗斯联邦通信监管局）申诉或通过司法途径申诉。'
        ]
      },
      {
        heading: '9. 数据保护',
        paragraphs: [
          '运营者采取必要的法律、组织与技术措施，保护个人数据免遭非法或意外访问、销毁、更改、封锁、复制和传播。'
        ]
      },
      {
        heading: '10. 政策变更',
        paragraphs: [
          '运营者有权修改本政策。除新版本另有规定外，新版本自在网站发布之时起生效。当前有效版本始终可在本页面查阅。'
        ]
      },
      {
        heading: '11. 联系方式',
        paragraphs: ['有关个人数据处理的事宜，或申请、变更、删除数据及撤回同意，请联系运营者：'],
        items: [`电话：${phone}`, `电子邮箱：${email}`]
      }
    ]
  }
}
