# 档期通小程序 — 知识库

## 项目架构

- 微信小程序 + TypeScript + WXSS
- Glass-easel 组件框架
- 自定义 tabBar（custom-tab-bar）
- authGuard behavior 统一登录拦截

## 样式体系

- CSS 变量系统：`styles/variables.wxss` 定义颜色/间距/字号/圆角
- 暗黑模式：同文件内 `@media (prefers-color-scheme: dark)` 覆盖
- 职业色变量：`--role-host/makeup/video/photo/director/floral/lighting/car/show`
- 公共类：`card-top`, `info-card`, `badge-*`, `completion-pill`, `empty-state`

## 页面结构规范

- nav-bar + card-top 实现顶部无缝衔接
- hero 区固定定位 + 内容区 paddingTop 避免遮挡
- 筛选用 filter-sheet（底部弹出面板）
- 列表用 onReachBottom 分页加载

## WXS 辅助函数（helpers.wxs）

- `formatDateShort` — 日期短格式
- `formatOrderTime` — 工单时间格式
- `getProClass` — 职业→CSS 类名映射
- `formatPrice` — 价格格式化
- `deadlineText` — 截止时间文案
- `timeAgo` — 相对时间
- `getGrabStatusText` — 抢单状态文案
- `getDay` — 提取日
- `getLocationShort` — 地点短格式

## 已知约束

- setData 是同步更新 this.data，但 DOM 渲染异步
- WXS 不能调用 wx API，只能做纯函数计算
- global.wxss 由 app.wxss 统一引入，页面不要重复 @import

## 关键文件清单

| 文件 | 用途 |
|------|------|
| mock/types.ts | Order/Schedule/ExtraContact 类型定义 |
| mock/orders.ts | 工单 mock（30+ 条） |
| mock/schedules.ts | 档期 mock |
| apis/orders.ts | 工单 API |
| apis/schedule.ts | 档期 API |
| constants/professions.ts | 10 个职业常量 |
| utils/helpers.wxs | 视图层辅助函数 |
| styles/variables.wxss | CSS 变量 + 暗黑模式 |
| styles/global.wxss | 公共样式类 |
| styles/iconfont.wxss | 图标字体 |
