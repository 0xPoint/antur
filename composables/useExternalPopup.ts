export const useExternalPopup = () => {
  const openExternalPopup = (event: MouseEvent, url?: string) => {
    if (!url || typeof window === 'undefined') {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const popup = window.open(
      url,
      'antur-review-source',
      'popup=yes,width=980,height=720,menubar=no,toolbar=no,location=yes,status=yes,scrollbars=yes,resizable=yes'
    )

    if (popup) {
      popup.opener = null
      popup.focus()
      return
    }

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return {
    openExternalPopup
  }
}
