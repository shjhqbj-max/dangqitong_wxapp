// 公共输入页
import authGuard from '../../behaviors/auth-guard'

Page({
  behaviors: [authGuard],
  data: {
    title: '',
    type: 'text',
    value: ''
  },

  onLoad(options: any) {
    const title = decodeURIComponent(options.title || '输入')
    const type = options.type || 'text'
    const value = decodeURIComponent(options.value || '')
    this.setData({ title, type, value })
    wx.setNavigationBarTitle({ title })
  },

  onInput(e: any) {
    this.setData({ value: e.detail.value })
  },

  onClear() {
    this.setData({ value: '' })
  },

  onSave() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('inputSaved', { value: this.data.value })
    wx.navigateBack()
  }
})
