(()=>{var e,t={942:(e,t)=>{var r;!function(){"use strict";var i={}.hasOwnProperty;function o(){for(var e="",t=0;t<arguments.length;t++){var r=arguments[t];r&&(e=s(e,n(r)))}return e}function n(e){if("string"==typeof e||"number"==typeof e)return e;if("object"!=typeof e)return"";if(Array.isArray(e))return o.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var t="";for(var r in e)i.call(e,r)&&e[r]&&(t=s(t,r));return t}function s(e,t){return t?e?e+" "+t:e+t:e}e.exports?(o.default=o,e.exports=o):void 0===(r=function(){return o}.apply(t,[]))||(e.exports=r)}()},958:(e,t,r)=>{"use strict";const i=window.wp.blocks,o=window.wp.i18n,n=window.wp.hooks,s=window.wp.data,l=window.wp.element;var c=r(942),a=r.n(c);const d=window.ReactJSXRuntime,u=({direction:e,height:t,xPos:r,top:i,isSelected:o})=>{const n=a()("wpcom-overlay-resize__handle","components-resizable-box__container",{"is-selected":o}),s={height:t+"px",width:r+"px",top:i+"px"};return a()("components-resizable-box__handle","components-resizable-box__side-handle",{"components-resizable-box__handle-left":"left"===e,"components-resizable-box__handle-right":"right"===e}),(0,d.jsx)("div",{className:n,style:s,children:(0,d.jsx)("span",{})})};function p(e,t){if(!e)return e;const r=t.charAt(0).toLowerCase();return String(e).replace(/column\d-\w*-grid__\w*-\d*/g,"").replace(/column\d-grid__\w*-\d*/g,"").replace(/\s{2,}/,"").replace(/wp-block-jetpack-layout-gutter__\w*/,"").replace(/is-vertically-aligned-\w*/,"").replace(/is-style-[A-Za-z-_]*/,"").replace(new RegExp(`${r}-grid-\\d+-\\d+`,"g"),"").replace(/are-vertically-aligned-\w*/).trim()}function g(e,t,r,i){const o=t.charAt(0).toLowerCase(),n="number"==typeof r&&"number"==typeof i&&r<i?`${o}-grid-${r}-${i}`:"";return`${e?.split(" ").filter((e=>!new RegExp(`${o}-grid-\\d+-\\d+`).test(e))).join(" ")||""} ${n}`.trim()}function h(e="",t="Desktop"){const r=t.charAt(0).toLowerCase(),i=e.match(new RegExp(`${r}-grid-(\\d+)-(\\d+)`));return i?{start:parseInt(i[1],10),end:parseInt(i[2],10)}:{start:1,end:12}}const m=({children:e,isSelected:t,onResize:r,gridWidth:i=12,clientId:o})=>{const n=(0,l.useRef)(null),[c,p]=(0,l.useState)(!1),[g,m]=(0,l.useState)({xPos:0,width:0,height:0,top:0,direction:null}),[w,v]=(0,l.useState)(null),b=(0,s.useSelect)((e=>e("core/block-editor").getBlockAttributes(o)?.className||""),[o]),x=(0,s.useSelect)((e=>e("core/edit-post")?.__experimentalGetPreviewDeviceType?.()||"Desktop"));(0,l.useEffect)((()=>{const e=n.current;e&&(Array.from(e.classList).forEach((t=>{/^[dtm]-grid-\d+-\d+$/.test(t)&&e.classList.remove(t)})),Array.from(new Set(b.split(" ").filter((e=>/^[dtm]-grid-\d+-\d+$/.test(e))))).forEach((t=>e.classList.add(t))))}),[b]),(0,l.useEffect)((()=>{const e=e=>{const t=e.detail.col;v(t)};return window.addEventListener("gridHoverColumn",e),()=>window.removeEventListener("gridHoverColumn",e)}),[]);const f=e=>{const{clientX:t,targetTouches:r}=e;return t||r&&r[0]?.clientX},_=e=>{const{target:t}=e;if((0===e.button||e.touches)&&(t.dataset.resizeRight||t.dataset.resizeLeft)){const r=t.closest(".wp-block"),o=t.dataset.resizeLeft,{width:s,right:l,left:c,top:a,height:d}=r.getBoundingClientRect(),u=(r.parentNode?.offsetWidth||1200)/i,{start:g,end:w}=h(b,x);m({xPos:f(e),width:s,height:d,top:a,direction:o?"left":"right",gridPixelWidth:u,start:g,end:w}),p(!0);const v=n.current?.closest(".wp-block-gutengrid-editor")?.querySelector(".gutengrid-overlay");v&&v.classList.add("is-resizing");const _=n.current?.ownerDocument||document;_.addEventListener("mousemove",y),_.addEventListener("mouseup",k),e.preventDefault(),e.stopPropagation()}},y=e=>{e.stopPropagation();const t=f(e);m((i=>{const o=function(e,t){const r=document.querySelector('iframe[name="editor-canvas"]');if(r&&r.contentDocument){const i=r.contentDocument.elementsFromPoint(e,t),o=Array.from(i).find((e=>e.classList?.contains("gutengrid-overlay__col")));return o?Number(o.dataset.col):null}const i=document.elementsFromPoint(e,t).find((e=>e.classList?.contains("gutengrid-overlay__col")));return i?Number(i.dataset.col):null}(e.clientX,e.clientY);if(!r||null===o)return i;let n=Number(i.start),s=Number(i.end);return"left"===i.direction&&(n=o||i.start),"right"===i.direction&&(s=o?o+1:i.end),r({direction:i.direction,start:n,end:s,device:x}),{...i,start:n,end:s,xPos:t}}))},k=()=>{p(!1);const e=n.current?.closest(".wp-block-gutengrid-editor")?.querySelector(".gutengrid-overlay");e&&e.classList.remove("is-resizing");const t=n.current?.ownerDocument||document;t.removeEventListener("mousemove",y),t.removeEventListener("mouseup",k),v(null)},j=a()(b,{"wp-block-gutengrid__resizing":c,"wp-block-gutengrid__resizable":!0});return(0,d.jsxs)("div",{className:j,onMouseDown:_,onTouchStart:_,ref:n,children:[c&&(0,d.jsx)(u,{direction:g.direction,height:g.height,xPos:g.xPos,top:g.top,isSelected:t}),(0,d.jsxs)("span",{className:"wp-blocks-gutengrid__resize-handles",children:[(0,d.jsx)("div",{className:"components-resizable-box__handle components-resizable-box__side-handle components-resizable-box__handle-right","data-resize-right":!0}),(0,d.jsx)("div",{className:"components-resizable-box__handle components-resizable-box__side-handle components-resizable-box__handle-left","data-resize-left":!0})]}),e]})};(0,n.addFilter)("editor.BlockListBlock","gutengrid/with-grid-resize-handles",(e=>t=>{const{clientId:r,attributes:i,name:o}=t;if(!(0,s.useSelect)((e=>{const t=e("core/block-editor"),i=t.getBlockRootClientId(r),o=t.getBlock(i);return"gutengrid/grid"===o?.name}),[r])||["core/group","core/columns"].includes(o))return(0,d.jsx)(e,{...t});const{updateBlockAttributes:n}=(0,s.useDispatch)("core/block-editor");return(0,d.jsx)(m,{clientId:r,gridWidth:12,onResize:({direction:e,start:t,end:o,device:s="Desktop"})=>{if("number"!=typeof t||"number"!=typeof o)return;let l=t,c=o;if(l>=c)return;const a=g(i.className||"",s,l,c);n(r,{className:a})},children:(0,d.jsx)(e,{...t})})}));const w=window.wp.compose,v=window.wp.blockEditor,b=window.wp.components,x=window.wp.primitives,f=(0,d.jsx)(x.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:(0,d.jsx)(x.Path,{d:"M20.5 16h-.7V8c0-1.1-.9-2-2-2H6.2c-1.1 0-2 .9-2 2v8h-.7c-.8 0-1.5.7-1.5 1.5h20c0-.8-.7-1.5-1.5-1.5zM5.7 8c0-.3.2-.5.5-.5h11.6c.3 0 .5.2.5.5v7.6H5.7V8z"})}),_=(0,d.jsx)(x.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:(0,d.jsx)(x.Path,{d:"M17 4H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H7c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h10c.3 0 .5.2.5.5v12zm-7.5-.5h4V16h-4v1.5z"})}),y=(0,d.jsx)(x.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:(0,d.jsx)(x.Path,{d:"M15 4H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H9c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h6c.3 0 .5.2.5.5v12zm-4.5-.5h2V16h-2v1.5z"})}),k=()=>[{value:"Desktop",label:(0,o.__)("Desktop","gutengrid"),icon:f},{value:"Tablet",label:(0,o.__)("Tablet","gutengrid"),icon:_},{value:"Mobile",label:(0,o.__)("Mobile","gutengrid"),icon:y}],j=e=>(0,d.jsx)(b.SVG,{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",...e,children:(0,d.jsx)(b.Path,{d:"M4 4h8v16H4zM14 4h6v16h-6z",fill:"#ccc"})}),D=e=>(0,d.jsx)(b.SVG,{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",...e,children:(0,d.jsx)(b.Path,{d:"M4 4h6v16H4zM12 4h8v16h-8z",fill:"#ccc"})}),P=e=>(0,d.jsx)(b.SVG,{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",...e,children:(0,d.jsx)(b.Path,{d:"M4 4h16v16H4z",fill:"#ccc"})}),B={Desktop:{left:[2,8],center:[2,14],right:[8,14]},Tablet:{left:[2,8],center:[2,14],right:[8,14]},Mobile:{left:[2,6],center:[2,10],right:[6,10]}},S=({clientId:e})=>{const{className:t=""}=(0,s.useSelect)((t=>t("core/block-editor").getBlockAttributes(e)),[e]),r=(0,s.useSelect)((e=>e("core/edit-post")?.__experimentalGetPreviewDeviceType?.()||"Desktop")),{updateBlockAttributes:i}=(0,s.useDispatch)("core/block-editor"),n=o=>{const[n,s]=B[r][o],l=g(t,r,n,s);i(e,{className:l})},l=e=>{const[i,o]=B[r][e],{start:n,end:s}=h(t,r);return n===i&&s===o};return(0,d.jsxs)(b.ToolbarGroup,{label:(0,o.__)("Layout presets","gutengrid"),children:[(0,d.jsx)(b.ToolbarButton,{icon:(0,d.jsx)(j,{}),label:(0,o.__)("Left","gutengrid"),onClick:()=>n("left"),isPressed:l("left")}),(0,d.jsx)(b.ToolbarButton,{icon:(0,d.jsx)(P,{}),label:(0,o.__)("Main center","gutengrid"),onClick:()=>n("center"),isPressed:l("center")}),(0,d.jsx)(b.ToolbarButton,{icon:(0,d.jsx)(D,{}),label:(0,o.__)("Right","gutengrid"),onClick:()=>n("right"),isPressed:l("right")})]})},N={Desktop:14,Tablet:14,Mobile:10};function C(e){return N[e]||12}const z=({clientId:e})=>{const{className:t=""}=(0,s.useSelect)((t=>t("core/block-editor").getBlockAttributes(e)),[e]),r=(0,s.useSelect)((e=>e("core/edit-post")?.__experimentalGetPreviewDeviceType?.()||"Desktop")),{updateBlockAttributes:i}=(0,s.useDispatch)("core/block-editor"),[n,c]=(0,l.useState)(""),[a,u]=(0,l.useState)(""),[p,m]=(0,l.useState)(""),[w,v]=(0,l.useState)("");(0,l.useEffect)((()=>{const{start:e,end:i}=h(t,r),{start:o,end:n}=function(e="",t="Desktop"){const r=t.charAt(0).toLowerCase(),i=e.match(new RegExp(`${r}-row-(\\d+)(?:-(\\d+))?`));return i?{start:parseInt(i[1],10),end:i[2]?parseInt(i[2],10):void 0}:{start:null,end:null}}(t,r);c(e||""),u(i||""),m(o||""),v(n||"")}),[t,r]);const x=(o,n)=>{const s=e=>""===e||!isNaN(e)&&Number(e)>0;if(!s(o)||!s(n))return;const l=g(t,r,Number(o),Number(n));i(e,{className:l})},f=(o,n)=>{const s=e=>""===e||!isNaN(e)&&Number(e)>0;if(!s(o)||!s(n))return;const l=function(e,t,r,i){const o=t.charAt(0).toLowerCase();let n="";return"number"==typeof r&&"number"==typeof i&&r<i?n=`${o}-row-${r}-${i}`:"number"==typeof r&&(n=`${o}-row-${r}`),`${e?.split(" ").filter((e=>!new RegExp(`${o}-row-\\d+(-\\d+)?`).test(e))).join(" ")||""} ${n}`.trim()}(t,r,Number(o),Number(n));i(e,{className:l})},_=C(r);return(0,d.jsxs)("div",{className:"gutengrid-controls",children:[(0,d.jsx)(b.__experimentalNumberControl,{label:(0,o.__)("Column start","gutengrid"),value:n,onChange:e=>{c(e),x(e,a)},min:1,max:_,placeholder:(0,o.__)("Auto","gutengrid")}),(0,d.jsx)(b.__experimentalNumberControl,{label:(0,o.__)("Column end","gutengrid"),value:a,onChange:e=>{u(e),x(n,e)},min:1,max:_+1,placeholder:(0,o.__)("Auto","gutengrid")}),(0,d.jsx)(b.__experimentalNumberControl,{label:(0,o.__)("Row start","gutengrid"),value:p,onChange:e=>{m(e),f(e,w)},min:1,placeholder:(0,o.__)("Auto","gutengrid")}),(0,d.jsx)(b.__experimentalNumberControl,{label:(0,o.__)("Row end","gutengrid"),value:w,onChange:e=>{v(e),f(p,e)},min:1,placeholder:(0,o.__)("Auto","gutengrid")})]})},T=(0,w.createHigherOrderComponent)((e=>t=>{const{clientId:r,name:i,isSelected:n}=t,l=(0,s.useSelect)((e=>{const t=e("core/block-editor").getBlockRootClientId(r),i=e("core/block-editor").getBlock(t);return"gutengrid/grid"===i?.name}),[r]),c=(0,s.useSelect)((e=>e("core/edit-site")?.__experimentalGetPreviewDeviceType?.()||e("core/edit-post")?.__experimentalGetPreviewDeviceType?.()||"Desktop"),[]),{__experimentalSetPreviewDeviceType:a}=(0,s.useDispatch)("core/edit-site")||(0,s.useDispatch)("core/edit-post");return n&&l?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(v.BlockControls,{children:(0,d.jsx)(S,{clientId:r})}),(0,d.jsx)(e,{...t}),(0,d.jsxs)(v.InspectorControls,{children:[(0,d.jsxs)(b.PanelBody,{title:(0,o.__)("Responsive Breakpoints","gutengrid"),children:[(0,d.jsx)("p",{className:"gutengrid-help",children:(0,o.__)("Previewing your post will show your browser's breakpoint, not the currently selected one.","gutengrid")}),(0,d.jsx)(b.ButtonGroup,{children:k().map((e=>(0,d.jsx)(b.Button,{isPrimary:e.value===c,onClick:()=>a(e.value),children:e.label},e.value)))})]}),(0,d.jsx)(b.PanelBody,{title:(0,o.__)("Grid position","gutengrid"),children:(0,d.jsx)(z,{clientId:r})})]})]}):(0,d.jsx)(e,{...t})}),"withGridPositionControl");(0,n.addFilter)("editor.BlockEdit","gutengrid/grid-position-controls",T),window.lodash,window.wp.keycodes;const R=function(e){const{viewPort:t,updateViewport:r}=e,{__experimentalSetPreviewDeviceType:i}=(0,s.useDispatch)("core/edit-post")||(0,s.useDispatch)("core/edit-site"),o=(0,s.useSelect)((e=>(e("core/edit-site")||e("core/edit-post")).__experimentalGetPreviewDeviceType()),[]),[n,c]=(0,w.useResizeObserver)(),a=(0,w.useViewportMatch)("medium","<"),u=(0,w.useViewportMatch)("small","<");return(0,l.useEffect)((()=>{const e=function(e,t){return e?"Mobile":t?"Tablet":"Desktop"}(u,a);e!==t&&r(e)}),[c]),(0,d.jsxs)(d.Fragment,{children:[n,!u&&(0,d.jsx)(v.BlockControls,{children:(0,d.jsx)(b.Dropdown,{renderToggle:({isOpen:e,onToggle:t})=>(0,d.jsx)(b.ToolbarGroup,{children:(0,d.jsx)(b.Button,{"aria-expanded":e,onClick:t,icon:k().find((e=>e.value===o)).icon})}),renderContent:()=>(0,d.jsx)(b.MenuGroup,{children:(0,d.jsx)(b.MenuItemsChoice,{value:o,onSelect:e=>i(e),choices:k()})})})})]})};function A(){return!!document.querySelector("#edit-site-editor")}const G=({device:e})=>{const t={Desktop:14,Tablet:14,Mobile:10}[e]||14,r=(0,l.useRef)();return(0,d.jsx)("div",{className:"gutengrid-overlay bo-grid",ref:r,children:Array.from({length:t}).map(((e,t)=>(0,d.jsx)("div",{className:`gutengrid-overlay__col d-grid-${t+1}-${t+1} t-grid-${t+1}-${t+1} m-grid-${t+1}-${t+1}`,"data-col":t+1},t)))})},$=[["core/heading",{content:"Lorum Ipsum",className:"d-row-1 d-grid-2-6 t-grid-2-6 m-grid-2-5",style:{typography:{fontSize:"48px"},color:{text:"#ffffff"}}}],["core/paragraph",{content:"Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",className:"d-row-1 d-grid-6-14 t-grid-6-14 m-grid-5-10"}],["core/buttons",{className:"d-row-2 d-grid-2-6 t-grid-2-6 m-grid-2-10"},[["core/button",{text:"Click here",className:"is-style-fill"}]]]];class M extends l.Component{constructor(e){super(e),this.overlayRef=(0,l.createRef)(),this.state={inspectorDeviceType:"Desktop",viewPort:"Desktop",hasBoGrid:!0,hoveredColumn:null}}componentDidMount(){const e=!!document.querySelector("body.is-bo-grid-enabled")||(console.warn("%cBO Grid not detected on <main>. Please ensure your theme uses .bo-grid","color: orange; font-weight: bold;"),!1);this.setState({hasBoGrid:e}),this.addEditorGridClasses()}componentDidUpdate(){this.addEditorGridClasses()}componentWillUnmount(){}addEditorGridClasses=()=>{const e=this.overlayRef.current;if(!e)return;const t=e.querySelector(".block-editor-block-list__layout");t&&["d-full","t-full","m-full","bo-grid"].forEach((e=>{t.classList.contains(e)||t.classList.add(e)}))};canResizeBreakpoint(e){if(this.overlayRef&&this.overlayRef.current){const{width:t}=this.overlayRef.current.getBoundingClientRect();return t/C(e)>50}return!1}updateInspectorDevice(e){this.setState({inspectorDeviceType:e}),"Mobile"!==this.state.viewPort&&this.props.setPreviewDeviceType(e)}getPreviewMode(){return this.props.isBlockOrPatternPreview?"Desktop":"Desktop"===this.state.viewPort||"Mobile"===this.props.previewDeviceType?this.props.previewDeviceType:this.state.viewPort}getInspectorMode(){return"Desktop"===this.state.viewPort?this.props.previewDeviceType:this.state.inspectorDeviceType}handleGridHover=e=>{this.setState({hoveredColumn:e.detail.col})};render(){const{className:e,attributes:t={},isSelected:r,columns:i,setAttributes:n,updateAlignment:s,columnAttributes:l}=this.props,{viewPort:c}=this.state,u=this.getPreviewMode(),g=this.getInspectorMode(),{verticalAlignment:h}=t,m=a()(p(e,u).replace("layout-grid","layout-grid-editor"),"wp-block-gutengrid-editor",{"wp-block-jetpack-layout-tablet":"Tablet"===u,"wp-block-jetpack-layout-desktop":"Desktop"===u,"wp-block-jetpack-layout-mobile":"Mobile"===u,"wp-block-jetpack-layout-resizable":this.canResizeBreakpoint(u),[`are-vertically-aligned-${h}`]:h});return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(R,{currentViewport:c,updateViewport:e=>this.setState({viewPort:e,inspectorDeviceType:e})}),(0,d.jsxs)("div",{className:m,ref:this.overlayRef,children:[(0,d.jsx)(G,{device:u}),!this.state.hasBoGrid&&(0,d.jsxs)(b.Notice,{status:"warning",isDismissible:!1,children:[(0,d.jsx)("strong",{children:(0,o.__)("BO Grid missing","gutengrid")}),(0,d.jsx)("p",{children:(0,o.__)("This block requires the theme to implement a .bo-grid layout on the <main> element. Please ensure your theme supports BO Grid for correct layout behavior. A starter theme will be available soon.","gutengrid")})]}),(0,d.jsx)(v.InnerBlocks,{template:$,templateLock:!1,allowedBlocks:void 0})]}),(0,d.jsx)(v.InspectorControls,{children:(0,d.jsxs)(b.PanelBody,{title:(0,o.__)("Responsive Breakpoints","gutengrid"),children:[(0,d.jsx)("p",{className:"gutengrid-help",children:(0,o.__)("Previewing your post will show your browser's breakpoint, not the currently selected one.","gutengrid")}),(0,d.jsx)(b.ButtonGroup,{children:k().map((e=>(0,d.jsx)(b.Button,{isPrimary:e.value===g,onClick:()=>this.updateInspectorDevice(e.value),children:e.label},e.value)))})]})}),(0,d.jsx)(v.BlockControls,{children:(0,d.jsx)(v.BlockVerticalAlignmentToolbar,{onChange:s,value:h})})]})}}const L=(0,w.compose)([(0,s.withDispatch)(((e,t,r)=>({updateAlignment(i){const{clientId:o,setAttributes:n}=t,{updateBlockAttributes:s}=e("core/block-editor"),{getBlockOrder:l}=r.select("core/block-editor");n({verticalAlignment:i}),l(o).forEach((e=>{s(e,{verticalAlignment:i})}))}}))),(0,s.withDispatch)((e=>({setPreviewDeviceType(t){if(A())return e("core/edit-site")?.__experimentalSetPreviewDeviceType(t);e("core/edit-post")?.__experimentalSetPreviewDeviceType(t)}}))),(0,s.withSelect)((e=>A()?{previewDeviceType:e("core/edit-site")?.__experimentalGetPreviewDeviceType()}:{previewDeviceType:e("core/edit-post")?.__experimentalGetPreviewDeviceType()}))])((function(e){return(0,d.jsx)(b.Disabled.Consumer,{children:t=>(0,d.jsx)(M,{...e,isBlockOrPatternPreview:t})})}));console.log((0,o.__)("Testing translation load","gutengrid")),console.debug("registerBlock"),(0,i.registerBlockType)("gutengrid/grid",{title:(0,o.__)("Layout Grid","gutengrid"),description:(0,o.__)("Align blocks to a global grid, with support for responsive breakpoints.","gutengrid"),icon:e=>(0,d.jsxs)(b.SVG,{viewBox:"0 0 20.5 16",xmlns:"http://www.w3.org/2000/svg",...e,children:[(0,d.jsx)(b.Rect,{x:"3.5",y:"0",width:"3",height:"16",fill:"#27aae1"}),(0,d.jsx)(b.Rect,{x:"0",y:"0",width:"3",height:"16",fill:"#b9e5fb"}),(0,d.jsx)(b.Rect,{x:"7",y:"0",width:"3",height:"16",fill:"#27aae1"}),(0,d.jsx)(b.Rect,{x:"10.5",y:"0",width:"3",height:"16",fill:"#27aae1"}),(0,d.jsx)(b.Rect,{x:"14",y:"0",width:"3",height:"16",fill:"#27aae1"}),(0,d.jsx)(b.Rect,{x:"17.5",y:"0",width:"3",height:"16",fill:"#b9e5fb"})]}),category:"layout",supports:{align:["full"],html:!1},keywords:["grid","layout","_structure"],example:{attributes:{className:"has-preview-style"},innerBlocks:[...Array.from({length:14}).map(((e,t)=>{const r=t+1;return{name:"core/group",attributes:{className:`preview-col d-row-1-3 t-row-1-3 m-row-1-3 d-grid-${r}-${r} t-grid-${r}-${r} m-grid-${r}-${r} `,style:{color:{background:1===r||14===r?"#000":"#B9E5FB"},layout:{display:"block"},dimensions:{minHeight:"120px",height:"100%"}}}}})),{name:"core/paragraph",attributes:{content:"<strong>Snow Patrol</strong>",align:"center",style:{typography:{fontSize:48}},className:"d-row-1-2 t-row-1-2 d-grid-2-6 t-grid-2-6 m-grid-2-5 preview-handles"}},{name:"core/paragraph",attributes:{content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",align:"left",className:"d-row-1-4 t-row-1-4 d-grid-7-14 t-grid-7-14 m-grid-5-10 preview-handles",style:{dimensions:{height:"100%"},layout:{display:"block"}}}},{name:"core/buttons",innerBlocks:[{name:"core/button",attributes:{text:"Meer informatie",className:"is-style-fill"}}],attributes:{className:"d-row-2-3 t-row-2-3 d-grid-3-6 t-grid-3-6 m-grid-3-5 preview-handles"}}]},attributes:{},edit:L,save:({attributes:e,innerBlocks:t})=>{const r=e.device,{className:i}=e,o=a()(p(i,r),"d-full","t-full","m-full","bo-grid");return(0,d.jsx)("div",{className:o,children:(0,d.jsx)(v.InnerBlocks.Content,{})})}})}},r={};function i(e){var o=r[e];if(void 0!==o)return o.exports;var n=r[e]={exports:{}};return t[e](n,n.exports,i),n.exports}i.m=t,e=[],i.O=(t,r,o,n)=>{if(!r){var s=1/0;for(d=0;d<e.length;d++){for(var[r,o,n]=e[d],l=!0,c=0;c<r.length;c++)(!1&n||s>=n)&&Object.keys(i.O).every((e=>i.O[e](r[c])))?r.splice(c--,1):(l=!1,n<s&&(s=n));if(l){e.splice(d--,1);var a=o();void 0!==a&&(t=a)}}return t}n=n||0;for(var d=e.length;d>0&&e[d-1][2]>n;d--)e[d]=e[d-1];e[d]=[r,o,n]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={57:0,350:0};i.O.j=t=>0===e[t];var t=(t,r)=>{var o,n,[s,l,c]=r,a=0;if(s.some((t=>0!==e[t]))){for(o in l)i.o(l,o)&&(i.m[o]=l[o]);if(c)var d=c(i)}for(t&&t(r);a<s.length;a++)n=s[a],i.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return i.O(d)},r=globalThis.webpackChunkgutengrid=globalThis.webpackChunkgutengrid||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var o=i.O(void 0,[350],(()=>i(958)));o=i.O(o)})();