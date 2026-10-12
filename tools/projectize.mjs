// Recover editable files from preserved production HTML without changing scene logic.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import prettier from 'prettier';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const archive=process.argv[2];
if(!archive)throw new Error('Pass the path of the preserved baseline/site directory');
const manifest=JSON.parse(await readFile(path.join(project,'recovery-manifest.json'),'utf8'));
const pages=[...new Set(Object.values(manifest).filter(x=>x.status==='recovered'&&x.path?.endsWith('/index.html')||x.path==='index.html').map(x=>x.path))];
const records=[];
for(const relative of pages){
  const original=await readFile(path.join(archive,relative),'utf8');
  let html=original;
  const folder=path.join(project,'site',path.dirname(relative));
  const relativeFolder=path.dirname(relative);
  const assetBase=relativeFolder==='.'?'/':`/${relativeFolder}/`;
  await mkdir(folder,{recursive:true});
  const generated=[];let styles=0, scripts=0;
  const blocks=[...original.matchAll(/<(script|style)\b([^>]*)>([\s\S]*?)<\/\1>/gi)];
  const scriptType=attrs=>{
    const m=/\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs);
    return (m?.[1]||m?.[2]||m?.[3]||'').toLowerCase();
  };
  const inline=blocks.filter(m=>m[1].toLowerCase()==='script'&&!/\bsrc\s*=/i.test(m[2])&&['','module','text/javascript','application/javascript'].includes(scriptType(m[2]))&&m[3].trim());
  const largest=inline.reduce((best,m)=>!best||m[3].length>best[3].length?m:best,null);
  for(const match of blocks.filter(m=>m[1].toLowerCase()==='style')){
    const name=++styles===1?'styles.css':`styles-${styles}.css`;
    const code=await prettier.format(match[3],{parser:'css'});
    await writeFile(path.join(folder,name),code);
    html=html.replace(match[0],`<link rel="stylesheet" href="${assetBase}${name}"${match[2]}>`);
    generated.push({file:name,type:'css',originalSha256:createHash('sha256').update(match[3]).digest('hex')});
  }
  for(const match of inline){
    const module=scriptType(match[2])==='module';
    const name=match===largest?(module?'scene.js':'app.js'):`bootstrap-${++scripts}.js`;
    let code;
    try { code=await prettier.format(match[3],{parser:'babel'}); }
    catch(error){throw new Error(`${relative}/${name}: ${error.message.split('\n')[0].slice(0,200)}`);}
    await writeFile(path.join(folder,name),code);
    html=html.replace(match[0],`<script${match[2]} src="${assetBase}${name}"></script>`);
    generated.push({file:name,type:module?'module':'classic',originalSha256:createHash('sha256').update(match[3]).digest('hex')});
  }
  html=await prettier.format(html,{parser:'html',htmlWhitespaceSensitivity:'strict'});
  await writeFile(path.join(folder,'index.html'),html);
  records.push({page:relative,sourceSha256:createHash('sha256').update(original).digest('hex'),generated});
  console.log(relative,generated.length);
}
await writeFile(path.join(project,'source-map.json'),JSON.stringify(records,null,2));
