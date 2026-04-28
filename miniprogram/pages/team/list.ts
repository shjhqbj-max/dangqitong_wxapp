// 团队主页 — 周日历 + 成员档期状态
import authGuard from '../../behaviors/auth-guard'
import * as teamApi from '../../apis/team'
import * as chatApi from '../../apis/chat'
import { Team, TeamScheduleItem } from '../../mock/types'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function fmt(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function getDateList(selectedDate: string): Array<{ day: number, date: string, weekday: string, isToday: boolean, isSelected: boolean }> {
  var today = fmt(new Date())
  var result = []
  for (var i = -30; i <= 60; i++) {
    var d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + i)
    var date = fmt(d)
    result.push({
      day: d.getDate(),
      date: date,
      weekday: WEEKDAYS[d.getDay()],
      isToday: date === today,
      isSelected: date === selectedDate
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
    isAdmin: false,
    showTeamPicker: false,
    weekdays: WEEKDAYS,
    dateList: [] as Array<{ day: number, date: string, weekday: string, isToday: boolean, isSelected: boolean }>,
    selectedDate: fmt(new Date()),
    selectedWeekday: WEEKDAYS[new Date().getDay()],
    scheduleList: [] as TeamScheduleItem[],
    busyMembers: [] as TeamScheduleItem[],
    freeMembers: [] as TeamScheduleItem[],
    loading: false,
    dropTop: 0,
    currentMonth: '',
    scrollTarget: '',
    navBarHeight: 0
  },

  onLoad() {
    var info = wx.getWindowInfo()
    this.setData({ navBarHeight: info.statusBarHeight + 44 })
    this.loadTeams()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: 1 , showGradient: true })
    }
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

  async loadTeams() {
    const res = await teamApi.getMyTeams()
    if (res.code !== 200) return
    const teams = res.data
    if (teams.length === 0) return
    this.setData({ teams, currentTeamId: teams[0].team_id, isAdmin: teams[0].my_role === 'admin' })
    this.buildDateList('day-' + this.data.selectedDate)
    this.loadSchedule()
  },

  // ====== 团队切换 ======

  onToggleTeamPicker() {
    var show = !this.data.showTeamPicker
    if (show) {
      this.setData({ showTeamPicker: true, dropTop: this.data.navBarHeight })
      return
    }
    this.setData({ showTeamPicker: false })
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
      isAdmin: team.my_role === 'admin',
      showTeamPicker: false
    })
    this.loadSchedule()
  },

  // ====== 周日历 ======

  buildDateList(scrollTo?: string) {
    var list = getDateList(this.data.selectedDate)
    var d = new Date(this.data.selectedDate.replace(/-/g, '/'))
    var month = (d.getMonth() + 1) + '月'
    var data: Record<string, any> = { dateList: list, currentMonth: month }
    if (scrollTo) {
      data.scrollTarget = scrollTo
    }
    this.setData(data)
  },

  onWeekPrev() {
    var d = new Date(this.data.selectedDate.replace(/-/g, '/'))
    d.setDate(d.getDate() - 7)
    var date = fmt(d)
    this.setData({ selectedDate: date, selectedWeekday: WEEKDAYS[d.getDay()] })
    this.buildDateList('day-' + date)
    this.loadSchedule()
  },

  onWeekNext() {
    var d = new Date(this.data.selectedDate.replace(/-/g, '/'))
    d.setDate(d.getDate() + 7)
    var date = fmt(d)
    this.setData({ selectedDate: date, selectedWeekday: WEEKDAYS[d.getDay()] })
    this.buildDateList('day-' + date)
    this.loadSchedule()
  },

  onDayTap(e: any) {
    var date = e.currentTarget.dataset.date
    if (!date || date === this.data.selectedDate) return
    var d = new Date(date.replace(/-/g, '/'))
    this.setData({ selectedDate: date, selectedWeekday: WEEKDAYS[d.getDay()], scrollTarget: '' })
    this.buildDateList()
    this.loadSchedule()
  },

  onWeekScroll(e: any) {
    var scrollLeft = e.detail.scrollLeft
    var info = wx.getWindowInfo()
    var cellPx = info.windowWidth / 750 * 88
    var wrapWidth = info.windowWidth - info.windowWidth / 750 * 120
    var centerIdx = Math.round((scrollLeft + wrapWidth / 2) / cellPx)
    var list = this.data.dateList
    if (centerIdx >= 0 && centerIdx < list.length) {
      var centerDate = list[centerIdx].date
      var d = new Date(centerDate.replace(/-/g, '/'))
      var month = (d.getMonth() + 1) + '月'
      if (month !== this.data.currentMonth) {
        this.setData({ currentMonth: month })
      }
    }
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

  onMemberTap(e: any) {
    const userId = e.currentTarget.dataset.uid
    if (!userId) return
    wx.navigateTo({ url: '/pages/team/card?userId=' + userId })
  },

  onGoManage() {
    if (this.data.isAdmin) {
      wx.navigateTo({ url: '/pages/team/members?teamId=' + this.data.currentTeamId })
    } else {
      wx.navigateTo({ url: '/pages/team/profile?teamId=' + this.data.currentTeamId })
    }
  },

  onGoProfile() {
    wx.navigateTo({ url: '/pages/team/profile?teamId=' + this.data.currentTeamId })
  },

  onGoCard() {
    wx.navigateTo({ url: '/pages/team/profile?teamId=' + this.data.currentTeamId })
  },

  onCreateTeam() {
    wx.navigateTo({ url: '/pages/team/members' })
  },

  onJoinTeam() {
    wx.showModal({
      title: '加入团队',
      editable: true,
      placeholderText: '请输入邀请码',
      success: async (res) => {
        if (!res.confirm) return
        var code = (res.content || '').trim()
        if (!code) return
        const result = await teamApi.joinTeam(code)
        if (result.code === 200) {
          wx.showToast({ title: '已加入', icon: 'none' })
          // 加入团队群
          if (result.data) {
            try {
              var chatsRes = await chatApi.getChatList()
              if (chatsRes.code === 200) {
                var teamChat = chatsRes.data.find(function(c) {
                  return c.team_id === result.data.team_id && c.chat_type === 'team'
                })
                if (teamChat) {
                  chatApi.addMember(teamChat.chat_id, 'u-001')
                }
              }
            } catch (e) { /* 静默 */ }
          }
          this.loadTeams()
        }
      }
    })
  }
})
