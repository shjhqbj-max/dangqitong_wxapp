// 发单页（发布工单）
import authGuard from '../../behaviors/auth-guard'
import * as ordersApi from '../../apis/orders'
import { PROFESSIONS } from '../../constants/professions'
import { ProfessionSlot } from '../../mock/types'

// 时间多列选择器数据
var _hours: string[] = []
var _minutes: string[] = []
for (var _i = 0; _i < 24; _i++) { _hours.push(String(_i).padStart(2, '0')) }
for (var _j = 0; _j < 60; _j += 5) { _minutes.push(String(_j).padStart(2, '0')) }
var TIME_RANGES = [_hours, _minutes, _hours, _minutes]

Page({
  behaviors: [authGuard],

  data: {
    form: {
      title: '',
      date: '',
      start_time: '08:00',
      end_time: '18:00',
      location: '',
      contact: '',
      description: '',
      deadline: ''
    },
    // 多职业槽位
    professionSlots: [] as Array<{ profession: string, price: string, need_count: string }>,
    selectedProSet: {} as Record<string, boolean>,
    professionLabel: '请选择',
    totalPrice: 0,
    showProSheet: false,
    professions: PROFESSIONS,
    loading: false,
    heroH: 0,
    timeRanges: TIME_RANGES,
    timeValues: [8, 0, 18, 0]
  },

  onLoad() {
    var d = this._getToday()
    var deadline = new Date()
    deadline.setDate(deadline.getDate() + 3)
    var dl = deadline.getFullYear() + '-' + String(deadline.getMonth() + 1).padStart(2, '0') + '-' + String(deadline.getDate()).padStart(2, '0') + 'T18:00:00'

    this.setData({
      'form.date': d,
      'form.deadline': dl
    })
  },

  onReady() {
    this._measureHero()
  },

  _getToday(): string {
    var today = new Date()
    return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
  },

  _measureHero() {
    var self = this
    setTimeout(function () {
      wx.createSelectorQuery().select('.publish-hero').boundingClientRect(function (rect: any) {
        if (!rect) return
        var rpx = Math.ceil(rect.height * 750 / wx.getSystemInfoSync().windowWidth)
        self.setData({ heroH: rpx })
      }).exec()
    }, 200)
  },

  _recalcLabel() {
    var slots = this.data.professionSlots
    var labels = slots.map(function(s) { return s.profession })
    var label = labels.length > 0 ? (labels.length >= 2 ? '多职业' : labels.join('、')) : '请选择'
    var total = 0
    for (var i = 0; i < slots.length; i++) {
      total += (parseFloat(slots[i].price) || 0) * (parseInt(slots[i].need_count) || 1)
    }
    this.setData({ professionLabel: label, totalPrice: total })
  },

  // ====== Hero 事件 ======

  onDateChange(e: any) {
    this.setData({ 'form.date': e.detail.value })
  },

  onTimeChange(e: any) {
    var val = e.detail.value
    var sh = _hours[val[0]] || '08'
    var sm = _minutes[val[1]] || '00'
    var eh = _hours[val[2]] || '18'
    var em = _minutes[val[3]] || '00'
    this.setData({
      'form.start_time': sh + ':' + sm,
      'form.end_time': eh + ':' + em,
      timeValues: val
    })
  },

  // ====== 职业多选 ======

  onToggleProSheet() {
    this.setData({ showProSheet: !this.data.showProSheet })
  },

  onCloseProSheet() {
    this.setData({ showProSheet: false })
  },

  onProfessionSelect(e: any) {
    var label = e.currentTarget.dataset.value
    var selected = this.data.selectedProSet
    var slots = this.data.professionSlots.slice()

    if (selected[label]) {
      // 取消选中
      delete selected[label]
      slots = slots.filter(function(s) { return s.profession !== label })
    } else {
      // 选中
      selected[label] = true
      slots.push({ profession: label, price: '', need_count: '1' })
    }

    this.setData({ selectedProSet: selected, professionSlots: slots })
    this._recalcLabel()
  },

  onSlotPriceInput(e: any) {
    var idx = e.currentTarget.dataset.idx
    var slots = this.data.professionSlots.slice()
    slots[idx] = Object.assign({}, slots[idx], { price: e.detail.value })
    this.setData({ professionSlots: slots })
    this._recalcLabel()
  },

  onSlotCountInput(e: any) {
    var idx = e.currentTarget.dataset.idx
    var slots = this.data.professionSlots.slice()
    slots[idx] = Object.assign({}, slots[idx], { need_count: e.detail.value })
    this.setData({ professionSlots: slots })
    this._recalcLabel()
  },

  onRemoveSlot(e: any) {
    var idx = e.currentTarget.dataset.idx
    var slots = this.data.professionSlots.slice()
    var removed = slots.splice(idx, 1)[0]
    var selected = this.data.selectedProSet
    delete selected[removed.profession]
    this.setData({ selectedProSet: selected, professionSlots: slots })
    this._recalcLabel()
  },

  // ====== 表单事件 ======

  onFieldInput(e: any) {
    var field = e.currentTarget.dataset.field
    this.setData({ ['form.' + field]: e.detail.value })
  },

  onChooseLocation() {
    wx.chooseLocation({
      success: (res: any) => {
        this.setData({ 'form.location': res.address || res.name || '' })
      }
    })
  },

  onDeadlineChange(e: any) {
    this.setData({ 'form.deadline': e.detail.value + 'T18:00:00' })
  },

  // ====== 保存 ======

  validate(): boolean {
    var form = this.data.form
    if (!form.title) {
      wx.showToast({ title: '请输入标题', icon: 'none' })
      return false
    }
    if (!form.date) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return false
    }
    if (this.data.professionSlots.length === 0) {
      wx.showToast({ title: '请选择至少一个职业', icon: 'none' })
      return false
    }
    if (!form.location) {
      wx.showToast({ title: '请输入地点', icon: 'none' })
      return false
    }
    return true
  },

  async onSave() {
    if (!this.validate()) return
    if (this.data.loading) return
    this.setData({ loading: true })

    var form = this.data.form
    var slots: ProfessionSlot[] = this.data.professionSlots.map(function(s) {
      return {
        profession: s.profession,
        price: parseFloat(s.price) || 0,
        need_count: parseInt(s.need_count) || 1,
        filled_count: 0
      }
    })
    var total = 0
    for (var k = 0; k < slots.length; k++) {
      total += slots[k].price * slots[k].need_count
    }

    try {
      var res = await ordersApi.createOrder({
        title: form.title,
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
        location: form.location,
        profession_slots: slots,
        total_price: total,
        contact: form.contact,
        description: form.description,
        deadline: form.deadline
      })

      if (res.code === 200) {
        wx.showToast({ title: '发布成功', icon: 'none' })
        setTimeout(function () { wx.navigateBack() }, 800)
      } else {
        wx.showToast({ title: res.message || '发布失败', icon: 'none' })
      }
    } catch {
      wx.showToast({ title: '操作异常，请重试', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  onCancel() {
    wx.navigateBack()
  }
})
