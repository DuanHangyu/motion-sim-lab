import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';

test('all 22 teaching labs have mounted deep links and namespaced dependencies', async () => {
  const child = spawn(process.execPath, ['--input-type=module', '-e', `
    const {server} = await import('./server.mjs');
    server.listen(0, '127.0.0.1', () => console.log(server.address().port));
  `], { cwd: fileURLToPath(new URL('..', import.meta.url)), env: { ...process.env, PUBLIC_BASE_PATH: '/motion-sim-lab' } });
  try {
    const [output] = await once(child.stdout, 'data');
    const origin = 'http://127.0.0.1:'+String(output).trim()+'/motion-sim-lab';
    const source = JSON.parse(await readFile(new URL('../site/wedulab/source.json', import.meta.url), 'utf8'));
    assert.equal(source.labs.length, 22);
    const gallery = await (await fetch(origin+'/education')).text();
    assert.equal((gallery.match(/data-cat="教学实验"/g) || []).length, 22);
    assert.match(gallery, /\/motion-sim-lab\/education\/app.js/);
    for (const lab of source.labs) {
      const response = await fetch(origin+'/wedulab'+lab.href+'/');
      assert.equal(response.status, 200, lab.href);
      const html = await response.text();
      assert.match(html, /src="\/motion-sim-lab\/wedulab\/src\/main.js"/);
      const preview = await fetch(origin+'/wedulab/previews/'+lab.id+'.svg');
      assert.equal(preview.status, 200);
      assert.match(await preview.text(), /<svg/);
    }
    const runtime = await (await fetch(origin+'/wedulab/src/core/runtime.js')).text();
    assert.match(runtime, /return \(\(document.querySelector/);
    const main = await (await fetch(origin+'/wedulab/src/main.js')).text();
    assert.ok(main.includes('window.location.pathname.slice('));
    assert.ok(!main.includes('f !== "/admin/analytics" && recordVisit'));
    assert.equal((await fetch(origin+'/wedulab/labs/not-a-lab/')).status, 404);
    const works = await (await fetch(origin+'/works.json')).json();
    assert.equal(works.works.filter(work=>work.cat==='教学实验').length, 22);
    assert.ok(works.works.filter(work=>work.cat==='教学实验').every(work=>work.url.startsWith(origin+'/wedulab/')));
  } finally {
    child.kill();
    await once(child, 'exit');
  }
});
