const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
let count = 0;
const check = (value, message) => { assert.ok(value, message); count++; };
function boot(saved) {
  const store = new Map(saved ? [['mg-progress-v1', saved]] : []);
  const events = {}, handlers = {}, elements = new Map();
  function element(id) { if (!elements.has(id)) elements.set(id, { innerHTML:'', textContent:'', hidden:false, focus(){}, addEventListener(name, fn){handlers[name]=fn;} }); return elements.get(id); }
  const context = { console, URL, Blob, setTimeout, location:{href:'https://app.maedaguarda.com.br/',hash:''}, document:{querySelector:element,querySelectorAll:()=>[],createElement:()=>({click(){}})}, localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)}, FormData:class {get(){return context.selected}}, navigator:{clipboard:{writeText:async()=>{}}} };
  context.window = context; context.scrollTo=()=>{};context.print=()=>{};context.addEventListener=(name,fn)=>events[name]=fn;
  vm.createContext(context);
  for (const file of ['config.js','content.js','progress.js','app.js']) vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
  return {context,store,events,handlers,element,navigate(hash){context.location.hash='#'+hash;events.hashchange();return element('#view').innerHTML;},action(action,day){handlers.click({target:{closest:()=>({dataset:{action,day}})}});}};
}
const app=boot();
check(app.store.size===0,'Default must not persist');
for(const route of ['inicio','roteiro','trilha','recursos','privacidade','seguranca','ajuda','desconhecida'])check(app.navigate(route).length>100,'Render '+route);
for (const situation of ['unclear','alone','excluded','harm']) {
  app.navigate('roteiro');app.action('restart');
  app.context.selected=situation;
  app.handlers.change({target:{name:'route',value:situation}});
  if(situation==='harm')check(app.element('#view').innerHTML.includes('Proteção vem primeiro'),'Immediate safety');
  app.handlers.submit({target:{id:'route-form',reportValidity:()=>true},preventDefault(){}});
  check(app.element('#view').innerHTML.includes('Encontre uma abertura'),'Conversation '+situation);
  app.action('next');check(app.element('#status').textContent.includes('Marque'),'Acknowledgement validation');
  app.handlers.change({target:{id:'ack',checked:true}});app.action('next');
  check(app.element('#view').innerHTML.includes('UM PLANO INICIAL'),'Plan '+situation);
  app.events.beforeprint();check(app.element('#print-area').textContent.includes('Situação selecionada:'),'Printable plan');
  app.events.afterprint();check(app.element('#print-area').textContent==='','Clear printed sensitive choice');
}
for(let id=1;id<=7;id++) {check(app.navigate('dia-'+id).includes('Uma ação possível'),'Activity '+id);app.action('toggle-day',String(id));check(app.element('#view').innerHTML.includes('Desmarcar atividade'),'Complete '+id);}
check(app.store.size===0,'Activities remain in memory');
app.context.MG_PROGRESS.setRemember(true);check(app.store.size===1,'Opt-in saves');
check(![...app.store.values()][0].includes('harm'),'No situation stored');
const restored=boot([...app.store.values()][0]);check(restored.context.MG_PROGRESS.snapshot().days.length===7,'Restore');
restored.context.MG_PROGRESS.reset();check(restored.store.size===0,'Delete local record');
check(boot('{broken').context.MG_PROGRESS.snapshot().warning,'Corrupted progress recovers');
for(const file of ['index.html','app.css']) {
  const text=fs.readFileSync(file,'utf8');
  for(const match of text.matchAll(/(?:src="|href="|url\(')([^"')]+)(?:"|'\))/g)){
    const target=match[1];if(/^(https?:|#)/.test(target))continue;
    check(fs.existsSync(target),'Local asset '+target);
  }
}
check(!fs.readFileSync('app.js','utf8').includes('../sac/'),'No broken SAC route');
console.log(`${count} verificações passaram: rotas, quatro caminhos, sete atividades, impressão, consentimento, restauração e arquivos locais. Renderização visual será verificada na Vercel.`);
