# 团队模块实施计划

> **For agentic workers:** 使用 superpowers:subagent-driven-development 或 superpowers:executing-plans 逐任务执行。

**Goal:** 实现团队档期协同（周日历 + 成员状态）和成员管理功能。

**Architecture:** 两个页面（team/list 重写 + team/members 新建），复用已有 nav-bar、样式体系、WXS 辅助函数。Mock 数据驱动，API 层已有基础，新增 4 个接口。

**Tech Stack:** 微信小程序 + TypeScript + WXSS + WXS + Glass-easel

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `mock/types.ts` | 修改:55-76 | 新增 TeamScheduleItem 类型 |
| `mock/teams.ts` | 修改 | 新增 getTeamSchedule 函数 + mock 数据 |
| `apis/team.ts` | 修改 | 新增 getTeamSchedule/updateMemberRole/removeMember/leaveTeam |
| `pages/team/list.ts` | 重写 | 团队主页逻辑：团队切换、周日历、成员状态加载 |
| `pages/team/list.wxml` | 重写 | 团队主页模板 |
| `pages/team/list.wxss` | 重写 | 团队主页样式 |
| `pages/team/list.json` | 修改 | 引入 nav-bar 组件 |
| `pages/team/members.ts` | 新建 | 成员管理页逻辑 |
| `pages/team/members.wxml` | 新建 | 成员管理页模板 |
| `pages/team/members.wxss` | 新建 | 成员管理页样式 |
| `pages/team/members.json` | 新建 | 页面配置 |
| `app.json` | 修改:11 | 注册 pages/team/members |
| `utils/helpers.wxs` | 修改 | 新增 getStatusText 辅助函数 |

---

### Task 1: 类型 + Mock 数据

**Files:** `mock/types.ts`, `mock/teams.ts`

- [ ] **Step 1: 在 mock/types.ts 添加 TeamScheduleItem 类型**

在 `TeamMember` 接口之后（第 76 行后）添加：

```ts
export interface TeamScheduleItem {
  user_id: string
  nickname: string
  avatar_url: string
  professions: string[]
  status: 'confirmed' | 'pending' | 'rest' | 'free'
  start_time?: string
  end_time?: string
  location?: string
}
```

- [ ] **Step 2: 在 mock/teams.ts 末尾添加 getTeamSchedule mock 数据**

```ts
// 按日期获取团队成员档期
export function getTeamSchedule(teamId: string, date: string): TeamScheduleItem[] {
  const members = mockTeamMembers[teamId] || []
  // 用日期 hash 生成伪随机档期
  const dayHash = parseInt(date.replace(/-/g, ''), 10)
  return members.map((m, i) => {
    const seed = (dayHash + i * 7) % 10
    if (seed < 3) {
      // 已排期
      const statuses: Array<'confirmed' | 'pending' | 'rest'> = ['confirmed', 'pending', 'rest']
      const status = statuses[seed]
      return {
        user_id: m.user_id,
        nickname: m.nickname,
        avatar_url: m.avatar_url,
        professions: m.professions,
        status,
        start_time: status !== 'rest' ? '08:00' : undefined,
        end_time: status !== 'rest' ? '18:00' : undefined,
        location: status !== 'rest' ? '杭州西湖区' : undefined
      }
    }
    // 空闲
    return {
      user_id: m.user_id,
      nickname: m.nickname,
      avatar_url: m.avatar_url,
      professions: m.professions,
      status: 'free'
    }
  })
}
```

- [ ] **Step 3: 验证**

在微信开发者工具的 Console 中调用确认无报错：
```ts
import * as teams from './mock/teams'
console.log(teams.getTeamSchedule('t-001', '2026-04-26'))
```

---

### Task 2: API 层扩展

**Files:** `apis/team.ts`

- [ ] **Step 1: 在 apis/team.ts 末尾追加 4 个新 API**

```ts
// 按日期获取团队成员档期
export function getTeamSchedule(teamId: string, date: string): Promise<ApiResponse<TeamScheduleItem[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockTeams.getTeamSchedule(teamId, date) })
  }
  return api.get('/api/teams/' + teamId + '/schedule?date=' + date)
}

// 修改成员角色
export function updateMemberRole(teamId: string, userId: string, role: 'admin' | 'member'): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.put('/api/teams/' + teamId + '/members/' + userId, { role })
}

// 移除成员
export function removeMember(teamId: string, userId: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.delete('/api/teams/' + teamId + '/members/' + userId)
}

// 退出团队
export function leaveTeam(teamId: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.post('/api/teams/' + teamId + '/leave')
}
```

在文件顶部 import 中加入：
```ts
import { TeamScheduleItem } from '../mock/types'
```

- [ ] **Step 2: 验证**

确认 TypeScript 编译无报错。

---

### Task 3: WXS 辅助函数

**Files:** `utils/helpers.wxs`

- [ ] **Step 1: 添加 getTeamStatusText 函数**

在 `getGrabStatusText` 函数之后、`module.exports` 之前添加：

```js
function getTeamStatusText(status) {
  var map = { 'confirmed': '已定', 'pending': '预定', 'rest': '休息', 'free': '空闲' }
  return map[status] || status
}
```

- [ ] **Step 2: 在 module.exports 中添加导出**

```js
module.exports = { getDay: getDay, formatDateShort: formatDateShort, getLocationShort: getLocationShort, getYear: getYear, getMonth: getMonth, getDayNum: getDayNum, isAssigned: isAssigned, timeAgo: timeAgo, formatOrderTime: formatOrderTime, getProClass: getProClass, formatPrice: formatPrice, deadlineText: deadlineText, getGrabStatusText: getGrabStatusText, getTeamStatusText: getTeamStatusText }
```

---

### Task 4: 团队主页 — 逻辑层

**Files:** `pages/team/list.ts`

- [ ] **Step 1: 重写 pages/team/list.ts**

```ts
// 团队主页 — 周日历 + 成员档期状态
import authGuard from '../../behaviors/auth-guard'
import * as teamApi from '../../apis/team'
import { Team, TeamMember, TeamScheduleItem } from '../../mock/types'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function fmt(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function getMonday(d: Date): Date {
  const day = d.getDay()
  const mon = new Date(d)
  mon.setDate(d.getDate() - ((day + 6) % 7))
  mon.setHours(0, 0, 0, 0)
  return mon
}

function getWeekDays(monday: Date): Array<{ day: number, date: string, isToday: boolean, isSelected: boolean }> {
  const today = fmt(new Date())
  const result = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const date = fmt(d)
    result.push({
      day: d.getDate(),
      date,
      isToday: date === today,
      isSelected: false
    })
  }
  return result
}

Page({
  behaviors: [authGuard],

  data: {
    teams: [] as Team[],
    currentTeamIdx: 0,
    currentTeamId: '',
    showTeamPicker: false,
    weekdays: WEEKDAYS,
    weekDays: [] as Array<{ day: number, date: string, isToday: boolean, isSelected: boolean }>,
    selectedDate: fmt(new Date()),
    scheduleList: [] as TeamScheduleItem[],
    busyMembers: [] as TeamScheduleItem[],
    freeMembers: [] as TeamScheduleItem[],
    loading: false
  },

  _monday: getMonday(new Date()),

  onLoad() {
    this.loadTeams()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: 1 })
    }
  },

  async loadTeams() {
    const res = await teamApi.getMyTeams()
    if (res.code !== 200) return
    const teams = res.data
    if (teams.length === 0) return
    this.setData({ teams, currentTeamId: teams[0].team_id })
    this.buildWeek()
    this.loadSchedule()
  },

  // ====== 团队切换 ======

  onToggleTeamPicker() {
    this.setData({ showTeamPicker: !this.data.showTeamPicker })
  },

  onCloseTeamPicker() {
    this.setData({ showTeamPicker: false })
  },

  onTeamSelect(e: any) {
    const idx = e.currentTarget.dataset.idx
    const team = this.data.teams[idx]
    this.setData({
      currentTeamIdx: idx,
      currentTeamId: team.team_id,
      showTeamPicker: false
    })
    this.loadSchedule()
  },

  // ====== 周日历 ======

  buildWeek() {
    const days = getWeekDays(this._monday)
    const sel = this.data.selectedDate
    days.forEach(d => { d.isSelected = d.date === sel })
    this.setData({ weekDays: days })
  },

  onWeekPrev() {
    this._monday.setDate(this._monday.getDate() - 7)
    this.buildWeek()
  },

  onWeekNext() {
    this._monday.setDate(this._monday.getDate() + 7)
    this.buildWeek()
  },

  onDayTap(e: any) {
    const date = e.currentTarget.dataset.date
    if (!date || date === this.data.selectedDate) return
    this.setData({ selectedDate: date })
    this.buildWeek()
    this.loadSchedule()
  },

  // ====== 数据加载 ======

  async loadSchedule() {
    const { currentTeamId, selectedDate } = this.data
    if (!currentTeamId || !selectedDate) return
    this.setData({ loading: true })
    const res = await teamApi.getTeamSchedule(currentTeamId, selectedDate)
    if (res.code === 200) {
      const list = res.data
      const busy = list.filter(m => m.status !== 'free')
      const free = list.filter(m => m.status === 'free')
      this.setData({ scheduleList: list, busyMembers: busy, freeMembers: free })
    }
    this.setData({ loading: false })
  },

  // ====== 导航 ======

  onGoManage() {
    wx.navigateTo({ url: '/pages/team/members?teamId=' + this.data.currentTeamId })
  }
})
```

- [ ] **Step 2: 修改 pages/team/list.json**

```json
{
  "usingComponents": {
    "nav-bar": "/components/nav-bar/nav-bar"
  }
}
```

- [ ] **Step 3: 验证 TypeScript 编译**

确认无报错。

---

### Task 5: 团队主页 — 模板

**Files:** `pages/team/list.wxml`

- [ ] **Step 1: 重写 pages/team/list.wxml**

```html
<wxs module="h" src="../../utils/helpers.wxs" />
<nav-bar title="团队" right-text="管理" bindright="onGoManage" />

<!-- 团队切换器 -->
<view class="t-hero card-top">
  <view class="t-team-switcher" bindtap="onToggleTeamPicker">
    <span class="t-team-name">{{teams[currentTeamIdx].name || '我的团队'}}</span>
    <span class="iconfont icon-arrow-down t-team-arrow {{showTeamPicker ? 't-team-arrow-up' : ''}}"></span>
  </view>
  <view class="t-team-tags" wx:if="{{teams[currentTeamIdx].service_types}}">
    <span class="t-team-tag" wx:for="{{teams[currentTeamIdx].service_types}}" wx:key="*this">{{item}}</span>
  </view>
</view>

<!-- 团队下拉遮罩 -->
<view class="t-picker-mask" wx:if="{{showTeamPicker}}" bindtap="onCloseTeamPicker"></view>

<!-- 团队下拉列表 -->
<view class="t-team-dropdown {{showTeamPicker ? 't-team-dropdown-open' : ''}}">
  <view class="t-team-option {{currentTeamIdx === idx ? 't-team-option-active' : ''}}"
        wx:for="{{teams}}" wx:key="team_id" wx:for-index="idx"
        data-idx="{{idx}}" bindtap="onTeamSelect">
    <span class="t-team-option-name">{{item.name}}</span>
    <span class="t-team-option-meta">{{item.member_count}}人 · {{item.my_role === 'admin' ? '管理员' : '成员'}}</span>
  </view>
</view>

<!-- 周日历 -->
<view class="t-week-cal">
  <view class="t-week-arrow" bindtap="onWeekPrev">
    <span class="iconfont icon-arrow-down t-week-arrow-icon t-arrow-left"></span>
  </view>
  <view class="t-week-days">
    <view class="t-week-cell {{item.isToday ? 't-cell-today' : ''}} {{item.isSelected ? 't-cell-selected' : ''}}"
          wx:for="{{weekDays}}" wx:key="date" data-date="{{item.date}}" bindtap="onDayTap">
      <span class="t-week-day">{{weekdays[index]}}</span>
      <span class="t-week-num">{{item.day}}</span>
    </view>
  </view>
  <view class="t-week-arrow" bindtap="onWeekNext">
    <span class="iconfont icon-arrow-down t-week-arrow-icon"></span>
  </view>
</view>

<!-- 日期标题 -->
<view class="t-date-title">
  <span>{{h.formatDateShort(selectedDate)}}</span>
  <span class="t-date-weekday">{{weekdays[(new Date(selectedDate.replace(/-/g,'/')).getDay())]}}</span>
  <span class="t-date-today" wx:if="{{selectedDate === weekDays[0] ? false : true}}">
    <!-- today badge rendered by JS -->
  </span>
</view>

<!-- 已排期成员 -->
<view class="t-section" wx:if="{{busyMembers.length > 0}}">
  <view class="t-section-title">已排期（{{busyMembers.length}}人）</view>
  <view class="t-member-card" wx:for="{{busyMembers}}" wx:key="user_id">
    <view class="t-member-row">
      <image class="t-member-avatar" src="{{item.avatar_url}}" mode="aspectFill" />
      <view class="t-member-info">
        <view class="t-member-name-row">
          <span class="t-member-name">{{item.nickname}}</span>
          <span class="t-member-pro pro-{{h.getProClass(item.professions[0])}}">
            <span class="iconfont icon-job t-pro-icon"></span>
            {{item.professions[0]}}
          </span>
        </view>
        <view class="t-member-schedule">
          <span class="t-status-dot t-status-{{item.status}}"></span>
          <span class="t-status-text">{{h.getTeamStatusText(item.status)}}</span>
          <span class="t-schedule-time" wx:if="{{item.start_time}}">{{item.start_time}}-{{item.end_time}}</span>
          <span class="t-schedule-loc" wx:if="{{item.location}}">{{h.getLocationShort(item.location)}}</span>
        </view>
      </view>
    </view>
  </view>
</view>

<!-- 空闲成员 -->
<view class="t-section" wx:if="{{freeMembers.length > 0}}">
  <view class="t-section-title">空闲（{{freeMembers.length}}人）</view>
  <view class="t-free-list">
    <view class="t-free-chip" wx:for="{{freeMembers}}" wx:key="user_id">
      <image class="t-free-avatar" src="{{item.avatar_url}}" mode="aspectFill" />
      <span class="t-free-name">{{item.nickname}}</span>
      <span class="t-free-pro">{{item.professions[0]}}</span>
    </view>
  </view>
</view>

<!-- 空状态 -->
<view class="empty-state" wx:if="{{!loading && scheduleList.length === 0}}">
  <span class="iconfont icon-calendar empty-icon"></span>
  <span class="empty-title">当日无排期</span>
</view>

<view class="safe-bottom" />
```

- [ ] **Step 2: 验证 wxml 语法**

确认无语法错误。

---

### Task 6: 团队主页 — 样式

**Files:** `pages/team/list.wxss`

- [ ] **Step 1: 重写 pages/team/list.wxss**

```css
/* 团队主页 */

/* ====== Hero 区 ====== */
.t-hero {
  background: var(--color-bg-card);
  padding: var(--space-3) var(--space-4) var(--space-2);
}

.t-team-switcher {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-bottom: var(--space-1);
}

.t-team-name {
  font-size: var(--font-lg);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}

.t-team-arrow {
  font-size: var(--font-xs);
  color: var(--color-text-tertiary);
  transition: transform 0.2s;
}

.t-team-arrow-up {
  transform: rotate(180deg);
}

.t-team-tags {
  display: flex;
  gap: var(--space-1);
}

.t-team-tag {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg-muted);
  padding: 2rpx var(--space-2);
  border-radius: var(--radius-full);
}

/* ====== 团队下拉 ====== */
.t-picker-mask {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: var(--color-overlay);
}

.t-team-dropdown {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  background: var(--color-bg-card);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-1) 0;
  transform: translateY(-10rpx);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.t-team-dropdown-open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.t-team-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
}

.t-team-option:active {
  background: var(--color-bg-muted);
}

.t-team-option-active .t-team-option-name {
  color: var(--color-primary);
  font-weight: var(--weight-semibold);
}

.t-team-option-name {
  font-size: var(--font-base);
  color: var(--color-text-primary);
}

.t-team-option-meta {
  font-size: var(--font-xs);
  color: var(--color-text-tertiary);
}

/* ====== 周日历 ====== */
.t-week-cal {
  display: flex;
  align-items: center;
  padding: var(--space-2) var(--space-1);
  background: var(--color-bg-card);
  margin-top: var(--space-2);
  border-radius: var(--radius-lg);
  margin-left: var(--space-3);
  margin-right: var(--space-3);
}

.t-week-arrow {
  padding: var(--space-1) var(--space-1-5);
}

.t-week-arrow-icon {
  font-size: var(--font-xs);
  color: var(--color-text-tertiary);
}

.t-arrow-left {
  transform: rotate(90deg);
}

.t-week-arrow .t-week-arrow-icon:not(.t-arrow-left) {
  transform: rotate(-90deg);
}

.t-week-days {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.t-week-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  padding: var(--space-1) 0;
  border-radius: var(--radius-lg);
  min-width: 64rpx;
}

.t-week-day {
  font-size: var(--font-xs);
  color: var(--color-text-tertiary);
}

.t-week-num {
  font-size: var(--font-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
}

.t-cell-today .t-week-num {
  color: var(--color-primary);
  font-weight: var(--weight-bold);
}

.t-cell-selected {
  background: var(--color-primary);
}

.t-cell-selected .t-week-day,
.t-cell-selected .t-week-num {
  color: var(--color-on-primary);
}

/* ====== 日期标题 ====== */
.t-date-title {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-4) var(--space-1);
  font-size: var(--font-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}

.t-date-weekday {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  font-weight: var(--weight-normal);
}

/* ====== 分区 ====== */
.t-section {
  padding: var(--space-1) var(--space-3);
}

.t-section-title {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--weight-medium);
  padding: var(--space-2) var(--space-1);
}

/* ====== 已排期成员卡片 ====== */
.t-member-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  margin-bottom: var(--space-2);
  box-shadow: var(--shadow-sm);
}

.t-member-row {
  display: flex;
  gap: var(--space-2);
}

.t-member-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.t-member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.t-member-name-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.t-member-name {
  font-size: var(--font-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
}

.t-member-pro {
  display: inline-flex;
  align-items: center;
  gap: 4rpx;
  font-size: var(--font-xs);
  padding: 2rpx var(--space-1-5);
  border-radius: var(--radius-full);
  background: var(--color-bg-muted);
}

.t-pro-icon {
  font-size: var(--font-xs);
}

.t-member-schedule {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

.t-status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: var(--radius-full);
  background: var(--color-text-placeholder);
}

.t-status-confirmed .t-status-dot { background: #22c55e; }
.t-status-pending .t-status-dot { background: #f59e0b; }
.t-status-rest .t-status-dot { background: var(--color-text-tertiary); }

.t-status-confirmed { color: #22c55e; }
.t-status-pending { color: #f59e0b; }

.t-schedule-time {
  color: var(--color-text-primary);
  font-weight: var(--weight-medium);
}

.t-schedule-loc {
  color: var(--color-text-tertiary);
}

/* ====== 空闲成员 ====== */
.t-free-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.t-free-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--color-bg-card);
  padding: var(--space-1-5) var(--space-2-5);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.t-free-avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: var(--radius-full);
}

.t-free-name {
  font-size: var(--font-sm);
  color: var(--color-text-primary);
  font-weight: var(--weight-medium);
}

.t-free-pro {
  font-size: var(--font-xs);
  color: var(--color-text-tertiary);
}
```

- [ ] **Step 2: 验证样式**

在开发者工具预览确认布局正确。

---

### Task 7: 成员管理页 — 逻辑 + 模板 + 样式

**Files:** `pages/team/members.ts`, `pages/team/members.wxml`, `pages/team/members.wxss`, `pages/team/members.json`

- [ ] **Step 1: 创建 pages/team/members.json**

```json
{
  "usingComponents": {
    "nav-bar": "/components/nav-bar/nav-bar"
  }
}
```

- [ ] **Step 2: 创建 pages/team/members.ts**

```ts
// 成员管理页
import * as teamApi from '../../apis/team'
import { Team, TeamMember } from '../../mock/types'

Page({
  data: {
    teamId: '',
    team: null as Team | null,
    members: [] as TeamMember[],
    isAdmin: false,
    inviteCode: 'DQTHGZ01',
    actionIdx: -1
  },

  onLoad(options: any) {
    const teamId = options.teamId || ''
    this.setData({ teamId })
    this.loadData()
  },

  async loadData() {
    const res = await teamApi.getMyTeams()
    if (res.code !== 200) return
    const team = res.data.find((t: Team) => t.team_id === this.data.teamId) || null
    if (!team) return
    const mRes = await teamApi.getTeamMembers(this.data.teamId)
    const members = mRes.code === 200 ? mRes.data : []
    this.setData({
      team,
      members,
      isAdmin: team.my_role === 'admin'
    })
  },

  onMemberAction(e: any) {
    const idx = e.currentTarget.dataset.idx
    const member = this.data.members[idx]
    if (member.user_id === 'u-001') return // 不能操作自己

    const items = member.role === 'admin'
      ? ['取消管理员', '移出团队']
      : ['设为管理员', '移出团队']

    wx.showActionSheet({
      itemList: items,
      success: async (res) => {
        if (res.tapIndex === 0) {
          // 切换角色
          const newRole = member.role === 'admin' ? 'member' : 'admin'
          await teamApi.updateMemberRole(this.data.teamId, member.user_id, newRole)
          wx.showToast({ title: '已更新', icon: 'none' })
          this.loadData()
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '确认移除',
            content: '确定将「' + member.nickname + '」移出团队？',
            success: async (modal) => {
              if (!modal.confirm) return
              await teamApi.removeMember(this.data.teamId, member.user_id)
              wx.showToast({ title: '已移除', icon: 'none' })
              this.loadData()
            }
          })
        }
      }
    })
  },

  onCopyInvite() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => wx.showToast({ title: '已复制', icon: 'none' })
    })
  },

  onLeaveTeam() {
    wx.showModal({
      title: '退出团队',
      content: '确定退出「' + (this.data.team?.name || '') + '」？',
      success: async (res) => {
        if (!res.confirm) return
        await teamApi.leaveTeam(this.data.teamId)
        wx.showToast({ title: '已退出', icon: 'none' })
        wx.navigateBack()
      }
    })
  }
})
```

- [ ] **Step 3: 创建 pages/team/members.wxml**

```html
<nav-bar title="成员管理" />

<view class="m-page">
  <!-- 团队信息 -->
  <view class="m-team-info">
    <span class="m-team-name">团队：{{team.name}}</span>
    <span class="m-team-count">（{{members.length}}人）</span>
  </view>

  <!-- 成员列表 -->
  <view class="m-list">
    <view class="m-item" wx:for="{{members}}" wx:key="user_id">
      <image class="m-avatar" src="{{item.avatar_url}}" mode="aspectFill" />
      <view class="m-info">
        <span class="m-name">{{item.nickname}}</span>
        <span class="m-pros">{{item.professions.join('·')}}</span>
      </view>
      <span class="m-role {{item.role === 'admin' ? 'm-role-admin' : ''}}">{{item.role === 'admin' ? '管理员' : '成员'}}</span>
      <span class="iconfont icon-more m-action" wx:if="{{isAdmin && item.user_id !== 'u-001'}}"
            data-idx="{{index}}" catchtap="onMemberAction" />
    </view>
  </view>

  <!-- 邀请码 -->
  <view class="m-invite">
    <view class="m-invite-label">邀请码</view>
    <view class="m-invite-row">
      <span class="m-invite-code">{{inviteCode}}</span>
      <view class="m-invite-copy" bindtap="onCopyInvite">复制</view>
    </view>
  </view>

  <!-- 退出团队 -->
  <view class="m-leave" wx:if="{{!isAdmin}}" bindtap="onLeaveTeam">退出团队</view>
</view>

<view class="safe-bottom" />
```

- [ ] **Step 4: 创建 pages/team/members.wxss**

```css
/* 成员管理页 */
.m-page {
  padding-top: var(--space-2);
}

.m-team-info {
  display: flex;
  align-items: baseline;
  padding: var(--space-2) var(--space-4);
}

.m-team-name {
  font-size: var(--font-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}

.m-team-count {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
}

/* 成员列表 */
.m-list {
  padding: 0 var(--space-3);
}

.m-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-1);
  border-bottom: 1rpx solid var(--color-border-light);
}

.m-item:last-child {
  border-bottom: none;
}

.m-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.m-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.m-name {
  font-size: var(--font-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
}

.m-pros {
  font-size: var(--font-xs);
  color: var(--color-text-tertiary);
}

.m-role {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg-muted);
  padding: 2rpx var(--space-2);
  border-radius: var(--radius-full);
}

.m-role-admin {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.m-action {
  font-size: var(--font-lg);
  color: var(--color-text-tertiary);
  padding: var(--space-1);
}

/* 邀请码 */
.m-invite {
  margin: var(--space-4) var(--space-3) 0;
  padding: var(--space-3);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
}

.m-invite-label {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-2);
}

.m-invite-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.m-invite-code {
  font-size: var(--font-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  letter-spacing: 4rpx;
}

.m-invite-copy {
  font-size: var(--font-sm);
  color: var(--color-primary);
  font-weight: var(--weight-medium);
  padding: var(--space-1) var(--space-3);
  background: var(--color-primary-light);
  border-radius: var(--radius-full);
}

/* 退出团队 */
.m-leave {
  margin: var(--space-4) var(--space-3) 0;
  padding: var(--space-3);
  text-align: center;
  font-size: var(--font-base);
  color: var(--color-danger);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
}
```

- [ ] **Step 5: 验证**

开发者工具预览确认页面渲染正确、交互正常。

---

### Task 8: 注册页面 + Tab 配置

**Files:** `app.json`

- [ ] **Step 1: 在 app.json 的 pages 数组中添加新页面**

在 `"pages/team/list",` 之后添加 `"pages/team/members",`：

```json
"pages": [
    "pages/schedule/index",
    "pages/schedule/edit",
    "pages/schedule/detail",
    "pages/schedule/search",
    "pages/orders/square",
    "pages/orders/detail",
    "pages/orders/publish",
    "pages/orders/city",
    "pages/team/list",
    "pages/team/members",
    "pages/chat/list",
    "pages/profile/index",
    "pages/login/index"
],
```

- [ ] **Step 2: 验证路由**

确认 custom-tab-bar 中团队 tab 指向 `/pages/team/list`，点击管理按钮可跳转 `/pages/team/members`。

---

### Task 9: 最终验证

- [ ] **Step 1: 全页面预览**

在微信开发者工具中：
1. 点击底部"团队"tab → 团队主页加载
2. 点击团队名 → 下拉切换团队
3. 左右箭头翻周 → 日历更新
4. 点击日期 → 成员状态列表更新
5. 点击右上角"管理" → 跳转成员管理页
6. 管理员点击 ⋮ → 弹出操作菜单
7. 复制邀请码 → 剪贴板
8. 非管理员看到"退出团队"按钮

- [ ] **Step 2: 暗黑模式检查**

切换系统到暗黑模式，确认两个页面颜色正常。

- [ ] **Step 3: 确认已有页面不受影响**

切换到档期、工单、消息、我的页面，确认功能正常。
