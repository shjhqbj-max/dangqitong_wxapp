Component({
  data: {
    active: 0,
    visible: true,
    showSheet: false,
    bgColor: (wx.getAppBaseInfo().theme || 'light') === 'dark' ? '#0F172A' : '#F8FAFC',
    showGradient: false,
    msgDot: false,
    list: [
      { pagePath: '/pages/schedule/index', text: '档期', iconPath: '/images/tab/schedule.png', selectedIconPath: '/images/tab/schedule-active.png' },
      { pagePath: '/pages/team/list', text: '团队', iconPath: '/images/tab/team.png', selectedIconPath: '/images/tab/team-active.png' },
      { pagePath: '/pages/chat/list', text: '消息', iconPath: '/images/tab/message.png', selectedIconPath: '/images/tab/message-active.png' },
      { pagePath: '/pages/profile/index', text: '我的', iconPath: '/images/tab/profile.png', selectedIconPath: '/images/tab/profile-active.png' }
    ]
  },

  lifetimes: {
    attached() {
      wx.onThemeChange((res) => {
        this.setData({ bgColor: res.theme === 'dark' ? '#0F172A' : '#F8FAFC' })
      })
    }
  },

  methods: {
    switchTab(e: any) {
      const idx = e.currentTarget.dataset.index
      const url = this.data.list[idx].pagePath
      this.setData({ active: idx })
      wx.switchTab({ url })
    },

    onAdd() {
      this.setData({ showSheet: true })
    },

    onCloseSheet() {
      this.setData({ showSheet: false })
    },

    onAddAction(e: any) {
      const action = e.currentTarget.dataset.action
      this.setData({ showSheet: false })

      switch (action) {
        case 'schedule':
          wx.navigateTo({ url: '/pages/schedule/edit' })
          break
        case 'schedule-order':
          wx.navigateTo({ url: '/pages/orders/publish' })
          break
        case 'schedule-share':
          const shareInfo = wx.getStorageSync('userInfo')
          const shareId = shareInfo ? shareInfo.id : ''
          if (shareId) {
            wx.navigateTo({ url: '/pages/team/card?userId=' + shareId })
          } else {
            wx.showToast({ title: '请先登录', icon: 'none' })
          }
          break
        case 'work':
          wx.navigateTo({ url: '/pages/common/input?type=work&saveAction=card' })
          break
        case 'post':
          wx.navigateTo({ url: '/pages/common/input?type=post&saveAction=card' })
          break
      }
    }
  }
})
