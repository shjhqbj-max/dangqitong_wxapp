// 城市选择页
import authGuard from '../../behaviors/auth-guard'
import * as cityApi from '../../apis/city'
import { City, CityGroup } from '../../apis/city'

var CITY_CACHE_KEY = 'dqt_user_city'

Page({
  behaviors: [authGuard],

  data: {
    hotCities: [] as City[],
    cityGroups: [] as CityGroup[],
    letters: [] as string[],
    currentCityId: '',
    currentCityName: '',
    keyword: '',
    searchFocused: false,
    hiddenSidebar: false,
    scrollTo: '',
    showLetterToast: false,
    activeLetter: ''
  },

  _sidebarTop: 0,
  _sidebarItemHeight: 0,
  _toastTimer: null as any,
  _eventChannel: null as any,

  _passedCityName: '',

  onLoad(query: any) {
    this._eventChannel = this.getOpenerEventChannel()
    if (query.city) {
      this._passedCityName = decodeURIComponent(query.city)
      this.setData({ currentCityName: this._passedCityName })
    }
    this._loadCities()
    this._loadCurrentCity()
  },

  onReady() {
    var self = this
    wx.createSelectorQuery().select('.city-sidebar').boundingClientRect(function (rect: any) {
      if (!rect) return
      self._sidebarTop = rect.top
      self._sidebarItemHeight = rect.height / self.data.letters.length
    }).exec()
  },

  onNavBarHeight(e: any) {
    // nav-bar 高度回调（预留吸顶等场景）
  },

  // ===== 数据加载 =====

  async _loadCities() {
    var hotRes = await cityApi.getHotCities()
    if (hotRes.code === 200) {
      this.setData({ hotCities: hotRes.data })
    }
    var allRes = await cityApi.getAllCities()
    if (allRes.code === 200) {
      var letters: string[] = []
      for (var i = 0; i < allRes.data.length; i++) {
        letters.push(allRes.data[i].letter)
      }
      this.setData({ cityGroups: allRes.data, letters: letters })
    }
    // URL 传入的城市名 → 匹配 city_id 以高亮
    if (this._passedCityName && !this.data.currentCityId) {
      this._matchCityId(this._passedCityName)
    }
  },

  _loadCurrentCity() {
    // URL 已传入城市名时优先使用，不覆盖定位
    if (this._passedCityName) return
    var cache = wx.getStorageSync(CITY_CACHE_KEY)
    if (cache && cache.city_id && cache.name) {
      this.setData({ currentCityId: cache.city_id, currentCityName: cache.name })
      return
    }
    this._getLocation()
  },

  _matchCityId(name: string) {
    // 从热门城市中查找
    for (var i = 0; i < this.data.hotCities.length; i++) {
      if (this.data.hotCities[i].name === name) {
        this.setData({ currentCityId: this.data.hotCities[i].city_id })
        return
      }
    }
    // 从全部城市中查找
    for (var g = 0; g < this.data.cityGroups.length; g++) {
      for (var c = 0; c < this.data.cityGroups[g].cities.length; c++) {
        if (this.data.cityGroups[g].cities[c].name === name) {
          this.setData({ currentCityId: this.data.cityGroups[g].cities[c].city_id })
          return
        }
      }
    }
  },

  _getLocation() {
    var self = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        cityApi.reverseGeocode(res.latitude, res.longitude).then(function (geoRes) {
          if (geoRes.code === 200) {
            wx.setStorageSync(CITY_CACHE_KEY, { city_id: geoRes.data.city_id, name: geoRes.data.name })
            self.setData({ currentCityId: geoRes.data.city_id, currentCityName: geoRes.data.name })
          }
        })
      },
      fail: function () {
        self.setData({ currentCityName: '定位失败' })
      }
    })
  },

  // ===== 搜索 =====

  onSearch(e: any) {
    var keyword = e.detail.value
    if (!keyword) {
      this.setData({ keyword: '', hiddenSidebar: false })
      this._loadCities()
      return
    }
    var filtered: CityGroup[] = []
    for (var i = 0; i < this.data.cityGroups.length; i++) {
      var group = this.data.cityGroups[i]
      var cities: City[] = []
      for (var j = 0; j < group.cities.length; j++) {
        if (group.cities[j].name.indexOf(keyword) >= 0) {
          cities.push(group.cities[j])
        }
      }
      if (cities.length > 0) {
        filtered.push({ letter: group.letter, cities: cities })
      }
    }
    var letters: string[] = []
    for (var k = 0; k < filtered.length; k++) {
      letters.push(filtered[k].letter)
    }
    this.setData({ keyword: keyword, cityGroups: filtered, letters: letters, hiddenSidebar: true })
  },

  onSearchFocus() {
    this.setData({ searchFocused: true })
  },

  onSearchBlur() {
    this.setData({ searchFocused: false })
  },

  onClearSearch() {
    this.setData({ keyword: '', hiddenSidebar: false })
    this._loadCities()
  },

  // ===== 交互 =====

  onRelocate() {
    wx.removeStorageSync(CITY_CACHE_KEY)
    this.setData({ currentCityName: '定位中...' })
    this._getLocation()
  },

  onLetterTap(e: any) {
    var letter = e.currentTarget.dataset.letter
    this._jumpToLetter(letter)
  },

  onSidebarTouchMove(e: any) {
    var touch = e.touches[0]
    if (this._sidebarTop <= 0 || this._sidebarItemHeight <= 0) return
    this._handleSidebarTouch(touch.clientY)
  },

  _handleSidebarTouch(clientY: number) {
    var index = Math.floor((clientY - this._sidebarTop) / this._sidebarItemHeight)
    if (index < 0) index = 0
    if (index >= this.data.letters.length) index = this.data.letters.length - 1
    var letter = this.data.letters[index]
    if (letter !== this.data.activeLetter) {
      this._jumpToLetter(letter)
    }
  },

  _jumpToLetter(letter: string) {
    var self = this
    if (this._toastTimer) {
      clearTimeout(this._toastTimer)
    }
    this.setData({ scrollTo: 'letter-' + letter, showLetterToast: true, activeLetter: letter })
    this._toastTimer = setTimeout(function () {
      self.setData({ showLetterToast: false })
    }, 600)
  },

  onSelect(e: any) {
    var city = e.currentTarget.dataset.city
    if (this._eventChannel) {
      this._eventChannel.emit('citySelected', { city_id: city.city_id, name: city.name })
    }
    wx.navigateBack()
  },

  onSelectAll() {
    if (this._eventChannel) {
      this._eventChannel.emit('citySelected', { city_id: '', name: '' })
    }
    wx.navigateBack()
  }
})
