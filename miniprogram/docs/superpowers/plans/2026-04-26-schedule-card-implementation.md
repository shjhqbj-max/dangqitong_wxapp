# 档期卡页面实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建档期卡独立页面，从团队主页/成员管理页点击成员进入，展示个人名片 + 档期信息，支持保存图片和分享。

**Architecture:** 全屏沉浸式页面，背景使用 CSS 职业色渐变，深色半透明卡片叠加。数据通过独立 API 获取，Mock 阶段用本地数据。保存图片走后端生成方案，Mock 阶段用默认图占位。

**Tech Stack:** 微信小程序 (WXML/WXSS/TS)、glass-easel 组件框架、现有 Mock + API 模式

---

## 文件结构

| 文件 | 操作 | 说明 |
|------|------|------|
| `miniprogram/mock/types.ts` | 修改 | 新增 ScheduleCard、CardSchedule 类型 |
| `miniprogram/mock/cards.ts` | 新建 | 档期卡 mock 数据 |
| `miniprogram/apis/card.ts` | 新建 | getScheduleCard、getCardImage API |
| `miniprogram/pages/team/card.json` | 新建 | 页面配置（无组件依赖） |
| `miniprogram/pages/team/card.ts` | 新建 | 页面逻辑：加载数据、保存图片、分享 |
| `miniprogram/pages/team/card.wxml` | 新建 | 全屏沉浸模板：浮动顶栏 + 背景 + 卡片 |
| `miniprogram/pages/team/card.wxss` | 新建 | 全屏沉浸样式 |
| `miniprogram/pages/team/list.wxml` | 修改 | 成员卡片/空闲 chip 添加点击事件 |
| `miniprogram/pages/team/list.ts` | 修改 | 添加跳转到档期卡逻辑 |
| `miniprogram/pages/team/members.wxml` | 修改 | 成员行添加点击事件 |
| `miniprogram/pages/team/members.ts` | 修改 | 添加跳转到档期卡逻辑 |
| `miniprogram/app.json` | 修改 | 注册 pages/team/card |

---

### Task 1: 类型定义 + Mock 数据

**Files:**
- Modify: `miniprogram/mock/types.ts`
- Create: `miniprogram/mock/cards.ts`

- [ ] **Step 1: 在 types.ts 添加 ScheduleCard 和 CardSchedule 类型**

在 `mock/types.ts` 文件末尾（`Notification` 接口之后）添加：

```ts
// ====== 档期卡 ======
export interface CardSchedule {
  date: string
  title: string
  location: string
}

export interface ScheduleCard {
  card_id: string
  user_id: string
  nickname: string
  avatar_url: string
  profession: string
  city: string
  phone: string
  bio: string
  price_text: string
  background_url: string
  schedules: CardSchedule[]
  updated_at: string
  qr_code_url: string
}
```

- [ ] **Step 2: 创建 mock/cards.ts**

```ts
// DQT Mock 数据 — 档期卡
import { ScheduleCard } from './types'

const mockCards: Record<string, ScheduleCard> = {
  'u-001': {
    card_id: 'c-001',
    user_id: 'u-001',
    nickname: '我自己',
    avatar_url: 'https://i.pravatar.cc/150?img=11',
    profession: '摄影',
    city: '杭州',
    phone: '13800138001',
    bio: '5年婚礼跟拍经验，擅长纪实风格，杭州本地团队核心摄影师。',
    price_text: '2,500/天',
    background_url: '',
    schedules: [
      { date: '2026-04-28', title: '婚礼跟拍', location: '杭州西湖区' },
      { date: '2026-05-03', title: '商业活动', location: '上海浦东新区' },
      { date: '2026-05-10', title: '婚礼跟拍', location: '杭州余杭区' }
    ],
    updated_at: '2026-04-26T10:00:00',
    qr_code_url: ''
  },
  'u-002': {
    card_id: 'c-002',
    user_id: 'u-002',
    nickname: '张三',
    avatar_url: 'https://i.pravatar.cc/150?img=12',
    profession: '摄像',
    city: '杭州',
    phone: '13800138002',
    bio: '专业婚礼摄像，4K拍摄，无人机航拍。',
    price_text: '3,000/天',
    background_url: '',
    schedules: [
      { date: '2026-04-28', title: '婚礼摄像', location: '杭州西湖区' },
      { date: '2026-05-01', title: '企业年会', location: '杭州滨江区' }
    ],
    updated_at: '2026-04-25T16:00:00',
    qr_code_url: ''
  },
  'u-003': {
    card_id: 'c-003',
    user_id: 'u-003',
    nickname: '李四',
    avatar_url: 'https://i.pravatar.cc/150?img=13',
    profession: '摄影',
    city: '杭州',
    phone: '13800138003',
    bio: '专注人像与婚礼摄影，风格清新自然。',
    price_text: '2,000/天',
    background_url: '',
    schedules: [
      { date: '2026-05-02', title: '婚纱摄影', location: '杭州西湖区' }
    ],
    updated_at: '2026-04-24T09:00:00',
    qr_code_url: ''
  },
  'u-004': {
    card_id: 'c-004',
    user_id: 'u-004',
    nickname: '王五',
    avatar_url: 'https://i.pravatar.cc/150?img=14',
    profession: '化妆',
    city: '杭州',
    phone: '13800138004',
    bio: '高级化妆造型师，新娘妆/晚宴妆/舞台妆均擅长。',
    price_text: '1,800/天',
    background_url: '',
    schedules: [
      { date: '2026-04-29', title: '新娘跟妆', location: '杭州拱墅区' },
      { date: '2026-05-05', title: '活动化妆', location: '杭州上城区' }
    ],
    updated_at: '2026-04-26T08:00:00',
    qr_code_url: ''
  },
  'u-005': {
    card_id: 'c-005',
    user_id: 'u-005',
    nickname: '赵六',
    avatar_url: 'https://i.pravatar.cc/150?img=15',
    profession: '摄像',
    city: '杭州',
    phone: '13800138005',
    bio: '影视级航拍+地面摄像，提供完整后期服务。',
    price_text: '3,500/天',
    background_url: '',
    schedules: [],
    updated_at: '2026-04-23T14:00:00',
    qr_code_url: ''
  },
  'u-006': {
    card_id: 'c-006',
    user_id: 'u-006',
    nickname: '孙七',
    avatar_url: 'https://i.pravatar.cc/150?img=16',
    profession: '灯光',
    city: '杭州',
    phone: '13800138006',
    bio: '专业婚礼灯光搭建，LED帕灯/追光灯/光束灯。',
    price_text: '1,500/天',
    background_url: '',
    schedules: [
      { date: '2026-04-28', title: '婚礼灯光', location: '杭州西湖区' }
    ],
    updated_at: '2026-04-25T11:00:00',
    qr_code_url: ''
  },
  'u-007': {
    card_id: 'c-007',
    user_id: 'u-007',
    nickname: '周八',
    avatar_url: 'https://i.pravatar.cc/150?img=20',
    profession: '化妆',
    city: '上海',
    phone: '13900139001',
    bio: '10年新娘妆经验，上海知名化妆造型团队创始人。',
    price_text: '2,800/天',
    background_url: '',
    schedules: [
      { date: '2026-04-30', title: '新娘跟妆', location: '上海静安区' },
      { date: '2026-05-02', title: '商业活动', location: '上海浦东新区' },
      { date: '2026-05-08', title: '婚礼跟妆', location: '上海黄浦区' }
    ],
    updated_at: '2026-04-26T09:00:00',
    qr_code_url: ''
  },
  'u-008': {
    card_id: 'c-008',
    user_id: 'u-008',
    nickname: '吴九',
    avatar_url: 'https://i.pravatar.cc/150?img=21',
    profession: '花艺',
    city: '上海',
    phone: '13900139002',
    bio: '婚礼花艺设计，手捧/胸花/拱门/桌花全系列。',
    price_text: '价格详聊',
    background_url: '',
    schedules: [
      { date: '2026-05-01', title: '婚礼花艺', location: '上海徐汇区' }
    ],
    updated_at: '2026-04-25T15:00:00',
    qr_code_url: ''
  },
  'u-009': {
    card_id: 'c-009',
    user_id: 'u-009',
    nickname: '郑十',
    avatar_url: 'https://i.pravatar.cc/150?img=22',
    profession: '摄影',
    city: '上海',
    phone: '13900139003',
    bio: '纪实婚礼摄影，用镜头记录每一个真实瞬间。',
    price_text: '2,200/天',
    background_url: '',
    schedules: [
      { date: '2026-05-06', title: '婚礼跟拍', location: '上海浦东新区' },
      { date: '2026-05-12', title: '婚纱摄影', location: '上海松江区' }
    ],
    updated_at: '2026-04-24T17:00:00',
    qr_code_url: ''
  },
  'u-010': {
    card_id: 'c-010',
    user_id: 'u-010',
    nickname: '冯十一',
    avatar_url: 'https://i.pravatar.cc/150?img=23',
    profession: '主持',
    city: '上海',
    phone: '13900139004',
    bio: '婚礼/活动主持人，台风稳健，幽默风趣。',
    price_text: '1,500/场',
    background_url: '',
    schedules: [
      { date: '2026-05-01', title: '婚礼主持', location: '上海静安区' }
    ],
    updated_at: '2026-04-26T07:00:00',
    qr_code_url: ''
  }
}

// 获取指定用户的档期卡
export function getScheduleCard(userId: string): ScheduleCard | null {
  return mockCards[userId] || null
}

// 获取档期卡图片（mock 返回空字符串）
export function getCardImage(_userId: string): { image_url: string } {
  return { image_url: '' }
}
```

- [ ] **Step 3: Commit**

```bash
git add miniprogram/mock/types.ts miniprogram/mock/cards.ts
git commit -m "feat: add ScheduleCard type and mock data"
```

---

### Task 2: API 层

**Files:**
- Create: `miniprogram/apis/card.ts`

- [ ] **Step 1: 创建 apis/card.ts**

```ts
import { api, USE_MOCK, ApiResponse } from '../utils/request'
import { ScheduleCard } from '../mock/types'
import * as mockCards from '../mock/cards'

// 获取档期卡数据
export function getScheduleCard(userId: string): Promise<ApiResponse<ScheduleCard | null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockCards.getScheduleCard(userId) })
  }
  return api.get('/api/cards/' + userId)
}

// 获取档期卡图片 URL（后端生成，mock 返回空）
export function getCardImage(userId: string): Promise<ApiResponse<{ image_url: string }>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockCards.getCardImage(userId) })
  }
  return api.get('/api/cards/' + userId + '/image')
}
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/apis/card.ts
git commit -m "feat: add card API layer"
```

---

### Task 3: 档期卡页面 — 模板 + 逻辑 + 配置

**Files:**
- Create: `miniprogram/pages/team/card.json`
- Create: `miniprogram/pages/team/card.ts`
- Create: `miniprogram/pages/team/card.wxml`

- [ ] **Step 1: 创建 card.json**

```json
{
  "usingComponents": {}
}
```

- [ ] **Step 2: 创建 card.ts**

```ts
// 档期卡页面
import * as cardApi from '../../apis/card'
import { ScheduleCard } from '../../mock/types'

// 职业 → 渐变色
const proGradients: Record<string, string> = {
  '摄影': 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #1a4a7a 100%)',
  '摄像': 'linear-gradient(135deg, #2c1654 0%, #5b3a8a 50%, #3d2066 100%)',
  '化妆': 'linear-gradient(135deg, #5c1a3a 0%, #a0366e 50%, #7a2852 100%)',
  '主持': 'linear-gradient(135deg, #5c3a1a 0%, #c07830 50%, #8a5520 100%)',
  '花艺': 'linear-gradient(135deg, #1a4a2a 0%, #2d8a4a 50%, #1e6a36 100%)',
  '灯光': 'linear-gradient(135deg, #4a3a1a 0%, #a08030 50%, #7a6020 100%)',
  '督导': 'linear-gradient(135deg, #1a3a4a 0%, #2d7090 50%, #1e5a7a 100%)',
  '场布': 'linear-gradient(135deg, #3a2a4a 0%, #7a5a9a 50%, #5a3a7a 100%)',
  '车队': 'linear-gradient(135deg, #2a3a1a 0%, #5a7a2a 50%, #3a5a1e 100%)',
  '演出': 'linear-gradient(135deg, #4a1a1a 0%, #9a3030 50%, #7a2424 100%)'
}

function formatCardDate(dateStr: string): string {
  if (!dateStr) return ''
  const m = dateStr.substring(5, 7).replace(/^0/, '')
  const d = dateStr.substring(8, 10).replace(/^0/, '')
  return m + '/' + d
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return ''
  const t = new Date(dateStr).getTime()
  const now = Date.now()
  const diff = now - t
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 2592000000) return Math.floor(diff / 86400000) + '天前'
  return Math.floor(diff / 2592000000) + '月前'
}

Page({
  data: {
    card: null as ScheduleCard | null,
    bgGradient: '',
    loading: true
  },

  onLoad(options: any) {
    const userId = options.userId || ''
    if (!userId) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    this.loadCard(userId)
  },

  async loadCard(userId: string) {
    const res = await cardApi.getScheduleCard(userId)
    if (res.code !== 200 || !res.data) {
      this.setData({ loading: false })
      return
    }
    const card = res.data
    const bgGradient = proGradients[card.profession] || proGradients['摄影']
    this.setData({ card, bgGradient, loading: false })
  },

  onBack() {
    wx.navigateBack()
  },

  async onSaveImage() {
    if (!this.data.card) return
    wx.showLoading({ title: '生成中...' })
    try {
      const res = await cardApi.getCardImage(this.data.card.user_id)
      if (res.code === 200 && res.data.image_url) {
        const dlRes = await wx.downloadFile({ url: res.data.image_url })
        await wx.saveImageToPhotosAlbum({ filePath: dlRes.tempFilePath })
        wx.showToast({ title: '已保存到相册', icon: 'none' })
      } else {
        wx.showToast({ title: '图片生成中，请稍后', icon: 'none' })
      }
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
    wx.hideLoading()
  },

  onShareAppMessage() {
    const card = this.data.card
    return {
      title: card ? card.nickname + '的档期卡' : '档期卡',
      path: '/pages/team/card?userId=' + (card ? card.user_id : '')
    }
  }
})
```

- [ ] **Step 3: 创建 card.wxml**

```xml
<wxs module="h" src="../../utils/helpers.wxs" />

<!-- 档期卡页面 -->
<view class="sc-page" wx:if="{{card}}">
  <!-- 背景渐变 -->
  <view class="sc-bg" style="background: {{bgGradient}}"></view>

  <!-- 浮动顶栏 -->
  <view class="sc-topbar">
    <view class="sc-topbar-back" bindtap="onBack">
      <span class="iconfont icon-arrow-left sc-topbar-icon"></span>
    </view>
    <view class="sc-topbar-share" catchtap="onShareAppMessage">
      <span class="iconfont icon-share sc-topbar-icon"></span>
    </view>
  </view>

  <!-- 头像 + 基本信息 -->
  <view class="sc-hero">
    <image class="sc-avatar" src="{{card.avatar_url}}" mode="aspectFill" />
    <view class="sc-name">{{card.nickname}}</view>
    <view class="sc-sub">
      <span>{{card.profession}}</span>
      <span wx:if="{{card.city}}"> · {{card.city}}</span>
    </view>
  </view>

  <!-- 内容区 -->
  <scroll-view class="sc-body" scroll-y>
    <!-- 信息卡 -->
    <view class="sc-card-dark">
      <view class="sc-bio" wx:if="{{card.bio}}">{{card.bio}}</view>
      <view class="sc-info-row">
        <span class="sc-info-label">报价</span>
        <span class="sc-info-value">{{card.price_text}}</span>
      </view>
      <view class="sc-info-row" wx:if="{{card.phone}}">
        <span class="sc-info-label">电话</span>
        <span class="sc-info-value">{{card.phone}}</span>
      </view>
    </view>

    <!-- 档期列表 -->
    <view class="sc-card-dark" wx:if="{{card.schedules.length > 0}}">
      <view class="sc-sch-title">已定档期</view>
      <view class="sc-sch-item" wx:for="{{card.schedules}}" wx:key="date">
        <span class="sc-sch-date">{{item.date}}</span>
        <span class="sc-sch-name">{{item.title}}</span>
        <span class="sc-sch-loc">{{h.getLocationShort(item.location)}}</span>
      </view>
      <view class="sc-sch-update">更新于 {{card.updated_at}}</view>
    </view>

    <!-- 空状态 -->
    <view class="sc-card-dark" wx:if="{{card.schedules.length === 0}}">
      <view class="sc-sch-title">已定档期</view>
      <view class="sc-empty">暂无档期安排</view>
    </view>
  </scroll-view>

  <!-- 底部操作栏 -->
  <view class="sc-bottom safe-bottom">
    <view class="sc-btn-save" bindtap="onSaveImage">
      <span class="iconfont icon-download sc-btn-icon"></span>
      <span>保存图片</span>
    </view>
    <button class="sc-btn-share" open-type="share">
      <span class="iconfont icon-share sc-btn-icon"></span>
      <span>分享给好友</span>
    </button>
  </view>
</view>

<!-- 加载中 -->
<view class="sc-loading" wx:if="{{loading}}">
  <span>加载中...</span>
</view>
```

- [ ] **Step 4: Commit**

```bash
git add miniprogram/pages/team/card.json miniprogram/pages/team/card.ts miniprogram/pages/team/card.wxml
git commit -m "feat: add schedule card page template and logic"
```

---

### Task 4: 档期卡页面 — 样式

**Files:**
- Create: `miniprogram/pages/team/card.wxss`

- [ ] **Step 1: 创建 card.wxss**

```css
/* 档期卡页面 — 全屏沉浸式 */

.sc-page {
  position: relative;
  min-height: 100vh;
  background: #1a1a2e;
  color: #fff;
}

/* ====== 背景 ====== */
.sc-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 55vh;
  z-index: 0;
}

/* ====== 浮动顶栏 ====== */
.sc-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-8) var(--space-4) var(--space-3);
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%);
}

.sc-topbar-back,
.sc-topbar-share {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: rgba(0,0,0,0.2);
}

.sc-topbar-icon {
  font-size: var(--font-lg);
  color: #fff;
}

/* ====== Hero 区 ====== */
.sc-hero {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 180rpx var(--space-4) var(--space-6);
}

.sc-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: var(--radius-full);
  border: 4rpx solid rgba(255,255,255,0.5);
  margin-bottom: var(--space-3);
}

.sc-name {
  font-size: var(--font-xl);
  font-weight: var(--weight-bold);
  color: #fff;
  margin-bottom: var(--space-1);
}

.sc-sub {
  font-size: var(--font-sm);
  color: rgba(255,255,255,0.7);
}

/* ====== 内容区 ====== */
.sc-body {
  position: relative;
  z-index: 1;
  padding: 0 var(--space-4);
  min-height: 45vh;
}

/* ====== 深色半透明卡片 ====== */
.sc-card-dark {
  background: rgba(0,0,0,0.45);
  border: 1rpx solid rgba(255,255,255,0.12);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  color: rgba(255,255,255,0.9);
}

/* 简介 */
.sc-bio {
  font-size: var(--font-sm);
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  margin-bottom: var(--space-3);
}

/* 信息行 */
.sc-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
}

.sc-info-row:not(:last-child) {
  border-bottom: 1rpx solid rgba(255,255,255,0.08);
}

.sc-info-label {
  font-size: var(--font-sm);
  color: rgba(255,255,255,0.5);
}

.sc-info-value {
  font-size: var(--font-base);
  color: #fff;
  font-weight: var(--weight-medium);
}

/* ====== 档期列表 ====== */
.sc-sch-title {
  font-size: var(--font-md);
  font-weight: var(--weight-semibold);
  color: #fff;
  margin-bottom: var(--space-3);
}

.sc-sch-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) 0;
  font-size: var(--font-sm);
}

.sc-sch-item:not(:last-child) {
  border-bottom: 1rpx solid rgba(255,255,255,0.06);
}

.sc-sch-date {
  color: rgba(255,255,255,0.6);
  min-width: 72rpx;
  flex-shrink: 0;
}

.sc-sch-name {
  color: #fff;
  flex: 1;
  min-width: 0;
}

.sc-sch-loc {
  color: rgba(255,255,255,0.4);
  flex-shrink: 0;
  font-size: var(--font-xs);
}

.sc-sch-update {
  font-size: var(--font-xs);
  color: rgba(255,255,255,0.35);
  margin-top: var(--space-3);
  text-align: right;
}

.sc-empty {
  font-size: var(--font-sm);
  color: rgba(255,255,255,0.4);
  text-align: center;
  padding: var(--space-4) 0;
}

/* ====== 底部操作栏 ====== */
.sc-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom));
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
}

.sc-btn-save,
.sc-btn-share {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  height: 88rpx;
  border-radius: var(--radius-lg);
  font-size: var(--font-base);
  font-weight: var(--weight-medium);
}

.sc-btn-save {
  background: rgba(255,255,255,0.15);
  color: #fff;
  border: 1rpx solid rgba(255,255,255,0.25);
}

.sc-btn-save:active {
  background: rgba(255,255,255,0.25);
}

.sc-btn-share {
  background: rgba(255,255,255,0.9);
  color: #1a1a2e;
  border: none;
  margin: 0;
  padding: 0;
  line-height: 88rpx;
  border-radius: var(--radius-lg);
}

.sc-btn-share::after {
  border: none;
}

.sc-btn-share:active {
  background: rgba(255,255,255,0.75);
}

.sc-btn-icon {
  font-size: var(--font-md);
}

/* ====== 加载状态 ====== */
.sc-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: var(--font-base);
  color: rgba(255,255,255,0.5);
  background: #1a1a2e;
}
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/team/card.wxss
git commit -m "feat: add schedule card page styles"
```

---

### Task 5: 团队主页 — 添加档期卡入口

**Files:**
- Modify: `miniprogram/pages/team/list.ts`
- Modify: `miniprogram/pages/team/list.wxml`

- [ ] **Step 1: 在 list.ts 添加跳转方法**

在 `onGoManage` 方法之前添加：

```ts
  onMemberTap(e: any) {
    const userId = e.currentTarget.dataset.uid
    if (!userId) return
    wx.navigateTo({ url: '/pages/team/card?userId=' + userId })
  },
```

- [ ] **Step 2: 在 list.wxml 已排期成员卡片添加点击事件**

将已排期成员卡片的 `<view class="card t-member-card"...>` 修改为添加 `data-uid` 和 `bindtap`：

```xml
  <view class="card t-member-card" wx:for="{{busyMembers}}" wx:key="user_id"
        data-uid="{{item.user_id}}" bindtap="onMemberTap">
```

- [ ] **Step 3: 在 list.wxml 空闲成员列表添加点击事件**

将空闲成员的 `<view class="t-free-item"...>` 修改为添加 `data-uid` 和 `bindtap`：

```xml
  <view class="t-free-item" wx:for="{{freeMembers}}" wx:key="user_id"
        data-uid="{{item.user_id}}" bindtap="onMemberTap">
```

- [ ] **Step 4: Commit**

```bash
git add miniprogram/pages/team/list.ts miniprogram/pages/team/list.wxml
git commit -m "feat: add schedule card entry from team list"
```

---

### Task 6: 成员管理页 — 添加档期卡入口

**Files:**
- Modify: `miniprogram/pages/team/members.ts`
- Modify: `miniprogram/pages/team/members.wxml`

- [ ] **Step 1: 在 members.ts 添加跳转方法**

在 `onLeaveTeam` 方法之后添加：

```ts
  onMemberTap(e: any) {
    const userId = e.currentTarget.dataset.uid
    if (!userId) return
    wx.navigateTo({ url: '/pages/team/card?userId=' + userId })
  },
```

- [ ] **Step 2: 在 members.wxml 成员行添加点击事件**

将成员行的 `<view class="m-item"...>` 修改为添加 `data-uid` 和 `bindtap`：

```xml
  <view class="m-item" wx:for="{{members}}" wx:key="user_id"
        data-uid="{{item.user_id}}" bindtap="onMemberTap">
```

- [ ] **Step 3: Commit**

```bash
git add miniprogram/pages/team/members.ts miniprogram/pages/team/members.wxml
git commit -m "feat: add schedule card entry from members page"
```

---

### Task 7: 注册页面

**Files:**
- Modify: `miniprogram/app.json`

- [ ] **Step 1: 在 app.json 注册新页面**

在 `"pages/team/members"` 之后添加 `"pages/team/card"`：

```json
    "pages/team/members",
    "pages/team/card",
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/app.json
git commit -m "feat: register schedule card page"
```

---

## 自检

- [x] 所有 spec 需求有对应 Task（类型、mock、API、页面、入口、注册）
- [x] 无 TBD/TODO/placeholder
- [x] 类型定义一致（ScheduleCard、CardSchedule 在 Task 1 定义，后续 Task 引用一致）
- [x] 函数名一致（getScheduleCard、getCardImage）
- [x] 文件路径精确
- [x] 每步有完整代码
