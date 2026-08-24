import * as React from "react"
import site from "../config/site"

/**
 * E-mail montado em runtime: harvesters de mailto não executam JS.
 * O HTML servido mostra "vcrmartinez [at] gmail" e aponta para #contato;
 * depois da hidratação vira o mailto de verdade.
 */
const Email = () => {
  const ref = React.useRef(null)

  React.useEffect(() => {
    const a = ref.current
    if (!a) return
    const addr = site.email.usuario + "@" + site.email.dominio
    a.href = "mailto:" + addr
    a.textContent = addr
  }, [])

  return (
    <a ref={ref} href="#contato">
      {`${site.email.usuario} [at] ${site.email.dominio.split(".")[0]}`}
    </a>
  )
}

export default Email
