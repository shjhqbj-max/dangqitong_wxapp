import { getMockScheduleById, Schedule, ScheduleType } from '../../mock/schedule'
import { CONTACT_ROLES } from '../../constants/contact-roles'
import { FREQUENT_CONTACTS, FrequentContact } from '../../mock/contacts'

interface ContactItem {
  role: string
  name: string
  phone: string
}

Page({
  data: {
    isEdit: false,
    scheduleId: '',
    // 类型
    type: 'booked' as ScheduleType,
    typeOptions: [
      { value: 'booked', label: '已定' },
      { value: 'pending', label: '预留' },
      { value: 'free', label: '休息' },
    ] as Array<{ value: string; label: string }>,
    // 休息模式
    restDays: 1,
    // 日期 & 时间
    date: '',
    startTime: '09:00',
    endTime: '12:00',
    // 基本信息
    title: '',
    source: '',
    location: '',
    // 联系人
    contacts: [] as ContactItem[],
    contactRoles: CONTACT_ROLES,
    frequentContacts: FREQUENT_CONTACTS.slice(0, 20) as FrequentContact[],
    // 联系人面板
    contactPanelVisible: false,
    panelContact: { role: '新人', roleIndex: 0, name: '', phone: '' },
    // 费用
    totalAmount: '' as string | number,
    paidAmount: '' as string | number,
    // 备注 & 图片
    note: '',
    images: [] as string[],
    statusBarHeight: 0,
  },

  onLoad(query: Record<string, string>) {
    const info = wx.getSystemInfoSync()
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    this.setData({ statusBarHeight: info.statusBarHeight })

    if (query.id) {
      const schedule = getMockScheduleById(query.id)
      if (schedule) {
        this.setData({
          isEdit: true,
          scheduleId: schedule.id,
          type: schedule.type,
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          title: schedule.title,
          source: schedule.source,
          location: schedule.location,
          contacts: schedule.contacts || [],
          totalAmount: schedule.totalAmount || '',
          paidAmount: schedule.paidAmount || '',
          restDays: schedule.restDays || 1,
          note: schedule.note,
          images: schedule.images || [],
        })
      }
    } else if (query.date) {
      this.setData({ date: query.date })
    } else {
      this.setData({ date: dateStr })
    }
  },

  // ============================
  // 类型切换
  // ============================
  onTypeChange(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.value as ScheduleType
    this.setData({ type })
  },

  // ============================
  // 日期 & 时间
  // ============================
  onDateChange(e: WechatMiniprogram.PickerChange) {
    this.setData({ date: e.detail.value })
  },

  onStartTimeChange(e: WechatMiniprogram.PickerChange) {
    this.setData({ startTime: e.detail.value })
  },

  onEndTimeChange(e: WechatMiniprogram.PickerChange) {
    this.setData({ endTime: e.detail.value })
  },

  // ============================
  // 休息天数
  // ============================
  onRestDaysChange(e: WechatMiniprogram.PickerChange) {
    this.setData({ restDays: parseInt(e.detail.value) })
  },

  // ============================
  // 通用输入
  // ============================
  onInput(e: WechatMiniprogram.InputEvent) {
    const field = e.currentTarget.dataset.field as string
    this.setData({ [field]: e.detail.value })
  },

  // ============================
  // 联系人
  // ============================
  onOpenContactPanel() {
    this.setData({
      contactPanelVisible: true,
      panelContact: { role: '新人', roleIndex: 0, name: '', phone: '' },
    })
  },

  onCloseContactPanel() {
    this.setData({ contactPanelVisible: false })
  },

  onPanelRoleChange(e: WechatMiniprogram.PickerChange) {
    const idx = parseInt(e.detail.value)
    this.setData({
      'panelContact.role': CONTACT_ROLES[idx],
      'panelContact.roleIndex': idx,
    })
  },

  onPanelNameInput(e: WechatMiniprogram.InputEvent) {
    this.setData({ 'panelContact.name': e.detail.value })
  },

  onPanelPhoneInput(e: WechatMiniprogram.InputEvent) {
    this.setData({ 'panelContact.phone': e.detail.value })
  },

  onConfirmAddContact() {
    const { name, phone, role } = this.data.panelContact
    if (!name.trim() && !phone.trim()) {
      wx.showToast({ title: '请填写联系人信息', icon: 'none' })
      return
    }
    this.setData({
      contacts: [...this.data.contacts, { role, name: name.trim(), phone: phone.trim() }],
      contactPanelVisible: false,
    })
  },

  onSelectFrequent(e: WechatMiniprogram.TouchEvent) {
    const contact = e.currentTarget.dataset.contact as FrequentContact
    // 检查是否已添加
    const exists = this.data.contacts.some(c => c.phone === contact.phone && c.name === contact.name)
    if (exists) {
      wx.showToast({ title: '该联系人已添加', icon: 'none' })
      return
    }
    this.setData({
      contacts: [...this.data.contacts, { ...contact }],
      contactPanelVisible: false,
    })
  },

  onRemoveContact(e: WechatMiniprogram.TouchEvent) {
    const idx = e.currentTarget.dataset.index as number
    const contacts = [...this.data.contacts]
    contacts.splice(idx, 1)
    this.setData({ contacts })
  },

  // ============================
  // 地点选择
  // ============================
  onChooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({ location: res.name || res.address || '' })
      },
    })
  },

  // ============================
  // 费用
  // ============================
  onFeeInput(e: WechatMiniprogram.InputEvent) {
    const field = e.currentTarget.dataset.field as string
    const value = e.detail.value
    this.setData({ [field]: value })
  },

  onSettleAll() {
    const total = Number(this.data.totalAmount) || 0
    this.setData({ paidAmount: total })
  },

  // ============================
  // 图片
  // ============================
  onChooseImage() {
    const remaining = 3 - this.data.images.length
    if (remaining <= 0) return

    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath)
        this.setData({ images: [...this.data.images, ...newImages] })
      },
    })
  },

  onPreviewImage(e: WechatMiniprogram.TouchEvent) {
    const src = e.currentTarget.dataset.src as string
    wx.previewImage({ current: src, urls: this.data.images })
  },

  onRemoveImage(e: WechatMiniprogram.TouchEvent) {
    const idx = e.currentTarget.dataset.index as number
    const images = [...this.data.images]
    images.splice(idx, 1)
    this.setData({ images })
  },

  // ============================
  // 保存
  // ============================
  onSave() {
    const { title, type, date, startTime, endTime } = this.data

    if (!title.trim()) {
      wx.showToast({ title: '请输入档期标题', icon: 'none' })
      return
    }
    if (!date) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return
    }

    const contacts = this.data.contacts

    const result: Partial<Schedule> = {
      id: this.data.scheduleId || `${Date.now()}`,
      title: title.trim(),
      type,
      date,
      startTime,
      endTime,
      note: this.data.note.trim(),
      location: this.data.location.trim(),
      source: this.data.source.trim(),
      contacts,
      totalAmount: Number(this.data.totalAmount) || 0,
      paidAmount: Number(this.data.paidAmount) || 0,
      restDays: type === 'free' ? this.data.restDays : 0,
      images: this.data.images,
    }

    console.log('保存档期:', result)

    wx.showToast({
      title: this.data.isEdit ? '修改成功' : '添加成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      },
    })
  },
})
