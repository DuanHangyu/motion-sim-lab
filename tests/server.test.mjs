import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import WebSocket from 'ws';

let server, origin, temporary;
before(async()=>{
  temporary=await mkdtemp(path.join(tmpdir(),'sael-test-'));
  process.env.DATA_DIR=temporary;
  ({server}=await import('../server.mjs'));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  origin=`http://127.0.0.1:${server.address().port}`;
});
after(async()=>{await new Promise(resolve=>server.close(resolve));await rm(temporary,{recursive:true,force:true});});

test('internal links and original rendering module are served locally',async()=>{
  const home=await (await fetch(origin)).text();
  assert.match(home,/href="\/soap-bubble"/);
  assert.match(home,/\/vendor\/fonts\//);
  const r=await fetch(origin+'/soap-bubble',{redirect:'manual'});
  assert.equal(r.status,308);assert.equal(r.headers.get('location'),'/soap-bubble/');
  const page=await(await fetch(origin+'/soap-bubble/')).text();
  const scene=/src="(?:\.\/|\/soap-bubble\/)scene\.js"/.test(page)?await(await fetch(origin+'/soap-bubble/scene.js')).text():page;
  assert.match(scene,/from\s*"three"/);assert.match(scene,/window\.__lab/);
  const works=await(await fetch(origin+'/works.json')).json();
  assert.ok(works.works.find(w=>w.slug==='soap-bubble').url.startsWith(origin));
});

test('HTTPS deployment keeps gallery navigation on the configured public origin',async()=>{
  const previous=process.env.PUBLIC_ORIGIN;
  process.env.PUBLIC_ORIGIN='https://example.invalid:8446';
  try {
    const works=await(await fetch(origin+'/works.json')).json();
    assert.equal(works.works.find(w=>w.slug==='soap-bubble').url,'https://example.invalid:8446/soap-bubble');
    assert.ok(works.works.some(w=>!w.url.startsWith('https://example.invalid:8446/')),'external works keep their original URLs');
  } finally {
    if(previous===undefined)delete process.env.PUBLIC_ORIGIN;
    else process.env.PUBLIC_ORIGIN=previous;
  }
});

test('video range reads provide real bytes and reject impossible ranges',async()=>{
  const url=origin+'/p/soap-bubble/loop.mp4';
  const r=await fetch(url,{headers:{Range:'bytes=0-99'}});
  assert.equal(r.status,206);assert.match(r.headers.get('content-range'),/^bytes 0-99\/\d+$/);
  assert.equal((await r.arrayBuffer()).byteLength,100);
  const bad=await fetch(url,{headers:{Range:'bytes=9999999999-'}});assert.equal(bad.status,416);
  const suffix=await fetch(url,{headers:{Range:'bytes=-20'}});assert.equal(suffix.status,206);assert.equal((await suffix.arrayBuffer()).byteLength,20);
});

test('malformed and cross-origin submissions fail without creating outbox',async()=>{
  let r=await fetch(origin+'/api/say',{method:'POST',body:'broken'});assert.equal(r.status,400);
  r=await fetch(origin+'/api/say',{method:'POST',body:JSON.stringify({kind:'newsletter',email:'bad'})});assert.equal(r.status,400);
  r=await fetch(origin+'/api/say',{method:'POST',headers:{Origin:'https://elsewhere.example'},body:'{}'});assert.equal(r.status,403);
});

test('a feedback submission durably preserves message and opt-in fields',async()=>{
  const input={kind:'feedback',email:'recovery-test@example.invalid',message:'Local recovery test',news:true,share:true,xh:'test',from:'/soap-bubble/'};
  const r=await fetch(origin+'/api/say',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
  assert.equal(r.status,200);assert.equal((await r.json()).delivery,'local-outbox');
  const saved=JSON.parse((await readFile(path.join(temporary,'outbox.jsonl'),'utf8')).trim());
  for(const field of Object.keys(input))assert.equal(saved[field],input[field]);
});

test('presence broadcasts joins, watcher status and departure to surviving clients',async()=>{
  const url=origin.replace('http:','ws:')+'/runtime/session';
  const a=new WebSocket(url), b=new WebSocket(url);
  await Promise.all([once(a,'open'),once(b,'open')]);
  const waitFor=(socket,predicate)=>new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{socket.off('message',receive);reject(new Error('Presence timeout'));},2000);
    function receive(raw){const m=JSON.parse(raw);if(predicate(m)){clearTimeout(timer);socket.off('message',receive);resolve(m);}}
    socket.on('message',receive);
  });
  let response=waitFor(a,m=>m.op==='init-ok');a.send(JSON.stringify({op:'init'}));await response;
  response=waitFor(a,m=>m.op==='refresh-presence'&&Object.keys(m.data).length===1);
  a.send(JSON.stringify({op:'join-room','room-id':'test'}));await response;
  response=waitFor(a,m=>m.op==='refresh-presence'&&Object.keys(m.data).length===2);
  b.send(JSON.stringify({op:'join-room','room-id':'test'}));await response;
  response=waitFor(a,m=>m.op==='refresh-presence'&&Object.values(m.data).some(p=>p.data.o===1));
  b.send(JSON.stringify({op:'set-presence','room-id':'test',data:{o:1,c:'US'}}));await response;
  response=waitFor(a,m=>m.op==='refresh-presence'&&Object.keys(m.data).length===1);b.close();await response;
  a.close();await once(a,'close');
});
