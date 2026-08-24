// Sem tema pronto do Prism: as cores de token vivem em src/styles/style.css,
// afinadas com o `pre` escuro da marca (importar prism.css sobrescreveria o
// fundo ameixa do bloco de código).
const { GA4_ID } = require("./src/components/analytics")

exports.wrapPageElement = require("./gatsby-shared").wrapPageElement

/**
 * page_view a cada troca de rota (roda também na primeira carga).
 * `gtag` é o stub forwardado pelo Partytown; se o GA não estiver
 * configurado, nada acontece.
 */
exports.onRouteUpdate = ({ location }) => {
  if (!GA4_ID || typeof window === "undefined" || typeof window.gtag !== "function") {
    return
  }
  window.gtag("event", "page_view", {
    page_path: location.pathname + location.search + location.hash,
    page_location: window.location.href,
    page_title: document.title,
  })
}
