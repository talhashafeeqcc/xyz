mapp.utils.merge(mapp.dictionaries,{en:{layer_zoom_to_extent:"Zoom to filtered layer extent",layer_visibility:"Toggle visibility"},de:{layer_zoom_to_extent:"Zoom zum Ausma\xDF des gefilterten Datensatzes",layer_visibility:"Umschalten der Ansicht"},cn:{layer_zoom_to_extent:"\u7F29\u653E\u81F3\u76F8\u5E94\u7B5B\u9009\u8303\u56F4",layer_visibility:"\u5207\u6362\u53EF\u89C1\u6027"},pl:{layer_zoom_to_extent:"Poka\u017C zasi\u0119g warstwy",layer_visibility:"Widoczno\u015B\u0107"},ko:{layer_zoom_to_extent:"\uD544\uD130\uB41C \uB808\uC774\uC5B4\uD06C\uAE30\uC5D0 \uC90C(zoom)",layer_visibility:"\uD1A0\uAE00 \uAC00\uC2DC\uC131"},fr:{layer_zoom_to_extent:"Zoom sur l'\xE9tendue de la couche",layer_visibility:"Changer la visiblit\xE9"},ja:{layer_zoom_to_extent:"\u30D5\u30A3\u30EB\u30BF\u30FC\u3055\u308C\u305F\u30EC\u30A4\u30E4\u30FC\u7BC4\u56F2\u3092\u30BA\u30FC\u30E0\u306B",layer_visibility:"\u8868\u793A\u5207\u66FF"}});var y=e=>{let t=mapp.utils.html`
    <button
      title=${mapp.dictionary.layer_zoom_to_extent}
      class="mask-icon fullscreen"
      onclick=${o=>{e.zoomToExtent()}}>`,i=mapp.utils.html.node`
    <button
      data-id=display-toggle
      title=${mapp.dictionary.layer_visibility}
      class="${`mask-icon toggle ${e.display&&"on"||"off"}`}"
      onclick=${o=>{e.display?e.hide():e.show()}}>`,a=mapp.utils.html`
    <h2>${e.name||e.key}</h2>
    <div class="mask-icon expander"></div>
    ${t}
    ${i}`,l=Object.keys(e).map(o=>mapp.ui.layers.panels[o]&&mapp.ui.layers.panels[o](e)).filter(o=>typeof o<"u");if(e.meta){let o=mapp.utils.html.node`<p class="meta">`;o.innerHTML=e.meta,l.unshift(o)}e.view=mapp.ui.elements.drawer({data_id:"layer-drawer",class:"layer-view",header:a,content:l}),e.showCallbacks.push(()=>{i.classList.add("on"),e.tabs?.forEach(o=>o.display&&o.show&&o.show())}),e.hideCallbacks.push(()=>{i.classList.remove("on"),e.tabs?.forEach(o=>o.remove())}),e.mapview.Map.getTargetElement().addEventListener("changeEnd",()=>{if(!!e.tables){if(e.tableCurrent()===null)return e.view.classList.add("disabled");e.view.classList.remove("disabled")}}),e.view.children.length<=1&&e.view.classList.add("empty")};mapp.utils.merge(mapp.dictionaries,{en:{layer_group_hide_layers:"Toggle all layers in group"},de:{layer_group_hide_layers:"Umschalten aller Ebenen in Gruppe"},cn:{layer_group_hide_layers:"\u9690\u85CF\u56FE\u5C42"},pl:{layer_group_hide_layers:"Ukryj warstwy z tej grupy"},ko:{layer_group_hide_layers:"\uADF8\uB8F9\uC5D0\uC11C \uB808\uC774\uC5B4 \uC228\uAE30\uAE30"},fr:{layer_group_hide_layers:"Cacher les couches du groupe"},ja:{layer_group_hide_layers:"\u30B0\u30EB\u30FC\u30D7\u304B\u3089\u30EC\u30A4\u30E4\u30FC\u3092\u96A0\u3059"}});function O(e){if(!e.mapview||!e.target)return;let t={node:e.target,groups:{}};Object.values(e.mapview.layers).forEach(l=>i(l));function i(l){if(!l.hidden){if(y(l),!l.group){t.node.appendChild(l.view),t.node.dispatchEvent(new CustomEvent("addLayerView",{detail:l}));return}t.groups[l.group]||a(l),t.groups[l.group].addLayer(l),t.node.dispatchEvent(new CustomEvent("addLayerView",{detail:l}))}}function a(l){let o={list:[]};t.groups[l.group]=o;let n=mapp.utils.html.node`
      <button
        class="mask-icon toggle"
        title=${mapp.dictionary.layer_group_hide_layers}
        onclick=${r=>{if(r.target.classList.toggle("on"),r.target.classList.contains("on")){o.list.filter(s=>!s.display).forEach(s=>s.show());return}o.list.filter(s=>s.display).forEach(s=>s.hide())}}>`;o.meta=mapp.utils.html.node`<div class="meta">`,o.drawer=mapp.ui.elements.drawer({data_id:"layer-drawer",class:"layer-group",header:mapp.utils.html`
        <h2>${l.group}</h2>
        <div class="mask-icon expander"></div>
        ${n}`,content:o.meta}),t.node.appendChild(o.drawer),o.chkVisibleLayer=()=>{o.list.some(r=>r.display)?n.classList.add("on"):n.classList.remove("on")},o.addLayer=r=>{if(r.group=o,r.groupmeta){let s=o.meta.appendChild(mapp.utils.html.node`<div>`);s.innerHTML=r.groupmeta}o.list.push(r),o.drawer.appendChild(r.view),o.chkVisibleLayer(),r.showCallbacks.push(()=>o.chkVisibleLayer()),r.hideCallbacks.push(()=>o.chkVisibleLayer())}}}var M={like:T,match:T,numeric:D,integer:D,in:Ve,date:q,datetime:q,boolean:Re},k;function $(e,t){clearTimeout(k),k=setTimeout(()=>{k=null,e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))},500)}function T(e,t){return mapp.utils.html`
  <input
    type="text"
    onkeyup=${i=>{i.target.value.length?e.filter.current[t.filter.field]={[t.filter.type]:encodeURIComponent(i.target.value)}:delete e.filter.current[t.filter.field],$(e)}}>`}function Re(e,t){return mapp.ui.elements.chkbox({label:t.label||t.title||"chkbox",onchange:i=>{e.filter.current[t.filter.field]={boolean:i},e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))}})}async function D(e,t){let i=await mapp.utils.xhr(`${e.mapview.host}/api/query?${mapp.utils.paramString({template:"field_stats",locale:e.mapview.locale.key,layer:e.key,table:e.tableCurrent(),field:t.field})}`);if(!i)return;let a=t.filter.type==="integer"?1:.01;return e.filter.current[t.field]=Object.assign({gte:Number(i.min),lte:Number(i.max)},e.filter.current[t.field]),$(e),mapp.ui.elements.slider_ab({min:i.min,max:i.max,step:a,label_a:"Greater than",val_a:i.min,callback_a:l=>{e.filter.current[t.field].gte=Number(l.target.value),$(e)},label_b:"Lesser than",val_b:i.max,callback_b:l=>{e.filter.current[t.field].lte=Number(l.target.value),$(e)}})}async function Ve(e,t){if(t.filter.distinct){let a=await mapp.utils.xhr(`${e.mapview.host}/api/query?`+mapp.utils.paramString({template:"distinct_values",dbs:e.dbs,table:e.tableCurrent(),field:t.field}));t.filter.in=a.map(l=>l[t.field]).filter(l=>l!==null)}let i=new Set(e.filter?.current[t.filter.field]?.in||[]);return t.filter.dropdown?mapp.ui.elements.dropdown_multi({placeholder:"Select Multiple",entries:t.filter.in.map(a=>({title:a,option:a})),callback:async(a,l)=>{Object.assign(e.filter.current,{[t.filter.field]:{in:l}}),e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))}}):t.filter.in.map(a=>mapp.ui.elements.chkbox({val:a,label:a,checked:i.has(a),onchange:(l,o)=>{if(l)e.filter.current[t.filter.field]||(e.filter.current[t.filter.field]={}),e.filter.current[t.filter.field].in||(e.filter.current[t.filter.field].in=[]),e.filter.current[t.filter.field].in.push(encodeURIComponent(o));else{let n=e.filter.current[t.filter.field].in.indexOf(encodeURIComponent(o));e.filter.current[t.filter.field].in.splice(n,1),e.filter.current[t.filter.field].in.length||delete e.filter.current[t.filter.field].in}e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))}}))}function q(e,t){let i=mapp.utils.html.node`
    <input
      data-id="inputAfter"
      onchange=${l}
      type=${t.type==="datetime"&&"datetime-local"||"date"}>`,a=mapp.utils.html.node`
    <input
      data-id="inputBefore"
      onchange=${l}
      type=${t.type==="datetime"&&"datetime-local"||"date"}>`;function l(o){o.target.dataset.id==="inputAfter"&&(e.filter.current[t.field]=Object.assign(e.filter.current[t.field]||{},{gt:new Date(o.target.value).getTime()/1e3})),o.target.dataset.id==="inputBefore"&&(e.filter.current[t.field]=Object.assign(e.filter.current[t.field]||{},{lt:new Date(o.target.value).getTime()/1e3})),e.reload(),e.mapview.Map.getTargetElement().dispatchEvent(new Event("changeEnd"))}return mapp.utils.html`
    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      grid-gap: 5px;">
      <label>Date after
        ${i}</label>
      <label>Date before
        ${a}</label>`}mapp.utils.merge(mapp.dictionaries,{en:{layer_add_new_location:"Add new locations"},de:{layer_add_new_location:"Erstelle neue Lage"},cn:{layer_add_new_location:"\u6570\u636E\u68C0\u89C6"},pl:{layer_add_new_location:"Dodaj nowe miejsca"},ko:{layer_add_new_location:"\uC0C8\uB85C\uC6B4 \uC704\uCE58 \uCD94\uAC00"},fr:{layer_add_new_location:"Ajouter des nouveaux lieux"},ja:{layer_add_new_location:"\u65B0\u3057\u3044\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u3092\u8FFD\u52A0"}});var I=e=>{let t={layer:e,srid:e.srid,edit:e.edit,mapview:e.mapview},i=typeof e.edit=="object"&&Object.keys(e.edit).map(l=>mapp.ui.elements.drawing[l]&&mapp.ui.elements.drawing[l](t,Ge)).filter(l=>!!l);return i?mapp.ui.elements.drawer({data_id:"draw-drawer",class:"lv-1",header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_add_new_location}</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`
      ${i}`}):void 0};function Ge(e,t){let i=e.target;if(i.classList.contains("active")){i.classList.remove("active"),t.mapview.interactions.highlight();return}i.classList.add("active"),t.layer.show(),t.layer.view.querySelector(".header").classList.add("edited","active"),t.mapview.interactions.draw({type:t.type,geometryFunction:t.geometryFunction,tooltip:t.tooltip,srid:t.srid,callback:async a=>{if(a){let l={layer:t.layer};l.id=await mapp.utils.xhr({method:"POST",url:`${l.layer.mapview.host}/api/location/new?`+mapp.utils.paramString({locale:l.layer.mapview.locale.key,layer:l.layer.key,table:l.layer.tableCurrent()}),body:JSON.stringify({geometry:a.geometry})}),t.layer.reload(),mapp.location.get(l)}t.layer.view.querySelector(".header").classList.remove("edited","active"),i.classList.contains("active")&&(i.classList.remove("active"),t.mapview.interactions.highlight())}})}mapp.utils.merge(mapp.dictionaries,{en:{layer_filter_header:"Filter",layer_filter_select:"Select filter from list"},de:{layer_filter_header:"Filter",layer_filter_select:"Filter Auswahl"},cn:{layer_filter_header:"\u7B5B\u9009",layer_filter_select:"\u4ECE\u5217\u8868\u7B5B\u9009"},pl:{layer_filter_header:"Filtruj",layer_filter_select:"Wybierz filtr z listy"},ko:{layer_filter_header:"\uD544\uD130",layer_filter_select:"\uB9AC\uC2A4\uD2B8\uB85C \uBD80\uD130 \uD544\uD130 \uC120\uD0DD"},fr:{layer_filter_header:"Filtres",layer_filter_select:"Choisir un filtre dans la liste"},ja:{layer_filter_header:"\u30D5\u30A3\u30EB\u30BF\u30FC",layer_filter_select:"\u30EA\u30B9\u30C8\u304B\u3089\u30D5\u30A3\u30EB\u30BF\u30FC\u3092\u9078\u629E"}});var F=e=>{if(!e.infoj?.some(a=>a.filter))return;e.filter.list=e.infoj.filter(a=>a.filter);let t=mapp.ui.elements.dropdown({data_id:`${e.key}-filter-dropdown`,placeholder:mapp.dictionary.layer_filter_select,entries:e.filter.list,callback:async(a,l)=>{if(e.filter.view.querySelector("[data-id=clearall]").style.display="block",l.filter.card||(l.filter.field=l.filter.field||l.field,l.filter.remove=()=>{delete e.filter.current[l.filter.field],delete l.filter.card,e.reload(),e.filter.view.querySelector("[data-id=clearall]").style.display=e.filter.view.children.length===3?"none":"block"},!mapp.ui.layers.filters[l.filter.type]))return;l.filter.field=l.filter.field||l.field;let o=await mapp.ui.layers.filters[l.filter.type](e,l);l.filter.card=e.filter.view.appendChild(mapp.ui.elements.card({header:l.filter_title||l.title,close:l.filter.remove,content:o}))}}),i=mapp.utils.html`
    <button
      data-id=clearall
      class="primary-colour"
      style="display: none; margin-bottom: 5px;"
      onclick=${a=>{e.filter.list.filter(l=>l.filter.card).forEach(l=>{l.filter.card.querySelector("[data-id=close]").click()}),e.reload()}}>${mapp.dictionary.layer_filter_clear_all}`;return e.filter.view=mapp.ui.elements.drawer({data_id:"filter-drawer",class:"lv-1",header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_filter_header}</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`
      ${t}
      ${i}`}),e.filter.view};mapp.utils.merge(mapp.dictionaries,{en:{layer_dataview_header:"Data Views"},de:{layer_dataview_header:"Datenansichten"},cn:{layer_dataview_header:"\u6570\u636E\u68C0\u89C6"},pl:{layer_dataview_header:"Widoki danych"},ko:{layer_dataview_header:"\uB370\uC774\uD130 \uBCF4\uAE30"},fr:{layer_dataview_header:"Vues des donn\xE9es"},ja:{layer_dataview_header:"\u30C7\u30FC\u30BF\u30D3\u30E5\u30FC"}});var P=e=>{let t=Object.entries(e.dataviews).map(a=>{let l=Object.assign(a[1],{key:a[0],layer:e,host:e.mapview.host}),o=document.querySelector(`[data-id=${l.target}]`);if(!o)return;e.display&&l.display&&n();function n(){if(l.show)return l.show();mapp.ui.Dataview(l).then(()=>l.show()),o.dispatchEvent(new CustomEvent("addTab",{detail:l})),e.tabs?e.tabs.push(l):e.tabs=[l]}return e.showCallbacks.push(()=>{l.display&&n()}),mapp.ui.elements.chkbox({label:l.title||l.key,checked:!!l.display,onchange:r=>{l.display=r,l.display?n():l.remove()}})});return mapp.ui.elements.drawer({data_id:"dataviews-drawer",class:"lv-1",header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_dataview_header}</h3>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`${t}`})};var A=e=>{let t=Object.keys(e.reports).map(a=>{let l=e.reports[a];l.key=a,l.host=e.mapview.host;let o=`${l.host}/view?${mapp.utils.paramString({template:l.template,lat:mapp.hooks.current?.lat,lng:mapp.hooks.current?.lng,z:mapp.hooks.current?.z})}`;return mapp.utils.html`
      <a
        class="link-with-img"
        target="_blank"
        href="${o}">
        <div class="mask-icon event-note"></div>
        <span>${l.title||l.key}`});return mapp.ui.elements.drawer({data_id:"reports-drawer",class:"lv-1",header:mapp.utils.html`
      <h4>Reports</h4>
      <div class="mask-icon expander"></div>`,content:mapp.utils.html`${t}`})};mapp.utils.merge(mapp.dictionaries,{en:{layer_style_header:"Style",layer_style_select_theme:"Select thematic style",layer_style_display_labels:"Display labels",layer_style_switch_caption:"Click on labels to switch visibility or ",layer_style_switch_all:"switch all",layer_grid_legend_ratio:"Display colour as a ratio to the size",layer_style_cluster:"Multiple locations"},de:{layer_style_header:"Stil",layer_style_select_theme:"Auswahl eines thematischen Stiles",layer_style_display_labels:"Umschalten der Label Ansicht",layer_style_switch_caption:"Auswahl der Label schaltet Ansicht um oder ",layer_style_switch_all:"Alle ausw\xE4hlen",layer_grid_legend_ratio:"Farbe im Verh\xE4ltnis zur Gr\xF6\xDFe",layer_style_cluster:"Mehrere Lagen"},cn:{layer_style_header:"\u98CE\u683C\u6837\u5F0F",layer_style_select_theme:"\u9009\u62E9\u4E3B\u9898\u98CE\u683C",layer_style_display_labels:"\u663E\u793A\u6807\u7B7E",layer_style_switch_caption:"\u5355\u51FB\u56FE\u6807\u4EE5\u5207\u6362\u53EF\u89C1\u6027 ",layer_style_switch_all:"\u5168\u90E8\u5207\u6362",layer_grid_legend_ratio:"\u663E\u793A\u989C\u8272\u4E0E\u5C3A\u5BF8\u6BD4\u4F8B",layer_style_cluster:"\u591A\u4E2A\u5730\u70B9"},pl:{layer_style_header:"Styl",layer_style_select_theme:"Wybierz styl tematyczny",layer_style_display_labels:"Poka\u017C etykiety",layer_style_switch_caption:"Kliknij etykiety aby zmieni\u0107 widoczno\u015B\u0107 albo ",layer_style_switch_all:"zmie\u0144 wszystkie",layer_grid_legend_ratio:"Poka\u017C kolor w proporcji do rozmiaru",layer_style_cluster:"Wi\u0119cej miejsc"},ko:{layer_style_header:"\uC2A4\uD0C0\uC77C",layer_style_select_theme:"\uC8FC\uC81C\uBCC4 \uC2A4\uD0C0\uC77C \uC120\uD0DD",layer_style_display_labels:"\uB77C\uBCA8 \uD45C\uC2DC",layer_style_switch_caption:"\uAC00\uC2DC\uC131 \uBCC0\uACBD\uC744 \uC704\uD574 \uB77C\uBCA8 \uD074\uB9AD \uB610\uB294 ",layer_style_switch_all:"\uBAA8\uB450 \uBCC0\uACBD",layer_grid_legend_ratio:"\uD06C\uAE30\uBE44\uC728\uC5D0 \uB530\uB978 \uC0C9\uC0C1 \uD45C\uC2DC",layer_style_cluster:"\uBCF5\uC218 \uC704\uCE58"},fr:{layer_style_header:"Style",layer_style_select_theme:"Choisir un th\xE8me dans la liste",layer_style_display_labels:"Afficher les \xE9tiquettes",layer_style_switch_caption:"Cliquer sur l'etiquette pour changer la visiblit\xE9 ou ",layer_style_switch_all:"changer tout",layer_grid_legend_ratio:"Rapport de coleur et de taille",layer_style_cluster:"Plusieurs lieux"},ja:{layer_style_header:"\u30B9\u30BF\u30A4\u30EB",layer_style_select_theme:"\u30C6\u30FC\u30DE\u30B9\u30BF\u30A4\u30EB\u3092\u9078\u629E",layer_style_display_labels:"\u30E9\u30D9\u30EB\u3092\u8868\u793A",layer_style_switch_caption:"\u8868\u793A\u5207\u66FF\u3048\u306B\u306F\u5404\u30E9\u30D9\u30EB\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u304B ",layer_style_switch_all:"\u5168\u8868\u793A\u6216\u3044\u306F\u5168\u975E\u8868\u793A",layer_grid_legend_ratio:"\u8272\u306F\u30B5\u30A4\u30BA\u306E\u6BD4\u7387\u3067\u8868\u793A",layer_style_cluster:"\u591A\u6570\u306E\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3"}});var R=e=>{if(e.style.hidden)return;let t=[];if(e.style.label){let i=mapp.ui.elements.chkbox({data_id:"labelCheckbox",label:e.style.label.title||mapp.dictionary.layer_style_display_labels,checked:!!e.style.label.display,onchange:a=>{e.style.label.display=a,e.L.setStyle(e.L.getStyle())}});(e.style.label.minZoom||e.style.label.maxZoom)&&e.mapview.Map.getTargetElement().addEventListener("changeEnd",()=>{let a=e.mapview.Map.getView().getZoom(),l=e.view.querySelector("[data-id=labelCheckbox]");if(a<=e.style.label.minZoom||a>=e.style.label.maxZoom)return l.classList.add("disabled");l.classList.remove("disabled")}),t.push(i)}if(e.style.themes&&Object.keys(e.style.themes).length>1&&t.push(mapp.utils.html`
      <div>${mapp.dictionary.layer_style_select_theme}</div>
        ${mapp.ui.elements.dropdown({entries:Object.keys(e.style.themes).map(i=>({title:e.style.themes[i].title||i,option:i})),callback:(i,a)=>{e.style.theme=e.style.themes[a.option],mapp.utils.render(e.style.drawer.querySelector(".drawer > .legend"),mapp.ui.layers.styles[e.style.theme.type](e)),e.reload()}})}`),e.style.theme&&!e.style.themes&&t.push(mapp.utils.html`
      <h3>${e.style.theme.title}</h3>`),e.style.theme&&t.push(mapp.utils.html`
    <div class="legend">
      ${mapp.ui.layers.styles[e.style.theme.type]&&mapp.ui.layers.styles[e.style.theme.type](e)}`),!!t.length)return e.style.drawer=mapp.ui.elements.drawer({data_id:"style-drawer",class:"lv-1",header:mapp.utils.html`
      <h3>${mapp.dictionary.layer_style_header}</h3>
      <div class="mask-icon expander"></div>`,content:t}),e.style.drawer};var V=e=>{let t=e.style.theme,i=[];if(i.push(mapp.utils.html`
    <div
      class="switch-all"
      style="grid-column: 1/3;">
      ${mapp.dictionary.layer_style_switch_caption}
      <button
        class="primary-colour bold"
        onclick=${a=>{a.target.closest(".legend").querySelectorAll(".switch").forEach(l=>l.click()),e.reload()}}>${mapp.dictionary.layer_style_switch_all}</button>.`),Object.entries(t.cat).forEach(a=>{let l=Object.assign({},e.style.default,a[1].style&&a[1].style.icon||a[1].style||a[1]),o=mapp.utils.html`
      <div
        style="height: 24px; width: 24px;">
        ${mapp.ui.elements.legendIcon(Object.assign({width:24,height:24},l))}`,n=mapp.utils.html`
      <div
        class=${`label switch ${e.filter.current[t.field]?.ni?.indexOf(a[0])===0?"disabled":""}`}
        onclick=${r=>{r.target.classList.toggle("disabled"),r.target.classList.contains("disabled")?(e.filter.current[t.field]||(e.filter.current[t.field]={}),e.filter.current[t.field].ni||(e.filter.current[t.field].ni=[]),e.filter.current[t.field].ni.push(a[1].keys||a[0]),e.filter.current[t.field].ni=e.filter.current[t.field].ni.flat()):(Array.isArray(a[1].keys)?a[1].keys.forEach(s=>{e.filter.current[t.field].ni.splice(e.filter.current[t.field].ni.indexOf(s),1)}):e.filter.current[t.field].ni.splice(e.filter.current[t.field].ni.indexOf(a[0]),1),e.filter.current[t.field].ni.length||delete e.filter.current[t.field]),e.reload()}}>${a[1].label||a[0]}`;i.push(mapp.utils.html`
    <div 
      data-id=${a[0]}
      class="contents">
      ${o}${n}`)}),e.style.cluster){let a=mapp.utils.html`
      <div
        style="height: 40px; width: 40px;">
        ${mapp.ui.elements.legendIcon(Object.assign({width:40,height:40},e.style.default,e.style.cluster))}`,l=mapp.utils.html`
      <div
        class="label">
        ${mapp.dictionary.layer_style_cluster}`;i.push(mapp.utils.html`
      <div 
        data-id="cluster"
        class="contents">
        ${a}${l}`)}return e.style.legend=mapp.utils.html.node`<div class="grid">${i}`,e.style.legend};var G=e=>{let t=e.style.theme,i=[];return t.cat_arr.forEach(a=>{let l=Object.assign({},e.style.default,a.style&&a.style.icon||a.style||a),o=mapp.utils.html`
      <div
        style="height: 24px; width: 24px;">
        ${mapp.ui.elements.legendIcon(Object.assign({width:24,height:24},l))}`,n=mapp.utils.html`
      <div class="label">${a.label||a.value}`;i.push(mapp.utils.html`
      <div 
        data-id=${a.value}
        class="contents">
        ${o}${n}`)}),e.style.legend=mapp.utils.html.node`<div class="grid">${i}`,e.style.legend};var B=e=>{let t=[];t.push(mapp.ui.elements.dropdown({entries:Object.entries(e.grid_fields).map(o=>({title:o[0],options:o[1]})),callback:(o,n)=>{e.grid_size=n.options,e.reload()}}));let i=e.style.range.length,a=new XMLSerializer,l=mapp.utils.html`
  <div
    class="grid"
    style=${`grid-template-columns: repeat(${i}, 1fr); grid-template-rows: 20px 20px 20px 20px;`}>
    <div data-id="size-labels" class="contents">
      <span data-id="size-min" style="grid-row:1;grid-column:1;">min</span>
      <span data-id="size-avg" style=${`grid-row:1;grid-column:${Math.ceil(i/2)};text-align:center;`}>avg</span>
      <span data-id="size-max" style=${`grid-row:1;grid-column:${i};text-align:end;`}>max</span>
    </div>
    <div data-id="size-icons" class="contents">
      ${e.style.range.map((o,n)=>{let r=mapp.utils.svg.node`<svg height=50 width=50>
          <circle
            fill='#777'
            cx=27
            cy=27
            r='${23/i*(n+1)}'/>
          <circle
            fill='#999'
            cx=25
            cy=25
            r='${23/i*(n+1)}'/>`,s=`data:image/svg+xml,${encodeURIComponent(a.serializeToString(r))}`,d=`
          grid-row:2;
          grid-column:${n+1};
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          width: 100%;
          height: 100%;
          background-image: url(${s});`;return mapp.utils.html`<div style=${d}>`})}
    </div>
    <div data-id="colour-icons" class="contents">
      ${e.style.range.map((o,n)=>mapp.utils.html`
        <div style=${`grid-row:3;grid-column:${n+1};background-color:${o};width:100%;height:100%;`}>
      `)}
    </div>
    <div data-id="colour-labels" class="contents">
      <span data-id="color-min" style="grid-row:4;grid-column:1;">min</span>
      <span data-id="color-avg" style=${`grid-row:4;grid-column:${Math.ceil(i/2)};text-align:center;`}>avg</span>
      <span data-id="color-max" style=${`grid-row:4;grid-column:${i};text-align:end;`}>max</span>
    </div>
  </div>`;return t.push(l),t.push(mapp.ui.elements.dropdown({entries:Object.entries(e.grid_fields).map(o=>({title:o[0],options:o[1]})),span:Object.keys(e.grid_fields)[1],callback:(o,n)=>{e.grid_color=n.options,e.reload()}})),t.push(mapp.ui.elements.chkbox({label:mapp.dictionary.layer_grid_legend_ratio,onchange:o=>{e.grid_ratio=o,e.reload()}})),e.style.legend=mapp.utils.html.node`
    <div class="legend">${t}`,e.style.legend.addEventListener("update",()=>{e.style.legend.querySelector("[data-id=size-min]").textContent=e.sizeMin.toLocaleString("en-GB",{maximumFractionDigits:0}),e.style.legend.querySelector("[data-id=size-avg]").textContent=e.sizeAvg.toLocaleString("en-GB",{maximumFractionDigits:0}),e.style.legend.querySelector("[data-id=size-max]").textContent=e.sizeMax.toLocaleString("en-GB",{maximumFractionDigits:0}),e.grid_ratio?(e.style.legend.querySelector("[data-id=color-min]").textContent=e.colorMin.toLocaleString("en-GB",{maximumFractionDigits:0,style:"percent"}),e.style.legend.querySelector("[data-id=color-avg]").textContent=e.colorAvg.toLocaleString("en-GB",{maximumFractionDigits:0,style:"percent"}),e.style.legend.querySelector("[data-id=color-max]").textContent=e.colorMax.toLocaleString("en-GB",{maximumFractionDigits:0,style:"percent"})):(e.style.legend.querySelector("[data-id=color-min]").textContent=e.colorMin.toLocaleString("en-GB",{maximumFractionDigits:0}),e.style.legend.querySelector("[data-id=color-avg]").textContent=e.colorAvg.toLocaleString("en-GB",{maximumFractionDigits:0}),e.style.legend.querySelector("[data-id=color-max]").textContent=e.colorMax.toLocaleString("en-GB",{maximumFractionDigits:0}))}),e.style.legend};var H=e=>{let t=[],i=mapp.utils.html`
  <div
    style="height: 24px; width: 24px;">
    ${mapp.ui.elements.legendIcon(Object.assign({width:24,height:24},Object.assign({},e.style.default,e.style.theme.style)))}`;return t.push(mapp.utils.html`
    <div 
      class="contents">
      ${i}<div class="label">${e.style.theme.label}`),e.style.legend=mapp.utils.html.node`<div class="grid">${t}`,e.style.legend};var N={view:y,listview:O,filters:M,panels:{edit:I,style:R,filter:F,reports:A,dataviews:P},styles:{categorized:V,graduated:G,grid:B,basic:H}};mapp.utils.merge(mapp.dictionaries,{en:{location_zoom:"Zoom map to feature bounds",location_save:"Save changes to cloud",location_remove:"Remove feature from selection",location_delete:"Delete location"},de:{location_zoom:"Ansicht den Lagen Geometrien anpassen",location_save:"Speichern der Daten\xE4nderungen",location_remove:"Lagen Auswahl aufheben",location_delete:"L\xF6schen der Lage"},cn:{location_zoom:"\u7F29\u653E\u5730\u56FE\u81F3\u76EE\u6807\u8303\u56F4",location_save:"\u5C06\u66F4\u6539\u4FDD\u5B58\u81F3\u4E91",location_remove:"\u5220\u9664\u6240\u9009\u76EE\u6807\u8981\u7D20",location_delete:"\u5220\u9664\u5730\u70B9"},pl:{location_zoom:"Poka\u017C zasi\u0119g miejsca",location_save:"Zapisz zmiany",location_remove:"Odznacz miejsce",location_delete:"Usu\u0144 miejsce"},ko:{location_zoom:"\uD55C\uACC4\uB97C \uD3EC\uD568\uD55C \uC90C \uC9C0\uB3C4",location_save:"\uBCC0\uACBD\uC0AC\uD56D \uD06C\uB77C\uC6B0\uB4DC \uC800\uC7A5",location_remove:"\uC120\uD0DD\uC5D0\uC11C \uD2B9\uC9D5 \uC81C\uAC70",location_delete:"\uC704\uCE58 \uC0AD\uC81C"},fr:{location_zoom:"Zoom sur le lieu",location_save:"Enregistrer les modifications",location_remove:"Le d\xE9s\xE9lectionner",location_delete:"Supprimer le lieu"},ja:{location_zoom:"\u30D5\u30A3\u30FC\u30C1\u30E3\u7BC4\u56F2\u306B\u306F\u30DE\u30C3\u30D7\u3092\u30BA\u30FC\u30E0",location_save:"\u30AF\u30E9\u30A6\u30C9\u306B\u5909\u66F4\u3092\u4FDD\u5B58",location_remove:"\u9078\u629E\u304B\u3089\u30D5\u30A3\u30FC\u30C1\u30E3\u30FC\uFF08\u6A5F\u80FD\uFF09\u3092\u524A\u9664",location_delete:"\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u3092\u524A\u9664"}});var U=e=>{e.removeCallbacks?.push(function(){e.view.remove()}),e.updateCallbacks?.push(function(){e.view.dispatchEvent(new Event("updateInfo"))});let t=[mapp.utils.html`<h2>${e.record.symbol}`,mapp.utils.html`<div class="mask-icon expander">`];e.infoj.some(a=>(a.type==="pin"||a.type==="geometry")&&a.value)&&t.push(mapp.utils.html`
    <button
      title = ${mapp.dictionary.location_zoom}
      class = "mask-icon search"
      onclick = ${a=>{e.flyTo()}}>`),e.layer?.toggleLocationViewEdits&&(e.infoj.forEach(a=>{!a.edit||(a._edit=a.edit,delete a.edit)}),t.push(mapp.utils.html`
      <button
        title = "Enable edits"
        class = "mask-icon build"
        onclick = ${a=>{e.infoj.forEach(l=>{!l._edit||(l.edit=l._edit,delete l._edit)}),i.remove(),a.target.style.display="none",i=mapp.ui.locations.infoj(e),e.view.appendChild(i)}}>`)),t.push(mapp.utils.html`
    <button
      title = ${mapp.dictionary.location_save}
      class = "mask-icon cloud-upload"
      style = "display: none;"
      onclick = ${a=>{e.view.classList.add("disabled"),e.update()}}>`),e.layer?.edit?.delete&&t.push(mapp.utils.html`
    <button
      title = ${mapp.dictionary.location_delete}
      class = "mask-icon trash"
      onclick = ${a=>{e.trash()}}>`),t.push(mapp.utils.html`
    <button
      title = ${mapp.dictionary.location_remove}
      class = "mask-icon close no"
      onclick = ${a=>{e.remove()}}>`),e.view=mapp.ui.elements.drawer({class:"location-view expanded",header:t});let i=e.view.appendChild(mapp.ui.locations.infoj(e));e.view.querySelector(".header").style.borderBottom=`3px solid ${e.record.colour}`,e.view.addEventListener("valChange",a=>{a.detail.value!=a.detail.newValue?a.detail.node.classList.add("val-changed"):(delete a.detail.newValue,a.detail.node.classList.remove("val-changed")),e.view.querySelector(".cloud-upload").style.display=e.infoj.some(l=>typeof l.newValue<"u")&&"inline-block"||"none"}),e.view.addEventListener("updateInfo",()=>{i.remove(),e.view.querySelector(".cloud-upload").style.display="none",e.view.classList.remove("disabled"),i=mapp.ui.locations.infoj(e),e.view.appendChild(i)})};mapp.utils.merge(mapp.dictionaries,{en:{location_clear_all:"Clear locations"},de:{location_clear_all:"Entferne Auswahl"},cn:{location_clear_all:"\uBAA8\uB4E0 \uC704\uCE58 \uC81C\uAC70"},pl:{location_clear_all:"Wyczy\u015B\u0107 selekcje"},ko:{location_clear_all:"\u6E05\u9664\u6240\u6709\u5730\u70B9"},fr:{location_clear_all:"Des\xE9lectionner tous les lieux."},ja:{location_clear_all:"\u5168\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3\u3092\u30AF\u30EA\u30A2"}});var W=[{symbol:"A",colour:"#2E6F9E"},{symbol:"B",colour:"#EC602D"},{symbol:"C",colour:"#5B8C5A"},{symbol:"D",colour:"#B84444"},{symbol:"E",colour:"#514E7E"},{symbol:"F",colour:"#E7C547"},{symbol:"G",colour:"#368F8B"},{symbol:"H",colour:"#841C47"},{symbol:"I",colour:"#61A2D1"},{symbol:"J",colour:"#37327F"}],J=e=>{if(!e.mapview||!e.target)return;let t={node:e.target,mapview:e.mapview},i=t.node.appendChild(mapp.utils.html.node`
    <button 
      style="display: none; width: 100%; text-align: right;"
      class="tab-display bold primary-colour text-shadow"
      onclick=${a=>{Object.values(t.mapview.locations).forEach(l=>l.remove())}}>
      ${mapp.dictionary.location_clear_all}`);return e.mapview.locations=new Proxy(e.mapview.locations,{set:function(a,l,o){let n=W.find(r=>!r.hook);return n.hook=o.hook,o.record=n,o.style={strokeColor:n.colour,fillColor:n.colour,fillOpacity:.2},o.Style=mapp.utils.style([{strokeColor:"#000",strokeOpacity:.1,strokeWidth:8},{strokeColor:"#000",strokeOpacity:.1,strokeWidth:6},{strokeColor:"#000",strokeOpacity:.1,strokeWidth:4},{strokeColor:o.style.strokeColor||"#000",strokeWidth:2,fillColor:o.style.fillColor||o.style.strokeColor||"#fff",fillOpacity:o.style.fillOpacity||.2}]),o.pinStyle=mapp.utils.style({icon:{type:"markerLetter",letter:n.symbol,color:o.style.strokeColor,scale:3,anchor:[.5,1]}}),Reflect.set(...arguments),mapp.ui.locations.view(o),Object.values(t.node.children).forEach(r=>r.classList.remove("expanded")),t.node.insertBefore(o.view,i.nextSibling),o.view.dispatchEvent(new Event("addLocationView")),i.style.display="block",document.querySelector("[data-id=locations]").click(),!0},deleteProperty:function(a,l){Reflect.deleteProperty(...arguments);let o=W.find(n=>n.hook===l);return o&&delete o.hook,setTimeout(()=>{if(!document.querySelectorAll("#locations > .location-view").length){document.querySelector("[data-id=layers]").click(),i.style.display="none";let n=document.querySelector("#locations #gazetteerInput");n?n.value="":document.querySelector("[data-id=locations]").style.display="none"}},300),!0}}),t};var Z=(e,t)=>{if(!e.infoj)return;let i=mapp.utils.html.node`<div class="location-view-grid">`,a={};for(let l of t||e.infoj){if(e.view&&e.view.classList.contains("disabled"))break;if(l.listview=i,l.type=l.type||"text",l.skipEntry||l.skipFalsyValue&&!l.value&&!l.edit||l.skipUndefinedValue&&typeof l.value>"u"&&!l.edit||l.skipNullValue&&l.value===null&&!l.edit)continue;l.nullValue&&l.value===null&&!l.defaults&&!l.edit&&(l.value=l.nullValue),l.group&&(a[l.group]||(a[l.group]=l.listview.appendChild(mapp.ui.elements.drawer({class:`lv-1 group ${l.expanded&&"expanded"||""}`,header:mapp.utils.html`
              <h3>${l.group}</h3>
              <div class="mask-icon expander"></div>`}))),l.listview=a[l.group]),l.node=l.listview.appendChild(mapp.utils.html.node`
      <div
        data-type=${l.type}
        class=${`contents ${l.type} ${l.class||""} ${l.inline&&"inline"||""}`}>`),l.title&&l.node.append(mapp.utils.html.node`
        <div
          class="label"
          style="${`${l.css_title||""}`}"
          title="${l.tooltip||null}">${l.title}`),(l.value===null||typeof l.value>"u")&&(l.value=l.default||l.value);let o=mapp.ui.locations.entries[l.type]&&mapp.ui.locations.entries[l.type](l);if(o==="break")break;o&&l.node.append(o)}return i};var X=e=>{let t=mapp.ui.elements.chkbox({label:e.label||e.title,checked:e.value,disabled:!e.edit,onchange:a=>{e.newValue=a,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}});return mapp.utils.html.node`${t}`};var K=e=>{e.layer=e.location.layer,e.host=e.host||e.location.layer.mapview.host,e.dependents&&e.dependents.some(n=>e.location.infoj.some(r=>!r.value&&r.field===n))&&delete e.display;let t;if(typeof e.target=="string"&&document.getElementById(e.target)){e.target=document.getElementById(e.target),mapp.ui.Dataview(e).then(()=>e.update());return}let i=typeof e.target=="string"&&document.querySelector(`[data-id=${e.target}]`);i&&(delete e.target,e.display&&a());function a(){if(e.show)return e.show();mapp.ui.Dataview(e).then(()=>{e.tab_style=`border-bottom: 3px solid ${e.location.style.strokeColor}`,i.dispatchEvent(new CustomEvent("addTab",{detail:e})),e.display&&e.show()})}typeof e.target=="string"&&(t=mapp.utils.html.node`
      <div
        class="${`location ${e.class}`}">`,e.target=t,e.display&&mapp.ui.Dataview(e).then(()=>e.update()));let l=e.label&&mapp.ui.elements.chkbox({label:e.label,checked:!!e.display,onchange:n=>{if(e.display=n,t){t.style.display=e.display?"block":"none",e.display&&typeof e.update=="function"&&e.update(),e.display&&typeof e.update!="function"&&mapp.ui.Dataview(e).then(()=>e.update());return}e.display?a():e.remove()}});return mapp.utils.html.node`${l}${t||""}`};var x=e=>{let t;return e.edit?t=mapp.utils.html.node`
      <input
        type=${e.type==="datetime"&&"datetime-local"||"date"}
        value=${e.value&&(e.type==="datetime"&&new Date(e.value*1e3).toISOString().split("Z")[0]||new Date(e.value*1e3).toISOString().split("T")[0])}
        onchange=${a=>{e.newValue=new Date(a.target.value).getTime()/1e3,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}>`:t=e.value&&new Date(e.value*1e3).toLocaleString(e.locale,e.options),mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">
      ${t}`};var Q=e=>{let t=e.value;return t||(t=e.defaults==="user"&&mapp.user?.email||e.nullValue,t&&mapp.utils.xhr({method:"POST",url:`${e.location.layer.mapview.host}/api/location/update?`+mapp.utils.paramString({locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,table:e.location.layer.table,id:e.location.id}),body:JSON.stringify({[e.field]:t})})),mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">
      ${e.prefix}${t}${e.suffix}`};var Y=e=>{let t=e.value.map(n=>mapp.utils.html`
		<div class="link-with-img">
      ${e.edit&&mapp.utils.html.node`
        <button
          class="mask-icon trash no"
          data-name=${n.replace(/.*\//,"").replace(/\.([\w-]{3})/,"")}
          data-href=${n}
          onclick=${r=>o(r)}>
        </button>`}		
        <a target="_blank"
          href=${n}>${n.replace(/.*\//,"").replace(/\.([\w-]{3})/,"")}`),i=mapp.utils.html.node`
    <div class="mask-icon cloud-upload">
      <input
        style="opacity: 0; width: 3em; height: 3em;"
        type="file"
        accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document;"
        onchange=${l}>`;if(e.edit&&t.push(i),!t.length)return;let a=mapp.utils.html.node`<div>${t}`;return a;async function l(n){e.location.view?.classList.add("disabled");let r=new FileReader,s=n.target.files[0];!s||(r.onload=async d=>{let p=await mapp.utils.xhr({method:"POST",requestHeader:{"Content-Type":"application/octet-stream"},url:`${e.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({public_id:s.name,resource_type:"raw"})}`,body:d.target.result}),c=p.secure_url,u=p.public_id.replace(/.*\//,"").replace(/\.([\w-]{3})/,"");await mapp.utils.xhr(`${e.location.layer.mapview.host}/api/query?`+mapp.utils.paramString({template:"set_field_array",locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,table:e.location.table,qID:e.location.layer.qID,id:e.location.id,action:"append",field:e.field,value:c}));let h=mapp.utils.html.node`
        <div class="link-with-img">
          <button
            class="mask-icon trash no"
            data-name=${u}
            data-href=${c}
            onclick=${g=>o(g)}>
          </button>
          <a target="_blank"
            href=${c}>${u}`;a.insertBefore(h,i),e.location.view?.classList.remove("disabled")},r.readAsDataURL(s),n.target.value="")}async function o(n){if(!confirm("Remove document link?"))return;let r=n.target;mapp.utils.xhr(`${e.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({destroy:!0,public_id:r.dataset.name})}`),await mapp.utils.xhr(`${e.location.layer.mapview.host}/api/query?`+mapp.utils.paramString({template:"set_field_array",locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,table:e.location.table,qID:e.location.layer.qID,id:e.location.id,action:"remove",field:e.field,value:r.dataset.href})),r.parentNode.remove()}};var ee=e=>{if(e.value=typeof e.value=="string"&&JSON.parse(e.value)||e.value,e.display=e.display&&e.value,!e.value&&!e.edit)return;e.Style=e.Style||typeof e.style=="object"&&mapp.utils.style(Object.assign({},e.location?.style||{},e.style))||e.location.Style,e.show=Be;let t=mapp.ui.elements.chkbox({label:e.label||"Geometry",data_id:`${e.field}-chkbox`,checked:!!e.display,disabled:!e.value,onchange:o=>{o?e.show():(e.display=!1,e.L&&e.location.layer.mapview.Map.removeLayer(e.L))}});e.display&&e.show();let i={entry:e,layer:e.location.layer,srid:e.srid||e.location.srid,edit:e.edit,mapview:e.location.layer.mapview},a=typeof e.edit=="object"&&Object.keys(e.edit).map(o=>mapp.ui.elements.drawing[o]&&mapp.ui.elements.drawing[o](i,He)).filter(o=>!!o);e.edit?.geometry&&a.push(mapp.utils.html`
    <button
      class="flat wide primary-colour"
      onclick=${o=>Ne(o,i)}>
      Modify Geometry`),e.value&&e.edit?.delete&&a.push(mapp.utils.html`
    <button
      class="flat wide no-colour"
      onclick=${()=>{if(e.display){o();return}e.show(),setTimeout(o,500);function o(){!confirm("Delete Geometry?")||(e.newValue=null,e.L&&(e.location.layer.mapview.Map.removeLayer(e.L),delete e.L),i.entry.location.update())}}}>Delete Geometry`);let l=e.style&&mapp.utils.html`
    ${mapp.ui.elements.legendIcon(Object.assign({width:24,height:24},e.style))}`;return a?mapp.ui.elements.drawer({class:"lv-2 flat",data_id:"draw-drawer",header:mapp.utils.html`
        ${t}
        <div class="mask-icon expander"></div>
        ${l}`,content:mapp.utils.html`
        ${a}`}):mapp.utils.html.node`<div class="flex-spacer">${t}${l}`};function Be(){this.display=!0;let e=this.location.view?.querySelector(`[data-id=${this.field}-chkbox] input`);e&&(e.checked=!0),this.L&&(this.location.layer.mapview.Map.removeLayer(this.L),delete this.L),this.L=this.location.layer.mapview.geoJSON({zIndex:this.zIndex,geometry:this.value,Style:this.Style,dataProjection:this.srid||this.location?.layer?.srid}),this.location.Layers.push(this.L)}function He(e,t){let i=e.target;if(i.classList.contains("active")){i.classList.remove("active"),t.mapview.interactions.highlight();return}i.classList.add("active"),!t.entry.display&&t.entry.show(),t.entry.L&&t.entry.location.layer.mapview.Map.removeLayer(t.entry.L),t.mapview.interactions.draw({type:t.type,geometryFunction:t.geometryFunction,tooltip:t.tooltip,srid:t.srid,callback:a=>{if(i.classList.remove("active"),t.mapview.interactions.highlight(),a){t.entry.newValue=a.geometry,t.entry.location.update();return}t.entry.L&&t.entry.location.layer.mapview.Map.addLayer(t.entry.L)}})}function Ne(e,t){let i=e.target;if(i.classList.contains("active")){i.classList.remove("active"),t.mapview.interactions.highlight();return}i.classList.add("active"),!t.entry.display&&t.entry.show(),t.entry.location.layer.mapview.Map.removeLayer(t.entry.L);let a=t.entry.L.getSource().getFeatures()[0];t.mapview.interactions.modify({Feature:a.clone(),snapLayer:t.entry.location.layer,callback:l=>{if(i.classList.remove("active"),t.mapview.interactions.highlight(),l){t.entry.newValue=l.geometry,t.entry.location.update();return}t.entry.location.layer.mapview.Map.addLayer(t.entry.L)}})}var te=e=>{let t=e.value.map(n=>mapp.utils.html`
    <div>
      <img src=${n}
        onclick=${mapp.ui.utils.imagePreview}>
        ${e.edit&&mapp.utils.html.node`
          <button
            class="mask-icon trash no"
            data-name=${n.replace(/.*\//,"").replace(/\.([\w-]{3})/,"")}
            data-src=${n}
            onclick=${r=>o(r)}>`}`),i=mapp.utils.html.node`
    <div class="mask-icon add-photo pos-center">
      <input
        type="file"
        accept="image/*;capture=camera"
        onchange=${l}>`;if(e.edit&&t.push(i),!t.length)return;let a=mapp.utils.html.node`
    <div
      class="images-grid">${t}`;return a;async function l(n){e.location.view?.classList.add("disabled");let r=new FileReader,s=n.target.files[0];!s||(r.onload=d=>{let p=new Image;p.onload=async()=>{let c=mapp.utils.html.node`<canvas>`,u=1024,h=p.width,g=p.height;h>g&&h>u?(g*=u/h,h=u):g>u&&(h*=u/g,g=u),c.width=h,c.height=g,c.getContext("2d").drawImage(p,0,0,h,g);let Fe=c.toDataURL("image/jpeg",.5),_=await mapp.utils.xhr({method:"POST",requestHeader:{"Content-Type":"application/octet-stream"},url:`${e.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({public_id:s.name.replace(/.*\//,"").replace(/\.([\w-]{3})/,""),resource_type:"image"})}`,body:mapp.utils.dataURLtoBlob(Fe)});await mapp.utils.xhr(`${e.location.layer.mapview.host}/api/query?`+mapp.utils.paramString({template:"set_field_array",locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,table:e.location.table,qID:e.location.layer.qID,id:e.location.id,action:"append",field:e.field,value:_.secure_url}));let Pe=mapp.utils.html.node`
          <div>
            <img
              src=${_.secure_url}
              onclick=${mapp.ui.utils.imagePreview}>
              <button
                class="mask-icon trash no"
                data-name=${_.public_id}
                data-src=${_.secure_url}
                onclick=${Ae=>o(Ae)}>`;a.insertBefore(Pe,i),e.location.view?.classList.remove("disabled")},p.src=d.target.result},r.readAsDataURL(s),n.target.value="")}async function o(n){if(!confirm("Remove image?"))return;let r=n.target;mapp.utils.xhr(`${e.location.layer.mapview.host}/api/provider/cloudinary?${mapp.utils.paramString({destroy:!0,public_id:r.dataset.name})}`),await mapp.utils.xhr(`${e.location.layer.mapview.host}/api/query?`+mapp.utils.paramString({template:"set_field_array",locale:e.location.layer.mapview.locale.key,layer:e.location.layer.key,table:e.location.table,qID:e.location.layer.qID,id:e.location.id,action:"remove",field:e.field,value:r.dataset.src})),r.parentNode.remove()}};var Ue={isoline_here:Ze,isoline_mapbox:Je},L=e=>{e.value=typeof e.value=="string"&&JSON.parse(e.value)||e.value,e.Style=e.Style||typeof e.style=="object"&&mapp.utils.style(e.style)||e.location.Style;let t=mapp.ui.elements.chkbox({label:e.label||"Isoline",checked:!!e.display,onchange:a=>{a?e.show():(e.display=!1,e.L&&e.location.layer.mapview.Map.removeLayer(e.L))}});if(e.show=We,e.display&&e.show())return"break";let i=e.style&&mapp.utils.html`
    ${mapp.ui.elements.legendIcon(Object.assign({width:24,height:24},e.style))}`;return mapp.utils.html.node`<div class="flex-spacer">${t}${i}`};function We(){if(this.display=!0,this.L){this.location.layer.mapview.Map.removeLayer(this.L),this.location.layer.mapview.Map.addLayer(this.L);return}if(this.value){this.L=this.location.layer.mapview.geoJSON({zIndex:this.zIndex,geometry:this.value,Style:this.Style,dataProjection:"4326"}),this.location.Layers.push(this.L);return}let e=this.location.infoj.find(t=>t.type==="pin");return this.params.latlng=ol.proj.transform(e.value,`EPSG:${e.srid||"3857"}`,"EPSG:4326"),this.location.view?.classList.add("disabled"),Ue[this.type](this),!0}function Je(e){let t=Object.assign({profile:"driving",minutes:10},e.params);mapp.utils.xhr(`https://api.mapbox.com/isochrone/v1/mapbox/${t.profile}/${t.latlng[0]},${t.latlng[1]}?${mapp.utils.paramString({contours_minutes:t.minutes,polygons:!0,access_token:t.access_token})}`).then(async i=>{!e.location.remove||!i.features||(e.newValue=i.features[0].geometry,e.location.update())})}function Ze(e){let t=Object.assign({"range[type]":"time",minutes:10,reverseDirection:!1,transportMode:"car",optimizeFor:"balanced"},e.params);t["range[values]"]=t.minutes*60,delete t.minutes,t.origin=`${t.latlng[1]},${t.latlng[0]}`,delete t.latlng,mapp.utils.xhr(`${e.location.layer.mapview.host}/api/proxy?url=${encodeURIComponent(`https://isoline.router.hereapi.com/v8/isolines?${mapp.utils.paramString(t)}&{HERE}`)}`).then(i=>{if(!e.location.remove)return;if(!i.isolines)return console.log(i),alert("Failed to process request");let a=mapp.utils.here.decodeIsoline(i.isolines[0].polygons[0].outer);a.polyline.forEach(l=>l.reverse()),a.polyline.push(a.polyline[0]),e.newValue={type:"Polygon",coordinates:[a.polyline]},e.location.update()})}var ae=e=>{let t=mapp.utils.html`
    <pre><code>${JSON.stringify(e.value,null,2)}`;return e.edit&&(t=mapp.utils.html`
    <textarea
      style="auto; min-height: 50px;"
      onfocus=${a=>{a.target.style.height=a.target.scrollHeight+"px"}}
      onfocusout=${a=>{a.target.style.height="auto"}}
      oninput=${a=>{e.json=(()=>{try{return JSON.parse(a.target.value)}catch{return!1}})(),a.target.style.border=e.json?"none":"1px solid red"}}
      onkeyup=${a=>{e.newValue=typeof e.json!="object"?e.value:e.json,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}
      onkeydown=${a=>setTimeout(()=>{a.target.style.height="auto",a.target.style.height=a.target.scrollHeight+"px"},100)}>${JSON.stringify(e.value,null,2)}`),mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">${t}`};var S=e=>{let t=!isNaN(e.value)&&e.type==="integer"?parseInt(e.value).toLocaleString("en-GB",{maximumFractionDigits:0}):parseFloat(e.value).toLocaleString("en-GB",{maximumFractionDigits:2});return e.edit&&(e.edit.range?t=mapp.ui.elements.slider({min:e.edit.range.min,max:e.edit.range.max,val:e.value,callback:a=>{t.value=parseFloat(a.target.value),e.newValue=t.value,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}):t=mapp.utils.html.node`
      <input
        type="number"
        value="${e.value||""}"
        onkeyup=${a=>{e.newValue=a.target.value,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}>`),mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">
      ${e.prefix}${t}${e.suffix}`};var ie=e=>{e.srid=e.srid||e.location.layer.srid,e.location.layer.mapview.Map.removeLayer(e.L),e.L=e.location.layer.mapview.geoJSON({zIndex:1/0,geometry:{type:"Point",coordinates:e.value},dataProjection:e.srid,Style:e.style&&mapp.utils.style(e.style)||e.Style||e.location.pinStyle}),e.location.Layers.push(e.L);let t=mapp.ui.elements.chkbox({label:e.label||"Pin",checked:!0,onchange:a=>{e.display=a,a?e.location.layer.mapview.Map.addLayer(e.L):e.location.layer.mapview.Map.removeLayer(e.L)}});return mapp.utils.html.node`${t}`};var le=e=>{if(!e.report.template)return;let t=`${e.location.layer.mapview.host}/view/${e.report.template}?${mapp.utils.paramString(Object.assign({id:e.location.id,layer:e.location.layer.key},e.params||{}))}`;return mapp.utils.html.node`
    <div class="link-with-img">
      <div
        class="mask-icon wysiwyg">
      </div>	
      <a
        target="_blank"
        href=${t}>${e.report.label||"Report"}`};var oe=e=>{let t=e.location.infoj.find(l=>l.type==="pin");if(!t||!t.value)return;let i=ol.proj.toLonLat(t.value,`EPSG:${t.srid||e.location.layer.mapview.srid}`,"EPSG:4326"),a=mapp.utils.html.node`
    <a
      target="_blank"
      href=${`https://www.google.com/maps?cbll=${i[1]},${i[0]}&layer=c`}>`;return mapp.utils.xhr(`${e.location.layer.mapview.host}/api/proxy?url=${encodeURIComponent(`https://maps.googleapis.com/maps/api/streetview/metadata?location=${i[1]},${i[0]}&source=outdoor&{GOOGLE}`)}`).then(l=>{if(l.status!=="OK")return;let o=`${e.location.layer.mapview.host}/api/proxy?url=${encodeURIComponent(`https://maps.googleapis.com/maps/api/streetview?location=${i[1]},${i[0]}&source=outdoor&size=300x230&{GOOGLE}`)}`;a.append(mapp.utils.html.node`<img src=${o}>`)}),a};var ne=e=>{let t=document.querySelector(`[data-id=${e.target}]`);e.tab_style=`border-bottom: 3px solid ${e.location.style.strokeColor}`,t.dispatchEvent(new CustomEvent("addTab",{detail:e})),e.display&&e.show();let i=mapp.ui.elements.chkbox({label:e.label,checked:!!e.display,onchange:a=>{e.display=a,e.display?e.show():e.remove()}});return mapp.utils.html.node`${i}`};var se=e=>{let t,i=e.value;if(e.query){let a=mapp.utils.queryParams(e),l=mapp.utils.paramString(a);mapp.utils.xhr(`${e.host||e.location.layer.mapview.host}/api/query?${l}`).then(o=>{t.innerHTML=Object.values(o)[0]})}return e.edit&&(e.edit.options?i=Xe(e):i=mapp.utils.html`
      <input
        type="text"
        value="${e.value||""}"
        onkeyup=${a=>{e.newValue=a.target.value,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}>`),t=mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">
      ${e.prefix}${i}${e.suffix}`,t};function Xe(e){let t=e.edit.options.find(l=>typeof l=="object"&&Object.values(l)[0]===e.value||l===e.value)||e.value;e.value=t&&typeof t=="object"&&Object.keys(t)[0]||t||e.value||" ";let i=e.edit.options.map(l=>({title:typeof l=="string"&&l||Object.keys(l)[0],option:typeof l=="string"&&l||Object.values(l)[0]}));return mapp.ui.elements.dropdown({span:e.value,entries:i,callback:(l,o)=>{e.newValue=o.option,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}})}var E=e=>{e.query&&mapp.utils.xhr(`${e.location.layer.mapview.host}/api/query/${e.query}`).then(a=>{e.node.querySelector(".val").innerHTML=a[e.params.field]});let t=e.type!=="html"?e.value:"";e.edit&&(t=mapp.utils.html`
    <textarea
      style="auto; min-height: 50px;"
      onfocus=${a=>{a.target.style.height=a.target.scrollHeight+"px"}}
      onfocusout=${a=>{a.target.style.height="auto"}}
      onkeyup=${a=>{e.newValue=a.target.value,e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}
      onkeydown=${a=>setTimeout(()=>{a.target.style.height="auto",a.target.style.height=a.target.scrollHeight+"px"},100)}>
      ${e.value||""}`);let i=mapp.utils.html.node`
  <div
    class="val"
    style="${`${e.css_val||""}`}">${t}`;return!e.edit&&e.type==="html"&&(i.innerHTML=e.value||""),i};var re=e=>{let t,i=e.value&&e.value.toString().replace(".",":");return i=i&&i.length<3&&`${i}:00`||i,e.edit?t=mapp.utils.html.node`
      <input
        type="time"
        value=${i}
        onchange=${l=>{e.newValue=parseFloat(l.target.value.replace(":",".")),e.location.view?.dispatchEvent(new CustomEvent("valChange",{detail:e}))}}>`:t=i,mapp.utils.html.node`
    <div
      class="val"
      style="${`${e.css_val||""}`}">
      ${t}`};var de={key:Ke,boolean:X,dataview:K,date:x,datetime:x,defaults:Q,documents:Y,geometry:ee,html:E,images:te,integer:S,isoline_here:L,isoline_mapbox:L,json:ae,numeric:S,pin:ie,report:le,streetview:oe,tab:ne,text:se,textarea:E,time:re};function Ke(e){return mapp.utils.html.node`
  <div class="layer-key">
    <span>
      ${e.location.layer.name}`}var ce={view:U,listview:J,infoj:Z,entries:de};var pe=async e=>{if(e.target=typeof e.target=="string"&&document.getElementById(e.target)||e.target,e.target=e.target instanceof HTMLElement&&e.target||mapp.utils.html.node`<div class="dataview-target">`,e.update=async()=>{if(!e.query)return;let t=mapp.utils.queryParams(e),i=mapp.utils.paramString(t),a=await mapp.utils.xhr(`${e.host||e.location.layer.mapview.host}/api/query?${i}`);if(!(a instanceof Error)){if(typeof e.responseFunction=="function")return e.responseFunction(a);typeof e.setData=="function"&&e.setData(a)}},e.toolbar){e.target=mapp.utils.html.node`
      <div class="dataview-target">`;let t=Object.keys(e.toolbar).map(i=>mapp.ui.elements.toolbar_el[i](e));e.panel=mapp.utils.html.node`
      <div class="grid">
        <div class="btn-row">${t}</div>
        ${e.target}`}return e.chart&&await Qe(e),typeof e.columns<"u"&&(console.warn("Table dataviews should be configured inside a tables object"),e.table={columns:e.columns}),e.table&&await Ye(e),e.mapChange&&e.layer&&e.layer.mapview.Map.getTargetElement().addEventListener("changeEnd",()=>{e.layer&&!e.layer.display||e.tab&&!e.tab.classList.contains("active")||typeof e.mapChange=="function"&&e.mapChange()||e.update()}),e};async function Qe(e){let t=e.target.appendChild(mapp.utils.html.node`<canvas>`);e.ChartJS=await mapp.ui.utils.Chart(t,mapp.utils.merge({type:"bar",options:{plugins:{legend:{display:!1},datalabels:{display:!1}}}},e.chart)),e.setData=i=>{e.noDataMask&&!i?(e.target.style.display="none",e.mask=!e.mask&&e.target.parentElement?.appendChild(mapp.utils.html.node`
        <div class="dataviewMask">No Data`)):(e.mask&&e.mask.remove(),delete e.mask,e.target.style.display="block"),i||(i={datasets:[{data:[]}]}),i.datasets||(i={datasets:[{data:i}]}),e.data=i,e.chart.datasets?.length&&i.datasets.forEach((a,l)=>Object.assign(a,e.chart.datasets[l])),i.labels=i.labels||e.chart.labels,e.ChartJS.data=i,e.ChartJS.update()}}async function Ye(e){e.Tabulator=await mapp.ui.utils.Tabulator(e.target,e.table),e.table.selectable&&e.Tabulator.on("rowClick",(t,i)=>{if(typeof e.rowSelect=="function"){e.rowSelect(t,i);return}let a=i.getData();!e.layer||!a[e.layer.qID]||(mapp.location.get({layer:e.layer,id:a[e.layer.qID]}),i.deselect())}),e.setData=t=>{!t&&e.data||(e.noDataMask&&!t?(e.target.style.display="none",e.mask=!e.mask&&e.target.parentElement?.appendChild(mapp.utils.html.node`
        <div class="dataviewMask">No Data`)):(e.mask&&e.mask.remove(),delete e.mask,e.target.style.display="block"),t=!t&&[]||t.length&&t||[t],e.Tabulator.setData(t),e.data=t,typeof e.setDataCallback=="function"&&e.setDataCallback(e))}}var me=e=>{!e.node||(e.tabs=e.node.appendChild(mapp.utils.html.node`<div class="tabs">`),e.panel=e.node.appendChild(mapp.utils.html.node`<div class="panel">`),e.id&&e.node.setAttribute("data-id",e.id),e.addTab=et,e.node.addEventListener("addTab",t=>e.addTab(t.detail)))};function et(e){let t=this;e.tab=mapp.utils.html.node`
    <div class="tab">
      <div
        class="header"
        style="${e.tab_style||""}"
        onclick=${i}>
        ${e.label||e.title||e.key||"Tab"}`,e.panel=e.panel||e.target||mapp.utils.html.node`
    <div
      class="${`panel ${e.class||""}`}">`,e.panel.addEventListener("activate",()=>{e.update&&e.update()}),e.show=i,e.remove=a,e.location?.removeCallbacks.push(()=>e.remove());function i(){mapp.utils.render(t.panel,e.panel),t.tabs.childNodes.forEach(l=>l.classList.remove("active")),!e.tab.parentElement&&t.tabs.appendChild(e.tab),e.tab.classList.add("active"),t.timer&&window.clearTimeout(t.timer),t.timer=window.setTimeout(()=>{if(e.panel instanceof HTMLElement){e.panel.dispatchEvent(new CustomEvent("activate"));return}e.target instanceof HTMLElement&&e.target.dispatchEvent(new CustomEvent("activate"))},500),t.showTab&&t.showTab()}function a(){if(!e.tab.parentElement)return;let l=e.tab.nextElementSibling||e.tab.previousElementSibling;if(e.tab.remove(),l)return l.querySelector(".header").click();t.removeLastTab&&t.removeLastTab()}}var ue=e=>mapp.utils.html.node`
  <div 
    data-id=${e.data_id||"card"}
    class="drawer">
    <div class="header bold">
      <span>${e.header}</span>
      <button
        data-id=close
        class="mask-icon close"
        onclick=${t=>{t.target.closest(".drawer").remove(),e.close&&e.close(t)}}>
    </div>
    ${e.content}`;var he=e=>mapp.utils.html`
  <label 
    data-id=${e.data_id||"chkbox"}
    class="checkbox">
    <input
      type="checkbox"
      .disabled=${!!e.disabled}
      .checked=${!!e.checked}
      onchange=${t=>{e.onchange&&e.onchange(t.target.checked,e.val)}}>
    </input>
    <div></div>
    <span>${e.label}`;var ge={modify:tt,draw:at};mapp.utils.merge(mapp.dictionaries,{en:{remove_last_vertex:"Remove last vertex"},de:{remove_last_vertex:"Remove last vertex"},cn:{remove_last_vertex:"\u5220\u9664\u6700\u540E\u4E00\u4E2A\u9876\u70B9"},pl:{remove_last_vertex:"Usu\u0144 ostatni wierzcho\u0142ek"},ko:{remove_last_vertex:"\uB9C8\uC9C0\uB9C9 \uC815\uC810(\uAF2D\uC9C0\uC810) \uC81C\uAC70"},fr:{remove_last_vertex:"Effacer le dernier point"},ja:{remove_last_vertex:"\u6700\u5F8C\u306E\u30D0\u30FC\u30C6\u30C3\u30AF\u30B9\u3092\u524A\u9664"}});function tt(e){e&&e.preventDefault();let t=[];t.push(mapp.utils.html`
    <li
      onclick=${()=>this.interaction.finish(this.interaction.getFeature())}>
      ${mapp.dictionary.save}`),t.push(mapp.utils.html`
    <li
      onclick=${()=>this.interaction.finish()}>
      ${mapp.dictionary.cancel}`),this.popup({coords:this.interaction.vertices[this.interaction.vertices.length-1],content:mapp.utils.html.node`<ul>${t}`})}function at(e){if(this.interaction.vertices.length===0)return;e&&e.preventDefault();let t=this.interaction.Layer.getSource().getFeatures(),i=[];t.length&&i.push(mapp.utils.html`
  <li
    onclick=${()=>this.interaction.finish(this.interaction.getFeature())}>
      ${mapp.dictionary.save}`),!t.length&&i.push(mapp.utils.html`
    <li
      onclick=${a=>{this.interaction.interaction.removeLastPoint(),this.interaction.vertices.pop(),this.popup(null)}}>${mapp.dictionary.remove_last_vertex}`),i.push(mapp.utils.html`
    <li
      onclick=${()=>this.interaction.finish()}>
      ${mapp.dictionary.cancel}`),this.popup({coords:this.interaction.vertices[this.interaction.vertices.length-1],content:mapp.utils.html.node`<ul>${i}`,autoPan:!0})}var fe=e=>mapp.utils.html.node`
  <div 
    data-id=${e.data_id||"drawer"}
    class=${`drawer expandable ${e.class||""}`}>
    <div
      class="header"
      onclick=${t=>{if(!t.target.parentElement.classList.contains("empty")){if(t.target.parentElement.classList.contains("expanded"))return t.target.parentElement.classList.remove("expanded");e.accordion&&[...t.target.parentElement.parentElement.children].forEach(i=>{i.classList.remove("expanded")}),t.target.parentElement.classList.add("expanded")}}}>
      ${e.header}
    </div>
    ${e.content}`;var ve={point:it,locator:lt,polygon:st,circle:rt,line:ot,freehand:nt,isoline_here:ct,isoline_mapbox:pt,rectangle:dt};mapp.utils.merge(mapp.dictionaries,{en:{draw_point:"Point",draw_position:"Current Position",draw_polygon:"Polygon",draw_rectangle:"Rectangle",draw_circle:"Circle",draw_line:"Line",draw_freehand:"Freehand"},de:{draw_point:"Punkt",draw_polygon:"Polygon",draw_rectangle:"Rechteck",draw_circle:"Kreis",draw_line:"Linie",draw_freehand:"Freihand"},cn:{draw_point:"\u70B9",draw_polygon:"\u591A\u8FB9\u5F62",draw_rectangle:"\u957F\u65B9\u5F62",draw_circle:"\u5708",draw_line:"\u7EBF",draw_freehand:"\u4EFB\u610F\u56FE\u5F62"},pl:{draw_point:"Punkt",draw_polygon:"Poligon",draw_rectangle:"Prostok\u0105t",draw_circle:"Okrag",draw_line:"Linia",draw_freehand:"Odr\u0119cznie"},ko:{draw_point:"\uC810",draw_polygon:"\uB2E4\uAC01\uD615",draw_rectangle:"\uC9C1\uC0AC\uAC01\uD615",draw_circle:"\uC6D0",draw_line:"\uC120",draw_freehand:"\uC190\uC73C\uB85C \uADF8\uB9BC(\uC790\uC720 \uC7AC\uB7C9)"},fr:{draw_point:"Point",draw_polygon:"Polygone",draw_rectangle:"Rectangle",draw_circle:"Cercle",draw_line:"Ligne",draw_freehand:"\xC0 main lev\xE9e"},ja:{draw_point:"\u30DD\u30A4\u30F3\u30C8",draw_polygon:"\u30DD\u30EA\u30B4\u30F3",draw_rectangle:"\u9577\u65B9\u5F62",draw_circle:"\u4E38",draw_line:"\u7DDA",draw_freehand:"\u30D5\u30EA\u30FC\u30CF\u30F3\u30C9"}});function it(e,t){let i=Object.assign({},e,{type:"Point"});return mapp.utils.html.node`
    <button
      class="flat wide primary-colour"
      onclick=${a=>t(a,i)}>
      ${mapp.dictionary.draw_point}`}function lt(e){return mapp.utils.html.node`
    <button
      class="flat wide primary-colour"
      onclick=${t=>{mapp.utils.getCurrentPosition(async i=>{let a={layer:e.layer},l=ol.proj.transform([parseFloat(i.coords.longitude),parseFloat(i.coords.latitude)],"EPSG:4326",`EPSG:${e.layer.srid}`);a.id=await mapp.utils.xhr({method:"POST",url:`${a.layer.mapview.host}/api/location/new?`+mapp.utils.paramString({locale:a.layer.mapview.locale.key,layer:a.layer.key,table:a.layer.tableCurrent()}),body:JSON.stringify({geometry:{type:"Point",coordinates:l}})}),a.layer.reload(),mapp.location.get(a)})}}>
      ${mapp.dictionary.draw_position}`}function ot(e,t){let i=Object.assign({},e,{type:"LineString"});return mapp.utils.html.node`
    <button
      class="flat wide primary-colour"
      onclick=${a=>t(a,i)}>
      ${mapp.dictionary.draw_line}`}function nt(e,t){let i=Object.assign({},e,{type:"LineString",freehand:!0});return mapp.utils.html.node`
    <button
      class="flat wide primary-colour"
      onclick=${a=>t(a,i)}>
      ${mapp.dictionary.draw_freehand}`}function st(e,t){let i=Object.assign({},e,{type:"Polygon"});return mapp.utils.html.node`
    <button
      class="flat wide primary-colour"
      onclick=${a=>t(a,i)}>
      ${mapp.dictionary.draw_polygon}`}function rt(e,t){let i=Object.assign({},e,{type:"Circle",geometryFunction:ol.interaction.Draw.createRegularPolygon(33),tooltip:e.edit.circle.tooltip});return mapp.utils.html.node`
    <button
      class="flat wide primary-colour"
      onclick=${a=>t(a,i)}>
      ${mapp.dictionary.draw_circle}`}function dt(e,t){let i=Object.assign({},e,{type:"Circle",geometryFunction:ol.interaction.Draw.createBox(),tooltip:e.edit.rectangle.tooltip});return mapp.utils.html.node`
    <button
      class="flat wide primary-colour"
      onclick=${a=>t(a,i)}>
      ${mapp.dictionary.draw_rectangle}`}function ct(e,t){let i=Object.assign({},e,{type:"Point",geometryFunction:n=>mapp.utils.here.geometryFunction(n,e.layer,l)});typeof i.edit.isoline_here!="object"&&(i.edit.isoline_here={});let a={"range[type]":"time",range:10,rangeMin:5,rangeMax:60,reverseDirection:!1,transportMode:"car",optimizeFor:"balanced"},l=Object.assign(i.edit.isoline_here,a),o=mapp.ui.elements.isoline_params_here(l);return o.append(mapp.utils.html.node`
    <button
      class="flat wide primary-colour"
      onclick=${n=>t(n,i)}>
      Create Isoline`),o}function pt(e,t){let i=Object.assign({},e,{type:"Point",geometryFunction:n=>mapp.utils.mapboxGeometryFunction(n,e.layer,l)});typeof i.edit.isoline_mapbox!="object"&&(i.edit.isoline_mapbox={});let a={profile:"driving",minutes:10,minutesMin:5,minutesMax:60},l=Object.assign(i.edit.isoline_mapbox,a),o=mapp.ui.elements.isoline_params_mapbox(l);return o.append(mapp.utils.html.node`
    <button
      class="flat wide primary-colour"
      onclick=${n=>t(n,i)}>
      Create Isoline`),o}var we=e=>mapp.utils.html`
  <button 
    data-id=${e.data_id||"dropdown"}
    class="dropdown">
    <div class="head"
      onclick=${t=>{if(t.target.parentElement.classList.contains("active")){t.target.parentElement.classList.remove("active");return}document.querySelectorAll("button.dropdown").forEach(i=>i.classList.remove("active")),t.target.parentElement.classList.add("active")}}>
      <span data-id=header-span>${e.span||e.placeholder||e.entries[0].title}</span>
      <div class="icon"></div>
    </div>
    <ul>${e.entries.map(t=>mapp.utils.html.node`
      <li onclick=${i=>{let a=i.target.closest("button.dropdown");a.classList.toggle("active"),a.querySelector("[data-id=header-span]").textContent=t.title,e.callback&&e.callback(i,t)}}>${t.title}`)}`;var _e=e=>{let t=new Set,i=new Set;return mapp.utils.html`
    <button 
      data-id=${e.data_id||"dropdown"}
      class="dropdown">
      <div class="head"
        onclick=${a=>{if(a.target.parentElement.classList.contains("active")){a.target.parentElement.classList.remove("active");return}document.querySelectorAll("button.dropdown").forEach(l=>l.classList.remove("active")),a.target.parentElement.classList.add("active")}}>
        <span data-id=header-span>${e.span||e.placeholder||e.entries[0].title}</span>
        <div class="icon"></div>
      </div>
      <ul>${e.entries.map(a=>mapp.utils.html.node`
        <li onclick=${l=>{let o=l.target.closest("button.dropdown");o.classList.toggle("active"),l.target.classList.toggle("selected"),l.target.classList.contains("selected")?(t.add(a.title),i.add(a.option)):(t.delete(a.title),i.delete(a.option)),o.querySelector("[data-id=header-span]").textContent=Array.from(t).join(", "),e.callback&&e.callback(l,Array.from(i))}}>${a.title}`)}`};mapp.utils.merge(mapp.dictionaries,{en:{here_mode:"Mode",here_mode_driving:"driving",here_mode_walking:"walking",here_range_minutes:"Travel time in minutes",here_datetime_arrive:"Arrive at",here_datetime_depart:"Depart at",here_optimize_for:"Optimize for",here_optimize_for_balanced:"balanced",here_optimize_for_quality:"quality",here_optimize_for_performance:"performance"},de:{here_mode:"Modus",here_mode_driving:"Kraftfahrzeug",here_mode_walking:"zu Fu\xDF",here_range_minutes:"Fahrzeit in Minuten",here_datetime_arrive:"Ankunft",here_datetime_depart:"Abfahrt",here_optimize_for:"Optimisierung",here_optimize_for_balanced:"Ausgeglichen",here_optimize_for_quality:"Qualit\xE4t",here_optimize_for_performance:"Leistung"},cn:{here_mode_driving:"\u673A\u52A8\u8F66\u884C",here_mode_walking:"\u6B65\u884C",here_range_minutes:"\u4EE5\u5206\u949F\u8BA1\u4EA4\u901A\u65F6\u95F4 "},pl:{here_mode:"\u015Arodek transportu",here_mode_driving:"samochodem",here_mode_walking:"piechot\u0105",here_range_minutes:"Czas podr\xF3\u017Cy w minutach",here_datetime_arrive:"Rozpocznij",here_datetime_depart:"Osi\u0105gnij cel",here_optimize_for:"Optymalizacja",here_optimize_for_balanced:"zr\xF3wnowa\u017Cona",here_optimize_for_quality:"jako\u015B\u0107",here_optimize_for_performance:"wydajno\u015B\u0107"},ko:{here_mode_driving:"\uC6B4\uC804",here_mode_walking:"\uB3C4\uBCF4",here_range_minutes:"\uC5EC\uD589\uC2DC\uAC04(\uBD84) "},fr:{here_mode:"Type de transport",here_mode_driving:"en voiture",here_mode_walking:"\xE0 pied",here_range_minutes:"Temps du trajet en minutes",here_datetime_depart:"Partir \xE0",here_datetime_arrive:"Arriver \xE0",here_optimize_for:"Optimiser",here_optimize_for_balanced:"l'\xE9quilibre",here_optimize_for_quality:"la qualit\xE9",here_optimize_for_performance:"les performances"},ja:{here_mode_driving:"\u30C9\u30E9\u30A4\u30D3\u30F3\u30B0",here_mode_walking:"\u30A6\u30A9\u30FC\u30AD\u30F3\u30B0",here_range_minutes:"\u79FB\u52D5\u6642\u9593 (\u5206) "}});var be=e=>{let t=mapp.utils.html.node`
    <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
      <div style="grid-column: 1;">${mapp.dictionary.here_mode}</div>
      <div style="grid-column: 2;">
        ${mapp.ui.elements.dropdown({entries:[{title:[mapp.dictionary.here_mode_driving],option:"car"},{title:[mapp.dictionary.here_mode_walking],option:"pedestrian"}],callback:(d,p)=>{e.transportMode=p.option}})}`,i=mapp.utils.html.node`
    <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
      <div style="grid-column: 1;">${mapp.dictionary.here_optimize_for}</div>
      <div style="grid-column: 2;">
        ${mapp.ui.elements.dropdown({entries:[{title:[mapp.dictionary.here_optimize_for_balanced],option:"balanced"},{title:[mapp.dictionary.here_optimize_for_quality],option:"quality"},{title:[mapp.dictionary.here_optimize_for_performance],option:"performance"}],callback:(d,p)=>{e.optimizeFor=p.option}})}`,a=mapp.utils.html.node`
    <span>${mapp.dictionary.here_datetime_depart}`,l=mapp.utils.html.node`
    <input
      type="datetime-local"
      onchange=${d=>{e.dateISO=new Date(d.target.value).toISOString()}}>`,o=mapp.utils.html.node`
    <div>
      ${a}
      ${l}`,n=mapp.ui.elements.slider({label:mapp.dictionary.here_range_minutes,min:e.rangeMin,max:e.rangeMax,val:10,callback:d=>{e.range=parseInt(d.target.value)}}),r=mapp.ui.elements.chkbox({label:"Reverse Direction Isoline",checked:!!e.reverseDirection,onchange:d=>{a.textContent=d&&mapp.dictionary.here_datetime_arrive||mapp.dictionary.here_datetime_depart,e.reverseDirection=d}});return mapp.ui.elements.drawer({header:mapp.utils.html`
      <h4>Here Isoline</h4>
      <div class="mask-icon expander"></div>`,class:"flat",content:mapp.utils.html`<div class="panel">
      <div style="display: grid; grid-row-gap: 5px;">
        ${t}
        ${i}
        ${o}
        ${r}
        ${n}`})};mapp.utils.merge(mapp.dictionaries,{en:{mapbox_mode:"Mode",mapbox_driving:"Driving",mapbox_walking:"Walking",mapbox_cycling:"Cycling",mapbox_travel_time:"Travel time in minutes"},de:{mapbox_mode:"Mode",mapbox_driving:"Kraftfahrzeug",mapbox_walking:"zu Fu\xDF",mapbox_cycling:"Fahrrad",mapbox_travel_time:"Fahrzeit in Minuten"},cn:{mapbox_mode:"\u6A21\u5F0F",mapbox_driving:"\u673A\u52A8\u8F66\u884C",mapbox_walking:"\u6B65\u884C",mapbox_cycling:"\u9A91\u884C",mapbox_travel_time:"\u4EE5\u5206\u949F\u8BA1\u4EA4\u901A\u65F6\u95F4"},pl:{mapbox_mode:"Typ",mapbox_driving:"Samochodem",mapbox_walking:"Piechot\u0105",mapbox_cycling:"Rowerem",mapbox_travel_time:"Czas podr\xF3\u017Cy w minutach"},ko:{mapbox_mode:"\uBAA8\uB4DC",mapbox_driving:"\uC6B4\uC804",mapbox_walking:"\uB3C4\uBCF4",mapbox_cycling:"\uC0AC\uC774\uD074",mapbox_travel_time:"\uC5EC\uD589\uC2DC\uAC04(\uBD84)"},fr:{mapbox_mode:"Mode",mapbox_driving:"En voiture",mapbox_walking:"\xC0 pied",mapbox_cycling:"\xC0 velo",mapbox_travel_time:"Temps du trajet en minutes "},ja:{mapbox_mode:"\u30E2\u30FC\u30C9",mapbox_driving:"\u30C9\u30E9\u30A4\u30D3\u30F3\u30B0",mapbox_walking:"\u30A6\u30A9\u30FC\u30AD\u30F3\u30B0",mapbox_cycling:"\u30B5\u30A4\u30AF\u30EA\u30F3\u30B0",mapbox_travel_time:"\u79FB\u52D5\u6642\u9593 (\u5206)"}});var ye=e=>{let t=mapp.utils.html.node`
    <div 
      style="display: grid; grid-template-columns: 100px 1fr; align-items: center;">
      <div style="grid-column: 1;">${mapp.dictionary.mapbox_mode}</div>
      <div style="grid-column: 2;">
        ${mapp.ui.elements.dropdown({entries:[{title:[mapp.dictionary.mapbox_driving],option:"driving"},{title:[mapp.dictionary.mapbox_walking],option:"walking"},{title:[mapp.dictionary.mapbox_cycling],option:"cycling"}],callback:(l,o)=>{e.profile=o.option}})}`,i=mapp.ui.elements.slider({label:mapp.dictionary.mapbox_travel_time,min:e.minutesMin,max:e.minutesMax,val:e.minutes,callback:l=>{e.minutes=parseInt(l.target.value)}});return mapp.ui.elements.drawer({header:mapp.utils.html`
      <h2>Mapbox Isoline</h2>
      <div class="mask-icon expander"></div>`,class:"lv-3 flat",content:mapp.utils.html`<div class="panel">
      <div style="display: grid; grid-row-gap: 5px;">
        ${t}
        ${i}`})};var $e=new XMLSerializer,ke=e=>{if(e.svg||e.type||e.layers){let t=e.layers&&Array.isArray(e.layers)&&e.layers.map(a=>`url(${a.svg})`).reverse().join(",")||`url(${e.svg||e.url||mapp.utils.svgSymbols[e.type](e)})`,i=`
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      width: ${e.width+"px"||"100%"};
      height: ${e.height+"px"||"100%"};
      background-image:${t};`;return mapp.utils.html`<div style=${i}>`}if(!e.fillColor&&e.strokeColor){let t=`
      M 0,${e.height/2}
      L ${e.width/2},${e.height/2}
      ${e.width/2},${e.height/2}
      ${e.width},${e.height/2}`,i=mapp.utils.svg.node`
      <svg height=${e.height} width=${e.width}>
        <path d=${t}
          fill="none"
          stroke=${e.strokeColor}
          stroke-width=${e.strokeWidth||1}/>`,a=`data:image/svg+xml,${encodeURIComponent($e.serializeToString(i))}`,l=`
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      width: ${e.width}px;
      height: ${e.height}px;
      background-image: url(${a});`;return mapp.utils.html`<div style=${l}>`}if(e.fillColor){let t=mapp.utils.svg.node`
      <svg height=${e.height} width=${e.width}>
        <rect
          x=${e.strokeWidth||1}
          y=${e.strokeWidth||1}
          rx="4px"
          ry="4px"
          stroke-linejoin="round"
          width=${e.width-2*(e.strokeWidth||1)}
          height=${e.height-2*(e.strokeWidth||1)}
          fill=${e.fillColor}
          fill-opacity=${e.fillOpacity||1}
          stroke=${e.strokeColor}
          stroke-width=${e.strokeWidth||1}>`,i=`data:image/svg+xml,${encodeURIComponent($e.serializeToString(t))}`,a=`
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      width: ${e.width}px;
      height: ${e.height}px;
      background-image: url(${i});`;return mapp.utils.html`<div style=${a}>`}};var xe=e=>{return mapp.utils.html.node`
    <div
      role="group"
      data-id=${e.data_id||"slider"}
      title=${e.title||""}
      class="input-range single"
      style=${`--min: ${e.min}; --max: ${e.max}; --a: ${e.val}; ${e.style||""}`}>
      <div class="label-row">
        <label>${e.label}</label>
        <input id="a"
          type="number"
          min=${e.min}
          max=${e.max}
          value=${e.val}
          oninput=${t}></input>
      </div>
      <div class="track-bg"></div>
      <input id="a"
        type="range"
        min=${e.min}
        max=${e.max}
        value=${e.val}
        step=${e.step||1}
        oninput=${t}>`;function t(i){i.target.closest(".input-range").style.setProperty(`--${i.target.id}`,i.target.value),i.target.closest(".input-range").querySelectorAll("input").forEach(a=>{a.id==i.target.id&&a!=i.target&&(a.value=i.target.value)}),e.callback&&e.callback(i)}};var Le=e=>{let t=mapp.utils.html.node`
    <div
      role="group"
      class="input-range multi"
      style=${`
        --min: ${e.min};
        --max: ${e.max};
        --a: ${e.val_a};
        --b: ${e.val_b};`}>
      <div 
        class="label-row">
        <label>${e.label_a||"A"}
          <input id="a" type="number"
            value=${e.val_a}
            min=${e.min}
            style="--c: var(--a)"
            oninput=${i}></input>
        </label>
        <label>${e.label_b||"B"}
          <input id="b" type="number"
            value=${e.val_b}
            style="--c: var(--b)"
            oninput=${i}></input>
        </label>
      </div>
      <div class="track-bg"></div>
      <input id="a" type="range"
        min=${e.min}
        max=${e.max}
        step=${e.step||1}
        value=${e.val_a}
        oninput=${i}/>
      <input id="b" type="range"
        min=${e.min}
        max=${e.max}
        step=${e.step||1}
        value=${e.val_b}
        oninput=${i}/>`;function i(a){t.style.setProperty(`--${a.target.id}`,a.target.value),t.querySelectorAll("input").forEach(l=>{l.id==a.target.id&&l!=a.target&&(l.value=a.target.value)}),a.target.id==="a"&&typeof e.callback_a=="function"&&e.callback_a(a),a.target.id==="b"&&typeof e.callback_b=="function"&&e.callback_a(b)}return t};var Se={viewport:mt,download_json:ut,download_csv:ht};function mt(e){return mapp.utils.html`
    <button
      class=${`flat ${e.viewport&&"active"||""}`}
      onclick=${t=>{t.target.classList.toggle("active"),e.viewport=!e.viewport,e.update()}}>Viewport`}function ut(e){return mapp.utils.html`
    <button
      class="flat"
      onclick=${()=>{e.Tabulator.download("json",`${e.title||"table"}.json`)}}>Export as JSON`}function ht(e){return mapp.utils.html`
    <button
      class="flat"
      onclick=${()=>{e.Tabulator.download("csv",`${e.title||"table"}.csv`)}}>Download as CSV`}var Ee={card:ue,chkbox:he,contextMenu:ge,drawer:fe,drawing:ve,dropdown:we,dropdown_multi:_e,isoline_params_here:be,isoline_params_mapbox:ye,legendIcon:ke,slider:xe,slider_ab:Le,toolbar_el:Se};var C,v=null;async function Ce(e,t){return v?new v(e,t):(C||(C=new Promise(async i=>{if(window.Chart){v=window.Chart,i();return}Promise.all([import("https://cdn.skypack.dev/chart.js@3.7.0"),import("https://cdn.skypack.dev/chartjs-plugin-datalabels@2.0.0"),import("https://cdn.skypack.dev/chartjs-plugin-annotation@1.4.0")]).then(a=>{a[0].Chart.register(...a[0].registerables),a[0].Chart.register(a[1].default),a[0].Chart.register(a[2].default),v=a[0].Chart,i()}).catch(a=>{console.error(a.message),alert("Failed to load Chart.js library. Please reload the browser.")})})),await C,new v(e,t))}var j,w=null;async function je(){return w?new w(...arguments):(j||(j=new Promise(async e=>{if(window.Tabulator){w=window.Tabulator,e();return}Promise.all([import("https://cdn.skypack.dev/-/tabulator-tables@v5.2.7-uFL2B6RLQMMWIcn9QymG/dist=es2019,mode=imports/optimized/tabulator-tables.js")]).then(t=>{w=t[0].TabulatorFull,e()}).catch(t=>{console.error(t.message),alert("Failed to load Chart.js library. Please reload the browser.")})})),await j,new w(...arguments))}var m={idle:600},Oe=e=>{Object.assign(m,e),m.idle!==0&&(window.onload=f,window.onmousemove=f,window.onmousedown=f,window.ontouchstart=f,window.onclick=f,window.onkeypress=f,f(),z())};function f(){m.locked||(m.timeout&&clearTimeout(m.timeout),m.timeout=setTimeout(ze,m.idle*1e3))}function ze(){m.locked=!0,m.renew&&clearTimeout(m.renew);let e=new XMLHttpRequest;e.open("GET",`${m.host}/api/user/cookie?destroy=true`),e.send();let t=mapp.utils.html.node`
    <form
      class="login"
      action="${`${m.host}/api/user/login`}"
      method="post"
      autocomplete="off">
       
      <input
        name="language"
        class="display-none"
        value="en"
        required>
  
      <div class="input-group">
        <input
          id="auth_user_email"
          name="email"
          type="email"
          required maxlength="50">
        <span class="bar"></span>
        <label style="color: #fff" for="auth_user_email">E-mail</label>
      </div>
  
      <div class="input-group">
        <input
          id="auth_user_password"
          name="password"
          type="password"
          required minlength="8">
        <span class="bar"></span>
        <label style="color: #fff" for="auth_user_password">Password</label>
      </div>
     
      <button id="btnLogin" type="submit">Log In</button>

      <div class="msg"></div>
        
    </form>`;t.onsubmit=i=>{i.preventDefault();let a=new XMLHttpRequest;a.open("POST",`${m.host}/api/user/login`),a.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),a.onload=l=>{l.target.status===401&&(t.querySelector(".msg").textContent=l.target.response),l.target.status===200&&(delete m.locked,m.mask.remove(),f(),z())},a.send(`login=true&email=${t.querySelector("#auth_user_email").value}&password=${t.querySelector("#auth_user_password").value}`)},m.mask=document.body.appendChild(mapp.utils.html.node`
    <div class="interfaceMask">${t}`)}function z(){m.renew=setTimeout(e,(m.idle-20)*1e3);function e(){let t=new XMLHttpRequest;t.open("GET",`${m.host}/api/user/cookie?renew=true`),t.onload=i=>{if(i.target.status===401)return ze();z()},t.send()}}var Te=e=>{document.body.append(mapp.utils.html.node`
    <div class="interfaceMask">
      <div class="bg-image" style=${`background-image:url(${e.target.src})`}>
      <button class="btn-close mask-icon close"
        onclick=${t=>t.target.parentElement.parentElement.remove()}>`)};var De=e=>{e.target.addEventListener("mousedown",i=>{i.preventDefault(),document.body.style.cursor="grabbing",window.addEventListener("mousemove",e.resizeEvent),window.addEventListener("mouseup",t)}),e.target.addEventListener("touchstart",i=>{i.preventDefault(),window.addEventListener("touchmove",e.resizeEvent),window.addEventListener("touchend",t)},{passive:!0});function t(){document.body.style.cursor="auto",window.removeEventListener("mousemove",e.resizeEvent),window.removeEventListener("touchmove",e.resizeEvent),window.removeEventListener("mouseup",t),window.removeEventListener("touchend",t)}};var qe={Chart:Ce,Tabulator:je,idleMask:Oe,imagePreview:Te,resizeHandler:De};var Me=e=>{let t=Object.assign({input:e.target.querySelector("input"),result:e.target.querySelector("ul"),sources:{glx:a,mapbox:n,google:l,opencage:o}},e);t.input.placeholder=t.placeholder||"",t.input.oninput=s=>{t.xhr&&t.xhr.abort(),t.result.innerHTML="",s.target.value.length>0&&i(s.target.value)},t.input.addEventListener("keydown",s=>{(s.keyCode||s.charCode)===13&&t.result.querySelector("li").click()});function i(s){let d=s.split(",").map(parseFloat);if(d.length===2&&d.every(p=>!isNaN(p))){t.result.appendChild(mapp.utils.html.node`
      <li 
        onclick=${p=>{t.result.innerHTML="",r({label:`Latitude:${d[0]}, Longitude:${d[1]}`,source:"Coordinates",lng:d[1],lat:d[0]})}}><span>Latitutde:${d[0]}, Longitude:${d[1]}`);return}t.xhr=new XMLHttpRequest,t.xhr.open("GET",t.mapview.host+"/api/gazetteer?"+mapp.utils.paramString({locale:t.mapview.locale.key,q:encodeURIComponent(s),source:e.source})),t.xhr.setRequestHeader("Content-Type","application/json"),t.xhr.responseType="json",t.xhr.onload=p=>{if(p.target.status===200){if(p.target.response.length===0)return t.result.appendChild(mapp.utils.html.node`
          <li>${mapp.dictionary.no_results}`);Object.values(p.target.response).forEach(c=>{t.result.append(mapp.utils.html.node`
          <li
            onclick=${u=>{if(t.result.innerHTML="",t.callback)return t.callback(c);t.sources[c.source]({label:c.label,id:c.id,source:c.source,layer:c.layer,table:c.table,marker:c.marker,callback:e.callback})}}>
            <span class="label">${t.mapview.layers[c.layer]&&t.mapview.layers[c.layer].name||c.layer||c.source}</span>
            <span>${c.label}</span>`)})}},t.xhr.send()}function a(s){mapp.location.get({layer:t.mapview.layers[s.layer],table:s.table,id:s.id}).then(d=>d.flyTo())}function l(s){mapp.utils.xhr(`${t.mapview.host}/api/proxy?url=${encodeURIComponent(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${s.id}&{GOOGLE}`)}`).then(d=>{r({label:s.label,source:s.source,lng:d.result.geometry.location.lng,lat:d.result.geometry.location.lat})})}function o(s){r({label:s.label,source:s.source,lng:s.marker[0],lat:s.marker[1]})}function n(s){r({label:s.label,source:s.source,lng:s.marker[0],lat:s.marker[1]})}function r(s){Object.assign(s,{layer:{mapview:t.mapview},Layers:[],hook:s.label});let d=[{title:s.label,value:s.source},{type:"pin",value:[s.lng,s.lat],srid:"4326",class:"display-none",location:s}];mapp.location.decorate(Object.assign(s,{infoj:d})),t.mapview.locations[s.hook]=s,s.flyTo()}};var Ie={layers:N,locations:ce,elements:Ee,utils:qe,gazetteer:Me,Dataview:pe,Tabview:me};typeof window.mapp=="object"&&(window.mapp.ui=Ie);var xi=Ie;export{xi as default};
//# sourceMappingURL=ui.js.map
