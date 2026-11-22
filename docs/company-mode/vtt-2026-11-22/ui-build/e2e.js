const { chromium } = require('playwright');
const B='http://localhost:3001', T='6b02d4274e945d2a1dbcad0d';
const api=async(m,p,body,tok)=>{const r=await fetch(B+'/api'+p,{method:m,headers:{'Content-Type':'application/json',...(tok?{Authorization:'Bearer '+tok}:{})},body:body?JSON.stringify(body):undefined});return r.json();};
const ok=(n,c,x='')=>{console.log((c?'PASS':'FAIL')+'  '+n+(x?'  '+x:''));if(!c)process.exitCode=1;};
(async()=>{
 const gm=await api('POST','/auth/login',{username:'gamemaster',password:'testpass1'});
 const sa=await api('POST','/auth/login',{username:'sasha',password:'testpass1'});
 const b=await chromium.launch(); const errs=[];
 // GM
 let ctx=await b.newContext({viewport:{width:1280,height:800}}); let p=await ctx.newPage();
 p.on('pageerror',e=>errs.push('gm: '+e.message));
 await p.goto(B+'/'); await p.evaluate(t=>{localStorage.setItem('adminToken',t);localStorage.setItem('adminUsername','gamemaster');},gm.token);
 await p.goto(B+'/gm/'+T); await p.waitForSelector('.toklist .tokrow',{timeout:15000});
 const rows=await p.$$eval('.toklist .tokrow',r=>r.map(x=>x.innerText.replace(/\s+/g,' ')));
 ok('GM list shows every token incl. the hidden one', rows.length===4 && rows.some(r=>/Little Brother/.test(r)), JSON.stringify(rows));
 ok('off-map warning shown', await p.isVisible('.offmap-warn'), await p.innerText('.offmap-warn').catch(()=>''));
 await p.click('.offmap-warn button'); await p.waitForTimeout(400);
 const lb=await p.$('g[data-token] >> text=Little Brother Roach (hidden)'); const box=lb&&await lb.boundingBox();
 ok('after Show, Little Brother is on screen', !!box && box.x>0 && box.x<1280 && box.y>0 && box.y<800, JSON.stringify(box));
 await p.screenshot({path:'gm-fit.png'});
 await p.click('button[aria-label="Reveal Little Brother Roach"]'); await p.waitForTimeout(800);
 let m=await api('GET',`/tables/${T}/live`,null,gm.token); ok('Reveal from the list un-hides it', m.map.tokens.find(t=>/Little/.test(t.name)).hidden===false);
 await p.click('button[aria-label="Hide Little Brother Roach"]'); await p.waitForTimeout(800);
 m=await api('GET',`/tables/${T}/live`,null,gm.token); ok('Hide from the list hides it again', m.map.tokens.find(t=>/Little/.test(t.name)).hidden===true);
 await ctx.close();
 // Player desktop
 await api('PATCH',`/tables/${T}/tokens/${m.map.tokens.find(t=>t.name==='Sasha').tokenId}/move`,{col:3,row:3},sa.token);
 ctx=await b.newContext({viewport:{width:1280,height:800}}); p=await ctx.newPage(); p.on('pageerror',e=>errs.push('pl: '+e.message));
 await p.goto(B+'/'); await p.evaluate(a=>{localStorage.setItem('token',a.token);localStorage.setItem('userId',a.userId);localStorage.setItem('username','sasha');},sa);
 await p.goto(B+'/table'); const sel='g[data-token]:has(text:text-is("Sasha"))'; await p.waitForSelector(sel,{timeout:15000});
 // keyboard
 await p.focus(sel); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
 ok('Enter picks up the token', /Pick a hex/i.test(await p.innerText('.board-info')), await p.innerText('.board-info'));
 await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(100);
 ok('arrows show the distance and cost', /2 spaces · free move/i.test(await p.innerText('.board-info')), await p.innerText('.board-info'));
 await p.keyboard.press('Enter'); await p.waitForTimeout(800);
 m=await api('GET',`/tables/${T}/live`,null,sa.token); let s=m.map.tokens.find(t=>t.name==='Sasha'); ok('keyboard move lands two hexes right', s.col===5&&s.row===3, `${s.col},${s.row}`);
 // mouse click-to-move
 const tb=await (await p.$(sel)).boundingBox(); await p.mouse.click(tb.x+tb.width/2, tb.y+tb.height/2-8); await p.waitForTimeout(200);
 ok('click picks up the token', /Pick a hex/i.test(await p.innerText('.board-info')));
 await p.screenshot({path:'pl-pick.png'});
 await p.mouse.click(tb.x+tb.width/2, tb.y+tb.height/2-8+120); await p.waitForTimeout(800);
 m=await api('GET',`/tables/${T}/live`,null,sa.token); s=m.map.tokens.find(t=>t.name==='Sasha'); ok('clicking a hex moves the token', !(s.col===5&&s.row===3), `${s.col},${s.row}`);
 await p.keyboard.press('Escape');
 await ctx.close();
 // phone
 ctx=await b.newContext({viewport:{width:375,height:740},deviceScaleFactor:2,isMobile:true,hasTouch:true}); p=await ctx.newPage(); p.on('pageerror',e=>errs.push('ph: '+e.message));
 await p.goto(B+'/'); await p.evaluate(a=>{localStorage.setItem('token',a.token);localStorage.setItem('userId',a.userId);localStorage.setItem('username','sasha');},sa);
 await p.goto(B+'/table'); await p.waitForSelector('.table-panes button',{timeout:15000}); await p.waitForTimeout(800);
 const sw=await p.evaluate(()=>document.documentElement.scrollWidth); ok('phone: no sideways scroll', sw<=375, 'scrollWidth '+sw);
 ok('phone: board is above the tabs', await p.evaluate(()=>document.querySelector('.table-map').getBoundingClientRect().top < document.querySelector('.table-panes').getBoundingClientRect().top));
 await p.screenshot({path:'ph-body.png'});
 await p.click('.table-panes button:text("Chat")'); await p.waitForTimeout(300);
 ok('phone: Chat tab shows the chat, hides the body', await p.isVisible('.tablechat') && !(await p.isVisible('text=My body')));
 await p.screenshot({path:'ph-chat.png'});
 // desktop unchanged
 await ctx.close(); ctx=await b.newContext({viewport:{width:1280,height:800}}); p=await ctx.newPage();
 await p.goto(B+'/'); await p.evaluate(a=>{localStorage.setItem('token',a.token);localStorage.setItem('userId',a.userId);},sa); await p.goto(B+'/table'); await p.waitForSelector('.tablechat',{timeout:15000});
 ok('desktop: no tabs, body + chat both visible', !(await p.isVisible('.table-panes')) && await p.isVisible('text=My body') && await p.isVisible('.tablechat'));
 ok('no page errors', errs.length===0, errs.join(' | '));
 await b.close();
 await api('PATCH',`/tables/${T}/tokens/${s.tokenId}/move`,{col:3,row:3},sa.token);
})();
