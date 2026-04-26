// 档期编辑页（新建 / 编辑）
import authGuard from '../../behaviors/auth-guard'
import * as scheduleApi from '../../apis/schedule'
import { Schedule, ExtraContact } from '../../mock/types'

const STATUS_MAP: Record<string, string> = { confirmed: '已定', pending: '预定', rest: '休息' }
const PAYMENT_MAP: Record<string, string> = { paid: '已结清', unpaid: '未付', partial: '部分付' }

// 时间多列选择器数据
var _hours: string[] = []
var _minutes: string[] = []
for (var _i = 0; _i < 24; _i++) { _hours.push(String(_i).padStart(2, '0')) }
for (var _j = 0; _j < 60; _j += 5) { _minutes.push(String(_j).padStart(2, '0')) }
var TIME_RANGES = [_hours, _minutes, _hours, _minutes]

Page({
  behaviors: [authGuard],

  data: {
    isEdit: false,
    scheduleId: '',
    form: {
      date: '',
      start_time: '',
      end_time: '',
      status: 'confirmed' as 'confirmed' | 'pending' | 'rest',
      source: '',
      location: '',
      contact_name: '',
      contact_phone: '',
      extra_contacts: [] as ExtraContact[],
      total_price: '',
      paid_amount: '',
      payment_status: 'unpaid' as 'paid' | 'unpaid' | 'partial',
      completion_status: '' as 'completed' | 'uncompleted' | 'delayed' | '',
      notes: ''
    },
    statusLabel: '已定',
    paymentLabel: '未付',
    statusExpanded: false,
    heroH: 0,
    loading: false,
    timeRanges: TIME_RANGES,
    timeValues: [9, 0, 17, 0]
  },

  onLoad(options: any) {
    const id = options.id || ''
    const date = options.date || ''

    if (id) {
      // 编辑模式：携带 id → 加载档期数据回填
      this.setData({ isEdit: true, scheduleId: id })
      this.loadSchedule(id)
    } else {
      // 新建模式：携带 date 或默认今日
      var d = date || this._getToday()
      this.setData({
        isEdit: false,
        'form.date': d,
        statusLabel: STATUS_MAP['confirmed'],
        paymentLabel: PAYMENT_MAP['unpaid']
      })
    }
  },

  onReady() {
    this._measureHero()
  },

  _getToday(): string {
    var today = new Date()
    var y = today.getFullYear()
    var m = String(today.getMonth() + 1).padStart(2, '0')
    var d = String(today.getDate()).padStart(2, '0')
    return y + '-' + m + '-' + d
  },

  _measureHero() {
    var self = this
    setTimeout(function () {
      wx.createSelectorQuery().select('.edit-hero').boundingClientRect(function (rect: any) {
        if (!rect) return
        var rpx = Math.ceil(rect.height * 750 / wx.getSystemInfoSync().windowWidth)
        self.setData({ heroH: rpx })
      }).exec()
    }, 200)
  },

  async loadSchedule(id: string) {
    var res = await scheduleApi.getScheduleDetail(id)
    if (res.code === 200) {
      var s = res.data
      this.setData({
        'form.date': s.date || '',
        'form.start_time': s.start_time || '',
        'form.end_time': s.end_time || '',
        'form.status': s.status || 'confirmed',
        'form.source': s.source || '',
        'form.location': s.location || '',
        'form.contact_name': s.contact_name || '',
        'form.contact_phone': s.contact_phone || '',
        'form.extra_contacts': s.extra_contacts || [],
        'form.total_price': s.total_price ? String(s.total_price) : '',
        'form.paid_amount': s.paid_amount ? String(s.paid_amount) : '',
        'form.payment_status': s.payment_status || 'unpaid',
        'form.completion_status': s.completion_status || '',
        'form.notes': s.notes || '',
        statusLabel: STATUS_MAP[s.status] || s.status || '',
        paymentLabel: PAYMENT_MAP[s.payment_status] || s.payment_status || ''
      })
      this._measureHero()
      this._syncTimeValues()
    }
  },

  // ====== Hero 区域事件 ======

  onDateChange(e: any) {
    this.setData({ 'form.date': e.detail.value })
  },

  // 时间多列选择器
  onTimeChange(e: any) {
    var val = e.detail.value
    var sh = _hours[val[0]] || '09'
    var sm = _minutes[val[1]] || '00'
    var eh = _hours[val[2]] || '17'
    var em = _minutes[val[3]] || '00'
    this.setData({
      'form.start_time': sh + ':' + sm,
      'form.end_time': eh + ':' + em,
      timeValues: val
    })
  },

  _syncTimeValues() {
    var st = (this.data.form.start_time || '09:00').split(':')
    var et = (this.data.form.end_time || '17:00').split(':')
    var shIdx = _hours.indexOf(st[0])
    var smIdx = _minutes.indexOf(st[1])
    var ehIdx = _hours.indexOf(et[0])
    var emIdx = _minutes.indexOf(et[1])
    this.setData({
      timeValues: [
        shIdx >= 0 ? shIdx : 9,
        smIdx >= 0 ? smIdx : 0,
        ehIdx >= 0 ? ehIdx : 17,
        emIdx >= 0 ? emIdx : 0
      ]
    })
  },

  onStatusToggle() {
    this.setData({ statusExpanded: !this.data.statusExpanded })
  },

  onStatusSelect(e: any) {
    var val = e.currentTarget.dataset.value
    this.setData({
      'form.status': val,
      statusLabel: STATUS_MAP[val],
      statusExpanded: false
    })
  },

  // 付款状态自动判断
  _calcPaymentStatus() {
    var total = parseFloat(this.data.form.total_price) || 0
    var paid = parseFloat(this.data.form.paid_amount) || 0
    var status = 'unpaid'
    if (total > 0 && paid >= total) {
      status = 'paid'
    } else if (paid > 0) {
      status = 'partial'
    }
    this.setData({
      'form.payment_status': status,
      paymentLabel: PAYMENT_MAP[status]
    })
  },

  // ====== 场地信息事件 ======

  onFieldInput(e: any) {
    var field = e.currentTarget.dataset.field
    this.setData({ ['form.' + field]: e.detail.value })
    // 费用字段变化时自动计算付款状态
    if (field === 'total_price' || field === 'paid_amount') {
      this._calcPaymentStatus()
    }
  },

  // ====== 地址选择 ======

  onChooseLocation() {
    wx.chooseLocation({
      success: (res: any) => {
        this.setData({ 'form.location': res.address || res.name || '' })
      }
    })
  },

  // ====== 附加联系人事件 ======

  onAddContact() {
    var contacts = this.data.form.extra_contacts || []
    contacts.push({ role: '', name: '', phone: '' })
    this.setData({ 'form.extra_contacts': contacts })
  },

  onRemoveContact(e: any) {
    var idx = e.currentTarget.dataset.idx
    var contacts = this.data.form.extra_contacts || []
    contacts.splice(idx, 1)
    this.setData({ 'form.extra_contacts': contacts })
  },

  onContactInput(e: any) {
    var idx = e.currentTarget.dataset.idx
    var field = e.currentTarget.dataset.field
    var key = 'form.extra_contacts[' + idx + '].' + field
    this.setData({ [key]: e.detail.value })
  },

  // ====== 保存 / 取消 ======

  validate(): boolean {
    var form = this.data.form
    if (!form.date) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return false
    }
    if (form.start_time && form.end_time && form.start_time >= form.end_time) {
      wx.showToast({ title: '结束时间必须晚于开始时间', icon: 'none' })
      return false
    }
    return true
  },

  async onSave() {
    if (!this.validate()) return
    if (this.data.loading) return
    this.setData({ loading: true })

    var form = this.data.form
    var payload: Record<string, any> = {
      date: form.date,
      start_time: form.start_time,
      end_time: form.end_time,
      status: form.status,
      source: form.source,
      location: form.location,
      contact_name: form.contact_name,
      contact_phone: form.contact_phone,
      extra_contacts: form.extra_contacts,
      total_price: parseFloat(form.total_price) || 0,
      paid_amount: parseFloat(form.paid_amount) || 0,
      payment_status: form.payment_status,
      completion_status: form.completion_status,
      notes: form.notes
    }

    try {
      var res: any
      if (this.data.isEdit) {
        res = await scheduleApi.updateSchedule(this.data.scheduleId, payload)
      } else {
        res = await scheduleApi.createSchedule(payload as any)
      }

      if (res.code === 200) {
        wx.showToast({ title: this.data.isEdit ? '保存成功' : '创建成功', icon: 'none' })
        if (this.data.isEdit) {
          setTimeout(function () { wx.navigateBack() }, 800)
        } else {
          var newId = res.data.id
          setTimeout(function () {
            wx.redirectTo({ url: '/pages/schedule/detail?id=' + newId })
          }, 800)
        }
      } else {
        wx.showToast({ title: res.message || '操作失败', icon: 'none' })
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
