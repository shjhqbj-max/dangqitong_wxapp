import { getMockSchedules, getScheduleTags, Schedule } from '../../mock/schedule'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

// 农历数据（简化版，1900-2100）
const lunarInfo: number[] = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252,
  0x0d520,
]

const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']
const lunarDays = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
]

function getLunarDay(year: number, month: number, day: number): string {
  const baseDate = new Date(1900, 0, 31)
  const targetDate = new Date(year, month - 1, day)
  let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000)

  let lunarYear = 1900
  let daysInYear: number

  while (lunarYear < 2101 && offset > 0) {
    daysInYear = getLunarYearDays(lunarYear)
    if (offset < daysInYear) break
    offset -= daysInYear
    lunarYear++
  }

  let lunarMonth = 1
  let leapMonth = getLeapMonth(lunarYear)
  let isLeap = false

  while (lunarMonth < 13 && offset > 0) {
    if (leapMonth > 0 && lunarMonth === leapMonth + 1 && !isLeap) {
      --lunarMonth
      isLeap = true
      daysInYear = getLeapDays(lunarYear)
    } else {
      daysInYear = getLunarMonthDays(lunarYear, lunarMonth)
    }

    if (isLeap && lunarMonth === leapMonth + 1) {
      isLeap = false
    }

    if (offset < daysInYear) {
      return lunarDays[offset]
    }
    offset -= daysInYear

    if (isLeap && lunarMonth === leapMonth + 1) {
      isLeap = false
    }
    lunarMonth++
  }

  return ''
}

function getLunarYearDays(year: number): number {
  let sum = 348
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo[year - 1900] & i) ? 1 : 0
  }
  return sum + getLeapDays(year)
}

function getLeapMonth(year: number): number {
  return lunarInfo[year - 1900] & 0xf
}

function getLeapDays(year: number): number {
  if (getLeapMonth(year)) {
    return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29
  }
  return 0
}

function getLunarMonthDays(year: number, month: number): number {
  return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29
}

Page({
  data: {
    year: 2026,
    month: 4,
    monthLabel: '2026年4月',
    viewMode: 'calendar' as 'calendar' | 'list',
    weekdays: WEEKDAYS,
    weeks: [] as Array<Array<{
      day: number
      lunar: string
      isCurrentMonth: boolean
      isToday: boolean
      isSunday: boolean
      isSaturday: boolean
      schedules: Array<{ text: string; type: string }>
      extraCount: number
      monthKey: string
    }>>,
    scrollTarget: '',
    drawerVisible: false,
    statusBarHeight: 0,
    safeAreaBottom: 0,
    todayLabel: '',
    menuList: [
      { icon: 'icon-calendar', text: '档期管理', key: 'schedule' },
      { icon: 'icon-flash', text: '抢单大厅', key: 'orders' },
      { icon: 'icon-team', text: '团队管理', key: 'team' },
      { icon: 'icon-user', text: '个人中心', key: 'profile' },
    ],
    bottomMenu: [
      { icon: 'icon-setting', text: '设置', key: 'settings' },
      { icon: 'icon-help', text: '帮助反馈', key: 'help' },
    ],
    panelVisible: false,
    panelDate: '',
    panelSchedules: [] as Schedule[],
  },
  drawerAnim: null as WechatMiniprogram.Animation | null,
  _loadingMore: false,
  _monthRange: { startYear: 0, startMonth: 0, endYear: 0, endMonth: 0 },
  _todayWeekIndex: -1,
  _scrollLock: false,
  onLoad() {
    this.drawerAnim = wx.createAnimation({ duration: 300, timingFunction: 'ease' })
    const info = wx.getSystemInfoSync()
    const safeAreaBottom = info.screenHeight - info.safeArea.bottom

    const today = new Date()
    const weekNames = ['日', '一', '二', '三', '四', '五', '六']
    const todayLabel = `今天 · ${today.getMonth() + 1}月${today.getDate()}日 周${weekNames[today.getDay()]}`

    this.setData({
      statusBarHeight: info.statusBarHeight,
      safeAreaBottom,
      todayLabel,
    })
    this.initInfiniteCalendar()
  },
  // ============================
  // 无限滚动日历
  // ============================
  initInfiniteCalendar() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    // 初始渲染 3 个月：上月 + 当月 + 下月
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year

    const prevWeeks = this.buildMonthWeeks(prevYear, prevMonth)
    const currWeeks = this.buildMonthWeeks(year, month)
    const nextWeeks = this.buildMonthWeeks(nextYear, nextMonth)

    const allWeeks = [...prevWeeks, ...currWeeks, ...nextWeeks]

    // 记录月份范围
    this._monthRange = {
      startYear: prevYear,
      startMonth: prevMonth,
      endYear: nextYear,
      endMonth: nextMonth,
    }

    // 找到"今天"所在的周索引
    let todayWeekIndex = 0
    for (let i = 0; i < allWeeks.length; i++) {
      for (const day of allWeeks[i]) {
        if (day.isToday) {
          todayWeekIndex = i
          break
        }
      }
      if (todayWeekIndex > 0) break
    }
    this._todayWeekIndex = todayWeekIndex

    // 定位到今天前一周，让今天落在页面中间
    const targetIndex = Math.max(todayWeekIndex - 1, 0)

    this.setData({
      year,
      month,
      monthLabel: `${year}年${month}月`,
      weeks: allWeeks,
      scrollTarget: `week-${targetIndex}`,
    })

    // 锁定滚动事件，防止 scroll-into-view 动画期间误更新月份
    this._scrollLock = true
    setTimeout(() => {
      this._scrollLock = false
    }, 500)
  },
  buildMonthWeeks(year: number, month: number) {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    const monthKey = `${year}-${month}`

    const firstDay = new Date(year, month - 1, 1)
    let startWeekday = firstDay.getDay() - 1
    if (startWeekday < 0) startWeekday = 6

    const daysInMonth = new Date(year, month, 0).getDate()
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate()

    const weeks: Array<Array<{
      day: number
      lunar: string
      isCurrentMonth: boolean
      isToday: boolean
      isSunday: boolean
      isSaturday: boolean
      schedules: Array<{ text: string; type: string }>
      extraCount: number
      monthKey: string
    }>> = []

    let currentWeek: typeof weeks[0] = []

    // 1号前面的空占位（根据实际星期补齐）
    for (let i = 0; i < startWeekday; i++) {
      currentWeek.push({
        day: 0,
        lunar: '',
        isCurrentMonth: false,
        isToday: false,
        isSunday: false,
        isSaturday: false,
        schedules: [],
        extraCount: 0,
        monthKey,
      })
    }

    // 当月日期
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month - 1, d)
      const weekday = dateObj.getDay()
      const schedules = getMockSchedules(year, month, d)
      const tags = getScheduleTags(schedules)
      const visible = tags.slice(0, 2)
      const extraCount = schedules.length > 2 ? schedules.length - 2 : 0

      currentWeek.push({
        day: d,
        lunar: getLunarDay(year, month, d),
        isCurrentMonth: true,
        isToday: `${year}-${month}-${d}` === todayStr,
        isSunday: weekday === 0,
        isSaturday: weekday === 6,
        schedules: visible,
        extraCount,
        monthKey,
      })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    // 不满一周的补空占位
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({
          day: 0,
          lunar: '',
          isCurrentMonth: false,
          isToday: false,
          isSunday: false,
          isSaturday: false,
          schedules: [],
          extraCount: 0,
          monthKey,
        })
      }
      weeks.push(currentWeek)
    }

    return weeks
  },
  // 前进一个月
  _getNextMonth(year: number, month: number) {
    return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 }
  },
  // 后退一个月
  _getPrevMonth(year: number, month: number) {
    return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 }
  },
  onScrollToLower() {
    if (this._loadingMore) return
    this._loadingMore = true

    const { endYear, endMonth } = this._monthRange
    const next = this._getNextMonth(endYear, endMonth)
    const newWeeks = this.buildMonthWeeks(next.year, next.month)

    const weeks = this.data.weeks.concat(newWeeks)

    // 裁剪：保留最多 6 个月的数据（约 26 周）
    let trimCount = 0
    const MAX_WEEKS = 30
    if (weeks.length > MAX_WEEKS) {
      trimCount = weeks.length - MAX_WEEKS
      // 更新起始月份
      const firstKeptWeek = weeks[trimCount]
      if (firstKeptWeek && firstKeptWeek[0]) {
        const mk = firstKeptWeek[0].monthKey.split('-')
        this._monthRange.startYear = parseInt(mk[0])
        this._monthRange.startMonth = parseInt(mk[1])
      }
    }

    const trimmedWeeks = weeks.slice(trimCount)
    this._monthRange.endYear = next.year
    this._monthRange.endMonth = next.month

    this.setData({ weeks: trimmedWeeks }, () => {
      this._loadingMore = false
    })
  },
  onScrollToUpper() {
    if (this._loadingMore) return
    this._loadingMore = true

    const { startYear, startMonth } = this._monthRange
    const prev = this._getPrevMonth(startYear, startMonth)
    const newWeeks = this.buildMonthWeeks(prev.year, prev.month)

    const weeks = newWeeks.concat(this.data.weeks)

    // 裁剪：保留最多 6 个月的数据
    const MAX_WEEKS = 30
    let trimmedWeeks = weeks
    if (weeks.length > MAX_WEEKS) {
      trimmedWeeks = weeks.slice(0, MAX_WEEKS)
      const lastKeptWeek = trimmedWeeks[trimmedWeeks.length - 1]
      if (lastKeptWeek && lastKeptWeek[0]) {
        const mk = lastKeptWeek[0].monthKey.split('-')
        this._monthRange.endYear = parseInt(mk[0])
        this._monthRange.endMonth = parseInt(mk[1])
      }
    }

    this._monthRange.startYear = prev.year
    this._monthRange.startMonth = prev.month

    // 顶部追加后，需要调整 scroll-into-view 以保持位置
    const addedWeeks = newWeeks.length
    const targetId = `week-${addedWeeks - 1}`

    this._scrollLock = true
    this.setData({
      weeks: trimmedWeeks,
      scrollTarget: targetId,
    }, () => {
      // 清空 scrollTarget 以便后续触发
      setTimeout(() => {
        this.setData({ scrollTarget: '' })
        this._loadingMore = false
        this._scrollLock = false
      }, 500)
    })
  },
  onScroll(e: WechatMiniprogram.ScrollViewScrollEvent) {
    if (this._scrollLock) return
    // 根据滚动位置估算当前月份
    const scrollTop = e.detail.scrollTop
    const weekHeight = 100 // 一周大约 100px（200rpx cell + 边框）
    const weekIndex = Math.floor(scrollTop / weekHeight)
    const weeks = this.data.weeks
    if (weekIndex >= 0 && weekIndex < weeks.length) {
      const firstDay = weeks[weekIndex][0]
      if (firstDay && firstDay.monthKey) {
        const mk = firstDay.monthKey.split('-')
        const y = parseInt(mk[0])
        const m = parseInt(mk[1])
        const label = `${y}年${m}月`
        if (this.data.monthLabel !== label) {
          this.setData({
            monthLabel: label,
            year: y,
            month: m,
          })
        }
      }
    }
  },
  openDrawer() {
    this.drawerAnim!.translateX(0).step()
    this.setData({ drawerVisible: true })
  },
  closeDrawer() {
    this.drawerAnim!.translateX('-100%').step()
    this.setData({})
    setTimeout(() => {
      this.setData({ drawerVisible: false })
    }, 300)
  },
  onDrawerMaskTap() {
    this.closeDrawer()
  },
  onMenuTap(e: WechatMiniprogram.TouchEvent) {
    const key = e.currentTarget.dataset.key
    console.log('menu tap:', key)
    this.closeDrawer()
  },
  onDayTap(e: WechatMiniprogram.TouchEvent) {
    const { day } = e.currentTarget.dataset
    if (!day || day.day <= 0) return

    const dateKey = `${this.data.year}-${this.data.month}-${day.day}`
    const weekNames = ['日', '一', '二', '三', '四', '五', '六']
    const dateObj = new Date(this.data.year, this.data.month - 1, day.day)
    const panelDate = `${this.data.month}月${day.day}日 周${weekNames[dateObj.getDay()]}`

    // 点击同一日期 → 关闭面板
    if (this.data.panelVisible && this.data.panelDate === panelDate) {
      this.setData({ panelVisible: false })
      return
    }

    const allSchedules = getMockSchedules(this.data.year, this.data.month, day.day)

    this.setData({
      panelVisible: true,
      panelDate,
      panelSchedules: allSchedules,
    })
  },
  onPanelClose() {
    this.setData({ panelVisible: false })
  },
  onGoToday() {
    this.initInfiniteCalendar()
  },
  onFilterTap() {
    console.log('filter tap')
  },
  onAddSchedule() {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    wx.navigateTo({ url: `/pages/index/edit?date=${dateStr}` })
  },
})