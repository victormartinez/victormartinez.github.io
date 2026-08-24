/**
 * APIs compartilhadas entre gatsby-browser.js e gatsby-ssr.js.
 * Mantém o mesmo wrapper nos dois lados (sem descasar a hidratação).
 */
const React = require("react")
const Analytics = require("./src/components/analytics").default

exports.wrapPageElement = ({ element }) =>
  React.createElement(React.Fragment, null, element, React.createElement(Analytics))
