(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{Fzi1:function(e,t,n){"use strict";var a=n("q1tI"),r=n.n(a),i=n("rmMi"),o=n("MUpH"),l=n("vOnD"),c=n("ibEc");function s(){var e=Object(o.a)(["\n    width: 100vw;\n  "]);return s=function(){return e},e}var m=l.c.footer.withConfig({displayName:"styled__FooterWrapper",componentId:"sc-1p32f99-0"})(["height:8rem;display:flex;justify-content:center;align-items:center;background-color:black;"]),u=l.c.div.withConfig({displayName:"styled__Footer",componentId:"sc-1p32f99-1"})(["display:flex;flex-direction:column;align-items:center;color:white;justify-content:center;width:70em;border-top:1px solid #000;",""],c.a.lessThan("small")(s())),d=l.c.p.withConfig({displayName:"styled__Copyright",componentId:"sc-1p32f99-2"})(["margin-bottom:1em;"]);t.a=function(e){var t=e.social;return r.a.createElement(m,null,r.a.createElement(u,null,r.a.createElement(d,null,"Copyright © ",(new Date).getFullYear()," Victor Martinez"),t&&r.a.createElement(i.a,{data:t})))}},RPjP:function(e,t,n){"use strict";e.exports=n("SLms")},SLms:function(e,t,n){"use strict";n("E9XD"),Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),i=l(n("q1tI")),o=l(n("17x9"));function l(e){return e&&e.__esModule?e:{default:e}}function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var m=["shortname","identifier","title","url","category_id","onNewComment","language"],u=!1;function d(e,t){var n=t.onNewComment,a=t.language,r=function(e,t){var n={};for(var a in e)t.indexOf(a)>=0||Object.prototype.hasOwnProperty.call(e,a)&&(n[a]=e[a]);return n}(t,["onNewComment","language"]);for(var i in r)e.page[i]=r[i];e.language=a,n&&(e.callbacks={onNewComment:[n]})}var f=function(e){function t(){return c(this,t),s(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentDidMount",value:function(){this.loadDisqus()}},{key:"componentDidUpdate",value:function(){this.loadDisqus()}},{key:"shouldComponentUpdate",value:function(e,t){return e.identifier!==this.props.identifier}},{key:"render",value:function(){var e=this,t=Object.keys(this.props).reduce((function(t,n){return m.some((function(e){return e===n}))?t:a({},t,function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},n,e.props[n]))}),{});return i.default.createElement("div",t,i.default.createElement("div",{id:"disqus_thread"}))}},{key:"addDisqusScript",value:function(){if(!u){var e=this.disqus=document.createElement("script"),t=document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0];e.async=!0,e.type="text/javascript",e.src="//"+this.props.shortname+".disqus.com/embed.js",t.appendChild(e),u=!0}}},{key:"loadDisqus",value:function(){var e=this,t={};m.forEach((function(n){"shortname"!==n&&e.props[n]&&(t[n]=e.props[n])})),"undefined"!=typeof DISQUS?DISQUS.reset({reload:!0,config:function(){d(this,t),this.page.url=this.page.url.replace(/#/,"")+"#!newthread"}}):(window.disqus_config=function(){d(this,t)},this.addDisqusScript())}}]),t}(i.default.Component);f.displayName="DisqusThread",f.propTypes={id:o.default.string,shortname:o.default.string.isRequired,identifier:o.default.string,title:o.default.string,url:o.default.string,category_id:o.default.string,onNewComment:o.default.func,language:o.default.string},f.defaultProps={url:"undefined"==typeof window?null:window.location.href},t.default=f},ijYg:function(e,t,n){"use strict";var a=n("q1tI"),r=n.n(a),i=n("MUpH"),o=n("vOnD"),l=n("ibEc");function c(){var e=Object(i.a)(["\n    font-size: 0.8rem;\n  "]);return c=function(){return e},e}function s(){var e=Object(i.a)(["\n    font-size: 1rem;\n    width: 85vw;\n  "]);return s=function(){return e},e}function m(){var e=Object(i.a)(["\n    font-size: 2.8rem;\n  "]);return m=function(){return e},e}function u(){var e=Object(i.a)(["\n    width: 100vw;\n    padding: 1.5em;\n  "]);return u=function(){return e},e}function d(){var e=Object(i.a)(["\n    margin-bottom: 1em;  \n  "]);return d=function(){return e},e}var f=o.c.div.withConfig({displayName:"styled__Wrapper",componentId:"sc-8ecjc7-0"})(["display:flex;background-color:#090b0b;height:",";",""],(function(e){return e.content?"40vh":"20vh"}),l.a.lessThan("small")(d())),p=o.c.div.withConfig({displayName:"styled__Container",componentId:"sc-8ecjc7-1"})(["margin:0 auto;width:70em;margin-top:10vh;",""],l.a.lessThan("large")(u())),g=o.c.h1.withConfig({displayName:"styled__Title",componentId:"sc-8ecjc7-2"})(["margin-bottom:0.3em;color:#fff;font-size:4rem;",""],l.a.lessThan("small")(m())),h=o.c.p.withConfig({displayName:"styled__Description",componentId:"sc-8ecjc7-3"})(["color:#fff;font-size:1.5rem;width:30em;line-height:1.5;"," ",""],l.a.lessThan("medium")(s()),l.a.lessThan("small")(c()));t.a=function(e){var t=e.title,n=e.description;return r.a.createElement(f,{content:t||n},r.a.createElement(p,null,t&&r.a.createElement(g,null,t),n&&r.a.createElement(h,null,n)))}},xGbm:function(e,t,n){"use strict";n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return i}));var a=n("wd/R"),r=function(e){return a().diff(a(e,"YYYY-MM-DDTHH:mm:ss"),"months")>=12},i=function(e,t){if("en"===t)return a(e,"YYYY-MM-DDTHH:mm:ss").locale("en").format("MMM DD, YYYY");var n=a(e,"YYYY-MM-DDTHH:mm:ss").locale("pt-br").format("MMM DD, YYYY");return""+n[0].toUpperCase()+n.slice(1)}},yZlL:function(e,t,n){"use strict";n.r(t),n.d(t,"pageQuery",(function(){return ae}));var a=n("q1tI"),r=n.n(a),i=n("kCIJ"),o=n("MUpH"),l=n("vOnD"),c=n("ibEc");function s(){var e=Object(o.a)(["\n    margin-top: 0.5em;\n  "]);return s=function(){return e},e}function m(){var e=Object(o.a)(["\n    margin-top: 0.5em;\n  "]);return m=function(){return e},e}function u(){var e=Object(o.a)(["\n    font-size: 2.8rem;\n  "]);return u=function(){return e},e}var d=l.c.h1.withConfig({displayName:"styled__Headline",componentId:"sc-1wa54kl-0"})(["font-size:4rem;font-weight:900;line-height:1.5;",""],c.a.lessThan("small")(u())),f=l.c.article.withConfig({displayName:"styled__Article",componentId:"sc-1wa54kl-1"})(["line-height:2;font-size:1.2rem;"]),p=l.c.header.withConfig({displayName:"styled__Header",componentId:"sc-1wa54kl-2"})([""]),g=l.c.span.withConfig({displayName:"styled__Date",componentId:"sc-1wa54kl-3"})(["color:gray;"]),h=l.c.div.withConfig({displayName:"styled__TagsWrapper",componentId:"sc-1wa54kl-4"})([""]),y=l.c.ul.withConfig({displayName:"styled__TagsList",componentId:"sc-1wa54kl-5"})(["display:flex;flex-direction:row;list-style-type:none;margin-top:1em;flex-wrap:wrap;"]),w=l.c.li.withConfig({displayName:"styled__TagItem",componentId:"sc-1wa54kl-6"})(["margin-right:1em;background-color:#f5f2f0;color:gray;padding:0 0.5em;font-weight:300;",""],c.a.lessThan("small")(m())),v=l.c.li.withConfig({displayName:"styled__TagItemFirst",componentId:"sc-1wa54kl-7"})(["font-weight:300;margin-right:1em;color:gray;",""],c.a.lessThan("small")(s())),b=l.c.section.withConfig({displayName:"styled__Section",componentId:"sc-1wa54kl-8"})(["margin-top:2em;ul,ol{margin-top:-0.5em;}ol{list-style-type:decimal;margin-left:1em;margin-bottom:2em;}ul{list-style-type:disc;margin-left:1em;margin-bottom:2em;}h1{font-size:4rem;font-weight:900;}h2{font-weight:900;font-size:2.5rem;}h3{font-weight:900;font-size:1.5rem;}h4,h5,h6{font-weight:900;font-size:1rem;}h1,h2,h3,h4,h5,h6{margin-top:1em;}p{margin:0 0 2em 0;}table{width:100%;}thead,th,tr{border-bottom:1px solid #222;text-align:center;}td{text-align:center;}blockquote{border-left:4px solid gray;padding-left:1em;font-style:italic;}strong{font-weight:900;}.gatsby-highlight{margin-bottom:2em;}"]),_=n("pVnL"),E=n.n(_),C=n("Bop7"),I=a.forwardRef((function(e,t){return a.createElement(C.a,E()({iconAttrs:{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},iconVerticalAlign:"middle",iconViewBox:"0 0 16 16"},e,{ref:t}),a.createElement("path",{d:"M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"}))}));I.displayName="StarFill";var j=a.forwardRef((function(e,t){return a.createElement(C.a,E()({iconAttrs:{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},iconVerticalAlign:"middle",iconViewBox:"0 0 16 16"},e,{ref:t}),a.createElement("path",{fillRule:"evenodd",d:"M5.354 5.119L7.538.792A.516.516 0 018 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0116 6.32a.55.55 0 01-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.519.519 0 01-.146.05c-.341.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 01-.171-.403.59.59 0 01.084-.302.513.513 0 01.37-.245l4.898-.696zM8 12.027c.08 0 .16.018.232.056l3.686 1.894-.694-3.957a.564.564 0 01.163-.505l2.906-2.77-4.052-.576a.525.525 0 01-.393-.288L8.002 2.223 8 2.226v9.8z"}))}));j.displayName="StarHalf";var N=l.c.div.withConfig({displayName:"styled__RatingWrapper",componentId:"sc-1qmwva5-0"})(["display:flex;align-items:center;"]),O=l.c.span.withConfig({displayName:"styled__RatingLabel",componentId:"sc-1qmwva5-1"})(["font-weight:600;"]),k=l.c.ul.withConfig({displayName:"styled__RatingList",componentId:"sc-1qmwva5-2"})(["height:3em;display:flex;padding-top:0.3em;margin-left:0.3em;"]),M=l.c.li.withConfig({displayName:"styled__RatingItem",componentId:"sc-1qmwva5-3"})(["flex-direction:row;height:1.5em;width:1.5em;color:#ebbe42;margin-left:0.3em;"]),x=function(e){var t=e.value;return r.a.createElement(N,null,r.a.createElement(O,null,"Rating:"),r.a.createElement(k,null,function(){for(var e=[],n=1;n<=t;n++)e.push(r.a.createElement(M,{key:n},r.a.createElement(I,null)));return e}(),(""+t).split(".").length>1&&r.a.createElement(M,null,r.a.createElement(j,null))))},T=l.c.div.withConfig({displayName:"styled__CreditsWrapper",componentId:"sc-1vosg0h-0"})(["font-style:italic;font-size:1rem;"]),D=l.c.span.withConfig({displayName:"styled__Text",componentId:"sc-1vosg0h-1"})([""]),q=l.c.a.withConfig({displayName:"styled__Url",componentId:"sc-1vosg0h-2"})([""]),Y=function(e){var t=e.url,n=e.author,a=Object(i.useIntl)();return n&&t&&r.a.createElement(T,null,r.a.createElement(D,null,"* ",a.formatMessage({id:"Featured_image_credits"}),":"," "),r.a.createElement(q,{title:n,target:"_blank",rel:"noopener noreferrer",href:t},n))},z=l.c.div.withConfig({displayName:"styled__AlertWrapper",componentId:"sc-1e0l874-0"})(["width:100%;background-color:#fff3cd;color:#856404;padding:0.75rem 1.25rem;border-radius:0.25rem;margin-top:1.5em;"]),R=function(e){var t=e.msg;return r.a.createElement(z,null,t)},L=n("xGbm"),P=function(e){var t=e.post,n=Object(i.useIntl)();return r.a.createElement(f,null,r.a.createElement(p,null,r.a.createElement(d,null,t.frontmatter.title),r.a.createElement(g,null,Object(L.a)(t.frontmatter.date,n.locale)," • ",t.timeToRead," ","min ",n.formatMessage({id:"reading"})),r.a.createElement(h,null,r.a.createElement(y,null,r.a.createElement(v,null,"Tags:"),t.frontmatter.tags.map((function(e,t){return r.a.createElement(w,{key:t},e)}))))),t.frontmatter.rating&&r.a.createElement(x,{value:t.frontmatter.rating}),Object(L.b)(t.frontmatter.date)&&r.a.createElement(R,{msg:n.formatMessage({id:"Warning_deprecated"})}),r.a.createElement(b,{dangerouslySetInnerHTML:{__html:t.html},itemProp:"articleBody"}),r.a.createElement(Y,{url:t.frontmatter.image_url,author:t.frontmatter.image_author}))},H=n("RPjP"),S=n.n(H);function F(){var e=Object(o.a)(["\n    margin-bottom: 2em;\n  "]);return F=function(){return e},e}var U=l.c.section.withConfig({displayName:"styled__CommentsWrapper",componentId:"qffwt9-0"})(['iframe[src*="ads-iframe"]{display:none;}#disqus_thread{a{color:#1fa1f2 !important;}}']),W=l.c.h2.withConfig({displayName:"styled__CommentsTitle",componentId:"qffwt9-1"})(["font-weight:900;font-size:1.5rem;",""],c.a.lessThan("small")(F())),A=function(e){var t=e.url,n=e.identifier,a=e.title,o=Object(i.useIntl)();return r.a.createElement(U,null,r.a.createElement(W,null,o.formatMessage({id:"Comments"})),r.a.createElement(S.a,{shortname:"vcrmartinez",identifier:n,title:a,url:t}))},B=l.c.hr.withConfig({displayName:"styled__Divider",componentId:"sc-1p6r5bs-0"})(["margin:3em 0;border-style:dashed;color:#f3f3f3;"]),V=function(){return r.a.createElement(B,null)},J=n("ijYg"),Q=n("/d1K"),G=n("9Exo"),Z=n("Fzi1"),K=n("lEpx");function X(){var e=Object(o.a)(["\n    width: 100vw;\n  "]);return X=function(){return e},e}var $=l.c.main.withConfig({displayName:"styled__MainWrapper",componentId:"sc-1uq84m3-0"})(["margin:0 auto;width:70em;background-color:#fff;margin-top:-5em;min-height:100vh;padding:2em;",""],c.a.lessThan("large")(X())),ee=function(e){var t=e.social,n=e.children;return r.a.createElement(r.a.Fragment,null,r.a.createElement(K.a,null),r.a.createElement(G.a,null),r.a.createElement(Q.a,{social:t}),r.a.createElement(J.a,null),r.a.createElement($,null,n),r.a.createElement(Z.a,{social:t}))},te=n("vrFN"),ne=n("IRZi"),ae=(t.default=function(e){var t=e.data,n=Object(i.useIntl)(),a=t.markdownRemark,o=t.site.siteMetadata.social,l=a.frontmatter.title,c=Object(ne.a)(n.locale,a.fields.slug),s=""+t.site.siteMetadata.siteUrl+c;return r.a.createElement(ee,{social:o},r.a.createElement(te.a,{title:l,description:a.frontmatter.description||a.excerpt,meta:[{property:"keywords",content:a.frontmatter.tags.join(", ")}]}),r.a.createElement(P,{post:a}),r.a.createElement(V,null),r.a.createElement(A,{url:s,identifier:c,title:l}))},"3443741204")}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-44b9f2a07c51f994b76a.js.map