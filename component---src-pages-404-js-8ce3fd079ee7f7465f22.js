(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{DXyh:function(e,t,n){"use strict";var a=n("q1tI"),i=n.n(a),o=n("ijYg"),r=n("/d1K"),c=n("9Exo"),l=n("Fzi1"),m=n("lEpx"),s=n("MUpH"),d=n("vOnD"),u=n("ibEc");function f(){var e=Object(s.a)(["\n    width: 100vw;\n    padding: 0;\n    margin-top: 0;\n  "]);return f=function(){return e},e}function p(){var e=Object(s.a)(["\n    width: 70em;\n    margin: 0 auto;\n    margin-top: -5em;\n  "]);return p=function(){return e},e}var g=d.c.main.withConfig({displayName:"styled__MainWrapper",componentId:"sc-1qrx28m-0"})(["background-color:#fff;margin-top:-5em;min-height:100vh;padding:2em;width:100vw;"," ",""],u.a.greaterThan("large")(p()),u.a.lessThan("medium")(f()));t.a=function(e){var t=e.title,n=e.description,a=e.social,s=e.children;return i.a.createElement(i.a.Fragment,null,i.a.createElement(m.a,null),i.a.createElement(c.a,null),i.a.createElement(r.a,{social:a}),i.a.createElement(o.a,{title:t,description:n}),i.a.createElement(g,null,s),i.a.createElement(l.a,{social:a}))}},Fzi1:function(e,t,n){"use strict";var a=n("q1tI"),i=n.n(a),o=n("rmMi"),r=n("MUpH"),c=n("vOnD"),l=n("ibEc");function m(){var e=Object(r.a)(["\n    width: 100vw;\n  "]);return m=function(){return e},e}var s=c.c.footer.withConfig({displayName:"styled__FooterWrapper",componentId:"sc-1p32f99-0"})(["height:8rem;display:flex;justify-content:center;align-items:center;background-color:black;"]),d=c.c.div.withConfig({displayName:"styled__Footer",componentId:"sc-1p32f99-1"})(["display:flex;flex-direction:column;align-items:center;color:white;justify-content:center;width:70em;border-top:1px solid #000;",""],l.a.lessThan("small")(m())),u=c.c.p.withConfig({displayName:"styled__Copyright",componentId:"sc-1p32f99-2"})(["margin-bottom:1em;"]);t.a=function(e){var t=e.social;return i.a.createElement(s,null,i.a.createElement(d,null,i.a.createElement(u,null,"Copyright © ",(new Date).getFullYear()," Victor Martinez"),t&&i.a.createElement(o.a,{data:t})))}},ijYg:function(e,t,n){"use strict";var a=n("q1tI"),i=n.n(a),o=n("MUpH"),r=n("vOnD"),c=n("ibEc");function l(){var e=Object(o.a)(["\n    font-size: 0.8rem;\n  "]);return l=function(){return e},e}function m(){var e=Object(o.a)(["\n    font-size: 1rem;\n    width: 85vw;\n  "]);return m=function(){return e},e}function s(){var e=Object(o.a)(["\n    font-size: 2.8rem;\n  "]);return s=function(){return e},e}function d(){var e=Object(o.a)(["\n    width: 100vw;\n    padding: 1.5em;\n  "]);return d=function(){return e},e}function u(){var e=Object(o.a)(["\n    margin-bottom: 1em;  \n  "]);return u=function(){return e},e}var f=r.c.div.withConfig({displayName:"styled__Wrapper",componentId:"sc-8ecjc7-0"})(["display:flex;background-color:#090b0b;height:",";",""],(function(e){return e.content?"40vh":"20vh"}),c.a.lessThan("small")(u())),p=r.c.div.withConfig({displayName:"styled__Container",componentId:"sc-8ecjc7-1"})(["margin:0 auto;width:70em;margin-top:10vh;",""],c.a.lessThan("large")(d())),g=r.c.h1.withConfig({displayName:"styled__Title",componentId:"sc-8ecjc7-2"})(["margin-bottom:0.3em;color:#fff;font-size:4rem;",""],c.a.lessThan("small")(s())),h=r.c.p.withConfig({displayName:"styled__Description",componentId:"sc-8ecjc7-3"})(["color:#fff;font-size:1.5rem;width:30em;line-height:1.5;"," ",""],c.a.lessThan("medium")(m()),c.a.lessThan("small")(l()));t.a=function(e){var t=e.title,n=e.description;return i.a.createElement(f,{content:t||n},i.a.createElement(p,null,t&&i.a.createElement(g,null,t),n&&i.a.createElement(h,null,n)))}},w2l6:function(e,t,n){"use strict";n.r(t),n.d(t,"pageQuery",(function(){return y}));var a=n("q1tI"),i=n.n(a),o=n("DXyh"),r=n("vrFN"),c=n("kCIJ"),l=n("IRZi"),m=n("vOnD"),s=n("Wbzz"),d=m.c.section.withConfig({displayName:"styled__NotFoundWrapper",componentId:"sc-1d1jwkw-0"})(["text-align:center;display:flex;flex-direction:column;"]),u=m.c.span.withConfig({displayName:"styled__Oops",componentId:"sc-1d1jwkw-1"})(["font-size:6rem;margin-top:1em;"]),f=m.c.h1.withConfig({displayName:"styled__Title",componentId:"sc-1d1jwkw-2"})(["font-size:2rem;margin:1em 0;"]),p=m.c.p.withConfig({displayName:"styled__Description",componentId:"sc-1d1jwkw-3"})(["font-weight:300;"]),g=m.c.footer.withConfig({displayName:"styled__Footer",componentId:"sc-1d1jwkw-4"})(["margin:1em 0;font-weight:300;"]),h=Object(m.c)(s.Link).withConfig({displayName:"styled__Url",componentId:"sc-1d1jwkw-5"})([""]),w=function(){var e=Object(c.useIntl)();return i.a.createElement(d,null,i.a.createElement(u,null,"Oooops!"),i.a.createElement(f,null,"404: ",e.formatMessage({id:"Not_Found"})),i.a.createElement(p,null,e.formatMessage({id:"Not_Found_Text"})),i.a.createElement(g,null,e.formatMessage({id:"Not_Found_Nav"})+" ",i.a.createElement(h,{to:""+Object(l.c)(e.locale)},"Home")," "+e.formatMessage({id:"or"})+" ",i.a.createElement(h,{to:""+Object(l.b)(e.locale)},"Blog")))},y=(t.default=function(e){var t=e.data,n=(e.location,t.site.siteMetadata.social);return i.a.createElement(o.a,{footerSocial:n},i.a.createElement(r.a,{title:"404: Not Found"}),i.a.createElement(w,null))},"559776468")}}]);
//# sourceMappingURL=component---src-pages-404-js-8ce3fd079ee7f7465f22.js.map