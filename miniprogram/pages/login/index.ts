import authGuard from '../../behaviors/auth-guard'
import * as authApi from '../../apis/auth'

Page({
  behaviors: [authGuard],
  data: {
    loading: false
  },

  goBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({ url: '/pages/schedule/index' })
    }
  },

  onLoad() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.goBack()
    }
  },

  async onGetPhoneNumber(e: any) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '授权失败', icon: 'none' })
      return
    }

    const phoneCode = e.detail.code
    if (!phoneCode) {
      wx.showToast({ title: '获取手机号失败，请重试', icon: 'none' })
      return
    }

    this.setData({ loading: true })

    try {
      const res = await authApi.loginByPhoneCode(phoneCode)
      if (res.code === 200) {
        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('userInfo', res.data.userInfo)
        wx.showToast({ title: '登录成功', icon: 'none' })
        setTimeout(() => {
          this.goBack()
        }, 800)
      } else {
        wx.showToast({ title: res.message || '登录失败', icon: 'none' })
      }
    } catch {
      wx.showToast({ title: '登录异常，请重试', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  onOpenAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议内容...',
      showCancel: false
    })
  },

  onOpenPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '这里是隐私政策内容...',
      showCancel: false
    })
  }
})
