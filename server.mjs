import http from 'node:http';
import { createReadStream } from 'node:fs';
import { appendFile, mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { WebSocketServer, WebSocket } from 'ws';

const base = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(process.env.SITE_ROOT || path.join(base, 'site'));
const dataDirectory = path.resolve(process.env.DATA_DIR || path.join(base, 'data'));
const types = { '.html':'text/html; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.ttf':'font/ttf', '.mp4':'video/mp4', '.webm':'video/webm', '.csv':'text/csv', '.txt':'text/plain; charset=utf-8' };
const rooms = new Map();
const limits = new Map();
let fontMap = {};
try { fontMap = JSON.parse(await readFile(path.join(root,'vendor/font-map.json'),'utf8')); } catch {}

function json(res, status, data) {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store'});
  res.end(JSON.stringify(data));
}

async function submission(req, res) {
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) return json(res, 403, {error:'Invalid origin'});
  let body = ''; let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 16384) return json(res, 413, {error:'Message is too large'});
    body += chunk;
  }
  let input;
  try { input = JSON.parse(body); } catch { return json(res, 400, {error:'Invalid JSON'}); }
  if (!input || typeof input !== 'object' || !['newsletter','feedback'].includes(input.kind)) return json(res, 400, {error:'Invalid message kind'});
  if (input.pot) return json(res, 200, {ok:true});
  const email = String(input.email || '').trim();
  const message = String(input.message || input.msg || '').trim();
  if (input.kind === 'newsletter' && (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254)) return json(res, 400, {error:'Invalid email'});
  if (input.kind === 'feedback' && (!message || message.length > 8000)) return json(res, 400, {error:'A message is required'});
  if (email && (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254)) return json(res,400,{error:'Invalid email'});
  const ip = req.socket.remoteAddress;
  const previous = limits.get(ip) || 0;
  if (Date.now() - previous < 1000) return json(res, 429, {error:'Please wait before sending again'});
  limits.set(ip, Date.now());
  const entry = {id:randomUUID(), at:new Date().toISOString(), kind:input.kind, email, message,
    name:String(input.name || '').slice(0,200), who:String(input.who || '').slice(0,200), does:String(input.does || '').slice(0,500),
    share:input.share===true, xh:input.share===true?String(input.xh || '').slice(0,100):'', news:input.news===true,
    from:String(input.from || '').slice(0,500)};
  await mkdir(dataDirectory, {recursive:true, mode:0o700});
  await appendFile(path.join(dataDirectory,'outbox.jsonl'),JSON.stringify(entry)+'\n',{mode:0o600});
  json(res,200,{ok:true,id:entry.id,delivery:'local-outbox'});
}

export function localizeHTML(html) {
  return html.replace(/https:\/\/sael\.net(?=[/"'])/g,'')
    .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/three@([^/]+)\//g,'/vendor/three-$1/')
    .replace(/https:\/\/fonts\.googleapis\.com\/css2\?[^"<>]+/g,url=>fontMap[url.replaceAll('&amp;','&')] || url)
    .replace(/<script\b[^>]*src=["']https:\/\/dat\.d1\.tel\/script\.js["'][^>]*>\s*<\/script>/gi,'')
    .replace(/new WebSocket\("wss:\/\/" \+ HOST \+ "\/runtime\/session"\)/g,'new WebSocket((location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/runtime/session")')
    .replace(/<head([^>]*)>/i,'<head$1><script src="/recovery-runtime.js"></script>');
}

function localizeScript(source) {
  return source.replaceAll('https://sael.net/', '/')
    .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/three@([^/]+)\//g,'/vendor/three-$1/')
    .replace(/https:\/\/fonts\.googleapis\.com\/css2\?[^"'<>]+/g,url=>fontMap[url.replaceAll('&amp;','&')] || url);
}

export const server = http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url,'http://localhost');
    if (req.method === 'POST' && url.pathname === '/api/say') return await submission(req,res);
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {'Allow':'GET, HEAD'}); return res.end(); }
    if (url.pathname === '/api/where') return json(res,200,{c:process.env.LOCAL_COUNTRY || ''});
    if (url.pathname === '/api/health') return json(res,200,{ok:true,mode:'recovered-source',rooms:rooms.size});
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch {return json(res,400,{error:'Invalid path'});}
    if (pathname.includes('\0') || pathname.includes('\\')) return json(res,400,{error:'Invalid path'});
    let file = path.resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) return json(res,403,{error:'Invalid path'});
    let info;
    try { info = await stat(file); } catch { return json(res,404,{error:'Not found',path:pathname}); }
    if (info.isDirectory()) {
      const isCategory = ['explainers','worlds','data','design','play','virtual-tour','newsletter'].includes(pathname.replaceAll('/',''));
      if (!pathname.endsWith('/') && !isCategory) {res.writeHead(308,{Location:pathname+'/'+url.search});return res.end();}
      file = path.join(file,'index.html'); info=await stat(file);
    }
    const extension=path.extname(file);
    const mime=types[extension] || (pathname.startsWith('/api/') ? 'application/json; charset=utf-8' : 'application/octet-stream');
    res.setHeader('Content-Type',mime);res.setHeader('X-Content-Type-Options','nosniff');
    if (extension === '.html') {
      const content=localizeHTML(await readFile(file,'utf8'));
      res.setHeader('Content-Length',Buffer.byteLength(content));
      if (req.method === 'HEAD') return res.end();
      return res.end(content);
    }
    if (pathname === '/works.json') {
      const origin=`http${req.socket.encrypted?'s':''}://${req.headers.host}`;
      const content=(await readFile(file,'utf8')).replaceAll('https://sael.net/',origin+'/');
      return res.end(req.method === 'HEAD' ? '' : content);
    }
    if (extension === '.js') {
      const source=localizeScript(await readFile(file,'utf8'));
      return res.end(req.method === 'HEAD' ? '' : source);
    }
    res.setHeader('Accept-Ranges','bytes');
    let start=0,end=info.size-1;
    if (req.headers.range) {
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) {res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
      if (!match[1]) start=Math.max(0,info.size-Number(match[2]));
      else {start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),end);}
      if (start> end || start>=info.size) {res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
      res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${info.size}`);
    }
    res.setHeader('Content-Length',end-start+1);
    if (req.method === 'HEAD') return res.end();
    createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
  } catch (error) {if(!res.headersSent)json(res,500,{error:'Server error'});else res.destroy();console.error(error.message);}
});

const sockets = new WebSocketServer({noServer:true,maxPayload:16384});
function refresh(room) {
  const members=rooms.get(room);
  if (!members) return;
  const data=Object.fromEntries([...members].map(([ws,presence])=>[ws.clientId,{data:presence}]));
  for(const ws of members.keys())if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify({op:'refresh-presence','room-id':room,data}));
  if (!members.size) rooms.delete(room);
}
server.on('upgrade',(req,socket,head)=>{
  let origin;
  try {origin = req.headers.origin && new URL(req.headers.origin).host;} catch {socket.destroy();return;}
  if(req.url!=='/runtime/session' || (origin && origin!==req.headers.host)){socket.destroy();return;}
  sockets.handleUpgrade(req,socket,head,ws=>sockets.emit('connection',ws,req));
});
sockets.on('connection',ws=>{
  ws.clientId=randomUUID();ws.joined=new Set();
  ws.on('error',()=>{});
  ws.on('message',raw=>{
    let m;try{m=JSON.parse(raw);}catch{return;}
    if(!m || typeof m!=='object')return;
    if(m.op==='init')return ws.send(JSON.stringify({op:'init-ok'}));
    const room=m['room-id'];
    if(typeof room!=='string'||room.length>100||!/^[\w/-]+$/.test(room))return;
    if(m.op==='join-room' && ws.joined.size<128){
      if(!rooms.has(room))rooms.set(room,new Map());rooms.get(room).set(ws,{});ws.joined.add(room);
      ws.send(JSON.stringify({op:'join-room-ok','room-id':room}));refresh(room);
    }
    if(m.op==='set-presence' && ws.joined.has(room)){
      rooms.get(room).set(ws,{c:typeof m.data?.c==='string'?m.data.c.slice(0,2):'',o:m.data?.o?1:0});refresh(room);
    }
  });
  ws.on('close',()=>{for(const room of ws.joined){rooms.get(room)?.delete(ws);refresh(room);}});
});

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(Number(process.env.PORT || 4173),process.env.HOST || '127.0.0.1',()=>console.log(`Sael restored: http://${process.env.HOST || '127.0.0.1'}:${server.address().port}`));
}
