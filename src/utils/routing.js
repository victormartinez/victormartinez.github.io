export const homeUrl = locale => {
  return `/${locale}`
}

export const blogUrl = locale => {
  return `/${locale}/blog`
}

export const articleUrl = (locale, slug) => {
  return `/${locale}/blog${slug}`
}

export const reviewUrl = (locale, slug) => {
  return `/${locale}/bookreviews${slug}`
}

export const talksUrl = locale => {
  return `/${locale}/talks`
}

export const studyNotesUrl = locale => {
  return `/${locale}/studynotes`
}

export const bookReviewsUrl = locale => {
  return `/${locale}/bookreviews`
}

export const nextPageBookReviewUrl = (locale, currentPage) => {
  return `/${locale}/bookreviews/page/${currentPage + 1}`
}

export const prevPageBookReviewUrl = (locale, currentPage) => {
  const previous =
    currentPage - 1 === 1 ? `/bookreviews` : `/bookreviews/page/${currentPage - 1}`
  return `/${locale}${previous}`
}

export const nextPageBlogUrl = (locale, currentPage) => {
  return `/${locale}/blog/page/${currentPage + 1}`
}

export const prevPageBlogUrl = (locale, currentPage) => {
  const previous =
    currentPage - 1 === 1 ? `/blog` : `/blog/page/${currentPage - 1}`
  return `/${locale}${previous}`
}
