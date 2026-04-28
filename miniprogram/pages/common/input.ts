// 公共输入页
import authGuard from '../../behaviors/auth-guard'
import * as cardApi from '../../apis/card'

Page({
  behaviors: [authGuard],
  data: {
    title: '',
    type: 'text',
    value: '',
    saveAction: 'back' as 'back' | 'card',
    // work 模式
    imageUrl: '',
    workTitle: '',
    // post 模式
    videoUrl: '',
    saving: false
  },

  onLoad(options: any) {
    const type = options.type || 'text'
    const saveAction = options.saveAction || 'back'
    let title = decodeURIComponent(options.title || '输入')

    if (type === 'work') title = '发布作品'
    if (type === 'post') title = '发布视频'

    const value = decodeURIComponent(options.value || '')
    const imageUrl = decodeURIComponent(options.imageUrl || '')

    this.setData({ title, type, value, saveAction, imageUrl })
    wx.setNavigationBarTitle({ title })
  },

  // ====== work: 选图 ======
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempUrl = res.tempFiles[0].tempFilePath
        this.setData({ imageUrl: tempUrl })
      },
      fail: () => {
        // 用户取消选图，留在当前页
      }
    })
  },

  onReplaceImage() {
    this.chooseImage()
  },

  onWorkTitleInput(e: any) {
    this.setData({ workTitle: e.detail.value })
  },

  // ====== post: 视频链接 ======
  onVideoUrlInput(e: any) {
    this.setData({ videoUrl: e.detail.value })
  },

  // ====== 通用输入 ======
  onInput(e: any) {
    this.setData({ value: e.detail.value })
  },

  onClear() {
    this.setData({ value: '' })
  },

  onClearVideo() {
    this.setData({ videoUrl: '' })
  },

  // ====== 保存 ======
  async onSave() {
    const { type, saveAction } = this.data

    if (saveAction === 'card') {
      if (type === 'work') {
        await this.saveWork()
      } else if (type === 'post') {
        await this.savePost()
      }
      return
    }

    // 默认: eventChannel 回传
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('inputSaved', { value: this.data.value })
    wx.navigateBack()
  },

  async saveWork() {
    const { imageUrl, workTitle } = this.data
    if (!imageUrl) {
      wx.showToast({ title: '请选择图片', icon: 'none' })
      return
    }
    this.setData({ saving: true })
    try {
      const res = await cardApi.publishWork({
        image_url: imageUrl,
        title: workTitle
      })
      if (res.code === 200) {
        wx.showToast({ title: '发布成功', icon: 'none' })
        this.goToCard()
      } else {
        wx.showToast({ title: '发布失败', icon: 'none' })
      }
    } catch {
      wx.showToast({ title: '发布异常', icon: 'none' })
    } finally {
      this.setData({ saving: false })
    }
  },

  async savePost() {
    const { videoUrl } = this.data
    if (!videoUrl) {
      wx.showToast({ title: '请输入视频链接', icon: 'none' })
      return
    }
    this.setData({ saving: true })
    try {
      const res = await cardApi.publishPost({ video_url: videoUrl })
      if (res.code === 200) {
        wx.showToast({ title: '发布成功', icon: 'none' })
        this.goToCard()
      } else {
        wx.showToast({ title: '发布失败', icon: 'none' })
      }
    } catch {
      wx.showToast({ title: '发布异常', icon: 'none' })
    } finally {
      this.setData({ saving: false })
    }
  },

  goToCard() {
    const userInfo = wx.getStorageSync('userInfo')
    const userId = userInfo ? userInfo.id : ''
    if (!userId) {
      wx.showToast({ title: '未获取用户信息', icon: 'none' })
      return
    }
    wx.redirectTo({ url: '/pages/team/card?userId=' + userId })
  }
})
