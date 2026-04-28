// 编辑资料页
import * as profileApi from '../../apis/profile'
import { UserProfile } from '../../mock/types'
import { PROFESSIONS } from '../../constants/professions'

Page({
  data: {
    profile: null as UserProfile | null,
    avatarUrl: '',
    showProPicker: false,
    tempPros: [] as string[],
    proOptions: PROFESSIONS,
    heroH: 0,
    displayPros: [] as string[],
    proOverflow: 0
  },

  onLoad() {
    this.loadData()
  },

  onReady() {
    this._measureHero()
  },

  _measureHero() {
    var self = this
    setTimeout(function () {
      wx.createSelectorQuery().select('.pe-hero').boundingClientRect(function (rect: any) {
        if (!rect) return
        var rpx = Math.ceil(rect.height * 750 / wx.getSystemInfoSync().windowWidth)
        self.setData({ heroH: rpx })
      }).exec()
    }, 200)
  },

  async loadData() {
    const res = await profileApi.getProfile()
    if (res.code === 200) {
      this.setData({
        profile: res.data,
        tempPros: [...(res.data.professions || [])]
      })
      this._measureHero()
      this._syncDisplayPros()
    }
  },

  // ====== 头像 ======
  onChangeAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      success: (res) => {
        const url = res.tempFiles[0].tempFilePath
        this.setData({ avatarUrl: url })
      }
    })
  },

  // ====== 昵称 ======
  onEditNickname() {
    const current = encodeURIComponent((this.data.profile ? this.data.profile.nickname : '') || '')
    wx.navigateTo({
      url: `/pages/common/input?title=${encodeURIComponent('昵称')}&type=text&value=${current}`,
      success: (res) => {
        res.eventChannel.on('inputSaved', (data: any) => {
          this.setData({ 'profile.nickname': data.value.trim() })
        })
      }
    })
  },

  // ====== 职业 ======
  onEditProfession() {
    this.setData({
      tempPros: [...(this.data.profile ? this.data.profile.professions : [])],
      showProPicker: true
    })
  },

  onTogglePro(e: any) {
    const label = e.currentTarget.dataset.label
    let pros = [...this.data.tempPros]
    const idx = pros.indexOf(label)
    if (idx >= 0) {
      pros.splice(idx, 1)
    } else {
      pros.push(label)
    }
    this.setData({ tempPros: pros })
  },

  onConfirmPro() {
    this.setData({
      'profile.professions': [...this.data.tempPros],
      showProPicker: false
    })
    this._syncDisplayPros()
  },

  _syncDisplayPros() {
    const pros = (this.data.profile ? this.data.profile.professions : []) || []
    if (pros.length <= 3) {
      this.setData({ displayPros: pros, proOverflow: 0 })
    } else {
      this.setData({ displayPros: pros.slice(0, 2), proOverflow: pros.length - 2 })
    }
  },

  onCloseProPicker() {
    this.setData({ showProPicker: false })
  },

  // ====== 收费 ======
  onEditPrice() {
    const current = encodeURIComponent((this.data.profile ? this.data.profile.price_desc : '') || '')
    wx.navigateTo({
      url: `/pages/common/input?title=${encodeURIComponent('收费')}&type=text&value=${current}`,
      success: (res) => {
        res.eventChannel.on('inputSaved', (data: any) => {
          this.setData({ 'profile.price_desc': data.value.trim() })
        })
      }
    })
  },

  // ====== 电话 ======
  onEditPhone() {
    const current = encodeURIComponent((this.data.profile ? this.data.profile.phone : '') || '')
    wx.navigateTo({
      url: `/pages/common/input?title=${encodeURIComponent('电话')}&type=phone&value=${current}`,
      success: (res) => {
        res.eventChannel.on('inputSaved', (data: any) => {
          this.setData({ 'profile.phone': data.value.trim() })
        })
      }
    })
  },

  // ====== 城市 ======
  onEditCity() {
    const current = encodeURIComponent((this.data.profile ? this.data.profile.city : '') || '')
    wx.navigateTo({
      url: `/pages/orders/city?city=${current}`,
      success: (res) => {
        res.eventChannel.on('citySelected', (data: any) => {
          this.setData({ 'profile.city': data.name })
        })
      }
    })
  },

  // ====== 个人简介 ======
  onEditBio() {
    const current = (this.data.profile ? this.data.profile.bio : '') || ''
    wx.showModal({
      title: '修改简介',
      editable: true,
      placeholderText: '请输入个人简介',
      content: current,
      success: (res) => {
        if (res.confirm) {
          this.setData({ 'profile.bio': res.content ? res.content.trim() : '' })
        }
      }
    })
  },

  // ====== 保存 ======
  async onSave() {
    const p = this.data.profile
    if (!p) return

    const data: Partial<UserProfile> = {
      nickname: p.nickname,
      professions: p.professions,
      price_desc: p.price_desc,
      phone: p.phone,
      city: p.city,
      bio: p.bio
    }
    if (this.data.avatarUrl) {
      data.avatar_url = this.data.avatarUrl
    }

    wx.showLoading({ title: '' })
    const res = await profileApi.updateProfile(data)
    wx.hideLoading()

    if (res.code === 200) {
      wx.showToast({ title: '保存成功', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
    } else {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  }
})
