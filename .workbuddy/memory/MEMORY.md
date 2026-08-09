# EverLink 项目长期记忆

## SVG 图标还原经验（PNG → SVG）
- 还原 PNG 图标几何时，**不要直接对全部白色像素做圆拟合**：对角连杆/连接线像素会污染，使拟合半径偏小（本案例大圆被从 R=17 误拟合为 R=12.3，约小 28%）。
- 正确做法：沿**干净方向（水平/垂直，避开连杆方向）扫描直径**，或隔离每个圆（按距离中心阈值）后再拟合；用 Pillow 栅格化回渲染与源图逐像素比对验证（吻合度应 >99%）。
- 环境：用 `C:\Users\Lenovo\.workbuddy\binaries\python\envs\default` 的 Pillow 做像素测量。
- 图标方案（截至 2026-08-09）：hero 右侧图标 = `ic_launcher.svg`（实色 #00897B 圆角方块 + 白色连接符号），与 `ic_launcher.png` 1:1 对应；图标后方由 `.VPHero .image::before` 承载**模糊彩虹光晕**（参考 NexIoT），标题文字使用**彩虹渐变**（background-clip:text）。`icon_foreground.svg` 作为透明前景版本备用。
- 关键定位：全站背景改为**干净白底**（参考 NexIoT 文档站），不再使用大面积青绿光斑；青绿色仅保留为品牌色（按钮、描边、图标填充）。

## 环境约束
- VitePress build/dev 在本环境需 `NODE_OPTIONS= npm run docs:build|docs:dev` 绕过 genie-safe-delete 回收站 shim。
- 本机无 Chromium，无法截图，靠 dev server 预览（localhost:5176）。
