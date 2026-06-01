export const useAssetPath = () => {
  const baseURL = useRuntimeConfig().app.baseURL || '/'
  const normalizedBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

  return (path: string) => `${normalizedBase}/${path.replace(/^\/+/, '')}`
}
