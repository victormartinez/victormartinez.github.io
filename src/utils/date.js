var moment = require("moment")

export const isPostDeprecated = datetime => {
  const months = moment().diff(moment(datetime), "months")
  return months >= 12
}

export const formatDate = (datetime, locale) => {
  if (locale === "en") {
    moment.locale("en")
    return moment(datetime).format("MMM DD, YYYY")
  }

  moment.locale("pt-br")
  return moment(datetime).format("MMM DD, YYYY")
}
