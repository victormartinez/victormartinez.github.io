(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{DXyh:function(e,t,n){"use strict";var a,i,o=n("q1tI"),l=n.n(o),c=n("ijYg"),r=n("/d1K"),m=n("9Exo"),s=n("Fzi1"),d=n("lEpx"),p=n("MUpH"),f=n("vOnD"),u=n("ibEc"),g=f.c.main.withConfig({displayName:"styled__MainWrapper",componentId:"sc-1qrx28m-0"})(["background-color:#fff;margin-top:-5em;min-height:100vh;padding:2em;width:100vw;"," ",""],u.a.greaterThan("large")(a||(a=Object(p.a)(["\n    width: 70em;\n    margin: 0 auto;\n    margin-top: -5em;\n  "]))),u.a.lessThan("medium")(i||(i=Object(p.a)(["\n    width: 100vw;\n    padding: 0;\n    margin-top: 0;\n  "]))));t.a=function(e){var t=e.title,n=e.description,a=e.social,i=e.children;return l.a.createElement(l.a.Fragment,null,l.a.createElement(d.a,null),l.a.createElement(m.a,null),l.a.createElement(r.a,{social:a}),l.a.createElement(c.a,{title:t,description:n}),l.a.createElement(g,null,i),l.a.createElement(s.a,{social:a}))}},Fzi1:function(e,t,n){"use strict";var a,i=n("q1tI"),o=n.n(i),l=n("rmMi"),c=n("MUpH"),r=n("vOnD"),m=n("ibEc"),s=r.c.footer.withConfig({displayName:"styled__FooterWrapper",componentId:"sc-1p32f99-0"})(["height:8rem;display:flex;justify-content:center;align-items:center;background-color:black;"]),d=r.c.div.withConfig({displayName:"styled__Footer",componentId:"sc-1p32f99-1"})(["display:flex;flex-direction:column;align-items:center;color:white;justify-content:center;width:70em;border-top:1px solid #000;",""],m.a.lessThan("small")(a||(a=Object(c.a)(["\n    width: 100vw;\n  "])))),p=r.c.p.withConfig({displayName:"styled__Copyright",componentId:"sc-1p32f99-2"})(["margin-bottom:1em;"]);t.a=function(e){var t=e.social;return o.a.createElement(s,null,o.a.createElement(d,null,o.a.createElement(p,null,"Copyright © ",(new Date).getFullYear()," Victor Martinez"),t&&o.a.createElement(l.a,{data:t})))}},ijYg:function(e,t,n){"use strict";var a,i,o,l,c,r=n("q1tI"),m=n.n(r),s=n("MUpH"),d=n("vOnD"),p=n("ibEc"),f=d.c.div.withConfig({displayName:"styled__Wrapper",componentId:"sc-8ecjc7-0"})(["display:flex;background-color:#090b0b;height:",";",""],(function(e){return e.content?"40vh":"20vh"}),p.a.lessThan("small")(a||(a=Object(s.a)(["\n    margin-bottom: 1em;  \n  "])))),u=d.c.div.withConfig({displayName:"styled__Container",componentId:"sc-8ecjc7-1"})(["margin:0 auto;width:70em;margin-top:10vh;",""],p.a.lessThan("large")(i||(i=Object(s.a)(["\n    width: 100vw;\n    padding: 1.5em;\n  "])))),g=d.c.h1.withConfig({displayName:"styled__Title",componentId:"sc-8ecjc7-2"})(["margin-bottom:0.3em;color:#fff;font-size:4rem;",""],p.a.lessThan("small")(o||(o=Object(s.a)(["\n    font-size: 2.8rem;\n  "])))),h=d.c.p.withConfig({displayName:"styled__Description",componentId:"sc-8ecjc7-3"})(["color:#fff;font-size:1.5rem;width:30em;line-height:1.5;"," ",""],p.a.lessThan("medium")(l||(l=Object(s.a)(["\n    font-size: 1rem;\n    width: 85vw;\n  "]))),p.a.lessThan("small")(c||(c=Object(s.a)(["\n    font-size: 0.8rem;\n  "]))));t.a=function(e){var t=e.title,n=e.description;return m.a.createElement(f,{content:t||n},m.a.createElement(u,null,t&&m.a.createElement(g,null,t),n&&m.a.createElement(h,null,n)))}},w2l6:function(e,t,n){"use strict";n.r(t);var a=n("q1tI"),i=n.n(a),o=n("DXyh"),l=n("vrFN"),c=n("kCIJ"),r=n("IRZi"),m=n("vOnD"),s=n("Wbzz"),d=m.c.section.withConfig({displayName:"styled__NotFoundWrapper",componentId:"sc-1d1jwkw-0"})(["text-align:center;display:flex;flex-direction:column;"]),p=m.c.span.withConfig({displayName:"styled__Oops",componentId:"sc-1d1jwkw-1"})(["font-size:6rem;margin-top:1em;"]),f=m.c.h1.withConfig({displayName:"styled__Title",componentId:"sc-1d1jwkw-2"})(["font-size:2rem;margin:1em 0;"]),u=m.c.p.withConfig({displayName:"styled__Description",componentId:"sc-1d1jwkw-3"})(["font-weight:300;"]),g=m.c.footer.withConfig({displayName:"styled__Footer",componentId:"sc-1d1jwkw-4"})(["margin:1em 0;font-weight:300;"]),h=Object(m.c)(s.Link).withConfig({displayName:"styled__Url",componentId:"sc-1d1jwkw-5"})([""]),w=function(){var e=Object(c.useIntl)();return i.a.createElement(d,null,i.a.createElement(p,null,"Oooops!"),i.a.createElement(f,null,"404: ",e.formatMessage({id:"Not_Found"})),i.a.createElement(u,null,e.formatMessage({id:"Not_Found_Text"})),i.a.createElement(g,null,e.formatMessage({id:"Not_Found_Nav"})+" ",i.a.createElement(h,{to:""+Object(r.c)(e.locale)},"Home")," "+e.formatMessage({id:"or"})+" ",i.a.createElement(h,{to:""+Object(r.b)(e.locale)},"Blog")))};t.default=function(e){var t=e.data,n=(e.location,t.site.siteMetadata.social);return i.a.createElement(o.a,{footerSocial:n},i.a.createElement(l.a,{title:"404: Not Found"}),i.a.createElement(w,null))}}}]);
//# sourceMappingURL=component---src-pages-404-js-abe5e809aa29d9da7e97.js.map