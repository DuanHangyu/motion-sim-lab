import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import WebSocket from 'ws';

let server, origin;
const prefix='/motion-sim-lab';
before(async()=>{
  process.env.PUBLIC_BASE_PATH=prefix;
  process.env.PUBLIC_ORIGIN='https://demo.example';
  ({server}=await import('../server.mjs'));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  origin=`http://127.0.0.1:${server.address().port}`;
});
after(async()=>{await new Promise(resolve=>server.close(resolve));});

test('mounted site serves its own links, dependencies and redirects inside its prefix',async()=>{
  assert.equal((await fetch(origin+'/api/health')).status,404);
  assert.equal((await fetch(origin+prefix+'/api/health')).status,200);
  const home=await(await fetch(origin+prefix+'/')).text();
  assert.match(home,/href="\/motion-sim-lab\/soap-bubble"/);
  assert.match(home,/href="\/motion-sim-lab\/"/);
  assert.match(home,/src="\/motion-sim-lab\/recovery-runtime\.js"/);
  const page=await(await fetch(origin+prefix+'/soap-bubble/')).text();
  assert.match(page,/\/motion-sim-lab\/soap-bubble\/bootstrap-1\.js/);
  const bootstrap=await(await fetch(origin+prefix+'/soap-bubble/bootstrap-3.js')).text();
  assert.match(bootstrap,/\/motion-sim-lab\/vendor\/three-/);
  const r=await fetch(origin+prefix+'/soap-bubble',{redirect:'manual'});
  assert.equal(r.status,308);
  assert.equal(r.headers.get('location'),prefix+'/soap-bubble/');
  const works=await(await fetch(origin+prefix+'/works.json')).json();
  assert.equal(works.works.find(w=>w.slug==='soap-bubble').url,'https://demo.example'+prefix+'/soap-bubble');
  const script=await(await fetch(origin+prefix+'/soap-bubble/scene.js')).text();
  assert.match(script,/t === "\/"/,'non-URL slash literals must remain unchanged');
  const runtime=await(await fetch(origin+prefix+'/recovery-runtime.js')).text();
  assert.match(runtime,/localURL\('\/runtime\/session'\)/);
  assert.match(runtime,/startsWith\('https:\/\/sael\.net\/'\)/,'URL adapter must keep the original host check');
});

test('mounted videos and websocket sessions remain functional',async()=>{
  for(const [legacy,slug] of [['airace','airace'],['ai-mall','token-town']]) {
    const response=await fetch(origin+prefix+'/'+legacy+'/poster.webp');
    assert.equal(response.status,200);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()),Buffer.from(await(await fetch(origin+prefix+'/p/'+slug+'/poster.webp')).arrayBuffer()));
  }
  const response=await fetch(origin+prefix+'/p/soap-bubble/loop.mp4',{headers:{Range:'bytes=0-99'}});
  assert.equal(response.status,206);
  assert.equal((await response.arrayBuffer()).byteLength,100);
  const ws=new WebSocket(origin.replace('http:','ws:')+prefix+'/runtime/session');
  await once(ws,'open');
  const reply=once(ws,'message');
  ws.send(JSON.stringify({op:'init'}));
  assert.equal(JSON.parse((await reply)[0]).op,'init-ok');
  ws.close(); await once(ws,'close');
});
