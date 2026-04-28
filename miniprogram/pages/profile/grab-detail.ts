// 抢单详情页
import authGuard from '../../behaviors/auth-guard'
import * as ordersApi from '../../apis/orders'
import { Order } from '../../mock/types'

Page({
  behaviors: [authGuard],

  data: {
    orderId: '',
    order: null as Order | null,
    grabbers: [] as NonNullable<Order['grabbers']>,
    expandedIdx: -1
  },

  onLoad(options: any) {
    this.setData({ orderId: options.orderId || '' })
    this.loadData()
  },

  async loadData() {
    var res = await ordersApi.getOrderDetail(this.data.orderId)
    if (res.code === 200) {
      var order = res.data
      this.setData({
        order: order,
        grabbers: order.grabbers || []
      })
    }
  },

  onGrabberTap(e: any) {
    // 暂不跳转
  },

  onPriceTap(e: any) {
    var idx = e.currentTarget.dataset.idx
    this.setData({ expandedIdx: this.data.expandedIdx === idx ? -1 : idx })
  },

  onAcceptTap(e: any) {
    var idx = e.currentTarget.dataset.idx
    this.setData({ expandedIdx: -1 })
    this.doAccept(idx)
  },

  onRejectTap(e: any) {
    var idx = e.currentTarget.dataset.idx
    this.setData({ expandedIdx: -1 })
    this.doReject(idx)
  },

  onCloseTap(e: any) {
    this.setData({ expandedIdx: -1 })
  },

  doAccept(idx: number) {
    var grabber = this.data.grabbers[idx]
    if (!grabber) return
    wx.showModal({
      title: '接受抢单',
      content: '确认接受 ' + grabber.nickname + ' 的抢单请求？',
      success: (res) => {
        if (!res.confirm) return
        var list = this.data.grabbers.slice()
        list[idx] = Object.assign({}, list[idx], { grab_status: 'accepted' })
        // 同职业岗位满人 → 其余待处理自动回拒
        var order = this.data.order
        if (order && order.profession_slots) {
          var slot = order.profession_slots.find(function(s) { return s.profession === grabber.grabbed_profession })
          if (slot) {
            slot.filled_count = (slot.filled_count || 0) + 1
            if (slot.filled_count >= slot.need_count) {
              for (var i = 0; i < list.length; i++) {
                if (i !== idx && !list[i].grab_status && list[i].grabbed_profession === grabber.grabbed_profession) {
                  list[i] = Object.assign({}, list[i], { grab_status: 'rejected' })
                }
              }
            }
          }
        }
        this.setData({ grabbers: list })
        wx.showToast({ title: '已接受', icon: 'success' })
      }
    })
  },

  doReject(idx: number) {
    var grabber = this.data.grabbers[idx]
    if (!grabber) return
    wx.showModal({
      title: '回拒抢单',
      content: '确认回拒 ' + grabber.nickname + ' 的抢单请求？',
      success: (res) => {
        if (!res.confirm) return
        var list = this.data.grabbers.slice()
        list[idx] = Object.assign({}, list[idx], { grab_status: 'rejected' })
        this.setData({ grabbers: list })
        wx.showToast({ title: '已回拒', icon: 'none' })
      }
    })
  },

  onDelete() {
    wx.showModal({
      title: '删除工单',
      content: '确定删除该工单？删除后无法恢复。',
      success: (res) => {
        if (!res.confirm) return
        wx.showToast({ title: '已删除', icon: 'success' })
        setTimeout(function() { wx.navigateBack() }, 1500)
      }
    })
  }
})
