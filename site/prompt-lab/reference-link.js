const link = document.createElement("a");
link.href = "../prompt-lab/";
link.textContent = "查看重建提示词 ↗";
link.title = "提示词、独立生成版与动态对照";
link.style.cssText =
  "position:fixed;left:14px;bottom:14px;z-index:20;padding:9px 12px;border:1px solid #7fe3ff55;border-radius:12px;background:#101827eb;color:#c7f5ff;font:12px system-ui,sans-serif;text-decoration:none;backdrop-filter:blur(10px)";
document.body.append(link);
