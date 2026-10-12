# 交互场景提示词还原清单与交付方案

整理日期：2026-10-12。此文是启动前的目录规划快照；最新逐项状态以 catalog.json 和场景评价为准。

## 目标与范围

将每个交互作品整理成可浏览、可运行、可复制提示词的条目，最终放入公开仓库 https://github.com/DuanHangyu/motion-sim-lab 。现有前端保留作参考，独立生成版另存，避免把原版当成提示词生成的成果。

这里的“还原”是根据现有演示与实现反推可复用的提示词，不能证明找回了当年的原始措辞。当前目录来自本地恢复包的 works.json、各作品页面、README 和 Git remote；不是重新核验线上最新目录。

现有本地作品 **56 个**；心脏已做提示词反推、迭代与一次独立盲测，摆的节律现已完成v1独立盲测，另有 **54 个未启动**。其中原理仿真类共 **30 个**，扣除心脏，首要候选为 **29 个**。其他 26 个也纳入总目录。

首页有 58 张作品卡片，其中 AI Race 和 dat.city 是两个外部网站入口，未恢复为本地作品。首页、分类页、订阅页等站点功能不作为独立模型重复计数。

## 当前状态

心脏已经有更新后的提示词、迭代版演示、独立生成版和动态对照报告；独立盲测尚未达到“整体接近原版”的预设门槛。后续公开条目应展示这个真实状态，不能标成已验证高保真。

## 全部场景清单

以下分类沿用原目录；“其他交互实验”收纳原目录未分类的四个作品。中文名称用于解释主题，不替换原英文署名。具体按钮、状态、参数范围和外部数据依赖留到逐项分析时核对。

### 原理仿真（30 个）

| 场景 | 原名称 | 参考演示 | 进度 |
| --- | --- | --- | --- |
| 脉冲磁约束聚变 | Fusion That Pushes Back | [fusion-pulse](http://127.0.0.1:4173/fusion-pulse/) | 待启动 |
| 星链卫星与通信链路 | Starlink: home internet from space | [starlink](http://127.0.0.1:4173/starlink/) | 待启动 |
| Mearim 河洪水与响应阶段 | When the Mearim Rises | [mearim-flood](http://127.0.0.1:4173/mearim-flood/) | 待启动 |
| 扬声器振膜与声波 | Speaker Cone | [speaker-cone](http://127.0.0.1:4173/speaker-cone/) | 待启动 |
| 棱镜与光谱分离 | Prism Room | [prism-room](http://127.0.0.1:4173/prism-room/) | 待启动 |
| 地震塔与结构共振 | Earthquake Tower | [earthquake-tower](http://127.0.0.1:4173/earthquake-tower/) | 待启动 |
| 虹吸实验 | Siphon Lab | [siphon-lab](http://127.0.0.1:4173/siphon-lab/) | 待启动 |
| 磁悬浮列车 | Maglev Track | [maglev-track](http://127.0.0.1:4173/maglev-track/) | 待启动 |
| 蜂鸟振翅与升力 | Hummingbird Wing | [hummingbird-wing](http://127.0.0.1:4173/hummingbird-wing/) | 待启动 |
| 根系与茎的向重力生长 | Root Finder | [root-finder](http://127.0.0.1:4173/root-finder/) | 待启动 |
| 闪电分支与放电路径 | Lightning Path | [lightning-path](http://127.0.0.1:4173/lightning-path/) | 待启动 |
| 冰淇淋结晶 | Ice Cream Crystal | [ice-cream-crystal](http://127.0.0.1:4173/ice-cream-crystal/) | 待启动 |
| 摆的节律与摆波 | Pendulum Rhythm | [pendulum-rhythm](http://127.0.0.1:4173/pendulum-rhythm/) | v1 独立盲测完成；结构/动效接近，质感有差距 |
| 火箭喷管与推力 | Rocket Nozzle | [rocket-nozzle](http://127.0.0.1:4173/rocket-nozzle/) | 待启动 |
| 肥皂膜与表面张力 | Soap Bubble | [soap-bubble](http://127.0.0.1:4173/soap-bubble/) | 待启动 |
| 河流弯曲、侵蚀与沉积 | River Bend | [river-bend](http://127.0.0.1:4173/river-bend/) | 待启动 |
| 心脏泵送与动态结构 | Heart Pump | [heart-pump](http://127.0.0.1:4173/heart-pump/) | 已有提示词与盲测，视觉仍有差距 |
| 极光与带电粒子 | Aurora Chamber | [aurora-chamber](http://127.0.0.1:4173/aurora-chamber/) | 待启动 |
| 自行车制动与 ABS | Bike Brake | [bike-brake](http://127.0.0.1:4173/bike-brake/) | 待启动 |
| 潮汐与日月关系 | Tidal Clock | [tidal-clock](http://127.0.0.1:4173/tidal-clock/) | 待启动 |
| 窗边冷气流与室内对流 | Window Draft | [window-draft](http://127.0.0.1:4173/window-draft/) | 待启动 |
| 指南针与磁场 | Compass Field | [compass-field](http://127.0.0.1:4173/compass-field/) | 待启动 |
| 冰刀转弯与打滑 | Skate Blade | [skate-blade](http://127.0.0.1:4173/skate-blade/) | 待启动 |
| 骑行风洞与空气阻力 | Cheat the Wind | [wind-tunnel](http://127.0.0.1:4173/wind-tunnel/) | 待启动 |
| 差速器与双轮转速 | Two Wheels, One Engine | [diff](http://127.0.0.1:4173/diff/) | 待启动 |
| 互联网请求的传输过程 | How the Internet Works | [internet](http://127.0.0.1:4173/internet/) | 待启动 |
| AI 提示词请求与生成过程 | What Happens When You Send a Prompt | [prompt](http://127.0.0.1:4173/prompt/) | 待启动 |
| 交通路口与信号调度 | Who Gets the Green? | [traffic](http://127.0.0.1:4173/traffic/) | 待启动 |
| AI 数据中心与供电散热 | Inside an AI Data Center | [data-center](http://127.0.0.1:4173/data-center/) | 待启动 |
| 镜头、焦平面与景深 | The Plane of Focus | [plane-of-focus](http://127.0.0.1:4173/plane-of-focus/) | 待启动 |

### 世界与场景探索（10 个）

| 场景 | 原名称 | 参考演示 | 进度 |
| --- | --- | --- | --- |
| 程序化未来城市 | Gigacity | [gigacity](http://127.0.0.1:4173/gigacity/) | 待启动 |
| AI 基准山峰 | Benchmark Mountain | [benchmark-mountain](http://127.0.0.1:4173/benchmark-mountain/) | 待启动 |
| X Muse 广场 | X Muse | [a-muse-ment](http://127.0.0.1:4173/a-muse-ment/) | 待启动 |
| AI 模型博物馆 | Model Museum | [ai-museum](http://127.0.0.1:4173/ai-museum/) | 待启动 |
| AI 模型怪兽岛 | Model Monsters | [model-monsters](http://127.0.0.1:4173/model-monsters/) | 待启动 |
| 最终 Boss 场景 | The Final Boss | [final-boss](http://127.0.0.1:4173/final-boss/) | 待启动 |
| AI 办公室 | The AI Office | [ai-office](http://127.0.0.1:4173/ai-office/) | 待启动 |
| Token 小镇 | Token Town | [token-town](http://127.0.0.1:4173/token-town/) | 待启动 |
| 共享天空与日落画廊 | Sky | [sky](http://127.0.0.1:4173/sky/) | 待启动 |
| 巴黎街道折叠 | Inception's Paris | [paris-inception](http://127.0.0.1:4173/paris-inception/) | 待启动 |

### 数据可视化（7 个）

| 场景 | 原名称 | 参考演示 | 进度 |
| --- | --- | --- | --- |
| 实时世界地图 | The World Map, Live | [live-dashboard](http://127.0.0.1:4173/live-dashboard/) | 待启动 |
| 在线访客地球 | Here now: the world on sael.net | [here](http://127.0.0.1:4173/here/) | 待启动 |
| Token 工厂 | Token Factory | [token-factory](http://127.0.0.1:4173/token-factory/) | 待启动 |
| AI 模型倒影城市 | The Reflection | [mirror-city](http://127.0.0.1:4173/mirror-city/) | 待启动 |
| AI 请求船舶港口 | Supertankers and Dinghies | [supertankers](http://127.0.0.1:4173/supertankers/) | 待启动 |
| 长对话成本阶梯 | The Long Session | [long-session](http://127.0.0.1:4173/long-session/) | 待启动 |
| Token 使用河流三角洲 | Token Delta | [token-delta](http://127.0.0.1:4173/token-delta/) | 待启动 |

### 建筑导览（1 个）

| 场景 | 原名称 | 参考演示 | 进度 |
| --- | --- | --- | --- |
| Apple Park 建筑导览 | Apple Park | [apple-park](http://127.0.0.1:4173/apple-park/) | 待启动 |

### 设计与展示（2 个）

| 场景 | 原名称 | 参考演示 | 进度 |
| --- | --- | --- | --- |
| Moods 伙伴展示页 | Moods | [moods](http://127.0.0.1:4173/moods/) | 待启动 |
| 室内空间与材质搭配 | Set the Mood | [interior](http://127.0.0.1:4173/interior/) | 待启动 |

### 经营交互（2 个）

| 场景 | 原名称 | 参考演示 | 进度 |
| --- | --- | --- | --- |
| 机器人生产经营 | A Nation of Robots | [robots](http://127.0.0.1:4173/robots/) | 待启动 |
| 数据中心经营 | Garage to Gigawatt | [gigawatt](http://127.0.0.1:4173/gigawatt/) | 待启动 |

### 其他交互实验（4 个）

| 场景 | 原名称 | 参考演示 | 进度 |
| --- | --- | --- | --- |
| 魔方与图论 | Cube Graph | [cube-graph](http://127.0.0.1:4173/cube-graph/) | 待启动 |
| 几何光学实验台 | Prismatic | [prismatic](http://127.0.0.1:4173/prismatic/) | 待启动 |
| 程序化地形塑造 | Terraform | [terraform](http://127.0.0.1:4173/terraform/) | 待启动 |
| 仓储机器人群调度 | Swarm Floor Logistics | [swarm-floor](http://127.0.0.1:4173/swarm-floor/) | 待启动 |

## 建议启动顺序

先按三个代表场景跑通同一套交付方式：**摆的节律 → 棱镜与光谱分离 → 肥皂膜**。分别检验运动节律、玻璃光学和连续形变的描述是否足够明确，再推进差速器和蜂鸟振翅。这个顺序是基于本地场景题材的初步安排，尚未完成逐项难度评估。

其余原理仿真按机械运动、流体热学、电磁天文、生命生长、系统流程分批推进；随后处理复杂城市与空间、设计展示、经营交互和数据可视化。每次只将一项推进到可核验的交付状态，避免批量生成未经验证的提示词。

## 每个场景采用的方法

1. **观察与拆解**：记录默认画面、模型轮廓与尺寸关系、材质光照、镜头、主要动作、完整周期、参数与异常状态。参考分析阶段可以读恢复代码，以厘清实际行为。
2. **先定义验收**：区分能运行、结构成立、运动及交互正确、视觉接近，指定相机、画面尺寸、参数和对照时间段。
3. **反推提示词**：写成可独立使用的完整主提示词，包含场景构成、造型、材质、运动规律、交互、技术约束与完成条件；必要时另存修正提示词。
4. **独立生成验证**：生成方只获得锁定版本的提示词与声明的通用环境信息，从空目录制作；不接触旧代码、原画面或父对话。可对自己的结果自检修复，必须记录模型配置、生成条件、修复轮数和实际输入。
5. **封存与对照**：封存生成结果，再观看参考画面和真实播放录像，比较造型、材质、运动、交互与性能；截图不能代替动态验证。上下文与访问约束不应描述成操作系统强隔离。
6. **诚实迭代**：结果未达标则修改提示词并建立下一轮记录。上一轮结果保留；一次通过或一次失败都不代表成功率。展示主提示词、修正过程及每轮测试输入的对应关系。
7. **整理入库**：保存提示词、实际对应的演示源码、运行说明、必要素材和许可证、对照证据与评价。提示词中的外部数据需求需明确记录。

## 给使用者的展示方式

总目录中每张作品卡片展示预览、中文主题、原名称、分类和测试状态。进入场景后可操作演示，并提供三个直接入口：**查看提示词、复制完整提示词、查看测试结果**。允许从原版参考切换到指定提示词生成版，页面明确标注版本对应关系。

查看提示词可在侧栏或弹窗完成，保持演示留在页面上；复制按钮应复制当前演示所对应的完整输入。若存在修正提示词，应一并可见。不能给未经测试的新提示词配上旧生成版，让使用者误以为二者经过对应验证。

将计划中的状态分为：待还原、提示词草案、已生成待对照、测试发现差距、达到验收、已发布。浏览者可按状态筛选。Github 仓库里的 README 提供总目录，每个作品再有自己的说明和提示词文件；网页中的按钮和仓库文件指向同一份内容。

## 仓库中的建议组织

保留现有 site/<场景>/ 前端目录作为参考演示；新增提示词目录、独立生成演示目录和验证记录目录，通过统一 catalog.json 关联 scene_id、提示词版本、生成轮次、演示入口、测试结果与数据模式。

建议内容关系：

- prompts/<场景>/：主提示词、修正提示词和版本说明。
- generated/<场景>/<轮次>/：该轮独立生成的源码与运行说明。
- evaluations/<场景>/<轮次>/：验收标准、结果、截图或视频证据与封存记录。
- docs/：方法说明、全作品目录、状态与使用指南。

这只是设计方案，此阶段未修改现有作品页面或仓库结构。最终源码与提示词会同步到已存在的公开 GitHub 仓库；网页展示入口在后续实施时配置，仓库公开本身不会自动产生可运行的在线网站。大型视频证据将按大小选择压缩片段或仓库 Release 资源，条目保留可访问链接。

## 数据与联网场景

部分作品不仅有前端渲染，还依赖公开数据源或原站实时服务，例如实时地图、在线访客、AI 模型榜单、使用量与价格、天气、轨道或地形数据。后续逐项核对数据来源、已有备用快照及必要素材。

发布时优先提供可运行的演示数据或快照模式；可选实时模式标注数据来源与网络需求。模拟在线人数不称为真实访客，历史榜单不称为最新排名。界面与数据应分开验收，避免把缺少后端误判成提示词建模失败。

## 你需要参与的事情

现在无需找回已丢失的文件，也无需重新搭建后端。下一步只需要确定首批顺序；可沿用“摆 → 棱镜 → 肥皂膜”。逐项制作时，你观看原版与新版本的实际对照，指出最在意的造型或动效差距；我负责分析、提示词整理、生成验证、记录与入库。

摆的节律已进入实施；提示词与对应生成演示及测试记录将作为首项交付，其他场景保留规划。
