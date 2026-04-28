// 档期页面 — 日历 + 列表混合布局
import authGuard from '../../behaviors/auth-guard'
import * as scheduleApi from '../../apis/schedule'
import * as ordersApi from '../../apis/orders'
import * as chatApi from '../../apis/chat'
import { Schedule, CalendarDayMap } from '../../mock/types'

type CalDay = { day: number, date: string, isToday: boolean, isSelected: boolean, statuses: string[], isOther: boolean }

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay()
}

function offsetMonth(year: number, month: number, delta: number): { y: number, m: number } {
  let m = month + delta
  let y = year
  if (m > 12) { y += Math.floor((m - 1) / 12); m = ((m - 1) % 12) + 1 }
  if (m < 1) { y += Math.floor((m - 1) / 12); m = ((m - 1) % 12) + 12 }
  return { y, m }
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

interface FilterState {
  date: string
  status: string
  payment_status: string
  completion_status: string
  team_only: boolean
}

Page({
  behaviors: [authGuard],
  data: {
    year: 2026,
    month: 5,
    weekdays: WEEKDAYS,
    calIndex: 1,
    calMonth0: [] as CalDay[],
    calMonth1: [] as CalDay[],
    calMonth2: [] as CalDay[],
    selectedDate: '',
    scheduleList: [] as Schedule[],
    calendarMap: {} as CalendarDayMap,
    listTab: 'week' as 'week' | 'month' | '',
    orderCount: 12,
    headerSticky: false,
    navBarH: 0,
    bannerClosed: false,
    bannerIdx: -1,
    showFilterSheet: false,
    filterStatus: '',
    filterPayment: '',
    filterCompletion: '',
    filterTeam: true,
    tempFilterStatus: '',
    tempFilterPayment: '',
    tempFilterCompletion: '',
    tempFilterTeam: true,
    statusOptions: [
      { value: '', label: '全部' },
      { value: 'confirmed', label: '已定' },
      { value: 'pending', label: '预定' },
      { value: 'rest', label: '休息' }
    ],
    paymentOptions: [
      { value: '', label: '全部' },
      { value: 'paid', label: '已结清' },
      { value: 'unpaid', label: '未结' },
      { value: 'partial', label: '部分结' }
    ],
    completionOptions: [
      { value: '', label: '全部' },
      { value: 'completed', label: '已完成' },
      { value: 'uncompleted', label: '未完成' },
      { value: 'delayed', label: '延期' },
      { value: 'cancelled', label: '已取消' }
    ]
  },

  _maps: {} as Record<string, CalendarDayMap>,

  onLoad() {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const prev = offsetMonth(y, m, -1)
    const next = offsetMonth(y, m, 1)

    this.setData({
      year: y,
      month: m,
      calMonth0: this.buildMonth(prev.y, prev.m, {}),
      calMonth1: this.buildMonth(y, m, {}),
      calMonth2: this.buildMonth(next.y, next.m, {})
    })
    this.loadData()
    this.loadNearbyCount()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      var theme = (wx.getAppBaseInfo().theme || 'light')
      this.getTabBar().setData({ active: 0, bgColor: theme === 'dark' ? '#0F172A' : '#F8FAFC', showGradient: true })
    }
    this.loadData()
    this._syncMsgDot()
  },

  async _syncMsgDot() {
    try {
      var [chatRes, notiRes] = await Promise.all([chatApi.getChatList(), chatApi.getNotifications()])
      var chats = chatRes.code === 200 ? chatRes.data : []
      var notifications = notiRes.code === 200 ? notiRes.data : []
      var unread = notifications.filter(function(n: any) { return !n.is_read }).length
      var chatUnread = chats.reduce(function(s: number, c: any) { return s + c.unread_count }, 0)
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({ msgDot: unread > 0 || chatUnread > 0 })
      }
    } catch (e) { /* 静默 */ }
  },

  onNavBarHeight(e: any) {
    this.setData({ navBarH: e.detail.height })
  },

  _headerAtBar: false,
  onPageScroll() {
    wx.createSelectorQuery().select('.c-sticky-sentinel').boundingClientRect((rect: any) => {
      if (!rect) return
      const atBar = rect.top <= this.data.navBarH
      if (atBar !== this._headerAtBar) {
        this._headerAtBar = atBar
        this.setData({ headerSticky: atBar })
      }
    }).exec()
  },

  // ====== 筛选 ======

  getFilterState(): FilterState {
    return {
      date: this.data.selectedDate,
      status: this.data.filterStatus,
      payment_status: this.data.filterPayment,
      completion_status: this.data.filterCompletion,
      team_only: this.data.filterTeam,
    }
  },

  hasActiveFilters(): boolean {
    const f = this.getFilterState()
    return !!(f.date || f.status || f.payment_status || f.completion_status || !this.data.filterTeam)
  },

  applyFilters(list: Schedule[]): Schedule[] {
    const f = this.getFilterState()
    let result = list
    if (f.date) result = result.filter(s => s.date === f.date)
    if (f.status) result = result.filter(s => s.status === f.status)
    if (f.payment_status) result = result.filter(s => s.payment_status === f.payment_status)
    if (f.completion_status) result = result.filter(s => s.completion_status === f.completion_status)
    if (!this.data.filterTeam) result = result.filter(s => s.source === 'self')
    return result
  },

  // ====== 数据加载 ======

  async loadData() {
    await Promise.all([this.loadCalendar(), this.loadScheduleList()])
  },

  async loadNearbyCount() {
    const res = await ordersApi.getNearbyOrderCount()
    if (res.code === 200) {
      this.setData({ orderCount: res.data.count })
    }
  },

  async loadCalendar() {
    const { year, month } = this.data
    const key = `${year}-${month}`
    const res = await scheduleApi.getCalendar(year, month)
    if (res.code === 200) {
      this._maps[key] = res.data
      this.setData({ calendarMap: res.data })
      this.rebuildAllCal()
    }
  },

  rebuildAllCal() {
    const { year, month, calIndex } = this.data
    const prev = offsetMonth(year, month, -1)
    const next = offsetMonth(year, month, 1)
    this.setData({
      calMonth0: this.buildMonth(
        calIndex === 0 ? year : calIndex === 1 ? prev.y : next.y,
        calIndex === 0 ? month : calIndex === 1 ? prev.m : next.m,
        this._maps[`${calIndex === 0 ? year : calIndex === 1 ? prev.y : next.y}-${calIndex === 0 ? month : calIndex === 1 ? prev.m : next.m}`] || {}
      ),
      calMonth1: this.buildMonth(
        calIndex === 1 ? year : calIndex === 2 ? prev.y : next.y,
        calIndex === 1 ? month : calIndex === 2 ? prev.m : next.m,
        this._maps[`${calIndex === 1 ? year : calIndex === 2 ? prev.y : next.y}-${calIndex === 1 ? month : calIndex === 2 ? prev.m : next.m}`] || {}
      ),
      calMonth2: this.buildMonth(
        calIndex === 2 ? year : calIndex === 0 ? prev.y : next.y,
        calIndex === 2 ? month : calIndex === 0 ? prev.m : next.m,
        this._maps[`${calIndex === 2 ? year : calIndex === 0 ? prev.y : next.y}-${calIndex === 2 ? month : calIndex === 0 ? prev.m : next.m}`] || {}
      )
    })
  },

  buildMonth(year: number, month: number, map: CalendarDayMap): CalDay[] {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfWeek(year, month)
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const { selectedDate } = this.data
    const days: CalDay[] = []

    const prev = offsetMonth(year, month, -1)
    const prevDays = getDaysInMonth(prev.y, prev.m)
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevDays - i, date: '', isToday: false, isSelected: false, statuses: [], isOther: true })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const info = map[date] || { statuses: [], count: 0 }
      days.push({
        day: d, date,
        isToday: date === todayStr,
        isSelected: date === selectedDate,
        statuses: info.statuses,
        isOther: false
      })
    }

    let nextDay = 1
    while (days.length < 35) {
      days.push({ day: nextDay++, date: '', isToday: false, isSelected: false, statuses: [], isOther: true })
    }
    return days
  },

  // ====== 日历交互 ======

  onDayTap(e: any) {
    const date = e.currentTarget.dataset.date
    if (!date) return
    this.setData({ selectedDate: date })
    this.rebuildAllCal()
    this.loadScheduleList()
  },

  onCalSwiperChange(e: any) {
    if (e.detail.source !== 'touch') return
    const newIdx = e.detail.current
    let delta = newIdx - this.data.calIndex
    if (delta === -2) delta = 1
    else if (delta === 2) delta = -1
    if (delta === 0) return
    this.navigateMonth(delta)
  },

  async navigateMonth(delta: number) {
    const { year, month, calIndex } = this.data
    const newMonth = offsetMonth(year, month, delta)
    const newIdx = (calIndex + delta + 3) % 3
    const prev = offsetMonth(newMonth.y, newMonth.m, -1)
    const next = offsetMonth(newMonth.y, newMonth.m, 1)

    const panelMonths = [
      { y: newIdx === 0 ? newMonth.y : newIdx === 1 ? prev.y : next.y,
        m: newIdx === 0 ? newMonth.m : newIdx === 1 ? prev.m : next.m },
      { y: newIdx === 1 ? newMonth.y : newIdx === 2 ? prev.y : next.y,
        m: newIdx === 1 ? newMonth.m : newIdx === 2 ? prev.m : next.m },
      { y: newIdx === 2 ? newMonth.y : newIdx === 0 ? prev.y : next.y,
        m: newIdx === 2 ? newMonth.m : newIdx === 0 ? prev.m : next.m }
    ]

    this.setData({
      year: newMonth.y, month: newMonth.m, calIndex: newIdx,
      calMonth0: this.buildMonth(panelMonths[0].y, panelMonths[0].m, this._maps[`${panelMonths[0].y}-${panelMonths[0].m}`] || {}),
      calMonth1: this.buildMonth(panelMonths[1].y, panelMonths[1].m, this._maps[`${panelMonths[1].y}-${panelMonths[1].m}`] || {}),
      calMonth2: this.buildMonth(panelMonths[2].y, panelMonths[2].m, this._maps[`${panelMonths[2].y}-${panelMonths[2].m}`] || {})
    })

    const edgeY = delta > 0 ? next.y : prev.y
    const edgeM = delta > 0 ? next.m : prev.m
    const edgePanelIdx = delta > 0 ? (newIdx + 1) % 3 : (newIdx + 2) % 3
    const edgeKey = `${edgeY}-${edgeM}`

    if (!this._maps[edgeKey]) {
      const res = await scheduleApi.getCalendar(edgeY, edgeM)
      if (res.code === 200) {
        this._maps[edgeKey] = res.data
        const field = `calMonth${edgePanelIdx}` as 'calMonth0' | 'calMonth1' | 'calMonth2'
        this.setData({ [field]: this.buildMonth(edgeY, edgeM, res.data) })
      }
    }
    this.loadScheduleList()
  },

  // ====== 列表加载 ======

  onTabChange(e: any) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      listTab: tab, selectedDate: '',
      filterStatus: '', filterPayment: '', filterCompletion: '', filterTeam: true,
    })
    this.rebuildAllCal()
    this.loadScheduleList()
  },

  async loadScheduleList() {
    const { year, month, listTab } = this.data
    const res = await scheduleApi.getScheduleList(year, month)
    if (res.code !== 200) return

    let list: Schedule[] = res.data.list

    if (listTab === 'week') {
      list = this.filterWeekSchedules(list)
    } else if (listTab === 'month') {
      list = list.filter((s: Schedule) => s.status !== 'rest')
    }

    if (this.hasActiveFilters()) {
      list = this.applyFilters(list)
    }

    const n = list.length
    const bannerIdx = n <= 5 ? 2 : 5
    this.setData({ scheduleList: list, bannerIdx })
  },

  filterWeekSchedules(list: Schedule[]): Schedule[] {
    const now = new Date()
    const day = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - ((day + 6) % 7))
    monday.setHours(0, 0, 0, 0)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const start = fmt(monday)
    const end = fmt(sunday)

    return list
      .filter(s => s.date >= start && s.date <= end && s.status !== 'rest')
      .sort((a, b) => a.date.localeCompare(b.date))
  },

  onGoSearch() {
    wx.navigateTo({ url: '/pages/schedule/search' })
  },

  // ====== 筛选面板 ======

  onOpenFilter() {
    this.setData({
      showFilterSheet: true,
      tempFilterStatus: this.data.filterStatus,
      tempFilterPayment: this.data.filterPayment,
      tempFilterCompletion: this.data.filterCompletion,
      tempFilterTeam: this.data.filterTeam
    })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ visible: false })
    }
  },

  onCloseFilter() {
    this.setData({ showFilterSheet: false })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ visible: true })
    }
  },

  onFilterStatusTap(e: any) {
    this.setData({ tempFilterStatus: e.currentTarget.dataset.value })
  },

  onFilterPaymentTap(e: any) {
    this.setData({ tempFilterPayment: e.currentTarget.dataset.value })
  },

  onFilterCompletionTap(e: any) {
    this.setData({ tempFilterCompletion: e.currentTarget.dataset.value })
  },

  onFilterTeamChange(e: any) {
    this.setData({ tempFilterTeam: e.detail.value })
  },

  onFilterReset() {
    this.setData({
      tempFilterStatus: '', tempFilterPayment: '',
      tempFilterCompletion: '', tempFilterTeam: true
    })
  },

  onFilterConfirm() {
    this.setData({
      showFilterSheet: false,
      filterStatus: this.data.tempFilterStatus,
      filterPayment: this.data.tempFilterPayment,
      filterCompletion: this.data.tempFilterCompletion,
      filterTeam: this.data.tempFilterTeam
    })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ visible: true })
    }
    this.loadScheduleList()
  },

  // ====== 筛选标签 ======

  onRemoveFilterTag(e: any) {
    const field = e.currentTarget.dataset.field
    const updates: Record<string, any> = {}
    switch (field) {
      case 'date': updates.selectedDate = ''; break
      case 'status': updates.filterStatus = ''; break
      case 'payment': updates.filterPayment = ''; break
      case 'completion': updates.filterCompletion = ''; break
      case 'team': updates.filterTeam = true; break
    }
    this.setData(updates)
    if (field === 'date') this.rebuildAllCal()
    this.loadScheduleList()
  },

  // ====== 档期项 ======

  onScheduleTap(e: any) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/schedule/detail?id=${id}` })
  },

  onAddSchedule() {
    wx.navigateTo({ url: '/pages/schedule/edit' })
  },

  onCloseBanner() {
    this.setData({ bannerClosed: true })
  },

  onGoSquare() {
    wx.navigateTo({ url: '/pages/orders/square' })
  },

  getStatusText(status: string): string {
    const map: Record<string, string> = { confirmed: '已定', pending: '预定', rest: '休息' }
    return map[status] || status
  },

  getCompletionText(status: string): string {
    const map: Record<string, string> = { completed: '已完成', uncompleted: '未完成', delayed: '延期', cancelled: '已取消' }
    return map[status] || status
  }
})
