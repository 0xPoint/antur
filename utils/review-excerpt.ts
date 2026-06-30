export const REVIEW_EXCERPT_MAX_LENGTH = 240
export const REVIEW_EXCERPT_TRUNCATION_SLACK = 24

type ReviewExcerptOptions = {
  maxLength?: number
  truncationSlack?: number
  expanded?: boolean
}

export const shouldTruncateReviewText = (text: string, options: ReviewExcerptOptions = {}) => {
  const maxLength = options.maxLength ?? REVIEW_EXCERPT_MAX_LENGTH
  const truncationSlack = options.truncationSlack ?? REVIEW_EXCERPT_TRUNCATION_SLACK

  return !options.expanded && text.length > maxLength + truncationSlack
}

export const getReviewExcerpt = (text: string, options: ReviewExcerptOptions = {}) => {
  if (!shouldTruncateReviewText(text, options)) {
    return text
  }

  const maxLength = options.maxLength ?? REVIEW_EXCERPT_MAX_LENGTH
  const sliced = text.slice(0, maxLength)
  const wordSafe = sliced.replace(/\s+\S*$/, '').trimEnd()
  const trimmed = wordSafe.length > maxLength * 0.65 ? wordSafe : sliced.trimEnd()

  return `${trimmed}...`
}
