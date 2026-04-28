// 个人中心页
import authGuard from '../../behaviors/auth-guard'
import * as profileApi from '../../apis/profile'
import * as chatApi from '../../apis/chat'
import { UserProfile } from '../../mock/types'

Page({
  behaviors: [authGuard],

  data: {
    profile: null as UserProfile | null,
    navBarHeight: 0
  },

  onLoad() {
    const info = wx.getWindowInfo()
    this.setData({ navBarHeight: info.statusBarHeight + 44 })
    this.loadData()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      var theme = (wx.getSystemInfoSync().theme || 'light')
      this.getTabBar().setData({ active: 3, bgColor: theme === 'dark' ? '#0F172A' : '#F8FAFC', showGradient: true })
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

  async loadData() {
    const res = await profileApi.getProfile()
    if (res.code === 200) {
      this.setData({ profile: res.data })
    }
  },

  onGoMySchedule() {
    wx.navigateTo({ url: '/pages/profile/schedule' })
  },

  onGoPublished() {
    wx.navigateTo({ url: '/pages/profile/grab' })
  },

  onGoFavorites() {
    wx.showToast({ title: '我的收藏开发中', icon: 'none' })
  },

  onGoCard() {
    var userId = this.data.profile ? this.data.profile.user_id : ''
    if (userId) {
      wx.navigateTo({ url: '/pages/team/card?userId=' + userId })
    }
  },

  onNavBarHeight(e: any) {
    this.setData({ navBarHeight: e.detail.height })
  },

  onEditProfile() {
    wx.navigateTo({ url: '/pages/profile/edit' })
  },

  onGoSubscription() {
    wx.showToast({ title: '订阅中心开发中', icon: 'none' })
  },

  onGoService() {
    wx.makePhoneCall({ phoneNumber: '400-000-0000' })
  },

  onGoFeedback() {
    wx.showToast({ title: '反馈功能开发中', icon: 'none' })
  },

  onGoAbout() {
    wx.showToast({ title: '关于我们开发中', icon: 'none' })
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定退出当前账号？',
      success: (res) => {
        if (!res.confirm) return
        wx.removeStorageSync('token')
        wx.reLaunch({ url: '/pages/login/index' })
      }
    })
  }
})
