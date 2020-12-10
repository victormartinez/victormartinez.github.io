export const homeUrl = locale => {
  return `/${locale}`
}

export const blogUrl = locale => {
  return `/${locale}/blog`
}

export const articleUrl = (locale, slug) => {
  return `/${locale}/blog${slug}`
}

export const nextPageBlogUrl = (locale, currentPage) => {
  return `/${locale}/blog/page/${currentPage + 1}`
}

export const prevPageBlogUrl = (locale, currentPage) => {
  const previous =
    currentPage - 1 === 1 ? `/blog` : `/blog/page/${currentPage - 1}`
  return `/${locale}${previous}`
}
