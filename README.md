# Motion Sim Lab

一个以 **交互动效、虚拟仿真和实时可视化** 为主题的前端演示集合。包含 56 个站内作品，以及首页、分类浏览和预览视频；使用 Three.js、WebGL / WebGPU、着色器与浏览器动画构建场景。

![Gigacity 城市生成与飞行演示](site/p/gigacity/poster.webp)

## 你可以体验什么

- **探索场景**：旋转、缩放、拖动和切换相机视角，观察城市、建筑和微观世界。
- **调节参数**：改变角度、形状、速度、光照和其他作品提供的参数，实时观察效果。
- **观察动态过程**：跟随流动、振荡、生长、受力、光线传播和生成过程。
- **浏览作品**：按分类、主题标签与热度查找作品，直接观看卡片预览。

各作品的控制方式不同，以页面内提示和帮助按钮为准。

## 代表作品

| 主题 | 作品 | 演示内容 | 本地入口 |
| --- | --- | --- | --- |
| 城市生成 | Gigacity | 从随机种子生成城市、车辆与灯光；飞行、昼夜和蓝图视图 | [/gigacity/](http://127.0.0.1:4173/gigacity/) |
| 曲面与物理 | Soap Bubble Lab | 肥皂膜、框架形状、扭转、拉环和拆解视图 | [/soap-bubble/](http://127.0.0.1:4173/soap-bubble/) |
| 光学 | Prism Room | 棱镜、入射角与光谱分离 | [/prism-room/](http://127.0.0.1:4173/prism-room/) |
| 建筑导览 | Apple Park | 建筑模型与剖面、空间和视角探索 | [/apple-park/](http://127.0.0.1:4173/apple-park/) |
| 流体与地形 | River Bend | 河流弯曲与形态变化的交互可视化 | [/river-bend/](http://127.0.0.1:4173/river-bend/) |
| 生理过程 | Heart Pump | 心脏泵送过程与动态结构展示 | [/heart-pump/](http://127.0.0.1:4173/heart-pump/) |
| 实时数据 | The World Map, Live | OpenStreetMap 编辑流、地球视图与上传视图 | [/live-dashboard/](http://127.0.0.1:4173/live-dashboard/) |

完整目录在运行后的首页。首页还保留两个外部作品入口，因此显示 58 张作品卡片。

## 提示词与独立复现

新增 **[摆的节律提示词实验室](http://127.0.0.1:4173/prompt-lab/)**：一键查看、复制或下载完整提示词，操作文字生成版，切换原版参考与左右对照，查看真实连续播放录像和评价。

- [当前完整提示词 v2](site/prompts/pendulum-rhythm/v2.md)与[光效改进演示](site/generated/pendulum-rhythm/refined-01/)（参考反馈后修饰，尚未重新盲测）
- [初次独立盲测主提示词 v1](site/prompts/pendulum-rhythm/v1.md)
- [对应独立生成源码 blind-01](site/generated/pendulum-rhythm/blind-01/)
- [盲测方法与结果](docs/prompt-recovery/pendulum-rhythm/REPORT.md)
- [完整作品清单与后续计划](docs/prompt-recovery/README.md)

重建提示词不是历史原始提示词的确认恢复。每份输入与实际生成轮次对应；可运行、物理正确和视觉接近分别验证，公开保留差距和简化项。原版署名保留，独立生成结果另存。

## 本地运行

需要 **Node.js 22 或以上**，以及支持 WebGL2 的现代浏览器。Gigacity 使用 WebGPU；浏览器和设备的图形能力会影响可用效果。

```sh
git clone https://github.com/DuanHangyu/motion-sim-lab.git
cd motion-sim-lab
npm ci
npm start
```

打开 **http://127.0.0.1:4173/**。

开发时使用：

```sh
npm run dev
```

可通过 `PORT`、`HOST` 调整本地服务地址。开发服务默认只监听本机。

## 前端与数据依赖

大多数作品的场景、动画、参数控制和绘制都在浏览器中完成，**不依赖原网站的业务后端**。项目自带轻量本地服务，用来提供网页文件、归档依赖和视频分段读取。

实时数据作品仍会请求其使用的公开数据接口，例如 OpenStreetMap、Open-Meteo 或 OpenRouter；最新数据需要网络连接。作品中原有的备用逻辑保持不变。

网站附属功能采用本地适配：访问统计使用恢复时的公开快照，在线人数在本地房间中统计，留言/订阅保存到 `data/outbox.jsonl`。这些功能不影响主要仿真展示；当前不包含真实邮件投递。

## 代码结构

```text
site/
  index.html            首页
  styles.css / app.js   首页样式和交互
  <作品>/
    index.html          作品页面
    styles.css          页面样式
    scene.js 或 app.js  场景、着色器和交互逻辑
  p/                    作品封面和预览视频
  lib/                  共用运行库和字体
  vendor/               对应版本的 Three.js 与归档字体
server.mjs              本地运行及接口适配
source-map.json         原页面与整理文件的映射
recovery-manifest.json  资源来源、哈希与本地化说明
tests/                  本地服务测试
tools/                  原页面源码整理工具
```

页面与场景代码拆分为 259 个可编辑样式/脚本文件。常见修改入口是作品目录内的 `styles.css` 和 `scene.js`；部分作品采用 `app.js`，另有少量启动脚本。

## 已完成的验证

- 56 个作品在整理前后均通过浏览器初始渲染检查。
- 194 个可执行脚本的语义结构与原代码一致；65 个 CSS 块仅做格式化。
- 首页在桌面、手机、宽屏和深色模式下完成分类、排序与布局对照。
- Soap Bubble、Gigacity 和实时地图完成多个动画时刻及操作状态对照。
- 本地服务通过视频分段读取、表单保存和实时房间协议测试。

运行服务测试与依赖审计：

```sh
npm test
npm audit
```

## 来源与署名

此项目由 [sael.net](https://sael.net/) 当前部署版本的公开前端源码与资源恢复、整理而来，保留现有页面署名和版权说明。原后端、Git 历史和原部署配置不包含在本仓库中。

Three.js 和字体等第三方依赖保留各自附带的许可证及说明。公开仓库不改变这些文件已有的权利声明。
