'use strict';
// Adaptador local. Guarda apenas ids de atividades concluídas; sem dados ou escolhas sobre a criança.
window.MG_PROGRESS=(()=>{
 const key='mg-progress-v1';const clean=x=>Array.isArray(x)?[...new Set(x.filter(n=>Number.isInteger(n)&&n>=1&&n<=7))]:[];
 let done=[],remember=false,warning='';
 try{const raw=localStorage.getItem(key);if(raw){const parsed=JSON.parse(raw);if(parsed?.version===1&&parsed.remember===true){remember=true;done=clean(parsed.days)}}}catch{warning='Não foi possível recuperar o progresso. Você pode continuar sem salvar.'}
 function save(){if(!remember)return;try{localStorage.setItem(key,JSON.stringify({version:1,remember:true,days:done}));warning=''}catch{remember=false;warning='O navegador não permitiu salvar. Seu progresso continua apenas nesta sessão.'}}
 return{snapshot:()=>({days:[...done],remember,warning}),setDay(id,value){if(!Number.isInteger(id)||id<1||id>7)return;done=clean(value?[...done,id]:done.filter(n=>n!==id));save()},setRemember(value){if(value){remember=true;save()}else{try{localStorage.removeItem(key);remember=false;warning=''}catch{warning='Não foi possível apagar o registro local. Use a limpeza de dados do navegador.'}}return this.snapshot()},reset(){try{localStorage.removeItem(key);done=[];remember=false;warning='';return true}catch{warning='Não foi possível apagar o registro local. Use a limpeza de dados do navegador.';return false}}};
})();
