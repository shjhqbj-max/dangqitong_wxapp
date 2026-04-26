// 消息列表页
import authGuard from '../../behaviors/auth-guard'
import * as chatApi from '../../apis/chat'
import { Chat, Notification } from '../../mock/types'

Page({
  behaviors: [authGuard],

  data: {
    chats: [] as Chat[],
    notifications: [] as Notification[],
    unreadNotiCount: 0,
    defaultAvatar: 'https://i.pravatar.cc/150?img=60',
    loading: false,
    showSearch: false,
    searchKey: '',
    navBarHeight: 0
  },

  onLoad() {
    const info = wx.getWindowInfo()
    this.setData({ navBarHeight: info.statusBarHeight + 44 })
    this.loadData()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: 2, bgColor: '#F8FAFC', showGradient: true })
    }
    this.loadData()
  },

  async loadData() {
    this.setData({ loading: true })
    const [chatRes, notiRes] = await Promise.all([
      chatApi.getChatList(),
      chatApi.getNotifications()
    ])

    const chats = chatRes.code === 200 ? chatRes.data : []
    const notifications = notiRes.code === 200 ? notiRes.data : []
    const unreadNotiCount = notifications.filter((n: Notification) => !n.is_read).length
    const chatUnread = chats.reduce((sum: number, c: Chat) => sum + c.unread_count, 0)
    const hasUnread = unreadNotiCount > 0 || chatUnread > 0

    this.setData({ chats, notifications, unreadNotiCount, loading: false })
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ msgDot: hasUnread })
    }
  },

  onChatTap(e: any) {
    const chatId = e.currentTarget.dataset.id
    if (!chatId) return
    wx.navigateTo({ url: '/pages/chat/detail?chatId=' + chatId })
  },

  onNotifyCardTap() {
    // 标记所有通知已读
    const notifications = this.data.notifications.map(n => {
      if (!n.is_read) {
        chatApi.markRead(n.notification_id)
        return Object.assign({}, n, { is_read: true })
      }
      return n
    })
    this.setData({ notifications, unreadNotiCount: 0 })
    wx.showToast({ title: '已读全部', icon: 'none' })
  },

  onNavBarHeight(e: any) {
    this.setData({ navBarHeight: e.detail.height })
  },

  onSearchTap() {
    this.setData({ showSearch: true })
  },

  onSearchClose() {
    this.setData({ showSearch: false, searchKey: '' })
  },

  onSearchInput(e: any) {
    this.setData({ searchKey: e.detail.value })
  },

  onSearchClear() {
    this.setData({ searchKey: '' })
  },

  onPullDownRefresh() {
    this.loadData().then(() => wx.stopPullDownRefresh())
  }
})
