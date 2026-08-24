/**
 * Palestras — lista estática, na ordem exata do site aprovado.
 * `ano` vazio = mesma safra da linha anterior.
 */
const palestras = [
  {
    ano: "2024",
    evento: "Google I/O Salvador",
    titulo:
      "Kubernetes para DEVs: o mínimo necessário para mandar bem na sua empresa",
  },
  {
    ano: "2022",
    evento: "In-company",
    titulo: "Construa o inquebrável: arquiteturas defensivas para devs cautelosos",
  },
  { ano: "", evento: "In-company", titulo: "Hexagonal Architecture" },
  { ano: "", evento: "In-company", titulo: "Building Scalable Restaurants" },
  { ano: "2021", evento: "In-company", titulo: "Defensive Software Delivery" },
  { ano: "2020", evento: "Meetup SanarTech", titulo: "O Manual do Trabalho Remoto" },
  { ano: "2019", evento: "NoSQL:BA", titulo: "Fast results with Elasticsearch" },
  { ano: "2018", evento: "Linguágil", titulo: "Remote Lifestyle" },
  {
    ano: "2016",
    evento: "Semcomp",
    titulo: "Maintaining 200+ spiders and still having time to sleep",
  },
  { ano: "", evento: "Hackagilize", titulo: "Crawling the web like a boss" },
]

export default palestras
