(() => {
  'use strict';

  const DATA = window.STATEMENTS_COMPANY || {};
  const rows = Array.isArray(DATA.records) ? DATA.records : [];
  const peers = Array.isArray(DATA.peers) ? DATA.peers : [];
  const state = { standard: '', periodType: '', metric: '', peerMetric: '' };
  const chartBindings = new WeakMap();
  const nf = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });
  const compact = new Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 });
  let accent = DATA.accent || '#274c63';
  function mixHex(left, right, weight) {
    const rgb=hex=>[1,3,5].map(index=>parseInt(hex.slice(index,index+2),16));
    const a=rgb(left),b=rgb(right);
    return toHex(a.map((value,index)=>value*weight+b[index]*(1-weight)));
  }
  function brandTones(primary) { return [primary,mixHex(primary,'#101820',.72),mixHex(primary,'#ffffff',.70)]; }
  let issuerColors = Array.isArray(DATA.palette) && DATA.palette.length >= 3 ? DATA.palette : brandTones(accent);
  accent = issuerColors[0] || accent;
  let palette = { accent:issuerColors[0], secondary:issuerColors[1], tertiary:issuerColors[2], navy:'#17374b', muted:'#b7c5cc', grid:'rgba(23,55,75,.10)' };
  function semanticColor(name) {
    return ({
      revenue:issuerColors[0],
      operating_income:issuerColors[0],
      net_interest_income:issuerColors[1],
      net_fee_income:issuerColors[2],
      ebitda:issuerColors[1],
      operating_profit:issuerColors[1],
      profit:issuerColors[2],
      ebitda_margin:issuerColors[0],
      nim:issuerColors[0],
      cir:issuerColors[2],
      net_margin:issuerColors[2],
      roe:issuerColors[1]
    })[name] || issuerColors[2] || '#547f98';
  }
  function withAlpha(hex, alpha) {
    return /^#[0-9a-f]{6}$/i.test(hex) ? `${hex}${Math.round(alpha*255).toString(16).padStart(2,'0')}` : hex;
  }

  const backLink = document.getElementById('companyBackLink');
  const sourceContext = new URLSearchParams(window.location.search).get('from');
  if (backLink && (sourceContext === 'asset' || sourceContext === 'search')) {
    backLink.textContent = sourceContext === 'asset' ? 'Назад к карточке' : 'Назад к поиску';
    backLink.href = '#';
    backLink.addEventListener('click', event => {
      event.preventDefault();
      if (window.history.length > 1) window.history.back();
      else window.location.href = './statements.html';
    });
  }

  function rgbStats(rgb) {
    const [r,g,b]=rgb, max=Math.max(r,g,b), min=Math.min(r,g,b), chroma=max-min;
    return {luma:.2126*r+.7152*g+.0722*b,saturation:max?chroma/max:0,chroma};
  }
  function rgbDistance(a,b) { return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]); }
  function toHex(rgb) { return `#${rgb.map(value=>Math.max(0,Math.min(255,Math.round(value))).toString(16).padStart(2,'0')).join('')}`; }
  function acceptable(rgb) { const s=rgbStats(rgb); return s.luma<220 && Math.min(...rgb)<225 && !(s.luma>205&&s.chroma<28); }
  async function extractLogoPalette() {
    const image=document.querySelector('.company-brand__logo img');
    if(!image) return null;
    if(!image.complete) await new Promise((resolve,reject)=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',reject,{once:true});});
    if(image.decode) await image.decode().catch(()=>{});
    const naturalWidth=image.naturalWidth||image.width, naturalHeight=image.naturalHeight||image.height;
    if(!naturalWidth||!naturalHeight) return null;
    const maxSide=96, scale=Math.min(maxSide/naturalWidth,maxSide/naturalHeight,1);
    const width=Math.max(1,Math.round(naturalWidth*scale)), height=Math.max(1,Math.round(naturalHeight*scale));
    const canvas=document.createElement('canvas'); canvas.width=width; canvas.height=height;
    const context=canvas.getContext('2d',{willReadFrequently:true});
    context.imageSmoothingEnabled=true; context.imageSmoothingQuality='high'; context.drawImage(image,0,0,width,height);
    const pixels=context.getImageData(0,0,width,height).data, bins=new Map(), quantum=24;
    let retained=0;
    for(let i=0;i<pixels.length;i+=4){
      if(pixels[i+3]<160) continue;
      const rgb=[pixels[i],pixels[i+1],pixels[i+2]], stats=rgbStats(rgb);
      if(stats.luma>=238||Math.min(...rgb)>=225||(stats.luma>=220&&stats.chroma<34)) continue;
      const key=rgb.map(value=>Math.min(255,Math.round(value/quantum)*quantum)).join(',');
      const bin=bins.get(key)||{count:0,sum:[0,0,0]}; bin.count++; bin.sum[0]+=rgb[0]; bin.sum[1]+=rgb[1]; bin.sum[2]+=rgb[2]; bins.set(key,bin); retained++;
    }
    if(retained<12) return null;
    const raw=[...bins.values()].map(bin=>({count:bin.count,rgb:bin.sum.map(value=>value/bin.count)})).sort((a,b)=>b.count-a.count);
    const clusters=[];
    raw.forEach(bin=>{
      const target=clusters.find(cluster=>rgbDistance(cluster.rgb,bin.rgb)<42);
      if(!target){clusters.push({...bin});return;}
      const count=target.count+bin.count;
      target.rgb=target.rgb.map((value,index)=>(value*target.count+bin.rgb[index]*bin.count)/count); target.count=count;
    });
    clusters.forEach(cluster=>{cluster.share=cluster.count/retained;Object.assign(cluster,rgbStats(cluster.rgb));});
    const significant=clusters.filter(cluster=>cluster.share>=.006&&acceptable(cluster.rgb));
    if(!significant.length) return null;
    const chromatic=significant.filter(cluster=>cluster.saturation>=.22&&cluster.chroma>=32&&cluster.luma>=24);
    const primary=(chromatic.length?chromatic:significant).slice().sort((a,b)=>{
      const score=cluster=>Math.log1p(cluster.count)*(1+cluster.saturation*1.8)*(cluster.luma<45?.72:1);
      return score(b)-score(a);
    })[0];
    const distinct=cluster=>rgbDistance(cluster.rgb,primary.rgb)>=58;
    const dark=significant.filter(cluster=>distinct(cluster)&&cluster.luma<=82&&cluster.share>=.035).sort((a,b)=>b.count-a.count)[0];
    const second=dark||chromatic.filter(cluster=>distinct(cluster)&&cluster.share>=.04).sort((a,b)=>b.count-a.count)[0];
    const used=[primary,...(second?[second]:[])];
    const third=chromatic.filter(cluster=>cluster.share>=.08&&used.every(selected=>rgbDistance(cluster.rgb,selected.rgb)>=68)).sort((a,b)=>b.count-a.count)[0];
    const extracted=[toHex(primary.rgb),...(second?[second.luma<=70&&second.saturation<.18?'#1b1b1b':toHex(second.rgb)]:[]),...(third?[toHex(third.rgb)]:[])];
    const colors=extracted.length>=3?extracted.slice(0,3):brandTones(extracted[0]);
    const diagnostics=significant.slice(0,8).map(cluster=>({color:toHex(cluster.rgb),share:Number(cluster.share.toFixed(3)),luma:Math.round(cluster.luma),saturation:Number(cluster.saturation.toFixed(2))}));
    return {colors,diagnostics,retained};
  }

  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function unique(values) { return [...new Set(values.filter(Boolean))]; }
  function text(row) { return String(row?.metric_label || '').toLocaleLowerCase('ru'); }
  function rank(value) { const raw=String(value||''); if(raw==='LTM') return 999999; const m=raw.match(/(\d{4})(?:Q(\d))?/i); return m ? Number(m[1])*10+Number(m[2]||5) : 0; }
  function reportRank(value) { const m=String(value||'').match(/(\d{2})\.(\d{2})\.(\d{4})/); return m ? Number(m[3])*10000+Number(m[2])*100+Number(m[1]) : 0; }
  function isRatio(row) { return row?.raw_unit === 'RATIO' || row?.unit_label === 'x' || /ev\/ebitda|p\/e|p\/b|p\/s|долг\/ebitda/.test(text(row)); }
  function isPercent(row) { return row?.raw_unit === 'PERCENT' || row?.unit_label === '%' || /рентаб|(^|\W)roe($|\W)|(^|\W)roa($|\W)|маржа/.test(text(row)); }
  function isArtifact(row) { return Number(row?.value)===0 && /выручка|ebitda|прибыль|актив|капитал|долг|денежн|capex/.test(text(row)); }
  function valid(list) { return list.filter(row => Number.isFinite(Number(row.value)) && !isArtifact(row)); }
  function filtered() { return rows.filter(row => (!state.standard || row.standard===state.standard) && (!state.periodType || row.period_type===state.periodType)); }
  function role(row) {
    const t=text(row);
    if(t.includes('выручка') && !t.includes('/')) return 'revenue';
    if(t.includes('ebitda') && !t.includes('/') && !t.includes('ev/') && !t.includes('рентаб')) return 'ebitda';
    if(t.includes('операционная прибыль') && !t.includes('/')) return 'operating_profit';
    if(t.includes('чистая прибыль') && !t.includes('/')) return 'profit';
    if(t.includes('чистый операц') && t.includes('доход')) return 'operating_income';
    if((t.includes('чист. проц.') || t.includes('чистый процент') || t.includes('чистые процент')) && t.includes('доход')) return 'net_interest_income';
    if((t.includes('чист. комисс') || t.includes('чистый комисс') || t.includes('чистые комисс')) && t.includes('доход')) return 'net_fee_income';
    if(t.includes('операционный денежный поток')) return 'ocf';
    if(t.includes('свободный денежный поток')) return 'fcf';
    if(t.includes('capex') && !t.includes('/')) return 'capex';
    if(t.includes('рентаб') && t.includes('ebitda')) return 'ebitda_margin';
    if(t.includes('рентаб') && (t.includes('чист') || t.includes('net margin'))) return 'net_margin';
    if(t.includes('чистая процентная маржа')) return 'nim';
    if(t.includes('расходы/доходы') || t.includes('(cir)')) return 'cir';
    if(/(^|\W)roe($|\W)/.test(t)) return 'roe';
    if(t.includes('чистый долг/ebitda')) return 'net_debt_ebitda';
    if(t.includes('ev/ebitda')) return 'ev_ebitda';
    if(/(^|\W)p\/e($|\W)/.test(t)) return 'pe';
    return '';
  }
  const roleOrder = ['revenue','operating_income','net_interest_income','net_fee_income','ebitda','operating_profit','profit','ocf','fcf','capex','ebitda_margin','nim','cir','net_margin','roe','net_debt_ebitda','ev_ebitda','pe'];
  function metricScore(label) { const fake={metric_label:label}; const idx=roleOrder.indexOf(role(fake)); return idx<0 ? 99 : idx; }
  function dedupe(list) { const map=new Map(); list.forEach(row=>{const previous=map.get(row.period); if(!previous||reportRank(row.report_date)>=reportRank(previous.report_date)) map.set(row.period,row)}); return [...map.values()].sort((a,b)=>rank(a.period)-rank(b.period)); }
  function seriesByRole(name) { const candidates=valid(filtered()).filter(row => role(row)===name); if(!candidates.length) return []; const counts=new Map(); candidates.forEach(r=>counts.set(r.metric_code,(counts.get(r.metric_code)||0)+1)); const code=[...counts].sort((a,b)=>b[1]-a[1])[0][0]; return dedupe(candidates.filter(r=>r.metric_code===code)); }
  function series(code) { return dedupe(valid(filtered().filter(row=>row.metric_code===code))); }
  function cleanUnit(row) { return String(row?.unit_label||'').replace(/\bRUB\b|руб\.?/ig,'').trim(); }
  function display(row) { const v=Number(row?.value); if(!Number.isFinite(v)) return row?.raw_value||'—'; if(isPercent(row)) return `${nf.format(v)}%`; if(isRatio(row)) return `${nf.format(v)}x`; return `${nf.format(v)}${cleanUnit(row)?` ${cleanUnit(row)}`:''}`; }
  function latest(list) { return list.reduce((a,b)=>!a||rank(b.period)>rank(a.period)?b:a,null); }
  function comparisonPair(list) { const sorted=list.filter(r=>r.period!=='LTM').sort((a,b)=>rank(a.period)-rank(b.period)); const current=sorted.at(-1); if(!current)return []; const match=String(current.period).match(/(\d{4})Q([1-4])/i); const target=match?`${Number(match[1])-1}Q${match[2]}`:String(Number(current.period)-1); const previous=sorted.find(r=>String(r.period)===target); return previous?[previous,current]:sorted.slice(-2); }
  function yoy(list) { const [previous,current]=comparisonPair(list); if(!previous||!current)return null; const a=Number(previous.value),b=Number(current.value); return a?(b/a-1)*100:null; }
  function ppChange(list) { const [previous,current]=comparisonPair(list); return !previous||!current?null:Number(current.value)-Number(previous.value); }
  function chartHeight(id,fallback) { const height=Math.round(document.getElementById(id)?.getBoundingClientRect().height||0); return height>0?height:fallback; }
  function baseLayout(height) { return {height,margin:{l:58,r:20,t:20,b:45},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{family:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',size:12,color:'#17374b'},hovermode:'x',hoverdistance:-1,spikedistance:-1,legend:{orientation:'h',x:0,y:1.13},xaxis:{gridcolor:'rgba(0,0,0,0)',tickfont:{color:'#667986'}},yaxis:{gridcolor:palette.grid,zerolinecolor:palette.grid,tickfont:{color:'#667986'}},bargap:.22}; }
  function periodLabel(value) {
    const raw=String(value||'');
    const quarter=raw.match(/^(\d{4})Q([1-4])$/i);
    return quarter?`Q${quarter[2]} ${quarter[1]}`:raw;
  }
  function compactPeriodAxis(values) { if (!window.matchMedia('(max-width: 680px)').matches || values.length<=6) return values; const last=values.length-1; const indexes=[0,Math.round(last*.25),Math.round(last*.5),Math.round(last*.75),last]; return [...new Set(indexes.map(index=>values[index]))]; }
  function periodAxis(values) {
    const visibleValues=compactPeriodAxis(values);
    return {
      gridcolor:'rgba(0,0,0,0)',
      tickfont:{color:'#667986'},
      type:'category',
      categoryorder:'array',
      categoryarray:values,
      tickmode:'array',
      tickvals:visibleValues,
      ticktext:visibleValues.map(periodLabel),
      tickangle:values.length>10?-45:0,
      automargin:true
    };
  }
  const config={responsive:true,displayModeBar:false};
  function empty(node, message='Недостаточно сопоставимых данных.') { node.innerHTML=`<div class="empty">${esc(message)}</div>`; }
  function bindChartTooltip(chartId, formatter) {
    const chart=document.getElementById(chartId); if(!chart?.on)return;
    let tooltip=chart.querySelector('.chart-tooltip');
    if(!tooltip){tooltip=document.createElement('div');tooltip.className='chart-tooltip';tooltip.setAttribute('role','status');chart.appendChild(tooltip);}
    let guide=chart.querySelector('.chart-hover-line');
    if(!guide){guide=document.createElement('span');guide.className='chart-hover-line';guide.setAttribute('aria-hidden','true');chart.appendChild(guide);}
    const previous=chartBindings.get(chart);
    if(previous?.show&&chart.removeListener)chart.removeListener('plotly_hover',previous.show);
    if(previous?.hide&&chart.removeListener)chart.removeListener('plotly_unhover',previous.hide);
    if(previous?.click&&chart.removeListener)chart.removeListener('plotly_click',previous.click);
    if(previous?.trackPointer)chart.removeEventListener('pointermove',previous.trackPointer,true);
    if(previous?.pointerDown)chart.removeEventListener('pointerdown',previous.pointerDown,true);
    if(previous?.clearPointer)chart.removeEventListener('mouseleave',previous.clearPointer);
    const binding={pointer:null,hitBounds:null,touchLocked:false};
    const trackPointer=source=>{
      const rect=chart.getBoundingClientRect();
      const plotRect=chart.querySelector('.nsewdrag')?.getBoundingClientRect();
      const x=source.clientX-rect.left, y=source.clientY-rect.top;
      const insideChart=x>=0&&x<=rect.width&&y>=0&&y<=rect.height;
      const insidePlot=!plotRect||(source.clientX>=plotRect.left&&source.clientX<=plotRect.right&&source.clientY>=plotRect.top&&source.clientY<=plotRect.bottom);
      binding.pointer=insideChart&&insidePlot?{x,y,at:performance.now()}:null;
      const bounds=binding.hitBounds;
      if(bounds&&(!binding.pointer||x<bounds.left||x>bounds.right||y<bounds.top||y>bounds.bottom))hide();
    };
    const clearPointer=()=>{binding.pointer=null;hide();};
    const hide=()=>{if(binding.touchLocked)return;binding.hitBounds=null;tooltip.classList.remove('is-visible');guide.classList.remove('is-visible');};
    const show=event=>{
      const point=event.points?.[0], model=point&&formatter(point); if(!model)return hide();
      const tooltipRows=Array.isArray(model.rows)?model.rows:[{label:model.label,value:model.value,color:model.color}];
      tooltip.innerHTML=`<span class="chart-tooltip__period">${esc(model.period)}</span>${tooltipRows.map(row=>`<span class="chart-tooltip__metric"><i style="--tooltip-color:${esc(row.color||accent)}"></i>${esc(row.label)}</span><strong>${esc(row.value)}</strong>`).join('')}`;
      tooltip.classList.add('is-visible');
      const rect=chart.getBoundingClientRect();
      const axisPoint=point.xaxis?.d2p?point.xaxis.d2p(point.x):point.xaxis?.l2p?point.xaxis.l2p(point.x):0;
      const axisX=(Number.isFinite(axisPoint)?axisPoint:0)+(point.xaxis?._offset||0);
      const axisYPoint=point.yaxis?.d2p?point.yaxis.d2p(point.y):point.yaxis?.l2p?point.yaxis.l2p(point.y):0;
      const axisY=(Number.isFinite(axisYPoint)?axisYPoint:0)+(point.yaxis?._offset||0);
      const pointer=binding.pointer;
      const pointerFresh=pointer&&performance.now()-pointer.at<350;
      const pointerX=pointerFresh?pointer.x:NaN;
      const pointerY=pointerFresh?pointer.y:NaN;
      const pointerInside=Number.isFinite(pointerX)&&Number.isFinite(pointerY);
      if(model.hit==='horizontal-bar'&&pointerInside){
        const zeroPoint=point.xaxis?.d2p?point.xaxis.d2p(0):point.xaxis?.l2p?point.xaxis.l2p(0):0;
        const zeroX=(Number.isFinite(zeroPoint)?zeroPoint:0)+(point.xaxis?._offset||0);
        const edge=8;
        const plotRect=chart.querySelector('.nsewdrag')?.getBoundingClientRect();
        const itemCount=Math.max(1,Array.isArray(point.data?.y)?point.data.y.length:1);
        const rowHalf=(plotRect?.height||rect.height)/itemCount/2;
        binding.hitBounds={left:Math.min(zeroX,axisX)-edge,right:Math.max(zeroX,axisX)+edge,top:axisY-rowHalf,bottom:axisY+rowHalf};
        if(pointerX<binding.hitBounds.left||pointerX>binding.hitBounds.right||pointerY<binding.hitBounds.top||pointerY>binding.hitBounds.bottom)return hide();
      }else binding.hitBounds=null;
      const rawX=pointerInside?pointerX:axisX;
      const rawY=pointerInside?pointerY:axisY;
      const width=tooltip.offsetWidth, height=tooltip.offsetHeight;
      let left=rawX+16; if(left+width>rect.width-8)left=rawX-width-16;
      tooltip.style.left=`${Math.max(8,Math.min(rect.width-width-8,left))}px`;
      tooltip.style.top=`${Math.max(8,Math.min(rect.height-height-8,rawY-height/2))}px`;
      if(model.guide!==false){const plotRect=chart.querySelector('.nsewdrag')?.getBoundingClientRect();guide.style.left=`${axisX}px`;guide.style.top=`${plotRect?plotRect.top-rect.top:20}px`;guide.style.height=`${plotRect?plotRect.height:Math.max(0,rect.height-65)}px`;guide.classList.add('is-visible');}else guide.classList.remove('is-visible');
    };
    const click=event=>{binding.touchLocked=true;show(event);};
    const pointerDown=source=>{binding.touchLocked=false;trackPointer(source);};
    Object.assign(binding,{show,hide,click,trackPointer,pointerDown,clearPointer}); chartBindings.set(chart,binding);
    chart.addEventListener('pointermove',trackPointer,{capture:true,passive:true});
    chart.addEventListener('pointerdown',pointerDown,{capture:true,passive:true});
    chart.addEventListener('mouseleave',clearPointer,{passive:true});
    chart.on('plotly_hover',show); chart.on('plotly_unhover',hide); chart.on('plotly_click',click);
  }

  function setDefaults() {
    const standards=unique(rows.map(r=>r.standard)); state.standard=standards.includes('IFRS')?'IFRS':standards[0]||'';
    const periods=unique(rows.filter(r=>r.standard===state.standard).map(r=>r.period_type)); state.periodType=periods.includes('annual')?'annual':periods[0]||'';
    state.metric=defaultMetricCode();
  }
  function positionGlider(node) { const active=node.querySelector('button[aria-selected="true"]'), glider=node.querySelector('.lg-segmented__glider'); if(!active||!glider)return; glider.style.width=`${active.offsetWidth}px`; glider.style.transform=`translateX(${active.offsetLeft}px)`; }
  function segment(id, values, labels, active, onClick) {
    const node=document.getElementById(id);
    node.className='company-segment lg-root lg-segmented';
    node.setAttribute('role','tablist');
    node.setAttribute('aria-orientation','horizontal');
    node.innerHTML=`<span class="lg-segmented__glider" aria-hidden="true"></span>${values.map(v=>`<button type="button" role="tab" aria-selected="${v===active}" tabindex="${v===active?'0':'-1'}" data-value="${esc(v)}">${esc(labels[v]||v)}</button>`).join('')}`;
    const buttons=[...node.querySelectorAll('button')];
    const activate=(button,restoreFocus=false)=>{
      const value=button.dataset.value;
      onClick(value);
      if(restoreFocus) requestAnimationFrame(()=>{
        [...document.getElementById(id).querySelectorAll('button')]
          .find(item=>item.dataset.value===value)?.focus();
      });
    };
    buttons.forEach((button,index)=>{
      button.onclick=()=>activate(button);
      button.onkeydown=event=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        event.preventDefault();
        const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:
          (index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
        activate(buttons[next],true);
      };
    });
    requestAnimationFrame(()=>positionGlider(node));
  }
  function metricOptions() { const map=new Map(); filtered().forEach(r=>{if(!map.has(r.metric_code)) map.set(r.metric_code,r.metric_label)}); return [...map].map(([code,label])=>({code,label})).sort((a,b)=>metricScore(a.label)-metricScore(b.label)||a.label.localeCompare(b.label,'ru')); }
  function hasRole(name) { return seriesByRole(name).length>0; }
  function isBankingSlice() { return !hasRole('revenue')&&!hasRole('ebitda')&&hasRole('operating_income')&&hasRole('net_interest_income'); }
  function resultDefinitions() {
    if(isBankingSlice()) return [['operating_income','Чистый операционный доход'],['net_interest_income','Чистый процентный доход'],['profit','Чистая прибыль']];
    if(!hasRole('ebitda')&&hasRole('operating_profit')) return [['revenue','Выручка'],['operating_profit','Операционная прибыль'],['profit','Чистая прибыль']];
    return [['revenue','Выручка'],['ebitda','EBITDA'],['profit','Чистая прибыль']];
  }
  function profitabilityDefinitions() {
    return isBankingSlice()
      ? [['nim','Чистая процентная маржа'],['cir','Расходы / доходы'],['roe','ROE']]
      : [['ebitda_margin','Рентабельность EBITDA'],['net_margin','Чистая рентабельность'],['roe','ROE']];
  }
  function defaultMetricCode() {
    const options=metricOptions();
    for(const [preferred] of resultDefinitions()){
      const match=options.find(option=>role({metric_label:option.label})===preferred);
      if(match)return match.code;
    }
    return options[0]?.code||'';
  }
  function renderControls() {
    const standards=unique(rows.map(r=>r.standard)); segment('standardButtons',standards,{IFRS:'МСФО',RAS:'РСБУ',UNKNOWN:'Прочие'},state.standard,v=>{state.standard=v; const p=unique(rows.filter(r=>r.standard===v).map(r=>r.period_type)); state.periodType=p.includes('annual')?'annual':p[0]||''; state.metric=defaultMetricCode(); render();});
    const periods=unique(rows.filter(r=>r.standard===state.standard).map(r=>r.period_type)); segment('periodButtons',periods,{annual:'Годовые',quarterly:'Квартальные',unknown:'Периоды'},state.periodType,v=>{state.periodType=v;state.metric=defaultMetricCode();render();});
    const select=document.getElementById('metricSelect'); select.innerHTML=metricOptions().map(o=>`<option value="${esc(o.code)}" ${o.code===state.metric?'selected':''}>${esc(o.label)}</option>`).join(''); select.onchange=()=>{state.metric=select.value;renderStatement();};
  }
  function renderMetrics() {
    const core=resultDefinitions();
    const supplemental=[['net_debt_ebitda','Чистый долг / EBITDA'],['ocf','Операционный денежный поток'],['fcf','Свободный денежный поток'],['roe','ROE'],['ebitda_margin','Рентабельность EBITDA'],['net_margin','Чистая рентабельность'],['capex','CAPEX'],['ev_ebitda','EV / EBITDA'],['pe','P / E']];
    const defs=[...core,...supplemental].filter(([key],index,list)=>seriesByRole(key).length&&list.findIndex(item=>item[0]===key)===index).slice(0,4);
    const cards=defs.map(([key,title])=>{const s=seriesByRole(key), row=latest(s.filter(r=>r.period!=='LTM'))||latest(s); if(!row)return ''; const delta=isPercent(row)||isRatio(row)?ppChange(s):yoy(s); const cls=delta===null?'flat':delta>=0?'up':'down'; const suffix=isPercent(row)?' п.п.':isRatio(row)?'x':'%'; const basis=isPercent(row)||isRatio(row)?'изменение':'г/г'; return `<article class="metric-card"><span>${title}</span><strong>${esc(display(row))}</strong><div><b class="delta ${cls}">${delta===null?'—':`${delta>=0?'+':''}${nf.format(delta)}${suffix}`}</b><small>${esc(row.period)} · ${basis}</small></div></article>`;}).filter(Boolean);
    const fallbackCards=[
      ['Доступные показатели',new Set(filtered().map(row=>row.metric_code).filter(Boolean)).size,'метрик'],
      ['Периоды отчетности',new Set(filtered().map(row=>row.period).filter(period=>period&&period!=='LTM')).size,'периодов'],
      ['Наблюдения',valid(filtered()).length,'строк данных']
    ];
    fallbackCards.forEach(([title,value,note])=>{if(cards.length<4)cards.push(`<article class="metric-card"><span>${title}</span><strong>${nf.format(value)}</strong><div><b class="delta flat">${note}</b><small>в выбранном срезе</small></div></article>`)});
    document.getElementById('latestMetrics').innerHTML=cards.length?cards.join(''):'<div class="empty">Нет ключевых показателей.</div>';
  }
  function renderResults() {
    const defs=resultDefinitions().map(([key,name])=>[key,name,semanticColor(key)]);
    document.getElementById('resultsTitle').textContent=defs.map(([,name])=>name).join(', ').replace(/, ([^,]+)$/,' и $1');
    const sets=defs.map(([key,name,color])=>{const data=seriesByRole(key).filter(r=>r.period!=='LTM');return {key,name,color,data:state.periodType==='annual'?data:data.slice(-24)}}).filter(x=>x.data.length);
    const periods=unique(sets.flatMap(x=>x.data.map(r=>r.period))).sort((a,b)=>rank(a)-rank(b));
    if(!sets.length){empty(document.getElementById('resultsChart'));return;}
    const traces=sets.map(x=>({type:'bar',name:x.name,x:periods,y:periods.map(p=>Number(x.data.find(r=>r.period===p)?.value)||null),marker:{color:x.color,line:{width:0}},customdata:periods.map(p=>{const r=x.data.find(v=>v.period===p);return r?display(r):'—'}),hoverinfo:'none'}));
    const layout=baseLayout(chartHeight('resultsChart',440)); layout.barmode='group'; layout.showlegend=true; layout.xaxis=periodAxis(periods); Plotly.react('resultsChart',traces,layout,config);
    bindChartTooltip('resultsChart',point=>({period:periodLabel(point.x),rows:sets.map(set=>{const row=set.data.find(item=>String(item.period)===String(point.x));return {label:set.name,value:row?display(row):'—',color:set.color};})}));
    document.getElementById('resultsPeriod').textContent=`${state.standard==='IFRS'?'МСФО':state.standard} · ${state.periodType==='annual'?'годовые':'квартальные'}`;
  }
  function renderMargins() {
    const defs=profitabilityDefinitions().map(([key,name])=>[key,name,semanticColor(key)]);
    const sets=defs.map(([key,name,color])=>{const data=seriesByRole(key).filter(r=>r.period!=='LTM');return {name,color,data:state.periodType==='annual'?data:data.slice(-24)}}).filter(x=>x.data.length);
    if(!sets.length){empty(document.getElementById('marginChart'));document.getElementById('marginFacts').innerHTML='';return;}
    const marginPeriods=unique(sets.flatMap(x=>x.data.map(r=>r.period))).sort((a,b)=>rank(a)-rank(b));
    Plotly.react('marginChart',sets.map(x=>({type:'scatter',mode:'lines+markers',name:x.name,x:x.data.map(r=>r.period),y:x.data.map(r=>Number(r.value)),line:{color:x.color,width:3},marker:{size:6},hoverinfo:'none'})),{...baseLayout(chartHeight('marginChart',310)),showlegend:true,margin:{l:50,r:15,t:20,b:42},legend:{orientation:'h',x:0,y:1.2},xaxis:periodAxis(marginPeriods)},config);
    bindChartTooltip('marginChart',point=>({period:periodLabel(point.x),rows:sets.map(set=>{const row=set.data.find(item=>String(item.period)===String(point.x));return {label:set.name,value:row?display(row):'—',color:set.color};})}));
    document.getElementById('marginFacts').innerHTML=sets.map(x=>{const r=latest(x.data),d=ppChange(x.data);return `<div><span>${esc(x.name)}</span><strong>${esc(display(r))}</strong><small>${d===null?'Изменение н/д':`${d>=0?'+':''}${nf.format(d)} п.п.`}</small></div>`}).join('');
  }
  const peerLabels={revenue:'Выручка',operating_income:'Чистый операционный доход',net_interest_income:'Чистый процентный доход',net_fee_income:'Чистый комиссионный доход',ebitda:'EBITDA',operating_profit:'Операционная прибыль',profit:'Чистая прибыль',ebitda_margin:'Рентабельность EBITDA',nim:'Чистая процентная маржа',cir:'Расходы / доходы',net_margin:'Чистая рентабельность',roe:'ROE',net_debt_ebitda:'Чистый долг / EBITDA',ev_ebitda:'EV / EBITDA',pe:'P / E'};
  function renderPeers() {
    const available=Object.keys(peerLabels).filter(key=>peers.filter(p=>p.metrics?.[key]).length>=2); if(!available.length){empty(document.getElementById('peerChart'));return;}
    if(!available.includes(state.peerMetric)) state.peerMetric=available.includes('revenue')?'revenue':available.includes('operating_income')?'operating_income':available.includes('ebitda_margin')?'ebitda_margin':available[0];
    const select=document.getElementById('peerMetric'); select.innerHTML=available.map(k=>`<option value="${k}" ${k===state.peerMetric?'selected':''}>${peerLabels[k]}</option>`).join(''); select.onchange=()=>{state.peerMetric=select.value;renderPeers();};
    const money=['revenue','operating_income','net_interest_income','net_fee_income','ebitda','operating_profit','profit'].includes(state.peerMetric);
    const items=peers.map(p=>{const m=p.metrics?.[state.peerMetric]; if(!m)return null; const value=money?Number(m.normalized_value):Number(m.value); return Number.isFinite(value)?{...p,value,raw:m}:null;}).filter(Boolean).sort((a,b)=>b.value-a.value).slice(0,8);
    const current=String(DATA.ticker||'').toUpperCase(); const metricColor=semanticColor(state.peerMetric); const colors=items.map(x=>x.ticker===current?metricColor:palette.muted);
    const displayPeer=i=>money?`${compact.format(i.value)} ₽`:state.peerMetric.includes('margin')||['nim','cir','roe'].includes(state.peerMetric)?`${nf.format(i.value)}%`:`${nf.format(i.value)}x`;
    Plotly.react('peerChart',[{type:'bar',orientation:'h',x:items.map(i=>i.value),y:items.map(i=>i.ticker),marker:{color:colors},customdata:items.map(displayPeer),hoverinfo:'none'}],{...baseLayout(chartHeight('peerChart',380)),hovermode:'closest',hoverdistance:18,spikedistance:18,margin:{l:70,r:25,t:15,b:45},showlegend:false,yaxis:{autorange:'reversed',gridcolor:'rgba(0,0,0,0)',tickfont:{weight:700,color:'#17374b'}},xaxis:{gridcolor:palette.grid,tickformat:money?'.2s':undefined}},config);
    bindChartTooltip('peerChart',point=>({period:point.y,label:peerLabels[state.peerMetric],value:point.customdata,color:colors[point.pointNumber]||palette.muted,guide:false,hit:'horizontal-bar'}));
    const median=[...items].sort((a,b)=>a.value-b.value)[Math.floor(items.length/2)]?.value;
    const peerTable=document.getElementById('peerTable');
    peerTable.innerHTML=`<table class="peer-table"><thead><tr><th>Эмитент</th><th>Показатель</th><th>К медиане</th></tr></thead><tbody>${items.map(i=>{const href=`${encodeURIComponent(i.ticker)}.html?from=peer&ticker=${encodeURIComponent(i.ticker)}`;return `<tr class="peer-table__row ${i.ticker===current?'current':''}" data-href="${esc(href)}" tabindex="0" role="link" aria-label="Открыть финансовую отчетность: ${esc(i.company_name||i.ticker)}"><td><a class="peer-table__link" href="${esc(href)}"><b>${esc(i.ticker)}</b><span>${esc(i.company_name)}</span></a></td><td>${esc(displayPeer(i))}</td><td>${median?`${i.value>=median?'+':''}${nf.format((i.value/median-1)*100)}%`:'—'}</td></tr>`;}).join('')}</tbody></table>`;
    peerTable.querySelectorAll('.peer-table__row').forEach(row=>{
      const open=()=>{window.location.href=row.dataset.href;};
      row.addEventListener('click',event=>{if(!event.target.closest('a'))open();});
      row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open();}});
    });
  }
  function renderStatement() {
    const metricSeries=series(state.metric); const points=state.periodType==='annual'?metricSeries:metricSeries.slice(-24); const chart=document.getElementById('focusChart'); if(!points.length){empty(chart);empty(document.getElementById('companyTableWrap'));return;}
    const selectedLabel=document.getElementById('metricSelect').selectedOptions[0]?.textContent||'';
    const metricColor=semanticColor(role({metric_label:selectedLabel}));
    const barColors=points.map((_,i)=>i===points.length-1?metricColor:withAlpha(metricColor,.58));
    const pointPeriods=points.map(r=>r.period);
    Plotly.react(chart,[{type:'bar',x:pointPeriods,y:points.map(r=>Number(r.value)),marker:{color:barColors},customdata:points.map(display),hoverinfo:'none'}],{...baseLayout(chartHeight('focusChart',360)),showlegend:false,margin:{l:55,r:15,t:15,b:45},xaxis:periodAxis(pointPeriods)},config);
    bindChartTooltip('focusChart',point=>({period:periodLabel(point.x),label:document.getElementById('metricSelect').selectedOptions[0]?.textContent||'Показатель',value:point.customdata,color:barColors[point.pointNumber]||accent}));
    document.getElementById('companyTableWrap').innerHTML=`<table class="company-table"><thead><tr><th>Период</th><th>Значение</th><th>Изменение</th></tr></thead><tbody>${points.slice().reverse().map((r,i,a)=>{const previous=a[i+1];const d=previous&&Number(previous.value)?(Number(r.value)/Number(previous.value)-1)*100:null;return `<tr><td>${esc(periodLabel(r.period))}</td><td class="value">${esc(display(r))}</td><td class="${d!==null&&d<0?'negative':'positive'}">${d===null?'—':`${d>=0?'+':''}${nf.format(d)}%`}</td></tr>`}).join('')}</tbody></table>`;
  }
  function render(){renderControls();renderMetrics();renderResults();renderMargins();renderPeers();renderStatement();}
  async function boot() {
    const extracted=Array.isArray(DATA.palette)&&DATA.palette.length>=3?null:await extractLogoPalette().catch(()=>null);
    if(extracted){
      issuerColors=extracted.colors; accent=issuerColors[0];
      palette={...palette,accent:issuerColors[0],secondary:issuerColors[1],tertiary:issuerColors[2]};
      document.documentElement.dataset.logoPalette=issuerColors.join(',');
      document.documentElement.dataset.logoPaletteSource='pixels';
      document.documentElement.dataset.logoPaletteDiagnostics=JSON.stringify(extracted.diagnostics);
    } else {
      document.documentElement.dataset.logoPalette=issuerColors.join(',');
      document.documentElement.dataset.logoPaletteSource=DATA.palette_source||'fallback';
    }
    document.documentElement.style.setProperty('--issuer-accent',accent);
    document.documentElement.style.setProperty('--issuer-color-1',issuerColors[0]);
    document.documentElement.style.setProperty('--issuer-color-2',issuerColors[1]);
    document.documentElement.style.setProperty('--issuer-color-3',issuerColors[2]);
    setDefaults(); render();
  }
  boot();
})();
