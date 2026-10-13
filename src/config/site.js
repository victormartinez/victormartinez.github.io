/**
 * Constantes do site usadas no Head API (que não aceita hooks nem
 * useStaticQuery) e nos componentes de layout.
 */
module.exports = {
  titulo: "Victor Martinez",
  tituloCompleto: "Victor Martinez — engenharia contada de dentro",
  descricao:
    "Victor Martinez: doze anos construindo software, quatro liderando times. Textos e palestras sobre engenharia, arquitetura, gestão e IA aplicada.",
  siteUrl: "https://vcrmartinez.com",
  autor: "Victor Martinez",
  lang: "pt-BR",
  papel: "Senior | Lead | Head",
  creditos: "© 2026 Victor Martinez · engenharia contada de dentro",
  linkedin: "https://linkedin.com/in/vcrmartinez",
  github: "https://github.com/victormartinez",
  ogImagem: "/assets/img/og-victor-martinez.png",
  email: { usuario: "vcrmartinez", dominio: "gmail.com" },
  // false tira a seção "Textos" do ar: some da home, do menu e da 404, e
  // /textos/ não é gerada. Um texto com publicado: true ainda ganha página
  // própria e entra no RSS — só não aparece em lugar nenhum do site.
  textosNoAr: false,
}
