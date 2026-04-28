// DQT Mock 数据 — 档期
import { Schedule, CalendarDayMap } from './types'

// 当前月档期数据
export const mockSchedules: Schedule[] = [
  // ===== 4月档期（20条） =====
  {
    id: 's-1',
    date: '2026-04-01',
    start_time: '', end_time: '',
    status: 'rest', completion_status: '', source: '',
    location: '', contact_name: '', contact_phone: '',
    total_price: 0, paid_amount: 0, payment_status: '',
    notes: '休息日',
    created_at: '2026-03-25T10:00:00'
  },
  {
    id: 's-2',
    date: '2026-04-03',
    start_time: '08:00', end_time: '18:00',
    status: 'confirmed', completion_status: 'completed', source: 'self',
    location: '杭州西湖区XX酒店', contact_name: '张伟', contact_phone: '13800138001',
    total_price: 5000, paid_amount: 5000, payment_status: 'paid',
    notes: '西湖边外景拍摄，客户要求下午逆光剪影',
    assigned_member_ids: ['u-003'],
    created_at: '2026-03-26T10:00:00'
  },
  {
    id: 's-3',
    date: '2026-04-05',
    start_time: '07:00', end_time: '20:00',
    status: 'confirmed', completion_status: 'completed', source: 'team_dispatch',
    location: '上海浦东新区XX宴会厅', contact_name: '李明', contact_phone: '13900139001',
    total_price: 8000, paid_amount: 4000, payment_status: 'partial',
    notes: '全天婚礼跟拍，需提前1小时到场布光',
    assigned_member_ids: ['u-002', 'u-005'],
    extra_contacts: [
      { role: '婚庆负责人', name: '王婚庆', phone: '13700137002' },
      { role: '化妆联系人', name: '刘化妆', phone: '13600136002' }
    ],
    created_at: '2026-03-28T10:00:00'
  },
  {
    id: 's-4',
    date: '2026-04-07',
    start_time: '09:00', end_time: '17:00',
    status: 'pending', completion_status: 'uncompleted', source: 'self',
    location: '杭州拱墅区XX花园', contact_name: '王芳', contact_phone: '13700137001',
    total_price: 3000, paid_amount: 0, payment_status: 'unpaid',
    notes: '户外婚礼，注意天气，备选方案为室内',
    created_at: '2026-03-30T10:00:00'
  },
  {
    id: 's-5',
    date: '2026-04-08',
    start_time: '', end_time: '',
    status: 'rest', completion_status: '', source: '',
    location: '', contact_name: '', contact_phone: '',
    total_price: 0, paid_amount: 0, payment_status: '',
    notes: '调休日，处理后期修图',
    created_at: '2026-03-31T10:00:00'
  },
  {
    id: 's-6',
    date: '2026-04-10',
    start_time: '08:00', end_time: '16:00',
    status: 'confirmed', completion_status: 'completed', source: 'platform',
    location: '杭州余杭区XX宴会中心', contact_name: '赵六', contact_phone: '13600136001',
    total_price: 2500, paid_amount: 2500, payment_status: 'paid',
    notes: '平台抢单，半天摄影，客户要求纪实风格',
    created_at: '2026-04-02T10:00:00'
  },
  {
    id: 's-7',
    date: '2026-04-12',
    start_time: '10:00', end_time: '18:00',
    status: 'pending', completion_status: 'uncompleted', source: 'team_dispatch',
    location: '上海徐汇区XX会所', contact_name: '孙七', contact_phone: '13500135001',
    total_price: 3500, paid_amount: 1000, payment_status: 'partial',
    notes: '下午场化妆跟妆，需带全套补妆工具',
    assigned_member_ids: ['u-002'],
    created_at: '2026-04-04T10:00:00'
  },
  {
    id: 's-8',
    date: '2026-04-13',
    start_time: '06:30', end_time: '21:00',
    status: 'confirmed', completion_status: 'delayed', source: 'self',
    location: '杭州萧山区XX度假酒店', contact_name: '钱八', contact_phone: '13200132001',
    total_price: 7500, paid_amount: 3750, payment_status: 'partial',
    notes: '婚礼全天跟拍+精修，外景在度假酒店花园',
    assigned_member_ids: ['u-002', 'u-005'],
    extra_contacts: [
      { role: '新娘联系人', name: '林新娘', phone: '13100131002' },
      { role: '场地负责人', name: '张经理', phone: '13000130002' }
    ],
    created_at: '2026-04-05T10:00:00'
  },
  {
    id: 's-9',
    date: '2026-04-15',
    start_time: '09:00', end_time: '17:00',
    status: 'pending', completion_status: 'uncompleted', source: 'self',
    location: '杭州上城区XX大酒店', contact_name: '周八', contact_phone: '13400134001',
    total_price: 6000, paid_amount: 0, payment_status: 'unpaid',
    notes: '待确认场地，客户还在对比三家酒店',
    created_at: '2026-04-07T10:00:00'
  },
  {
    id: 's-10',
    date: '2026-04-17',
    start_time: '08:00', end_time: '18:00',
    status: 'confirmed', completion_status: 'completed', source: 'team_dispatch',
    location: '上海静安区XX大酒店', contact_name: '吴九', contact_phone: '13300133001',
    total_price: 5500, paid_amount: 5500, payment_status: 'paid',
    notes: '全天摄影+摄像，双机位，需与摄像师配合',
    assigned_member_ids: ['u-005'],
    extra_contacts: [
      { role: '婚庆负责人', name: '陈策划', phone: '15200152002' }
    ],
    created_at: '2026-04-09T10:00:00'
  },
  {
    id: 's-11',
    date: '2026-04-19',
    start_time: '08:00', end_time: '18:00',
    status: 'pending', completion_status: 'uncompleted', source: 'platform',
    location: '杭州西湖区XX酒店', contact_name: '郑十', contact_phone: '13100131001',
    total_price: 2000, paid_amount: 0, payment_status: 'unpaid',
    notes: '平台抢单，需要一位婚礼跟拍摄影师',
    created_at: '2026-04-11T10:00:00'
  },
  {
    id: 's-12',
    date: '2026-04-20',
    start_time: '07:00', end_time: '19:00',
    status: 'confirmed', completion_status: 'completed', source: 'self',
    location: '杭州江干区XX婚庆中心', contact_name: '冯十一', contact_phone: '13000130001',
    total_price: 4500, paid_amount: 2250, payment_status: 'partial',
    notes: '婚礼跟拍，外景在钱塘江边，注意潮汐时间',
    assigned_member_ids: ['u-003', 'u-006'],
    extra_contacts: [
      { role: '新郎联系人', name: '何新郎', phone: '15900159002' }
    ],
    created_at: '2026-04-12T10:00:00'
  },
  {
    id: 's-13',
    date: '2026-04-21',
    start_time: '09:00', end_time: '18:00',
    status: 'pending', completion_status: 'delayed', source: 'self',
    location: '杭州滨江区XX花园', contact_name: '陈十二', contact_phone: '15800158001',
    total_price: 4000, paid_amount: 1000, payment_status: 'partial',
    notes: '户外婚礼延期至下周，注意天气',
    created_at: '2026-04-13T10:00:00'
  },
  {
    id: 's-14',
    date: '2026-04-22',
    start_time: '08:00', end_time: '16:00',
    status: 'confirmed', completion_status: 'completed', source: 'team_dispatch',
    location: '上海黄浦区XX宴会厅', contact_name: '卫十三', contact_phone: '15700157001',
    total_price: 3200, paid_amount: 3200, payment_status: 'paid',
    notes: '半天婚礼摄影，客户要求精修30张',
    created_at: '2026-04-14T10:00:00'
  },
  {
    id: 's-15',
    date: '2026-04-23',
    start_time: '10:00', end_time: '17:00',
    status: 'confirmed', completion_status: 'completed', source: 'self',
    location: '杭州西湖区XX影楼', contact_name: '蒋十四', contact_phone: '15600156001',
    total_price: 2800, paid_amount: 2800, payment_status: 'paid',
    notes: '室内婚纱照，三套服装',
    created_at: '2026-04-15T10:00:00'
  },
  {
    id: 's-16',
    date: '2026-04-24',
    start_time: '14:00', end_time: '20:00',
    status: 'pending', completion_status: 'uncompleted', source: 'platform',
    location: '杭州下城区XX会所', contact_name: '沈十五', contact_phone: '15500155001',
    total_price: 1800, paid_amount: 0, payment_status: 'unpaid',
    notes: '下午场，化妆跟妆，晚宴补妆',
    created_at: '2026-04-16T10:00:00'
  },
  {
    id: 's-17',
    date: '2026-04-25',
    start_time: '', end_time: '',
    status: 'rest', completion_status: '', source: '',
    location: '', contact_name: '', contact_phone: '',
    total_price: 0, paid_amount: 0, payment_status: '',
    notes: '休息日，家庭聚餐',
    created_at: '2026-04-17T10:00:00'
  },
  {
    id: 's-18',
    date: '2026-04-26',
    start_time: '07:30', end_time: '19:00',
    status: 'confirmed', completion_status: 'delayed', source: 'self',
    location: '杭州富阳区XX生态园', contact_name: '韩十六', contact_phone: '15300153001',
    total_price: 5500, paid_amount: 0, payment_status: 'unpaid',
    notes: '户外婚礼全天跟拍，因雨天延期',
    created_at: '2026-04-18T10:00:00'
  },
  {
    id: 's-19',
    date: '2026-04-28',
    start_time: '08:00', end_time: '18:00',
    status: 'confirmed', completion_status: 'completed', source: 'team_dispatch',
    location: '上海长宁区XX酒店', contact_name: '杨十七', contact_phone: '15200152001',
    total_price: 6500, paid_amount: 3250, payment_status: 'partial',
    notes: '婚礼跟拍+无人机航拍，需提前报备飞行',
    extra_contacts: [
      { role: '航拍联系人', name: '李飞手', phone: '15100151002' },
      { role: '婚庆负责人', name: '赵策划', phone: '15000150002' }
    ],
    created_at: '2026-04-20T10:00:00'
  },
  {
    id: 's-20',
    date: '2026-04-30',
    start_time: '09:00', end_time: '17:00',
    status: 'pending', completion_status: 'uncompleted', source: 'self',
    location: '杭州临平区XX宴会中心', contact_name: '朱十八', contact_phone: '15100151001',
    total_price: 3800, paid_amount: 0, payment_status: 'unpaid',
    notes: '月底档期，待确认，客户预算有限',
    created_at: '2026-04-22T10:00:00'
  },

  // ===== 5月档期 =====
  {
    id: 's-101',
    date: '2026-05-02',
    start_time: '08:00', end_time: '18:00',
    status: 'confirmed', completion_status: 'completed', source: 'self',
    location: '杭州西湖区XX酒店', contact_name: '李四', contact_phone: '13900139000',
    total_price: 5000, paid_amount: 5000, payment_status: 'paid',
    notes: '外景在西湖边，注意带反光板和备用电池',
    created_at: '2026-04-20T10:00:00'
  },
  {
    id: 's-102',
    date: '2026-05-05',
    start_time: '09:00', end_time: '17:00',
    status: 'pending', completion_status: 'uncompleted', source: 'team_dispatch',
    location: '上海浦东新区XX宴会厅', contact_name: '王五', contact_phone: '13800138000',
    total_price: 3000, paid_amount: 0, payment_status: 'unpaid',
    notes: '团队派单，待确认细节，客户要求纪实风格',
    created_at: '2026-04-21T10:00:00'
  },
  {
    id: 's-103',
    date: '2026-05-08',
    start_time: '', end_time: '',
    status: 'rest', completion_status: '', source: '',
    location: '', contact_name: '', contact_phone: '',
    total_price: 0, paid_amount: 0, payment_status: '',
    notes: '连休缓冲日，处理后期',
    created_at: '2026-04-22T10:00:00'
  },
  {
    id: 's-104',
    date: '2026-05-13',
    start_time: '08:00', end_time: '18:00',
    status: 'confirmed', completion_status: 'completed', source: 'self',
    location: '杭州西湖区XX酒店', contact_name: '王五', contact_phone: '13700137000',
    total_price: 6000, paid_amount: 3000, payment_status: 'partial',
    notes: '王五婚礼跟拍，老客户二次合作',
    assigned_member_ids: ['u-005', 'u-009'],
    created_at: '2026-04-20T10:00:00'
  },
  {
    id: 's-105',
    date: '2026-05-16',
    start_time: '06:30', end_time: '21:00',
    status: 'confirmed', completion_status: 'delayed', source: 'self',
    location: '上海静安区XX大酒店', contact_name: '赵六', contact_phone: '13600136000',
    total_price: 8000, paid_amount: 4000, payment_status: 'partial',
    notes: '赵六婚礼全天跟拍，仪式流程较长',
    created_at: '2026-04-19T10:00:00'
  },
  {
    id: 's-106',
    date: '2026-05-16',
    start_time: '10:00', end_time: '16:00',
    status: 'confirmed', completion_status: 'completed', source: 'team_dispatch',
    location: '上海徐汇区XX会所', contact_name: '孙七', contact_phone: '13500135000',
    total_price: 2500, paid_amount: 2500, payment_status: 'paid',
    notes: '下午场化妆跟妆，轻复古风格',
    created_at: '2026-04-18T10:00:00'
  },
  {
    id: 's-107',
    date: '2026-05-18',
    start_time: '08:00', end_time: '20:00',
    status: 'pending', completion_status: 'uncompleted', source: 'platform',
    location: '杭州西湖区XX酒店', contact_name: '李四', contact_phone: '13900139000',
    total_price: 2000, paid_amount: 0, payment_status: 'unpaid',
    notes: '需要一位婚礼跟拍摄影师，预算有限',
    created_at: '2026-04-22T10:00:00'
  },
  {
    id: 's-108',
    date: '2026-05-20',
    start_time: '09:00', end_time: '18:00',
    status: 'pending', completion_status: 'uncompleted', source: 'self',
    location: '杭州拱墅区XX花园', contact_name: '周八', contact_phone: '13400134000',
    total_price: 4000, paid_amount: 1000, payment_status: 'partial',
    notes: '户外婚礼，注意天气，五月多雨',
    created_at: '2026-04-23T10:00:00'
  },
  {
    id: 's-109',
    date: '2026-05-25',
    start_time: '', end_time: '',
    status: 'rest', completion_status: '', source: '',
    location: '', contact_name: '', contact_phone: '',
    total_price: 0, paid_amount: 0, payment_status: '',
    notes: '连休第一天，整理设备',
    created_at: '2026-04-23T10:00:00'
  },
  {
    id: 's-110',
    date: '2026-05-27',
    start_time: '07:00', end_time: '19:00',
    status: 'confirmed', completion_status: 'uncompleted', source: 'team_dispatch',
    location: '杭州余杭区XX宴会中心', contact_name: '吴九', contact_phone: '13300133000',
    total_price: 5500, paid_amount: 0, payment_status: 'unpaid',
    notes: '全天摄影+摄像，与摄像团队配合',
    created_at: '2026-04-23T10:00:00'
  }
]

// 档期日历数据（按日期映射）
export function getCalendarData(year: number, month: number): CalendarDayMap {
  const map: CalendarDayMap = {}
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  const filtered = mockSchedules.filter(s => s.date.startsWith(prefix))

  filtered.forEach(s => {
    if (!map[s.date]) {
      map[s.date] = { statuses: [], count: 0 }
    }
    if (!map[s.date].statuses.includes(s.status)) {
      map[s.date].statuses.push(s.status)
    }
    map[s.date].count++
  })

  return map
}

// 按日期获取档期
export function getSchedulesByDate(date: string): Schedule[] {
  return mockSchedules.filter(s => s.date === date)
}

// 获取本周档期
export function getWeekSchedules(): Schedule[] {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const start = monday.toISOString().split('T')[0]
  const end = sunday.toISOString().split('T')[0]

  return mockSchedules
    .filter(s => s.date >= start && s.date <= end && s.status !== 'rest')
    .sort((a, b) => a.date.localeCompare(b.date))
}

// 获取本月档期
export function getMonthSchedules(year: number, month: number): Schedule[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  return mockSchedules
    .filter(s => s.date.startsWith(prefix) && s.status !== 'rest')
    .sort((a, b) => a.date.localeCompare(b.date))
}

// 获取本月档期（分页）
export function getMonthSchedulesPaged(year: number, month: number, page?: number, pageSize?: number): { list: Schedule[], total: number, hasMore: boolean } {
  var all = getMonthSchedules(year, month)
  var total = all.length
  var p = page || 1
  var ps = pageSize || 20
  var start = (p - 1) * ps
  var paged = all.slice(start, start + ps)
  return { list: paged, total: total, hasMore: start + ps < total }
}

// 按 ID 获取档期
export function getScheduleById(id: string): Schedule {
  return mockSchedules.find(function (s) { return s.id === id }) || mockSchedules[0]
}

// 模糊搜索档期（按日期、备注、地点）
export function searchSchedules(keyword: string): Schedule[] {
  const lower = keyword.toLowerCase()
  return mockSchedules.filter(s =>
    (s.date && s.date.indexOf(keyword) >= 0) ||
    (s.notes && s.notes.toLowerCase().indexOf(lower) >= 0) ||
    (s.location && s.location.toLowerCase().indexOf(lower) >= 0)
  ).sort((a, b) => a.date.localeCompare(b.date))
}
