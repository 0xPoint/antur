const getImageStem = (src: string) => {
  const filename = src.split('/').pop() || ''
  return filename.replace(/\.[^.]+$/, '')
}

const availableWebpWidthsByStem: Record<string, number[]> = {
  'antur-kamchatka-bird-cliffs-2026-05-30': [480, 720, 960],
  'antur-kamchatka-boat-pier-2026-06-01': [480, 720, 960],
  'antur-kamchatka-captain-helm-2026-06-24': [480, 720, 960],
  'antur-kamchatka-coastal-base-2026-05-30': [480, 720, 960],
  'antur-kamchatka-crab-catch-2026-06-24': [480, 720, 960],
  'antur-kamchatka-crab-tray-2026-07-07': [480, 720, 960],
  'antur-kamchatka-crab-safari-deck-2026-05-30': [480, 720, 960],
  'antur-kamchatka-crab-tasting-2026-05-30': [480, 720, 960],
  'antur-kamchatka-crab-wine-deck-2026-06-14': [480, 720, 960],
  'antur-kamchatka-deck-table-cliffs-2026-06-24': [480, 720, 960],
  'antur-kamchatka-fishing-catch-2026-05-30': [480, 720, 960],
  'antur-kamchatka-kekur-ocean-2026-05-30': [480, 720, 960],
  'antur-kamchatka-orca-2026-05-30': [480, 720, 960],
  'antur-kamchatka-rock-passage-waves-2026-06-24': [480, 720, 960],
  'antur-kamchatka-sea-cave-2026-05-30': [480, 720, 960],
  'antur-kamchatka-sea-cliff-cave-2026-06-24': [480, 720, 960],
  'antur-kamchatka-sea-lions-rocks-2026-05-30': [480, 720, 960],
  'antur-kamchatka-sea-stacks-2026-06-24': [480, 720, 960],
  'antur-kamchatka-sea-urchins-platter-2026-06-24': [480, 720, 960],
  'antur-kamchatka-seafood-dinner-deck-2026-06-24': [480, 720, 960],
  'antur-kamchatka-snow-crab-urchin-2026-06-24': [480, 720, 960],
  'antur-kamchatka-three-brothers-avacha-2026-06-26': [480, 720, 960, 1280, 1600, 1920],
  'antur-kamchatka-ukha-after-tour-2026-05-30': [480, 720, 960],
  'crab-tasting': [480, 720, 920, 960, 1280, 1600, 1920],
  'faq-preview': [480, 720, 920, 960, 1280, 1600, 1920],
  'fishing-deck': [480, 720, 920, 960, 1280, 1600, 1920],
  'hero-kamchatka-boat': [480, 720, 920, 960, 1280, 1600, 1920],
  'hero-orca-breach': [480, 720, 920, 960, 1280, 1600, 1920],
  'hero-orca-breach-mobile': [480, 720, 920, 960, 1280, 1600, 1920],
  'kamchatka-ocean-rocks': [480, 720, 920, 960, 1280, 1600, 1920],
  'location-avacha-boat': [480, 720, 920, 960, 1280, 1600, 1920],
  'location-buhta-russkaya': [480, 720, 920, 960, 1280, 1600, 1920],
  'location-starichkov': [480, 720, 920, 960, 1280, 1600, 1920],
  'location-three-brothers': [480, 720, 920, 960, 1280, 1600, 1920],
  'og-image': [480, 720, 920, 960, 1280, 1600, 1920]
}

export const useImageSources = () => {
  const assetPath = useAssetPath()

  const webpSrcset = (src: string, widths: number[]) => {
    const stem = getImageStem(src)
    const availableWidths = availableWebpWidthsByStem[stem]
    const safeWidths = availableWidths
      ? widths.filter((width) => availableWidths.includes(width))
      : widths

    return (safeWidths.length ? safeWidths : availableWidths || widths)
      .map((width) => `${assetPath(`/images/webp/${stem}-${width}.webp`)} ${width}w`)
      .join(', ')
  }

  return {
    assetPath,
    webpSrcset
  }
}
