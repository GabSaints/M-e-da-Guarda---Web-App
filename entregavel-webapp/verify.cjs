const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let count=0;const check=(v,m)=>{assert.ok(v,m);count++};
function boot(saved,{readFail=false,writeFail=false}={}){
 const store=new Map(saved?[['mg-progress-v1',saved]]:[]),events={},handlers={},elements=new Map(),downloads=[];
 const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',hidden:false,focus(){},addEventListener(name,fn){handlers[name]=fn}});return elements.get(id)};
 class TestURL extends URL{static createObjectURL(blob){downloads.push(blob);return 'blob:test'}static revokeObjectURL(){}}
 let currentHash='';const location={href:'https://app.maedaguarda.com.br/',get hash(){return currentHash},set hash(v){currentHash=v.startsWith('#')?v:'#'+v}};
 const context={console,URL:TestURL,Blob,setTimeout,location,document:{querySelector:element,querySelectorAll:()=>[],createElement:()=>({click(){}})},localStorage:{getItem:k=>{if(readFail)throw Error('blocked');return store.get(k)||null},setItem:(k,v)=>{if(writeFail)throw Error('blocked');store.set(k,v)},removeItem:k=>store.delete(k)},FormData:class{get(key){return key==='age'?context.selectedAge:context.selected}},navigator:{clipboard:{writeText:async text=>context.copied=text}}};
 context.window=context;context.scrollTo=()=>{};context.print=()=>events.beforeprint?.();context.addEventListener=(n,fn)=>events[n]=fn;vm.createContext(context);
 for(const f of ['config.js','content.js','progress.js','trail.js','app.js'])vm.runInContext(fs.readFileSync(f,'utf8'),context,{filename:f});
 return{context,store,events,handlers,element,downloads,navigate(hash){context.location.hash='#'+hash;events.hashchange();return element('#view').innerHTML},action(action,data={}){handlers.click({target:{closest:()=>({dataset:{action,...data}})}})},choose(situation,age){context.selected=situation;context.selectedAge=age;handlers.change({target:{name:'age',value:age}});handlers.change({target:{name:'route',value:situation}})},submit(){handlers.submit({target:{id:'route-form',reportValidity:()=>true},preventDefault(){}})}};
}
(async()=>{
 const app=boot(),C=app.context.MG_CONTENT;
 check(Object.keys(C.ages).length===3,'Three published age bands');check(Object.keys(C.routes).length===7,'Seven situations including solitude');
 for(const page of ['inicio','guia','situacoes','praticas','recursos','privacidade','seguranca','ajuda','desconhecida','roteiro','trilha'])check(app.navigate(page).length>100,'Render '+page);
 check(!/sete dias|7 dias|DEMONSTRAÇÃO|premium/i.test(app.navigate('inicio')),'No time-limited or premium framing');
 check(app.navigate('ajuda').includes('https://sac.maedaguarda.com.br/'),'Preserve SAC');
 app.navigate('guia');app.context.selected='unclear';app.context.selectedAge='';app.submit();check(app.element('#status').textContent.includes('faixa etária'),'Reject missing age');
 for(const [id,r] of Object.entries(C.routes)){
   check(new Set(Object.values(r.ages)).size===3,'Distinct age openings '+id);
   for(const age of Object.keys(C.ages)){
     app.navigate('guia');app.action('restart');app.choose(id,age);
     if(r.urgent)check(app.element('#view').innerHTML.includes('Proteção vem primeiro'),'Safety before form submit');
     app.submit();let html=app.element('#view').innerHTML;
     check(html.includes(r.ages[age]),'Age-specific question '+id+'/'+age);check(html.includes(r.avoid),'Response to avoid '+id+'/'+age);check(html.includes(C.ages[age].note),'Age guidance '+id+'/'+age);
     app.action('next');check(app.element('#status').textContent.includes('Marque'),'Read acknowledgement');
     app.handlers.change({target:{id:'ack',checked:true}});app.action('next');html=app.element('#view').innerHTML;
     check(html.includes(r.today)&&html.includes(r.next),'Contextual next steps');check(html.includes(C.professional),'Professional support on all plans');
     app.action('print');const text=app.element('#print-area').textContent;
     check(text.includes(r.ages[age])&&text.includes(C.ages[age].label),'Printed age question');check(text.includes(r.avoid)&&text.includes(C.safety),'Print includes avoidance and protection');
     app.events.afterprint();check(app.element('#print-area').textContent==='','Clear printed choice');
     app.action('copy',{copy:'question'});await Promise.resolve();check(app.context.copied===r.ages[age],'Copies selected age question');
     app.action('export-plan');const exported=await app.downloads.at(-1).text();check(exported.includes(r.ages[age]),'TXT matches age question');
   }
 }
 
 for(const scenario of Object.keys(C.routes))for(const age of Object.keys(C.ages)){
 app.navigate('guia');app.action('restart');app.choose(scenario,age);app.submit();
 const days=app.context.MG_TRAIL.create(scenario,age);check(days.length===7,'Seven days for '+scenario+'/'+age);
 check(days.every((d,i)=>d.day===i+1&&d.body.length>250&&d.variation.length>70&&d.ageTip===C.ages[age].note),'Explanatory paragraphs and contextual variables');
 check(days[6].body.includes('o que aprendeu')&&days[6].body.includes('não presume'),'Day seven honest adult learning review');
 check(days[1].body.includes(C.routes[scenario].ages[age]),'Age question embedded in daily plan');
 let page=app.navigate('plano-7-dias');check(page.includes('0 de 7 dias realizados'),'Independent trail starts empty');
 for(let day=1;day<=7;day++)app.handlers.change({target:{name:'trail-day',value:String(day),checked:true}});
 page=app.element('#view').innerHTML;check(page.includes('7 de 7 dias realizados')&&page.includes('100%'),'All days complete progress');
 check(page.includes('Você marcou os sete dias'),'Completion reflection');
 app.handlers.change({target:{name:'trail-day',value:'3',checked:false}});check(app.element('#view').innerHTML.includes('6 de 7 dias realizados'),'Uncheck reverses progress');
 app.action('export-trail');const txt=await app.downloads.at(-1).text();check(txt.includes('DIA 7')&&txt.includes(C.ages[age].label)&&txt.includes('[x]')&&txt.includes('[ ]'),'Complete TXT with checkboxes');
 page=app.navigate('prever-trilha');check(page.includes('Salvar como PDF')&&page.includes('Dia 7')&&page.includes('Se a situação variar'),'Print preview instructions and all days');
 app.action('print-trail');check(app.element('#print-area').innerHTML.includes('Dia 7')&&app.element('#print-area').innerHTML.includes(C.routes[scenario].label),'Dedicated trail print');app.events.afterprint();
 if(scenario==='harm')check(days.every(d=>d.variation.includes('proteção')||d.variation.includes('apoio')||d.variation.includes('adultos')||d.variation.includes('acompanhamento')),'Urgent trail never delays safety');
 }
 const savedTrail=app.context.MG_TRAIL.backup('fear','older');const resumed=boot();check(resumed.context.MG_TRAIL.restore(savedTrail),'Restore selected trail from file data');check(resumed.context.MG_TRAIL.snapshot('fear','older').length===6,'Restore exact marked days');check(resumed.store.size===0,'Restoring does not persist history');check(!resumed.context.MG_TRAIL.restore({...savedTrail,days:[0,8]}),'Reject invalid imported days');check(!resumed.context.MG_TRAIL.restore({...savedTrail,route:'__proto__'}),'Reject invalid imported scenario');check(!resumed.context.MG_TRAIL.restore({...savedTrail,notes:'private'}),'Reject extra fields');
 app.action('backup-trail');const trailBackup=JSON.parse(await app.downloads.at(-1).text());check(trailBackup.format==='mg-trail-v1','Download restorable progress format');
 check(app.store.size===0,'Trail selections not saved by marking');
 check(boot().context.MG_TRAIL.snapshot('unclear','young').length===0,'Fresh page has no sensitive trail history');
 check(app.context.MG_TRAIL.create('invalid','young').length===0,'Invalid plan is rejected');
 app.context.MG_TRAIL.setDay('unclear','young',99,true);check(!app.context.MG_TRAIL.snapshot('unclear','young').includes(99),'Invalid day is rejected');
 app.context.MG_TRAIL.reset();check(app.context.MG_TRAIL.snapshot('unclear','young').length===0,'Clear all trail session markers');
 
 check(app.store.size===0,'No persistence by default, including age and situation');
 app.action('previous');app.action('previous');app.choose('fear','young');app.submit();app.action('next');check(app.element('#status').textContent.includes('Marque'),'Acknowledgement resets for new case');
 for(let id=1;id<=7;id++){check(app.navigate('ferramenta-'+id).includes('Uma ação possível'),'Tool '+id);app.action('toggle-day',{day:String(id)});check(app.element('#view').innerHTML.includes('Desmarcar ferramenta'),'Mark tool');check(app.navigate('dia-'+id).includes(C.days[id-1].title),'Legacy activity bookmark');}
 check(app.navigate('trilha').includes('FERRAMENTAS DE CONVERSA'),'Legacy trail bookmark');
 app.navigate('situacoes');app.action('open-case',{case:'shame'});app.events.hashchange();check(app.element('#view').innerHTML.includes('value="shame" checked'),'Library selects case');
 app.navigate('situacoes');app.action('open-case',{case:'harm'});app.events.hashchange();check(app.context.location.hash==='#seguranca'&&app.element('#view').innerHTML.includes('Segurança'),'Urgent library case goes directly to protection');
 app.context.MG_PROGRESS.setRemember(true);check(app.store.size===1,'Opt-in persistence');const stored=JSON.parse(app.store.get('mg-progress-v1'));check(Object.keys(stored).sort().join(',')==='days,remember,version','Only tool IDs and consent persisted');check(stored.days.length===7,'Preserve existing seven IDs');
 const restored=boot(app.store.get('mg-progress-v1'));check(restored.context.MG_PROGRESS.snapshot().days.length===7,'Restore previous progress');
 app.action('export-progress');const exported=JSON.parse(await app.downloads.at(-1).text());check(Object.keys(exported).sort().join(',')==='product,usedTools,version','Export no age, scenario or reflections');
 app.action('copy',{copy:'repair'});await Promise.resolve();check(app.context.copied===C.repair,'Repair phrase copy');
 restored.context.MG_PROGRESS.reset();check(restored.store.size===0,'Remove saved record');check(boot('{broken').context.MG_PROGRESS.snapshot().warning,'Corrupt record recovery');check(boot(null,{readFail:true}).context.MG_PROGRESS.snapshot().warning,'Blocked read recovery');const blocked=boot(null,{writeFail:true});blocked.context.MG_PROGRESS.setRemember(true);check(!blocked.context.MG_PROGRESS.snapshot().remember,'Blocked storage remains session only');
 for(const file of ['index.html','app.css'])for(const match of fs.readFileSync(file,'utf8').matchAll(/(?:src="|href="|url\(')([^"')]+)(?:"|'\))/g)){const target=match[1];if(/^(https?:|#)/.test(target))continue;check(fs.existsSync(target),'Local file '+target)}
 console.log(`${count} verificações passaram: 21 combinações de situação/idade, cópia, TXT, impressão, sete ferramentas, links antigos, proteção e privacidade. DOM simulado; revisão visual separada.`);
})().catch(e=>{console.error(e);process.exitCode=1});
