const $ = (s) => document.querySelector(s);
const paths = {
  generated: "../generated/pendulum-rhythm/blind-01/",
  reference: "../pendulum-rhythm/",
};
let prompt = "",
  report = "",
  mode = "generated";
const fetchText = async (u) => {
  const r = await fetch(u);
  if (!r.ok) throw new Error(`文件暂不可用 (${r.status})`);
  return r.text();
};
const promptReady = fetchText("../prompts/pendulum-rhythm/v1.md").then(
  (t) => (prompt = t),
);
const reportReady = fetchText("./evidence/pendulum-rhythm/report.md")
  .then((t) => (report = t))
  .catch((e) => (report = e.message));
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
    kind === "prompt" ? "摆的节律 · 主提示词 v1" : "摆的节律 · 独立盲测评价";
  $("#dialog-kind").textContent =
    kind === "prompt" ? "这份输入对应盲测生成版 01" : "封存后对照结果";
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
  document
    .querySelectorAll("[data-mode]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.mode === mode)),
    );
  $("#frames").classList.toggle("compare", mode === "compare");
  $("#sync-controls").hidden = mode !== "compare";
  $("#frames").replaceChildren();
  const ids = mode === "compare" ? ["reference", "generated"] : [mode];
  for (const id of ids) {
    const wrap = document.createElement("div");
    wrap.className = "frame-wrap";
    const label = document.createElement("div");
    label.className = "frame-label";
    label.textContent =
      id === "reference"
        ? "原版参考 · Ryan Sael"
        : "独立生成 · 提示词 v1 / 盲测 01";
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
    paths[mode === "reference" ? "reference" : "generated"];
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
fetch("./evidence/pendulum-rhythm/verdict.json")
  .then((r) => {
    if (!r.ok) throw new Error();
    return r.json();
  })
  .then((v) => {
    $("#status-label").textContent = v.statusLabel;
    $("#verdict-text").textContent = v.conclusion;
    for (const r of v.ratings) {
      const div = document.createElement("div");
      div.className = "rating";
      const h = document.createElement("h3");
      h.textContent = r.name;
      const score = document.createElement("b");
      score.textContent = `${r.score} / 3`;
      const p = document.createElement("p");
      p.textContent = r.reason;
      div.append(h, score, p);
      $("#rating-grid").append(div);
    }
  })
  .catch(() => {
    $("#status-label").textContent = "评价记录尚未就绪";
  });
promptReady.catch((e) => {
  $("#copy-status").textContent = e.message;
  $("#show-prompt").disabled = true;
  $("#copy-prompt").disabled = true;
});
