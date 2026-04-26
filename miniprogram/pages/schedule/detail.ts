// 档期详情查看页（只读）
import authGuard from '../../behaviors/auth-guard'
import * as scheduleApi from '../../apis/schedule'
import * as teamApi from '../../apis/team'
import { Schedule, TeamMember } from '../../mock/types'

const STATUS_MAP: Record<string, string> = { confirmed: '已定', pending: '预定', rest: '休息' }
const COMPLETION_MAP: Record<string, string> = { completed: '已完成', uncompleted: '未完成', cancelled: '已取消', delayed: '延期' }
const PAYMENT_MAP: Record<string, string> = { paid: '已结清', unpaid: '未付', partial: '部分付' }

Page({
  behaviors: [authGuard],

  data: {
    scheduleId: '',
    schedule: {} as Partial<Schedule>,
    statusLabel: '',
    completionLabel: '',
    paymentLabel: '',
    isMine: true,
    assignedToMe: false,
    isFavorited: false,
    heroH: 0,
    popupVisible: false,
    popupTitle: '',
    popupPlaceholder: '',
    popupUnit: '',
    popupValue: '',
    popupType: '' as 'delay' | 'partial' | 'reject',
    keyboardHeight: 0,
    remainAmount: 0,
    completionExpanded: false,
    // 指派模块
    showAssignSheet: false,
    canAssign: false,
    teamGroups: [] as Array<{
      team_id: string
      team_name: string
      allChecked: boolean
      members: Array<TeamMember & { checked: boolean }>
    }>,
    selectedMemberIds: [] as string[]
  },

  onLoad(options: any) {
    const id = options.id || ''
    if (!id) {
      wx.navigateBack()
      return
    }
    this.setData({ scheduleId: id })
    this.loadSchedule(id)
  },

  onReady() {
    this._measureHero()
  },

  _measureHero() {
    var self = this
    setTimeout(function () {
      wx.createSelectorQuery().select('.detail-hero').boundingClientRect(function (rect: any) {
        if (!rect) return
        var rpx = Math.ceil(rect.height * 750 / wx.getSystemInfoSync().windowWidth)
        self.setData({ heroH: rpx })
      }).exec()
    }, 200)
  },

  onShow() {
    if (this.data.scheduleId) {
      this.loadSchedule(this.data.scheduleId)
    }
  },

  async loadSchedule(id: string) {
    const res = await scheduleApi.getScheduleDetail(id)
    if (res.code === 200) {
      const s = res.data
      const total = s.total_price || 0
      const paid = s.paid_amount || 0

      // 场景判断（演示用，实际应由后端返回 owner/assignee 字段）
      const assignedToMe = s.source === 'team_dispatch'
      const isMine = !assignedToMe

      // 指派权限：自己创建的档期 + 团队有 admin 或 can_dispatch
      let canAssign = false
      if (s.source === 'self') {
        const teamRes = await teamApi.getMyTeams()
        if (teamRes.code === 200) {
          for (const team of teamRes.data) {
            if (team.my_role === 'admin') {
              canAssign = true
              break
            }
            const membersRes = await teamApi.getTeamMembers(team.team_id)
            if (membersRes.code === 200) {
              const me = membersRes.data.find(m => m.user_id === 'u-001')
              if (me && me.can_dispatch) {
                canAssign = true
                break
              }
            }
          }
        }
      }

      this.setData({
        schedule: s,
        statusLabel: STATUS_MAP[s.status] || s.status || '',
        completionLabel: COMPLETION_MAP[s.completion_status] || s.completion_status || '',
        paymentLabel: PAYMENT_MAP[s.payment_status] || s.payment_status || '',
        isMine: isMine,
        assignedToMe: assignedToMe,
        isFavorited: false,
        canAssign: canAssign,
        selectedMemberIds: s.assigned_member_ids || [],
        remainAmount: total > paid ? total - paid : 0
      })
      this._measureHero()
    }
  },

  onCallPhone(e: any) {
    const phone = e.currentTarget.dataset.phone
    if (phone) {
      wx.makePhoneCall({ phoneNumber: phone })
    }
  },

  onEdit() {
    wx.navigateTo({
      url: '/pages/schedule/edit?id=' + this.data.scheduleId
    })
  },

  onDelete() {
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确定删除此档期？',
      confirmColor: '#ff3b30',
      success: async (res) => {
        if (res.confirm) {
          const result = await scheduleApi.deleteSchedule(this.data.scheduleId)
          if (result.code === 200) {
            wx.showToast({ title: '已删除', icon: 'none' })
            setTimeout(function () { wx.navigateBack() }, 1000)
          }
        }
      }
    })
  },

  onShare() {
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    const s = this.data.schedule
    const dateStr = s.date ? s.date : ''
    return {
      title: dateStr + ' 档期详情',
      path: '/pages/schedule/detail?id=' + this.data.scheduleId
    }
  },

  onFavorite() {
    const newVal = !this.data.isFavorited
    this.setData({ isFavorited: newVal })
    wx.showToast({ title: newVal ? '已收藏' : '已取消收藏', icon: 'none' })
  },

  async onOpenAssign() {
    // 加载所有团队和成员
    const teamRes = await teamApi.getMyTeams()
    if (teamRes.code !== 200) return

    const groups: typeof this.data.teamGroups = []
    const selectedIds = [...this.data.selectedMemberIds]

    for (const team of teamRes.data) {
      const membersRes = await teamApi.getTeamMembers(team.team_id)
      if (membersRes.code === 200) {
        // 排除自己（u-001）
        const members = membersRes.data
          .filter(m => m.user_id !== 'u-001')
          .map(m => ({
            ...m,
            checked: selectedIds.includes(m.user_id)
          }))
        if (members.length > 0) {
          groups.push({
            team_id: team.team_id,
            team_name: team.name,
            allChecked: members.length > 0 && members.every(m => m.checked),
            members: members
          })
        }
      }
    }

    this.setData({
      teamGroups: groups,
      showAssignSheet: true
    })
  },

  onCloseAssign() {
    this.setData({ showAssignSheet: false })
  },

  onToggleMember(e: any) {
    const userId = e.currentTarget.dataset.id
    const groups = this.data.teamGroups.map(g => {
      const members = g.members.map(m =>
        m.user_id === userId ? { ...m, checked: !m.checked } : m
      )
      return { ...g, members, allChecked: members.every(m => m.checked) }
    })
    const selectedIds: string[] = []
    groups.forEach(g => g.members.forEach(m => {
      if (m.checked) selectedIds.push(m.user_id)
    }))
    this.setData({ teamGroups: groups, selectedMemberIds: selectedIds })
  },

  onToggleTeam(e: any) {
    const teamId = e.currentTarget.dataset.id
    const groups = this.data.teamGroups.map(g => {
      if (g.team_id !== teamId) return g
      const allChecked = g.members.every(m => m.checked)
      const members = g.members.map(m => ({ ...m, checked: !allChecked }))
      return { ...g, members, allChecked: !allChecked }
    })
    const selectedIds: string[] = []
    groups.forEach(g => g.members.forEach(m => {
      if (m.checked) selectedIds.push(m.user_id)
    }))
    this.setData({ teamGroups: groups, selectedMemberIds: selectedIds })
  },

  async onConfirmAssign() {
    const ids = this.data.selectedMemberIds
    if (ids.length === 0) {
      wx.showToast({ title: '请先选择成员', icon: 'none' })
      return
    }
    const res = await scheduleApi.assignSchedule(this.data.scheduleId, ids)
    if (res.code === 200) {
      this.setData({
        showAssignSheet: false,
        'schedule.assigned_member_ids': ids
      })
      wx.showToast({ title: '已指派 ' + ids.length + ' 人', icon: 'none' })
    }
  },

  onAccept() {
    wx.showModal({
      title: '确认接受',
      content: '接受后此档期将归属于你',
      success: async (res) => {
        if (res.confirm) {
          const result = await scheduleApi.acceptSchedule(this.data.scheduleId)
          if (result.code === 200) {
            wx.showToast({ title: '已接受', icon: 'none' })
            this.setData({
              isMine: true,
              assignedToMe: false,
              'schedule.source': 'team_dispatch'
            })
          }
        }
      }
    })
  },

  onReject() {
    this.setData({
      popupVisible: true,
      popupTitle: '拒绝理由',
      popupPlaceholder: '请输入拒绝理由',
      popupUnit: '',
      popupValue: '',
      popupType: 'reject'
    })
  },

  onCompletionToggle() {
    if (this.data.assignedToMe) return
    this.setData({ completionExpanded: !this.data.completionExpanded })
  },

  onCompletionSelect(e: any) {
    var val = e.currentTarget.dataset.value
    var self = this
    if (val === 'cancelled') {
      wx.showModal({
        title: '确认取消',
        content: '确定要取消此档期吗？',
        confirmColor: '#ff3b30',
        success: function (res) {
          if (res.confirm) {
            self.setData({
              'schedule.completion_status': 'cancelled',
              completionLabel: COMPLETION_MAP['cancelled'],
              completionExpanded: false
            })
            scheduleApi.updateSchedule(self.data.scheduleId, { completion_status: 'cancelled' })
          }
        }
      })
      return
    }
    this.setData({
      'schedule.completion_status': val,
      completionLabel: COMPLETION_MAP[val] || val,
      completionExpanded: false
    })
    scheduleApi.updateSchedule(this.data.scheduleId, { completion_status: val })
  },

  onPaymentToggle() {
    var isPaid = this.data.schedule.payment_status === 'paid'
    if (isPaid) {
      // 已结清 → 切回未付
      this.setData({
        'schedule.payment_status': 'unpaid',
        'schedule.paid_amount': 0,
        remainAmount: this.data.schedule.total_price || 0
      })
      scheduleApi.updateSchedule(this.data.scheduleId, { payment_status: 'unpaid', paid_amount: 0 })
    } else {
      // 未结清 → 标记结清
      this.setData({
        'schedule.payment_status': 'paid',
        'schedule.paid_amount': this.data.schedule.total_price,
        remainAmount: 0
      })
      scheduleApi.updateSchedule(this.data.scheduleId, { payment_status: 'paid', paid_amount: this.data.schedule.total_price })
    }
  },

  onPopupInput(e: any) {
    this.setData({ popupValue: e.detail.value })
  },

  onPopupFocus(e: any) {
    const h = e.detail.height || 0
    if (h > 0) {
      this.setData({ keyboardHeight: h })
    }
  },

  onPopupClose() {
    this.setData({ popupVisible: false })
  },

  onPopupBlur() {
    this.onPopupConfirm()
  },

  onPopupConfirm() {
    const val = (this.data.popupValue || '').trim()
    if (!val) {
      this.setData({ popupVisible: false })
      return
    }

    if (this.data.popupType === 'reject') {
      this.setData({ popupVisible: false })
      scheduleApi.rejectSchedule(this.data.scheduleId, { reason: val })
      wx.showToast({ title: '已拒绝', icon: 'none' })
      setTimeout(function () { wx.navigateBack() }, 1000)
      return
    }

    const num = parseFloat(val)
    if (isNaN(num) || num <= 0) {
      wx.showToast({ title: '请输入有效数字', icon: 'none' })
      return
    }
    if (this.data.popupType === 'delay') {
      this.setData({
        popupVisible: false,
        'schedule.completion_status': 'delayed'
      })
      scheduleApi.updateSchedule(this.data.scheduleId, {
        completion_status: 'delayed',
        delay_days: Math.round(num)
      })
    } else if (this.data.popupType === 'partial') {
      this.setData({
        popupVisible: false,
        'schedule.payment_status': 'partial',
        'schedule.paid_amount': num
      })
      scheduleApi.updateSchedule(this.data.scheduleId, {
        payment_status: 'partial',
        paid_amount: num
      })
    }
  }
})
