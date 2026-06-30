export const useDragSlider = () => {
  const clickSuppressionDistance = 6
  const clickSuppressionWindowMs = 160
  const viewport = ref<HTMLElement | null>(null)
  const suppressNextClick = ref(false)
  let clickSuppressionTimer: ReturnType<typeof setTimeout> | null = null

  const drag = reactive({
    active: false,
    startX: 0,
    scrollLeft: 0,
    maxDistance: 0
  })

  const clearClickSuppression = () => {
    suppressNextClick.value = false

    if (clickSuppressionTimer) {
      clearTimeout(clickSuppressionTimer)
      clickSuppressionTimer = null
    }
  }

  const armClickSuppression = () => {
    clearClickSuppression()
    suppressNextClick.value = true
    clickSuppressionTimer = setTimeout(clearClickSuppression, clickSuppressionWindowMs)
  }

  const scrollByPage = (direction: -1 | 1) => {
    const element = viewport.value

    if (!element) {
      return
    }

    const maxScroll = element.scrollWidth - element.clientWidth
    const pageStep = Math.max(element.clientWidth - 48, 280)
    const isAtEnd = element.scrollLeft >= maxScroll - 8
    const isAtStart = element.scrollLeft <= 8

    if (direction > 0 && isAtEnd) {
      element.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }

    if (direction < 0 && isAtStart) {
      element.scrollTo({ left: maxScroll, behavior: 'smooth' })
      return
    }

    element.scrollBy({ left: pageStep * direction, behavior: 'smooth' })
  }

  const isInteractiveTarget = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest('a, button, input, select, textarea, [role="button"]'))

  const startDrag = (event: PointerEvent) => {
    const element = viewport.value

    if (!element || event.button !== 0 || isInteractiveTarget(event.target)) {
      return
    }

    drag.active = true
    drag.startX = event.clientX
    drag.scrollLeft = element.scrollLeft
    drag.maxDistance = 0
    element.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event: PointerEvent) => {
    const element = viewport.value

    if (!element || !drag.active) {
      return
    }

    const deltaX = event.clientX - drag.startX
    drag.maxDistance = Math.max(drag.maxDistance, Math.abs(deltaX))
    element.scrollLeft = drag.scrollLeft - deltaX
  }

  const stopDrag = (event: PointerEvent) => {
    const element = viewport.value
    const shouldSuppressClick = drag.active && drag.maxDistance > clickSuppressionDistance
    drag.active = false
    drag.maxDistance = 0

    if (element?.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId)
    }

    if (shouldSuppressClick) {
      armClickSuppression()
    }
  }

  const preventClickAfterDrag = (event: MouseEvent) => {
    if (!suppressNextClick.value) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    clearClickSuppression()
  }

  onBeforeUnmount(clearClickSuppression)

  return {
    viewport,
    drag,
    scrollByPage,
    startDrag,
    moveDrag,
    stopDrag,
    preventClickAfterDrag
  }
}
