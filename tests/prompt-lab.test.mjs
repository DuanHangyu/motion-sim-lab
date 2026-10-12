import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
let server, origin;
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
before(async () => {
  ({ server } = await import("../server.mjs"));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
});
test("prompt gallery binds a versioned text input to its actual generated entry", async () => {
  const html = await (await fetch(origin + "/prompt-lab/")).text();
  assert.match(html, /查看提示词/);
  assert.match(html, /复制完整提示词/);
  assert.match(html, /v1\.md/);
  const app = await (await fetch(origin + "/prompt-lab/app.js")).text();
  assert.match(app, /generated\/pendulum-rhythm\/blind-01/);
  const page = await fetch(origin + "/generated/pendulum-rhythm/blind-01/");
  assert.equal(page.status, 200);
  assert.match(page.headers.get("content-type"), /text\/html/);
});
test("published prompt hash equals locked input and report identifies exact trial", async () => {
  const r = await fetch(origin + "/prompts/pendulum-rhythm/v1.md");
  assert.equal(r.status, 200);
  assert.match(r.headers.get("content-type"), /text\/plain/);
  const input = await r.text();
  const freeze = await (
    await fetch(origin + "/prompt-lab/evidence/pendulum-rhythm/freeze.json")
  ).json();
  assert.equal(
    createHash("sha256").update(input).digest("hex"),
    freeze.input_sha256,
  );
  const verdict = await (
    await fetch(origin + "/prompt-lab/evidence/pendulum-rhythm/verdict.json")
  ).json();
  assert.equal(verdict.trial, "blind-01");
  assert.equal(verdict.ratings.length, 6);
  assert.equal(typeof verdict.overallClose, "boolean");
  const report = await fetch(
    origin + "/prompt-lab/evidence/pendulum-rhythm/report.md",
  );
  assert.equal(report.status, 200);
});
test("generated ES modules are served with executable MIME", async () => {
  const root = path.join(base, "site/generated/pendulum-rhythm/blind-01");
  const files = await readdir(root, { recursive: true });
  const module = files.find(
    (f) => f.endsWith(".mjs") && !f.startsWith("vendor" + path.sep),
  );
  assert.ok(module, "candidate must include a model/test ES module");
  const r = await fetch(
    origin +
      "/generated/pendulum-rhythm/blind-01/" +
      module.split(path.sep).join("/"),
  );
  assert.equal(r.status, 200);
  assert.match(r.headers.get("content-type"), /application\/javascript/);
});
test("both published continuous comparison clips support video range reads", async () => {
  for (const name of ["reference", "candidate"]) {
    const r = await fetch(
      origin + `/prompt-lab/evidence/pendulum-rhythm/${name}.mp4`,
      { headers: { Range: "bytes=0-99" } },
    );
    assert.equal(r.status, 206);
    assert.equal((await r.arrayBuffer()).byteLength, 100);
    assert.match(r.headers.get("content-type"), /video\/mp4/);
  }
});
