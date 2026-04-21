// ============================
// 档期类型定义
// ============================

export type ScheduleType = 'booked' | 'pending' | 'free'
export type SettlementStatus = 'unsettled' | 'settled' | 'partial'

export interface ContactItem {
  role: string
  name: string
  phone: string
}

export interface Schedule {
  id: string
  title: string
  type: ScheduleType
  date: string
  startTime: string
  endTime: string
  note: string
  owner: string
  location: string
  source: string
  contacts: ContactItem[]
  totalAmount: number
  paidAmount: number
  settlement: SettlementStatus
  restDays: number
  images: string[]
}

export interface ScheduleTag {
  text: string
  type: string
}

// ============================
// 档期 mock 数据
// ============================

function makeId(year: number, month: number, day: number, index: number): string {
  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${index}`
}

function makeDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function getMockSchedules(year: number, month: number, day: number): Schedule[] {
  const date = makeDate(year, month, day)
  const seed = (year * 10000 + month * 100 + day) % 7
  if (seed === 0) return [
    { id: makeId(year, month, day, 0), title: '张三婚礼', type: 'booked', date, startTime: '08:00', endTime: '12:00', note: '城东希尔顿酒店', owner: '李明', location: '城东希尔顿酒店', source: '老客户介绍', contacts: [{ role: '新人', name: '张三', phone: '13800001111' }], totalAmount: 8000, paidAmount: 8000, settlement: 'settled', restDays: 0, images: [] },
    { id: makeId(year, month, day, 1), title: '李四婚宴', type: 'pending', date, startTime: '14:00', endTime: '18:00', note: '需确认场地', owner: '王芳', location: '', source: '抢单大厅', contacts: [{ role: '新人', name: '李四', phone: '13800002222' }], totalAmount: 6000, paidAmount: 0, settlement: 'unsettled', restDays: 0, images: [] },
    { id: makeId(year, month, day, 2), title: '王五拍摄', type: 'booked', date, startTime: '09:00', endTime: '11:00', note: '外景婚纱照', owner: '李明', location: '西湖公园', source: '朋友介绍', contacts: [{ role: '新人', name: '王五', phone: '13800003333' }, { role: '化妆师', name: '小美', phone: '13800004444' }], totalAmount: 5000, paidAmount: 3000, settlement: 'partial', restDays: 0, images: [] },
    { id: makeId(year, month, day, 3), title: '赵六外景', type: 'pending', date, startTime: '15:00', endTime: '17:00', note: '西湖公园', owner: '张伟', location: '西湖公园', source: '', contacts: [], totalAmount: 3000, paidAmount: 0, settlement: 'unsettled', restDays: 0, images: [] },
    { id: makeId(year, month, day, 4), title: '钱七仪式', type: 'booked', date, startTime: '10:00', endTime: '12:00', note: '', owner: '刘洋', location: '西溪教堂', source: '老客户介绍', contacts: [{ role: '新人', name: '钱七', phone: '13800005555' }], totalAmount: 10000, paidAmount: 10000, settlement: 'settled', restDays: 0, images: [] },
    { id: makeId(year, month, day, 5), title: '孙八晚宴', type: 'free', date, startTime: '18:00', endTime: '21:00', note: '待确认', owner: '李明', location: '', source: '', contacts: [], totalAmount: 0, paidAmount: 0, settlement: 'unsettled', restDays: 0, images: [] },
  ]
  if (seed === 1) return [
    { id: makeId(year, month, day, 0), title: '婚纱拍摄', type: 'booked', date, startTime: '09:00', endTime: '13:00', note: '室内影棚', owner: '张伟', location: '星光影棚', source: '平台推荐', contacts: [{ role: '新人', name: '小林', phone: '13800006666' }, { role: '策划师', name: '小陈', phone: '13800007777' }], totalAmount: 12000, paidAmount: 12000, settlement: 'settled', restDays: 0, images: [] },
    { id: makeId(year, month, day, 1), title: '婚宴跟拍', type: 'pending', date, startTime: '17:00', endTime: '21:00', note: '君悦酒店', owner: '王芳', location: '君悦酒店', source: '抢单大厅', contacts: [{ role: '新人', name: '小王', phone: '13800008888' }], totalAmount: 5000, paidAmount: 0, settlement: 'unsettled', restDays: 0, images: [] },
  ]
  if (seed === 2) return [
    { id: makeId(year, month, day, 0), title: '外景拍摄', type: 'booked', date, startTime: '07:00', endTime: '11:00', note: '湿地公园晨光', owner: '李明', location: '西溪湿地公园', source: '老客户介绍', contacts: [{ role: '新人', name: '小赵', phone: '13800009999' }], totalAmount: 8000, paidAmount: 5000, settlement: 'partial', restDays: 0, images: [] },
  ]
  if (seed === 3) return [
    { id: makeId(year, month, day, 0), title: '仪式跟拍', type: 'pending', date, startTime: '10:00', endTime: '12:00', note: '教堂仪式', owner: '刘洋', location: '城西教堂', source: '', contacts: [{ role: '主持人', name: '大伟', phone: '13800010000' }], totalAmount: 4000, paidAmount: 0, settlement: 'unsettled', restDays: 0, images: [] },
    { id: makeId(year, month, day, 1), title: '晚宴拍摄', type: 'booked', date, startTime: '18:00', endTime: '22:00', note: '洲际酒店', owner: '李明', location: '洲际酒店', source: '朋友介绍', contacts: [{ role: '新人', name: '小周', phone: '13800011111' }, { role: '化妆师', name: '小丽', phone: '13800012222' }], totalAmount: 15000, paidAmount: 15000, settlement: 'settled', restDays: 0, images: [] },
    { id: makeId(year, month, day, 2), title: '修图交付', type: 'free', date, startTime: '14:00', endTime: '17:00', note: '', owner: '张伟', location: '', source: '', contacts: [], totalAmount: 0, paidAmount: 0, settlement: 'unsettled', restDays: 0, images: [] },
  ]
  if (seed === 5) return [
    { id: makeId(year, month, day, 0), title: '全天跟拍', type: 'booked', date, startTime: '08:00', endTime: '22:00', note: '全天婚礼跟拍', owner: '李明', location: '城东大酒店', source: '老客户介绍', contacts: [{ role: '新人', name: '小吴', phone: '13800013333' }, { role: '策划师', name: '小孙', phone: '13800014444' }], totalAmount: 20000, paidAmount: 10000, settlement: 'partial', restDays: 0, images: [] },
    { id: makeId(year, month, day, 1), title: '选片会议', type: 'pending', date, startTime: '10:00', endTime: '12:00', note: '影楼', owner: '王芳', location: '星光影楼', source: '', contacts: [{ role: '新人', name: '小郑', phone: '13800015555' }], totalAmount: 0, paidAmount: 0, settlement: 'unsettled', restDays: 0, images: [] },
    { id: makeId(year, month, day, 2), title: '成品交付', type: 'free', date, startTime: '14:00', endTime: '15:00', note: '相册+U盘', owner: '张伟', location: '', source: '', contacts: [], totalAmount: 0, paidAmount: 0, settlement: 'settled', restDays: 0, images: [] },
    { id: makeId(year, month, day, 3), title: '修图排期', type: 'free', date, startTime: '15:00', endTime: '17:00', note: '', owner: '李明', location: '', source: '', contacts: [], totalAmount: 0, paidAmount: 0, settlement: 'unsettled', restDays: 0, images: [] },
    { id: makeId(year, month, day, 4), title: '加急修图', type: 'booked', date, startTime: '19:00', endTime: '23:00', note: '客户急单', owner: '刘洋', location: '', source: '老客户介绍', contacts: [{ role: '新人', name: '小冯', phone: '13800016666' }], totalAmount: 3000, paidAmount: 1500, settlement: 'partial', restDays: 0, images: [] },
    { id: makeId(year, month, day, 5), title: '外景踩点', type: 'pending', date, startTime: '08:00', endTime: '10:00', note: '下周拍摄场地', owner: '王芳', location: '千岛湖', source: '', contacts: [], totalAmount: 0, paidAmount: 0, settlement: 'unsettled', restDays: 0, images: [] },
  ]
  return []
}

// 获取简略 tag 数据（cell 内显示用）
export function getScheduleTags(schedules: Schedule[]): ScheduleTag[] {
  return schedules.map(s => ({ text: s.title, type: s.type }))
}

// 根据 ID 获取单条档期（mock）
export function getMockScheduleById(id: string): Schedule | null {
  // 遍历近 60 天查找
  const now = new Date()
  for (let offset = -30; offset <= 30; offset++) {
    const d = new Date(now.getTime() + offset * 86400000)
    const schedules = getMockSchedules(d.getFullYear(), d.getMonth() + 1, d.getDate())
    const found = schedules.find(s => s.id === id)
    if (found) return found
  }
  return null
}
