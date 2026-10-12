# Pendulum Rhythm · 光效改进版

在封存的blind-01基础上，参考用户反馈和原版调整灯光、材质与地面倒影。此版本不是新的独立盲测。

仓库根目录运行 `npm ci` 与 `npm start`，打开 `/prompt-lab/` 或 `/generated/pendulum-rhythm/refined-01/`。也可用静态服务打开本目录。

- 完整描述：[PROMPT.md](PROMPT.md)，公开版本为site/prompts/pendulum-rhythm/v2.md。v2尚未经过从空目录生成的新盲测。
- model.js与初次盲测逐字一致；渲染保留原来的交互API。
- 新增真实平面反射、反射软化、窄环境光源、局部暖光、透明物体阴影处理。
- Three.js 0.183.2及Reflector来自官方npm包，MIT许可保留在vendor/three/LICENSE。
- 反射是实时平面近似；玻璃仍不模拟体积折射。模型造型、界面比例与原版仍有差异。
