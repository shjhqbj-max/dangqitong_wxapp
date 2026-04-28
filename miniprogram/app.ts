// app.ts
App<IAppOption>({
  globalData: {
    theme: 'light' as 'light' | 'dark'
  },

  onLaunch() {
    const appBaseInfo = wx.getAppBaseInfo()
    
    this.globalData.theme = appBaseInfo.theme || 'light'

    wx.onThemeChange((res) => {
      this.globalData.theme = res.theme
    })
  }
})
