// 抢单列表页
import authGuard from '../../behaviors/auth-guard'
import * as ordersApi from '../../apis/orders'
import { Order } from '../../mock/types'

Page({
  behaviors: [authGuard],

  data: {
    navBarHeight: 0,
    orderList: [] as Order[],
    stats: { total: 0, active: 0, grabbed: 0, completed: 0 },
    loading: false,
    loadingMore: false,
    page: 1,
    hasMore: true
  },

  onLoad() {
    var info = wx.getWindowInfo()
    this.setData({ navBarHeight: info.statusBarHeight + 44 })
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  async loadData() {
    this.setData({ loading: true, page: 1, hasMore: true })
    var res = await ordersApi.getMyPublishedOrders(1, 20)
    if (res.code === 200) {
      var list = res.data.list
      this.setData({
        orderList: list,
        hasMore: res.data.hasMore,
        stats: this._calcStats(list),
        loading: false
      })
    } else {
      this.setData({ loading: false })
    }
  },

  async loadMore() {
    if (this.data.loadingMore || !this.data.hasMore) return
    this.setData({ loadingMore: true })
    var nextPage = this.data.page + 1
    var res = await ordersApi.getMyPublishedOrders(nextPage, 20)
    if (res.code === 200) {
      this.setData({
        orderList: this.data.orderList.concat(res.data.list),
        page: nextPage,
        hasMore: res.data.hasMore,
        loadingMore: false
      })
    } else {
      this.setData({ loadingMore: false })
    }
  },

  _calcStats(list: Order[]) {
    var active = 0
    var grabbed = 0
    var completed = 0
    for (var i = 0; i < list.length; i++) {
      if (list[i].status === 'active') active++
      else if (list[i].status === 'grabbed') grabbed++
      else if (list[i].status === 'completed') completed++
    }
    return { total: list.length, active: active, grabbed: grabbed, completed: completed }
  },

  onNavBarHeight(e: any) {
    this.setData({ navBarHeight: e.detail.height })
  },

  onOrderTap(e: any) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/profile/grab-detail?orderId=' + id })
  },

  onReachBottom() {
    this.loadMore()
  }
})
