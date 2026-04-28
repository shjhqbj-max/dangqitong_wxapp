// 我的档期页
import authGuard from '../../behaviors/auth-guard'
import * as scheduleApi from '../../apis/schedule'
import { Schedule } from '../../mock/types'

Page({
  behaviors: [authGuard],

  data: {
    navBarHeight: 0,
    scheduleList: [] as Schedule[],
    stats: { total: 0, confirmed: 0, pending: 0, rest: 0 },
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
    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var res = await scheduleApi.getScheduleList(year, month, 1, 20)
    if (res.code === 200) {
      var list = res.data.list
      this.setData({
        scheduleList: list,
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
    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var nextPage = this.data.page + 1
    var res = await scheduleApi.getScheduleList(year, month, nextPage, 20)
    if (res.code === 200) {
      this.setData({
        scheduleList: this.data.scheduleList.concat(res.data.list),
        page: nextPage,
        hasMore: res.data.hasMore,
        loadingMore: false
      })
    } else {
      this.setData({ loadingMore: false })
    }
  },

  _calcStats(list: Schedule[]) {
    var confirmed = 0
    var pending = 0
    var rest = 0
    for (var i = 0; i < list.length; i++) {
      if (list[i].status === 'confirmed') confirmed++
      else if (list[i].status === 'pending') pending++
      else if (list[i].status === 'rest') rest++
    }
    return { total: list.length, confirmed: confirmed, pending: pending, rest: rest }
  },

  onNavBarHeight(e: any) {
    this.setData({ navBarHeight: e.detail.height })
  },

  onScheduleTap(e: any) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/schedule/detail?scheduleId=' + id })
  },

  onReachBottom() {
    this.loadMore()
  }
})
