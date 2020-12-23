const moment = require("moment")

export const isPostDeprecated = datetime => {
  const months = moment().diff(
    moment(datetime, "YYYY-MM-DDTHH:mm:ss"),
    "months"
  )
  return months >= 12
}

export const formatDate = (datetime, locale) => {
  if (locale === "en") {
    return moment(datetime, "YYYY-MM-DDTHH:mm:ss")
      .locale("en")
      .format("MMM DD, YYYY")
  }
  let formatted = moment(datetime, "YYYY-MM-DDTHH:mm:ss")
    .locale("pt-br")
    .format("MMM DD, YYYY")

  return `${formatted[0].toUpperCase()}${formatted.slice(1)}`
}
