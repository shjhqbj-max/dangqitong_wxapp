import authGuard from '../../behaviors/auth-guard'
import * as scheduleApi from '../../apis/schedule'
import { Schedule } from '../../mock/types'

const STATUS_LABELS: Record<string, string> = { confirmed: '已定', pending: '预定', rest: '休息' }

Page({
  behaviors: [authGuard],

  data: {
    keyword: '',
    searchFocused: false,
    loading: false,
    resultList: [] as Schedule[],
    _searchTimer: null as any
  },

  onSearchInput(e: any) {
    const keyword = e.detail.value
    this.setData({ keyword })

    if (this.data._searchTimer) clearTimeout(this.data._searchTimer)
    const timer = setTimeout(() => {
      this.doSearch(keyword)
    }, 300)
    this.setData({ _searchTimer: timer })
  },

  async doSearch(keyword: string) {
    const kw = keyword.trim()
    if (!kw) {
      this.setData({ resultList: [] })
      return
    }

    this.setData({ loading: true })

    try {
      const res = await scheduleApi.searchSchedules(kw)
      if (res.code === 200) {
        this.setData({ resultList: res.data.list })
      }
    } finally {
      this.setData({ loading: false })
    }
  },

  onSearchFocus() {
    this.setData({ searchFocused: true })
  },

  onSearchBlur() {
    this.setData({ searchFocused: false })
  },

  onClear() {
    this.setData({ keyword: '', resultList: [] })
  },

  onResultTap(e: any) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/schedule/detail?id=' + id })
  },

  getStatusText(status: string): string {
    return STATUS_LABELS[status] || status
  },

  getCompletionText(status: string): string {
    const map: Record<string, string> = { completed: '已完成', uncompleted: '未完成', delayed: '延期', cancelled: '已取消' }
    return map[status] || status
  }
})
