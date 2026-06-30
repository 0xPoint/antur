export const sortReviewsByDateDesc = <T extends { date: string, id: string }>(items: T[]) =>
  items.slice().sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
