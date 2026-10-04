const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
function el(id=''){let cls=new Set(id==='home'?['active']:[]);return {id,value: id==='rounds'?'10':id==='a1'?'0':id==='a2'?'2':id==='t1'?'الفريق الأحمر':id==='t2'?'الفريق الأزرق':'',innerHTML:'',textContent:'',style:{},dataset:{},classList:{add(...xs){xs.forEach(x=>cls.add(x))},remove(...xs){xs.forEach(x=>cls.delete(x))},contains(x){return cls.has(x)},toggle(x,v){v=v??!cls.has(x);v?cls.add(x):cls.delete(x)}},setAttribute(){},addEventListener(){},focus(){},appendChild(){}}}
const els=Object.fromEntries(ids.map(id=>[id,el(id)]));const screens=['home','setup','categories','turnIntro','game','finish'].map(id=>els[id]);let selected=[];
const storage={};const doc={getElementById:id=>els[id]??(els[id]=el(id)),querySelectorAll:s=>s==='.screen'?screens:s==='.cat.selected'?selected:[],querySelector:s=>s==='.screen.active'?screens.find(e=>e.classList.contains('active')):el(),addEventListener(){},createElement:()=>el()};
const sandbox={document:doc,window:{},navigator:{},location:{protocol:'file:'},console:{info(){},error(...v){console.error(...v)}},localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){},Audio:function(){},Math,Date,Set,Uint8Array};sandbox.window=sandbox;
vm.createContext(sandbox);vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],sandbox);vm.runInContext('stopAll=()=>{};play=()=>{};haptic=()=>{};maybeStartOpeningMusic=()=>{}',sandbox);
const report=vm.runInContext(`(()=>{let failures=[];let tested=0;for(let age=0;age<5;age++)for(const cat of CAT)for(const rounds of [6,10,14]){st.teams=[{name:'A',age},{name:'B',age}];st.selected=[cat[0]];st.used=new Set();st.usedTopics=new Set();st.usedTypes=[];st.catCounts={};st.categoryQueue=[];st.lastCategory=null;st.veryHard25Used=false;st.turn=0;let hard=0;for(let i=0;i<rounds;i++){let q=getQuestion();if(!questionFits(q,age))failures.push('age mismatch');if(q.level===5)hard++}if(age===4&&hard>1)failures.push('cap exceeded');tested++}return {bank:window.__QUESTION_BANK_AUDIT__,arabic:window.__ARABIC_TEXT_AUDIT__,tested,failures}})()`,sandbox);
assert.equal(report.failures.length,0);assert.equal(report.bank.errors.length,0);assert.equal(report.arabic.errors.length,0);
// History only leaves level 5 unseen: still cannot select a second one.
assert.equal(vm.runInContext(`(()=>{st.teams=[{name:'A',age:4},{name:'B',age:4}];st.selected=['general'];st.used=new Set();st.usedTopics=new Set();st.usedTypes=[];st.veryHard25Used=true;let h={};Q.filter(q=>q.level<5).forEach(q=>h[q.id]={last:1});saveHistory(h);return getQuestion().level<5})()`,sandbox),true);
assert.equal(vm.runInContext(`(()=>{st.scores=[0,0];st.current={level:3};st.answered=false;mark(true);mark(true);return st.scores[0]})()`,sandbox),300);
assert.equal(vm.runInContext(`(()=>{st.teams=[{name:'<img src=x>',age:4},{name:'B',age:4}];st.scores=[300,0];finish();return document.getElementById('finalScore').innerHTML.includes('&lt;img')})()`,sandbox),true);
console.log(JSON.stringify({...report,regressions:['history cap','double score','team name escaping']},null,2));
// Drive complete games through the real selection/scoring/finish functions.
selected=['general','flags','capitals','math','words','speed','islamic'].map(cat=>{const e=el();e.dataset.cat=cat;return e;});
for(const rounds of [6,10,14]){
  els.rounds.value=String(rounds);els.a1.value='0';els.a2.value='4';
  const outcome=vm.runInContext(`(()=>{startChallenge();let expected=[0,0],hard=0;for(let i=0;i<st.rounds;i++){expected[st.turn]+=POINTS[st.current.level];if(st.teams[st.turn].age===4&&st.current.level===5)hard++;reveal();mark(true);nextTurn();if(st.qnum<st.rounds)beginQuestion()}clearTimer();return {scores:st.scores,expected,hard,finished:document.getElementById('finish').classList.contains('active')}})()`,sandbox);
  assert.equal(JSON.stringify(outcome.scores),JSON.stringify(outcome.expected));assert(outcome.hard<=1);assert(outcome.finished);
}
console.log('Full game scoring and finish passed for 6, 10, 14 questions');
