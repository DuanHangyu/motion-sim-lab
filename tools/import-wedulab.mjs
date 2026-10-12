// Import a pinned WeduLab recovery checkout without changing scene calculations.
import { readFile, writeFile, cp, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(process.argv[2] || '../sources/wedulab-recovered');
const project = path.join(source, 'project');
const target = path.join(repo, 'site/wedulab');
const mount = `(document.querySelector('meta[name="motion-sim-base"]')?.content || '') + ['', 'wedulab'].join('/')`;
const assetPaths = text => text.replace(/(["'`(])\/(assets|fonts|src)\//g, '$1/wedulab/$2/');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
await mkdir(target, { recursive: true });
for (const folder of ['src', 'assets', 'fonts']) {
  await cp(path.join(project, folder === 'src' ? folder : 'public/'+folder), path.join(target, folder), { recursive: true });
}
async function adapt(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await adapt(file);
    else if (/\.(js|css)$/.test(file)) await writeFile(file, assetPaths(await readFile(file, 'utf8')));
  }
}
await adapt(target);
const runtime = path.join(target, 'src/core/runtime.js');
let text = await readFile(runtime, 'utf8');
text = text.replace('return "/" + f;', `return (${mount}) + '/' + f;`);
text = text.replace('R.pathname + R.search + R.hash', `((R.pathname === (${mount}) || R.pathname.startsWith((${mount}) + '/')) ? R.pathname : (${mount}) + R.pathname) + R.search + R.hash`);
await writeFile(runtime, text);
const main = path.join(target, 'src/main.js');
text = await readFile(main, 'utf8');
text = text.replace('window.location.pathname.replace(/\\/$/, "") || "/"', `window.location.pathname.slice((${mount}).length).replace(/\\/$/, "") || "/"`);
text = text.replace('f !== "/admin/analytics" && recordVisit(f, currentLocale);', '// Frontend-only integration: no analytics backend is imported.');
text = text.replace('jsxRuntime.jsx(FeedbackWidget, {})', 'null');
text = text.replace('legacyRoutes[currentPath] + window.location.search', 'localizedUrl(legacyRoutes[currentPath]) + window.location.search');
await writeFile(main, text);
let catalog = await readFile(path.join(project, 'src/home/catalog.js'), 'utf8');
catalog = catalog.replace(/import[^;]+;/, 'const translate = text => text;');
const { T: entries, P: previews, s: color } = await import('data:text/javascript;base64,'+Buffer.from(catalog).toString('base64'));
const labs = entries.filter(lab => lab.status === 'live');
if (labs.length !== 22) throw new Error('Unexpected WeduLab catalog size');
await mkdir(path.join(target, 'previews'), { recursive: true });
for (const lab of labs) {
  await writeFile(path.join(target, 'previews', lab.id+'.svg'), previews[lab.preview](color(lab.subject)));
}
// Each experiment has a real entry file, so refreshes and shared deep links work.
for (const route of ['/', ...labs.map(lab => lab.href)]) {
  const input = route === '/' ? 'index.html' : route.slice(1)+'.html';
  let html = await readFile(path.join(project, 'public/pages/zh-CN', input), 'utf8');
  html = assetPaths(html).replace(/(href=["'])\/(labs\/[^"']*|\/?)(["'])/g, '$1/wedulab/$2$3');
  html = html.replace('</body>', '<a href="/education" style="position:fixed;bottom:16px;left:16px;z-index:9999;padding:9px 14px;border:1px solid #bbc4cc;border-radius:24px;background:#ffffffee;color:#18242e;font:13px system-ui;text-decoration:none">← 作品列表</a></body>');
  const directory = path.join(target, route.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html);
}
const cards = labs.map(lab => `<article class="card" data-slug="wedu-${lab.id}" data-date="2026-10-13" data-cat="教学实验" data-tags="${escape(lab.subject)}|教学|仿真" data-size="" data-views="0" data-x="0"><a class="hit" href="/wedulab${lab.href}/?lang=zh-CN" title="${escape(lab.desc)}"><span class="media" style="background:#f6f8f9"><img src="/wedulab/previews/${lab.id}.svg" alt="${escape(lab.subject+' · '+lab.name)}" loading="lazy" decoding="async"></span><span class="shade" aria-hidden="true"></span><span class="title">${escape(lab.subject+' · '+lab.name)}</span><span class="go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg></span></a></article>`).join('\n');
const pages = ['', 'explainers', 'worlds', 'data', 'design', 'play', 'virtual-tour'];
for (const category of pages) {
  const file = path.join(repo, 'site', category, 'index.html');
  let html = await readFile(file, 'utf8');
  if (!html.includes('data-filter="教学实验"')) {
    html = html.replace('All<b>58</b>', 'All<b>80</b>');
    html = html.replace('</nav', '<a href="/education" class="cat-link" data-filter="教学实验">教学实验<b>22</b></a></nav');
    html = html.replace('<div class="grid">', '<div class="grid">\n'+cards);
    await writeFile(file, html);
  }
  const script = path.join(repo, 'site', category, 'app.js');
  let js = await readFile(script, 'utf8');
  if (!js.includes('"教学实验":')) js = js.replace('const CATP = {', 'const CATP = {\n  "教学实验": "/education",');
  await writeFile(script, js);
}
await mkdir(path.join(repo, 'site/education'), { recursive: true });
text = await readFile(path.join(repo, 'site/index.html'), 'utf8');
text = text.replace('class="cat-link on"', 'class="cat-link"').replace('class="cat-link" data-filter="教学实验"', 'class="cat-link on" data-filter="教学实验"').replace('<script src="/app.js">', '<script src="/education/app.js">');
await writeFile(path.join(repo, 'site/education/index.html'), text);
text = (await readFile(path.join(repo, 'site/app.js'), 'utf8')).replace('let cat = "",', 'let cat = "教学实验",');
await writeFile(path.join(repo, 'site/education/app.js'), text);
const worksFile = path.join(repo, 'site/works.json');
const works = JSON.parse(await readFile(worksFile, 'utf8'));
works.works = works.works.filter(work => !work.slug.startsWith('wedu-'));
works.works.unshift(...labs.map(lab => ({ slug:'wedu-'+lab.id, title:lab.name, url:'https://sael.net/wedulab'+lab.href+'/?lang=zh-CN', date:'2026-10-13', cat:'教学实验', poster:'https://sael.net/wedulab/previews/'+lab.id+'.svg', views:0, site:0, x:0, posts:[] })));
await writeFile(worksFile, JSON.stringify(works, null, 1)+'\n');
await writeFile(path.join(target, 'source.json'), JSON.stringify({ repository:'https://github.com/DuanHangyu/wedulab-recovered', commit:'4b7482a0f14da828612b4334bde759460c09dd90', frontendOnly:true, labs:labs.map(({id,name,subject,href,desc}) => ({id,name,subject,href,desc})) }, null, 2)+'\n');
console.log(`Imported ${labs.length} interactive teaching labs.`);
