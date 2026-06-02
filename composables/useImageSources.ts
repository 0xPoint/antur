const getImageStem = (src: string) => {
  const filename = src.split('/').pop() || ''
  return filename.replace(/\.[^.]+$/, '')
}

export const useImageSources = () => {
  const assetPath = useAssetPath()

  const webpSrcset = (src: string, widths: number[]) => {
    const stem = getImageStem(src)

    return widths
      .map((width) => `${assetPath(`/images/webp/${stem}-${width}.webp`)} ${width}w`)
      .join(', ')
  }

  return {
    assetPath,
    webpSrcset
  }
}
