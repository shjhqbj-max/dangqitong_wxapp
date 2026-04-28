// 工单广场页
import authGuard from '../../behaviors/auth-guard'
import * as ordersApi from '../../apis/orders'
import { Order } from '../../mock/types'
import { PROFESSIONS } from '../../constants/professions'

var PAGE_SIZE = 10

Page({
  behaviors: [authGuard],

  data: {
    orderList: [] as Order[],
    loading: false,
    loadingMore: false,
    hasMore: true,
    page: 1,
    // 筛选
    selectedCity: '',
    selectedProfession: '',
    selectedSort: '',
    sortLabel: '排序',
    professions: PROFESSIONS,
    sortOptions: [
      { value: '', label: '默认' },
      { value: 'price_desc', label: '价格从高到低' },
      { value: 'price_asc', label: '价格从低到高' }
    ],
    // 下拉面板
    showSortPicker: false,
    showProPicker: false,
    myOnly: false,
    // 导航栏
    navBarH: 0
  },

  onLoad() {
    this.loadOrders()
  },

  onReady() {
    this._measureHero()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      var theme = (wx.getSystemInfoSync().theme || 'light')
      this.getTabBar().setData({ active: 0, bgColor: theme === 'dark' ? '#0F172A' : '#F8FAFC', showGradient: true })
    }
  },

  onNavBarHeight(e: any) {
    this.setData({ navBarH: e.detail.height })
  },

  _measureHero() {
    var self = this
    setTimeout(function () {
      wx.createSelectorQuery().select('.square-hero').boundingClientRect(function (rect: any) {
        if (!rect) return
      }).exec()
    }, 200)
  },

  // ====== 数据加载 ======

  async loadOrders() {
    this.setData({ loading: true, page: 1 })
    var res
    if (this.data.myOnly) {
      res = await ordersApi.getMyGrabbedOrders()
      if (res.code === 200) {
        this.setData({ orderList: res.data.list, hasMore: false })
      }
    } else {
      res = await ordersApi.getOrderList({
        city: this.data.selectedCity || undefined,
        profession: this.data.selectedProfession || undefined,
        sort: this.data.selectedSort || undefined,
        page: 1,
        pageSize: PAGE_SIZE
      })
      if (res.code === 200) {
        this.setData({
          orderList: res.data.list,
          hasMore: res.data.hasMore
        })
      }
    }
    this.setData({ loading: false })
  },

  async loadMore() {
    if (this.data.loadingMore || !this.data.hasMore || this.data.myOnly) return
    this.setData({ loadingMore: true })
    var nextPage = this.data.page + 1
    var res = await ordersApi.getOrderList({
      city: this.data.selectedCity || undefined,
      profession: this.data.selectedProfession || undefined,
      sort: this.data.selectedSort || undefined,
      page: nextPage,
      pageSize: PAGE_SIZE
    })
    if (res.code === 200) {
      this.setData({
        orderList: this.data.orderList.concat(res.data.list),
        page: nextPage,
        hasMore: res.data.hasMore
      })
    }
    this.setData({ loadingMore: false })
  },

  onReachBottom() {
    this.loadMore()
  },

  // ====== 筛选面板 ======

  onGoCity() {
    var self = this
    var url = '/pages/orders/city'
    if (self.data.selectedCity) {
      url += '?city=' + encodeURIComponent(self.data.selectedCity)
    }
    wx.navigateTo({
      url: url,
      events: {
        citySelected: function (data: any) {
          if (data && data.name) {
            self.setData({ selectedCity: data.name })
          } else {
            self.setData({ selectedCity: '' })
          }
          self.loadOrders()
        }
      }
    })
  },

  onToggleSortPicker() {
    this.setData({ showSortPicker: !this.data.showSortPicker, showProPicker: false })
  },

  onToggleProPicker() {
    this.setData({ showProPicker: !this.data.showProPicker, showSortPicker: false })
  },

  onClosePickers() {
    this.setData({ showSortPicker: false, showProPicker: false })
  },

  onSortSelect(e: any) {
    var sort = e.currentTarget.dataset.value
    var label = '排序'
    for (var i = 0; i < this.data.sortOptions.length; i++) {
      if (this.data.sortOptions[i].value === sort) {
        label = this.data.sortOptions[i].label
        break
      }
    }
    this.setData({
      selectedSort: sort,
      sortLabel: label,
      showSortPicker: false
    })
    this.loadOrders()
  },

  onProfessionSelect(e: any) {
    var pro = e.currentTarget.dataset.value
    this.setData({ selectedProfession: pro, showProPicker: false })
    this.loadOrders()
  },

  onProfessionClear() {
    this.setData({ selectedProfession: '', showProPicker: false })
    this.loadOrders()
  },

  // ====== 列表交互 ======

  onOrderTap(e: any) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/orders/detail?id=' + id })
  },

  onMyGrabs() {
    this.setData({ myOnly: !this.data.myOnly })
    this.loadOrders()
  },

  onPublishOrder() {
    wx.navigateTo({ url: '/pages/orders/publish' })
  }
})
