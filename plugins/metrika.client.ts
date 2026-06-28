// Яндекс.Метрика. Грузится только в браузере (плагин .client) и не в dev.
// Первый просмотр отправляет сам init; на каждую SPA-навигацию (включая
// переключение языка) дополнительно шлём hit — иначе Метрика считает только
// первую загрузку.

type YandexMetrika = ((counterId: number, action: string, ...rest: unknown[]) => void) & {
  a?: unknown[]
  l?: number
}

declare global {
  interface Window {
    ym?: YandexMetrika
    dataLayer?: unknown[]
  }
}

export default defineNuxtPlugin(() => {
  if (import.meta.dev) {
    return
  }

  const rawId = useRuntimeConfig().public.yandexMetrikaId
  const counterId = Number(rawId)

  if (!counterId) {
    return
  }

  const scriptSrc = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`

  // Очередь вызовов до загрузки tag.js (как в официальном сниппете).
  window.ym = window.ym || function (...args: unknown[]) {
    (window.ym!.a = window.ym!.a || []).push(args)
  } as YandexMetrika
  window.ym.l = Date.now()
  window.dataLayer = window.dataLayer || []

  if (![...document.scripts].some((s) => s.src === scriptSrc)) {
    const script = document.createElement('script')
    script.async = true
    script.src = scriptSrc
    const first = document.getElementsByTagName('script')[0]
    first.parentNode?.insertBefore(script, first)
  }

  window.ym(counterId, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    accurateTrackBounce: true,
    trackLinks: true
  })

  const router = useRouter()
  router.afterEach((to, from) => {
    if (to.fullPath === from.fullPath) {
      return
    }

    // nextTick: дать обновиться document.title перед отправкой просмотра.
    void nextTick(() => {
      window.ym?.(counterId, 'hit', to.fullPath, {
        title: document.title,
        referer: from.fullPath
      })
    })
  })
})
