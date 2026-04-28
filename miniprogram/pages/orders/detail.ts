// 订单详情页
import authGuard from '../../behaviors/auth-guard'
import * as ordersApi from '../../apis/orders'
import * as chatApi from '../../apis/chat'
import { Order, ProfessionSlot } from '../../mock/types'

const STATUS_MAP: Record<string, string> = { active: '进行中', grabbed: '已抢单', closed: '已关闭', completed: '已完成' }

// 当前用户的职业列表（实际应从用户信息获取）
const MY_PROFESSIONS: string[] = ['摄影', '摄像']

Page({
  behaviors: [authGuard],

  data: {
    orderId: '',
    order: {} as Partial<Order>,
    statusLabel: '',
    isMine: false,
    hasGrabbed: false,
    professionMatch: false,
    matchedSlots: [] as ProfessionSlot[],
    isGuest: true,
    heroH: 0,
    // 抢单表单
    showGrabForm: false,
    grabProfession: '',
    grabFormPrice: '',
    grabFormIntro: ''
  },

  onLoad(options: any) {
    var id = options.id || ''
    if (!id) {
      wx.navigateBack()
      return
    }
    var token = wx.getStorageSync('token')
    this.setData({ orderId: id, isGuest: !token })
    this.loadOrder(id)
  },

  onReady() {
    this._measureHero()
  },

  onShow() {
    var token = wx.getStorageSync('token')
    var wasGuest = this.data.isGuest
    this.setData({ isGuest: !token })
    if (wasGuest && token) {
      this.loadOrder(this.data.orderId)
    }
  },

  _measureHero() {
    var self = this
    setTimeout(function () {
      wx.createSelectorQuery().select('.detail-hero').boundingClientRect(function (rect: any) {
        if (!rect) return
        var rpx = Math.ceil(rect.height * 750 / wx.getSystemInfoSync().windowWidth)
        self.setData({ heroH: rpx })
      }).exec()
    }, 200)
  },

  async loadOrder(id: string) {
    const res = await ordersApi.getOrderDetail(id)
    if (res.code === 200) {
      const o = res.data
      const isMine = o.publisher.user_id === 'u-001'
      const hasGrabbed = !!(o.grabbers && o.grabbers.find(function(g) { return g.user_id === 'u-001' }))

      // 查找用户可抢的角色（职业匹配 + 未满）
      var matched: ProfessionSlot[] = []
      if (o.profession_slots) {
        for (var i = 0; i < o.profession_slots.length; i++) {
          var slot = o.profession_slots[i]
          if (MY_PROFESSIONS.indexOf(slot.profession) >= 0 && slot.filled_count < slot.need_count) {
            matched.push(slot)
          }
        }
      }

      this.setData({
        order: o,
        statusLabel: STATUS_MAP[o.status] || o.status,
        isMine: isMine,
        hasGrabbed: hasGrabbed,
        professionMatch: matched.length > 0,
        matchedSlots: matched
      })
      this._measureHero()
    }
  },

  onGrab() {
    if (this.data.isGuest) {
      wx.navigateTo({ url: '/pages/login/index?redirect=' + encodeURIComponent('/pages/orders/detail?id=' + this.data.orderId) })
      return
    }
    if (this.data.hasGrabbed || this.data.isMine) return
    if (!this.data.professionMatch) {
      wx.showModal({
        title: '职业不匹配',
        content: '该工单没有你可抢的角色，你的职业不匹配或角色已满。',
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }

    var matched = this.data.matchedSlots

    if (matched.length === 1) {
      this._openGrabForm(matched[0].profession, matched[0].price)
    } else {
      // 多个可抢角色，弹出选择
      var items = matched.map(function(s) { return s.profession + ' ¥' + s.price })
      var self = this
      wx.showActionSheet({
        itemList: items,
        success: function(res) {
          var slot = matched[res.tapIndex]
          self._openGrabForm(slot.profession, slot.price)
        }
      })
    }
  },

  _openGrabForm(profession: string, defaultPrice: number) {
    this.setData({
      showGrabForm: true,
      grabProfession: profession,
      grabFormPrice: defaultPrice > 0 ? String(defaultPrice) : '',
      grabFormIntro: ''
    })
  },

  onCancelGrabForm() {
    this.setData({ showGrabForm: false })
  },

  onGrabFormPriceInput(e: any) {
    this.setData({ grabFormPrice: e.detail.value })
  },

  onGrabFormIntroInput(e: any) {
    this.setData({ grabFormIntro: e.detail.value })
  },

  async onSubmitGrab() {
    var price = Number(this.data.grabFormPrice) || 0
    var intro = this.data.grabFormIntro.trim()
    var profession = this.data.grabProfession

    this.setData({ showGrabForm: false })

    var res = await ordersApi.grabOrder(this.data.orderId, profession, price, intro)
    if (res.code === 200) {
      this.setData({ hasGrabbed: true })
      wx.showToast({ title: '抢单成功', icon: 'none' })
      this._createGrabChat(profession)
      this.loadOrder(this.data.orderId)
    }
  },

  async _createGrabChat(profession: string) {
    try {
      var o = this.data.order
      if (!o || !o.title) return
      var dateStr = o.date || ''
      var expireAt = ''
      if (dateStr) {
        var d = new Date(dateStr.replace(/-/g, '/'))
        d.setDate(d.getDate() + 1)
        expireAt = d.toISOString()
      }
      var memberIds = ['u-001'] // 当前用户（抢单者）
      if (o.publisher && o.publisher.user_id) {
        memberIds.unshift(o.publisher.user_id)
      }
      chatApi.createChat({
        chat_type: 'schedule_temp',
        chat_name: o.title + '·工单群',
        member_ids: memberIds,
        expire_at: expireAt
      })
    } catch (e) { /* 静默 */ }
  },

  onCallPhone() {
    var contact = this.data.order.contact
    if (contact) {
      wx.makePhoneCall({ phoneNumber: contact })
    }
  },

  onShare() {
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: this.data.order.title || '工单详情',
      path: '/pages/orders/detail?id=' + this.data.orderId
    }
  }
})
