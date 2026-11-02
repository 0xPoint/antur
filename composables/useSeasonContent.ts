import { seasonContent, seasonPreparation } from '~/data/season'

export const useSeasonContent = () => {
  const { locale } = useLocaleContent()

  return {
    season: computed(() => seasonContent[locale.value]),
    seasonPreparation
  }
}
