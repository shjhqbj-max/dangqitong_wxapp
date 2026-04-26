// 公共输入页
Page({
  data: {
    title: '',
    type: 'text',
    value: '',
    navBarStyle: ''
  },

  onLoad(options: any) {
    const title = decodeURIComponent(options.title || '输入')
    const type = options.type || 'text'
    const value = decodeURIComponent(options.value || '')
    const windowInfo = wx.getWindowInfo()
    const navBarStyle = 'padding-top:' + windowInfo.statusBarHeight + 'px'
    this.setData({ title, type, value, navBarStyle })
    wx.setNavigationBarTitle({ title })
  },

  onInput(e: any) {
    this.setData({ value: e.detail.value })
  },

  onClear() {
    this.setData({ value: '' })
  },

  onBack() {
    wx.navigateBack()
  },

  onSave() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('inputSaved', { value: this.data.value })
    wx.navigateBack()
  }
})
