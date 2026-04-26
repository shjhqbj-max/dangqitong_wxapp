// 登录守卫 Behavior：页面显示时检查登录态，白名单页面放行
export default Behavior({
  pageLifetimes: {
    show() {
      const token = wx.getStorageSync('token')
      if (token) return

      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      const currentRoute = page ? page.route || '' : ''

      // 白名单：不需要登录的页面
      const whiteList = [
        'pages/login/index',
        'pages/orders/detail'
      ]

      if (whiteList.includes(currentRoute)) return

      wx.reLaunch({ url: '/pages/login/index' })
    }
  }
})
