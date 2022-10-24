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
