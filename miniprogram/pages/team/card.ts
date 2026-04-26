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

function formatCardDate(dateStr: string): string {
  if (!dateStr) return ''
  const m = dateStr.substring(5, 7).replace(/^0/, '')
  const d = dateStr.substring(8, 10).replace(/^0/, '')
  return m + '/' + d
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return ''
  const t = new Date(dateStr).getTime()
  const now = Date.now()
  const diff = now - t
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 2592000000) return Math.floor(diff / 86400000) + '天前'
  return Math.floor(diff / 2592000000) + '月前'
}

Page({
  data: {
    card: null as ScheduleCard | null,
    bgGradient: '',
    loading: true
  },

  onLoad(options: any) {
    const userId = options.userId || ''
    if (!userId) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    this.loadCard(userId)
  },

  async loadCard(userId: string) {
    const res = await cardApi.getScheduleCard(userId)
    if (res.code !== 200 || !res.data) {
      this.setData({ loading: false })
      return
    }
    const card = res.data
    const bgGradient = proGradients[card.profession] || proGradients['摄影']
    this.setData({ card, bgGradient, loading: false })
  },

  onBack() {
    wx.navigateBack()
  },

  async onSaveImage() {
    if (!this.data.card) return
    wx.showLoading({ title: '生成中...' })
    try {
      const res = await cardApi.getCardImage(this.data.card.user_id)
      if (res.code === 200 && res.data.image_url) {
        const dlRes = await wx.downloadFile({ url: res.data.image_url })
        await wx.saveImageToPhotosAlbum({ filePath: dlRes.tempFilePath })
        wx.showToast({ title: '已保存到相册', icon: 'none' })
      } else {
        wx.showToast({ title: '图片生成中，请稍后', icon: 'none' })
      }
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
    wx.hideLoading()
  },

  onShareAppMessage() {
    const card = this.data.card
    return {
      title: card ? card.nickname + '的档期卡' : '档期卡',
      path: '/pages/team/card?userId=' + (card ? card.user_id : '')
    }
  }
})
