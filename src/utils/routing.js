export const homeUrl = locale => {
  return `/${locale}`
}

export const pageUrl = (locale, name) => {
  return `/${locale}/${name}`
}

export const pageDetailUrl = (locale, name, slug) => {
  return `/${locale}/${name}${slug}`
}

export const prevPageUrl = (locale, name, currentPage) => {
  const previous =
    currentPage - 1 === 1 ? `/${name}` : `/${name}/page/${currentPage - 1}`
  return `/${locale}${previous}`
}

export const nextPageUrl = (locale, name, currentPage) => {
  return `/${locale}/${name}/page/${currentPage + 1}`
}

export const pageDetailsUrl = (locale, name) => {
  return `/${locale}/${name}`
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

export const studyNoteUrl = (locale, slug) => {
  return `/${locale}/studynotes${slug}`
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

export const nextPageBlogUrl = (locale, currentPage) => {
  return `/${locale}/blog/page/${currentPage + 1}`
}

export const prevPageBlogUrl = (locale, currentPage) => {
  const previous =
    currentPage - 1 === 1 ? `/blog` : `/blog/page/${currentPage - 1}`
  return `/${locale}${previous}`
}

export const nextPageStudyNotesUrl = (locale, currentPage) => {
  return `/${locale}/blog/page/${currentPage + 1}`
}

export const prevPageStudyNotesUrl = (locale, currentPage) => {
  const previous =
    currentPage - 1 === 1 ? `/blog` : `/blog/page/${currentPage - 1}`
  return `/${locale}${previous}`
}

export const nextPageBookReviewUrl = (locale, currentPage) => {
  return `/${locale}/bookreviews/page/${currentPage + 1}`
}

export const prevPageBookReviewUrl = (locale, currentPage) => {
  const previous =
    currentPage - 1 === 1 ? `/bookreviews` : `/bookreviews/page/${currentPage - 1}`
  return `/${locale}${previous}`
}

export const nextPageTalksUrl = (locale, currentPage) => {
  return `/${locale}/talks/page/${currentPage + 1}`
}

export const prevPageTalksUrl = (locale, currentPage) => {
  const previous =
    currentPage - 1 === 1 ? `/talks` : `/talks/page/${currentPage - 1}`
  return `/${locale}${previous}`
}
