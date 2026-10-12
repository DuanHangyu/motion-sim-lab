const $ = (s) => document.querySelector(s);
const paths = {
  generated: "../generated/pendulum-rhythm/blind-01/",
  refined: "../generated/pendulum-rhythm/refined-01/",
  reference: "../pendulum-rhythm/",
};
let prompt = "",
  report = "",
  mode = "refined";
let selectedRevision = "v2";
const fetchText = async (u) => {
  const r = await fetch(u);
  if (!r.ok) throw new Error(`文件暂不可用 (${r.status})`);
  return r.text();
};
let promptReady,
  reportReady,
  revisionRequest = 0;
async function loadRevision(blind) {
  const request = ++revisionRequest;
  selectedRevision = blind ? "v1" : "v2";
  const evidence = blind
    ? "./evidence/pendulum-rhythm/"
    : "./evidence/pendulum-rhythm/refined-01/";
  const promptPath = `../prompts/pendulum-rhythm/${selectedRevision}.md`;
  promptReady = fetchText(promptPath).then((text) => {
    if (request === revisionRequest) prompt = text;
  });
  reportReady = fetchText(evidence + "report.md").then((text) => {
    if (request === revisionRequest) report = text;
  });
  $("#download-prompt").href = promptPath;
  $("#download-prompt").download = `pendulum-rhythm-${selectedRevision}.md`;
  $("#revision-label").textContent = blind
    ? "v1 · 独立盲测 01"
    : "v2 · 光效改进版";
  $("#workflow-label").textContent = blind
    ? "文字输入 → 空目录生成 → 封存 → 原版对照"
    : "保留盲测初版 → 参考反馈 → 光效修饰";
  $("#candidate-caption").textContent = blind
    ? "文字提示词独立生成 · v1"
    : "光效改进版 · v2";
  $("#candidate-video").pause();
  $("#candidate-video").src = evidence + "candidate.mp4";
  $("#candidate-video").poster = evidence + "candidate-drift.png";
  $("#evaluation-link").href = evidence + "report.md";
  $("#source-link").href =
    "https://github.com/DuanHangyu/motion-sim-lab/tree/main/site/generated/pendulum-rhythm/" +
    (blind ? "blind-01" : "refined-01");
  $("#copy-prompt").textContent = "复制完整提示词";
  $("#rating-grid").replaceChildren();
  try {
    const response = await fetch(evidence + "verdict.json");
    if (!response.ok) throw new Error();
    const v = await response.json();
    if (request !== revisionRequest) return;
    $("#status-label").textContent = v.statusLabel;
    $("#verdict-text").textContent = v.conclusion;
    for (const r of v.ratings) {
      const div = document.createElement("div");
      div.className = "rating";
      const h = document.createElement("h3");
      h.textContent = r.name;
      const score = document.createElement("b");
      score.textContent =
        typeof r.score === "number" ? `${r.score} / 3` : "本次调整";
      const text = document.createElement("p");
      text.textContent = r.reason;
      div.append(h, score, text);
      $("#rating-grid").append(div);
    }
  } catch {
    if (request === revisionRequest)
      $("#status-label").textContent = "评价记录暂不可用";
  }
  promptReady.catch(() => {
    if (request === revisionRequest)
      $("#status-label").textContent = "提示词暂不可用";
  });
  reportReady.catch((e) => {
    if (request === revisionRequest) report = e.message;
  });
}
const copy = async () => {
  await promptReady;
  try {
    await navigator.clipboard.writeText(prompt);
    $("#copy-status").textContent = "已复制完整主提示词";
    $("#copy-prompt").textContent = "已复制 ✓";
  } catch {
    showText("prompt");
    $("#copy-status").textContent = "浏览器未允许复制，请选中下方全文复制";
    const r = document.createRange();
    r.selectNodeContents($("#dialog-text"));
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }
};
function showText(kind) {
  $("#dialog-title").textContent =
    kind === "prompt"
      ? `摆的节律 · 主提示词 ${selectedRevision}`
      : "摆的节律 · 对照与调整记录";
  $("#dialog-kind").textContent =
    kind === "prompt"
      ? selectedRevision === "v1"
        ? "这份输入对应独立盲测 01"
        : "光效修饰后的完整提示词；尚未进行新一轮独立盲测"
      : "版本对应的记录";
  $("#dialog-text").textContent = kind === "prompt" ? prompt : report;
  $("#dialog-copy").hidden = kind !== "prompt";
  $("#copy-status").textContent = "";
  if (!$("#text-dialog").open) $("#text-dialog").showModal();
}
$("#show-prompt").addEventListener("click", async () => {
  await promptReady;
  showText("prompt");
});
$("#copy-prompt").addEventListener("click", copy);
$("#dialog-copy").addEventListener("click", copy);
$("#show-report").addEventListener("click", async () => {
  await reportReady;
  showText("report");
});
$("#close-dialog").addEventListener("click", () => $("#text-dialog").close());
function loadMode(next) {
  mode = next;
  loadRevision(mode === "generated");
  document
    .querySelectorAll("[data-mode]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.mode === mode)),
    );
  $("#frames").classList.toggle("compare", mode === "compare");
  $("#sync-controls").hidden = mode !== "compare";
  $("#frames").replaceChildren();
  const ids = mode === "compare" ? ["reference", "refined"] : [mode];
  for (const id of ids) {
    const wrap = document.createElement("div");
    wrap.className = "frame-wrap";
    const label = document.createElement("div");
    label.className = "frame-label";
    label.textContent =
      id === "reference"
        ? "原版参考 · Ryan Sael"
        : id === "generated"
          ? "独立生成 · 提示词 v1 / 盲测 01"
          : "光效改进 · v2 / 参考反馈后迭代";
    const frame = document.createElement("iframe");
    frame.src = paths[id];
    frame.title = label.textContent;
    frame.dataset.scene = id;
    frame.allow = "fullscreen";
    frame.addEventListener("load", () => {
      $("#sync-message").textContent =
        "两侧加载后可按“默认状态”固定镜头和释放时刻";
    });
    wrap.append(label, frame);
    $("#frames").append(wrap);
  }
  $("#open-scene").href =
    paths[
      mode === "reference"
        ? "reference"
        : mode === "generated"
          ? "generated"
          : "refined"
    ];
}
document
  .querySelectorAll("[data-mode]")
  .forEach((b) => b.addEventListener("click", () => loadMode(b.dataset.mode)));
loadMode(mode);
function eachScene(fn) {
  let count = 0;
  document.querySelectorAll("#frames iframe").forEach((frame) => {
    const w = frame.contentWindow;
    const api = frame.dataset.scene === "reference" ? w.__lab : w.pendulumLab;
    if (api) {
      fn(api, frame.dataset.scene, w);
      count++;
    }
  });
  $("#sync-message").textContent =
    count === 2
      ? "已向两侧发送同一操作；时间点同步，浏览器绘制时刻可能有少量差异"
      : "场景仍在加载，请稍后重试";
  return count;
}
function setTime(t) {
  eachScene((a, id) => {
    id === "reference" ? (a.play(false), a.time(t)) : (a.pause(), a.setTime(t));
  });
  $("#shared-time").value = t;
  $("#shared-time-value").value = `${Number(t).toFixed(2)} s`;
}
$("#shared-time").addEventListener("input", (e) => setTime(+e.target.value));
$("#sync-reset").addEventListener("click", () => {
  eachScene((a, id) => {
    if (id === "reference") {
      a.preset(0);
      a.view("lab");
      a.script(a.HERO.lab);
      a.speed(1);
      a.play(false);
      a.time(0);
    } else {
      a.setPreset("Drift");
      a.setView("Lab");
      a.setCinematic(false);
      a.resetCamera();
      a.setSpeed(1);
      a.pause();
      a.setTime(0);
    }
  });
  $("#shared-time").value = 0;
  $("#shared-time-value").value = "0.00 s";
});
$("#sync-play").addEventListener("click", () =>
  eachScene((a, id) => {
    id === "reference" ? (a.speed(1), a.play(true)) : (a.setSpeed(1), a.play());
  }),
);
$("#sync-pause").addEventListener("click", () =>
  eachScene((a, id) => (id === "reference" ? a.play(false) : a.pause())),
);
const videos = [$("#reference-video"), $("#candidate-video")];
$("#video-play").addEventListener("click", async () => {
  videos.forEach((v) => (v.currentTime = 0));
  const r = await Promise.allSettled(videos.map((v) => v.play()));
  $("#video-status").textContent = r.every((x) => x.status === "fulfilled")
    ? "正在播放两段真实录像"
    : "录像未能播放，请使用播放器控制";
});
$("#video-pause").addEventListener("click", () => {
  videos.forEach((v) => v.pause());
  $("#video-status").textContent = "两段录像已暂停";
});
document.querySelectorAll("[data-rate]").forEach((b) =>
  b.addEventListener("click", () => {
    videos.forEach((v) => (v.playbackRate = +b.dataset.rate));
    $("#video-status").textContent = `录像播放倍率 ${b.dataset.rate}×`;
  }),
);
