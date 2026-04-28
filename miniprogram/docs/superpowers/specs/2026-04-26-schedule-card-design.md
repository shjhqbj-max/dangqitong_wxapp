# 档期卡页面设计文档

## 概述

档期卡是一个独立页面，展示团队成员的个人名片 + 档期信息。用户从团队主页或成员管理页点击成员进入，可以查看档期详情、保存图片、分享给好友。

## 数据结构

### ScheduleCard（新增于 `mock/types.ts`）

```ts
interface ScheduleCard {
  card_id: string
  user_id: string
  nickname: string
  avatar_url: string
  profession: string          // 主职业（单个）
  city: string
  phone: string               // 联系电话
  bio: string                 // 个人简介
  price_text: string          // 如 "2,500/天" 或 "价格详聊"
  background_url: string      // 默认背景图（不同职业不同风格）
  schedules: CardSchedule[]   // 已定档期（最多展示 5 条）
  updated_at: string          // 档期更新时间
  qr_code_url: string         // 小程序码（暂不实现，空字符串）
}

interface CardSchedule {
  date: string
  title: string               // 如 "婚礼跟拍"
  location: string
}
```

背景图由系统提供默认图片（不同职业不同风格），暂不支持用户自定义上传。

## 页面布局

### 路由

`/pages/team/card?userId=xxx`

### 全屏沉浸式布局（方案 A）

- 无 nav-bar，使用自定义浮动顶栏
- 背景图铺满全屏
- 头像 + 昵称 + 职业 + 城市（白色文字，位于背景图上方）
- 两张深色半透明卡片叠加在背景图上：
  - 信息卡：简介、报价、电话
  - 档期卡：已定档期列表（最多 5 条）+ 更新时间
- 底部固定双按钮：保存图片 + 分享给好友

### 卡片样式

深色半透明底，无需 backdrop-filter，兼容性好：

```css
.card-dark {
  background: rgba(0, 0, 0, 0.45);
  border: 1rpx solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  color: #fff;
}
```

### 默认背景

不同职业使用不同风格的默认背景图，统一存放在 `miniprogram/images/card-bg/` 目录下。

## 交互

| 交互 | 行为 |
|------|------|
| 左上角 ← | navigateBack |
| 右上角 分享 | 触发 wx.shareAppMessage |
| 保存图片 | 调用后端 API 获取图片 URL → wx.downloadFile → wx.saveImageToPhotosAlbum |
| 分享给好友 | 直接分享小程序卡片 |
| 下拉滚动 | 内容超出时可滚动 |

## API 设计

### apis/card.ts

```ts
// 获取档期卡数据
export function getScheduleCard(userId: string): ApiResponse<ScheduleCard>

// 获取档期卡图片 URL（后端生成）
export function getCardImage(userId: string): ApiResponse<{ image_url: string }>
```

Mock 阶段 `getCardImage` 返回默认图片。

## 导航入口

| 入口位置 | 触发方式 |
|---------|---------|
| 团队主页 → 已排期成员卡片 | 点击卡片 → navigateTo |
| 团队主页 → 空闲成员 chip | 点击 chip → navigateTo |
| 成员管理页 → 成员行 | 点击行 → navigateTo |

统一通过 `userId` 参数传递。

## 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `mock/types.ts` | 修改 | 新增 ScheduleCard、CardSchedule 类型 |
| `mock/cards.ts` | 新建 | 档期卡 mock 数据 |
| `apis/card.ts` | 新建 | getScheduleCard、getCardImage API |
| `pages/team/card.wxml` | 新建 | 档期卡页面模板 |
| `pages/team/card.wxss` | 新建 | 全屏沉浸样式 |
| `pages/team/card.ts` | 新建 | 页面逻辑 |
| `pages/team/card.json` | 新建 | 页面配置 |
| `pages/team/list.wxml` | 修改 | 成员卡片添加点击事件 |
| `pages/team/list.ts` | 修改 | 添加跳转逻辑 |
| `pages/team/members.wxml` | 修改 | 成员行添加点击事件 |
| `pages/team/members.ts` | 修改 | 添加跳转逻辑 |
| `app.json` | 修改 | 注册 pages/team/card |

## Mock 数据

在 `mock/cards.ts` 中为现有团队成员构造档期卡数据：
- 复用 mock/teams.ts 中的头像和昵称
- 每个成员 2-5 条已定档期
- 不同职业不同默认背景图
- 价格、城市、简介等随机但合理的数据

## 保存图片方案

后端生成档期卡图片，前端下载保存：
1. 用户点击"保存图片"
2. 调用 `getCardImage(userId)` 获取图片 URL
3. `wx.downloadFile` 下载
4. `wx.saveImageToPhotosAlbum` 保存到相册
5. Mock 阶段直接返回默认图片占位

## 注意事项

- 档期卡页面不需要登录保护（可以是公开名片）
- 背景图使用本地默认图片，不需要网络加载
- QR 码字段预留但暂不实现
- 分享使用小程序原生分享，封面为档期卡页面截图或默认图
