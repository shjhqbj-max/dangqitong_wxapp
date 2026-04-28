// 系统消息页
import authGuard from '../../behaviors/auth-guard'
import * as chatApi from '../../apis/chat'
import { Notification } from '../../mock/types'

Page({
  behaviors: [authGuard],

  data: {
    notifications: [] as Notification[],
    loading: false
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  async loadData() {
    this.setData({ loading: true })
    const res = await chatApi.getNotifications()
    if (res.code === 200) {
      // 标记所有为已读
      var list = res.data
      for (var i = 0; i < list.length; i++) {
        if (!list[i].is_read) {
          chatApi.markRead(list[i].notification_id)
          list[i] = Object.assign({}, list[i], { is_read: true })
        }
      }
      this.setData({ notifications: list, loading: false })
    } else {
      this.setData({ loading: false })
    }
  },

  onNotiTap(e: any) {
    var type = e.currentTarget.dataset.type
    var extra = e.currentTarget.dataset.extra
    if (!extra) return

    if (type === 'order_grab') {
      // 订单提醒 → 订单详情
      if (extra.order_id) {
        wx.navigateTo({ url: '/pages/orders/detail?orderId=' + extra.order_id })
      }
    } else if (type === 'schedule_update' || type === 'dispatch') {
      // 档期确认/变更/取消、档期指派 → 档期详情
      if (extra.schedule_id) {
        wx.navigateTo({ url: '/pages/schedule/detail?scheduleId=' + extra.schedule_id })
      }
    }
  },

  onServiceTap() {
    wx.makePhoneCall({ phoneNumber: '400-000-0000' })
  },

  onFeedbackTap() {
    wx.showToast({ title: '反馈功能开发中', icon: 'none' })
  },

  onPullDownRefresh() {
    this.loadData().then(function() {
      wx.stopPullDownRefresh()
    })
  }
})
