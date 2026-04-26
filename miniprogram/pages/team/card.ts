// 档期卡页面
import * as cardApi from '../../apis/card'
import { ScheduleCard } from '../../mock/types'

// 职业 → 渐变色
const proGradients: Record<string, string> = {
  '摄影': 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #1a4a7a 100%)',
  '摄像': 'linear-gradient(135deg, #2c1654 0%, #5b3a8a 50%, #3d2066 100%)',
  '化妆': 'linear-gradient(135deg, #5c1a3a 0%, #a0366e 50%, #7a2852 100%)',
  '主持': 'linear-gradient(135deg, #5c3a1a 0%, #c07830 50%, #8a5520 100%)',
  '花艺': 'linear-gradient(135deg, #1a4a2a 0%, #2d8a4a 50%, #1e6a36 100%)',
  '灯光': 'linear-gradient(135deg, #4a3a1a 0%, #a08030 50%, #7a6020 100%)',
  '督导': 'linear-gradient(135deg, #1a3a4a 0%, #2d7090 50%, #1e5a7a 100%)',
  '场布': 'linear-gradient(135deg, #3a2a4a 0%, #7a5a9a 50%, #5a3a7a 100%)',
  '车队': 'linear-gradient(135deg, #2a3a1a 0%, #5a7a2a 50%, #3a5a1e 100%)',
  '演出': 'linear-gradient(135deg, #4a1a1a 0%, #9a3030 50%, #7a2424 100%)'
}

Page({
  data: {
    card: null as ScheduleCard | null,
    bgGradient: '',
    loading: true,
    heroPaddingTop: '',
    showWorksFull: false
  },

  onLoad(options: any) {
    const userId = options.userId || ''
    if (!userId) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    const windowInfo = wx.getWindowInfo()
    this.setData({ heroPaddingTop: windowInfo.statusBarHeight + 'px' })
    this.loadCard(userId)
  },

  async loadCard(userId: string) {
    try {
      const res = await cardApi.getScheduleCard(userId)
      if (res.code !== 200 || !res.data) {
        this.setData({ loading: false })
        return
      }
      const card = res.data
      const bgGradient = proGradients[card.profession] || proGradients['摄影']
      this.setData({ card, bgGradient, loading: false })
    } catch (e) {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  onBack() {
    wx.navigateBack()
  },

  onBookSchedule() {
    // TODO: 跳转私聊详情页，目前聊天页为骨架，先切换到消息tab
    wx.switchTab({ url: '/pages/chat/list' })
  },

  async onShareCard() {
    if (!this.data.card) return
    wx.showLoading({ title: '生成中...' })
    try {
      const res = await cardApi.getCardImage(this.data.card.user_id)
      if (res.code !== 200 || !res.data.image_url) {
        wx.showToast({ title: '图片生成中，请稍后', icon: 'none' })
        return
      }
      const dlRes = await wx.downloadFile({ url: res.data.image_url })
      if (dlRes.statusCode === 200) {
        wx.shareImageMessage({
          imagePath: dlRes.tempFilePath
        })
      }
    } catch (e) {
      wx.showToast({ title: '分享失败', icon: 'none' })
    }
    wx.hideLoading()
  },

  onExpandWorks() {
    this.setData({ showWorksFull: true })
  },

  onCloseWorksFull() {
    this.setData({ showWorksFull: false })
  },

  onShareAppMessage() {
    const card = this.data.card
    return {
      title: card ? card.nickname + '的档期卡' : '档期卡',
      path: '/pages/team/card?userId=' + (card ? card.user_id : '')
    }
  }
})
