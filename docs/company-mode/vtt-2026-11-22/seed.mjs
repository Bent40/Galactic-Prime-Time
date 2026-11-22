import fs from 'fs';
const B='http://localhost:3001/api';
const j=async(m,p,body,tok)=>{const r=await fetch(B+p,{method:m,headers:{'Content-Type':'application/json',...(tok?{Authorization:'Bearer '+tok}:{})},body:body?JSON.stringify(body):undefined});const t=await r.text();let d;try{d=JSON.parse(t)}catch{d=t}if(!r.ok)throw new Error(m+' '+p+' '+r.status+' '+t);return d;};
const reg=async(u)=>{try{return await j('POST','/auth/register',{username:u,password:'testpass1'})}catch{return j('POST','/auth/login',{username:u,password:'testpass1'})}};
await reg('gamemaster'); await j('POST','/auth/make-admin',{username:'gamemaster',adminSecret:'devadmin'});
const gm=await j('POST','/auth/login',{username:'gamemaster',password:'testpass1'}); const G=gm.token;
const { DEFAULT_STATE } = await import(process.argv[2]);
const fire=await j('POST','/admin/skill-library',{name:'Fire Ball',momentCost:2,stats:['mind'],range:'6',target:'One',effect:'Hurl a ball of flame for 2 Burn.',damageTypes:['Burn']},G);
const slice=await j('POST','/admin/skill-library',{name:"Slice n' Dice",momentCost:1,stats:['reflexes'],effect:'Claw slash for 2 Bleed.'},G);
const players={};
for (const [u,name] of [['sasha','Sasha'],['filipe','Filipe']]) {
  const p=await reg(u); players[u]=p;
  const st=structuredClone(DEFAULT_STATE); st.identity={...st.identity,name};
  await j('POST','/character',{state:st},p.token);
  for (const t of [fire,slice]) await j('POST',`/admin/players/${p.userId}/skills`,{templateId:t._id},G);
}
const table=await j('POST','/tables',{name:'Tutorial Floor',description:'Company Mode test table'},G);
for (const p of Object.values(players)) await j('POST',`/tables/${table._id}/seats`,{userId:p.userId},G);
const img='data:image/jpeg;base64,'+fs.readFileSync('map.jpg').toString('base64');
const map=await j('POST',`/tables/${table._id}/maps`,{name:'Hatchery',image:img,width:900,height:600,grid:{size:40}},G);
const T=(b)=>j('POST',`/tables/${table._id}/maps/${map._id}/tokens`,b,G);
await T({name:'Sasha',kind:'player',refId:players.sasha.userId,col:3,row:3,color:'#ffb347'});
await T({name:'Filipe',kind:'player',refId:players.filipe.userId,col:4,row:5,color:'#5bc0eb'});
await T({name:'Roach-dog',kind:'enemy',col:10,row:4,color:'#c0392b',parts:[{name:'Carapace',maxHp:2,lethal:true}]});
await T({name:'Little Brother Roach',kind:'enemy',col:14,row:6,hidden:true,color:'#8e44ad',parts:[{name:'Thorax',maxHp:8,lethal:true},{name:'Brood-Sling',maxHp:4}]});
await j('PATCH',`/tables/${table._id}`,{activeMapId:map._id},G);
fs.writeFileSync('seeded.json',JSON.stringify({tableId:table._id,mapId:map._id,gmToken:G,players},null,1));
console.log('table',table._id);
