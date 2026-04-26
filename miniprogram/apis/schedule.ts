import { api, USE_MOCK, ApiResponse } from '../utils/request'
import { Schedule, CalendarDayMap, ExtraContact } from '../mock/types'
import * as mock from '../mock/schedules'

// 获取日历映射（用于日历格子状态渲染）
export function getCalendar(year: number, month: number): Promise<ApiResponse<CalendarDayMap>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mock.getCalendarData(year, month) })
  }
  return api.get('/api/schedules/calendar', { year, month })
}

// 获取档期列表（本月/筛选）
export function getScheduleList(year: number, month: number): Promise<ApiResponse<{ list: Schedule[] }>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: { list: mock.getMonthSchedules(year, month) } })
  }
  return api.get('/api/schedules', { year, month })
}

// 按日期获取档期
export function getSchedulesByDate(date: string): Promise<ApiResponse<Schedule[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mock.getSchedulesByDate(date) })
  }
  return api.get('/api/schedules/by-date', { date })
}

// 获取本周档期
export function getWeekSchedules(): Promise<ApiResponse<Schedule[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mock.getWeekSchedules() })
  }
  return api.get('/api/schedules/week')
}

// 获取档期详情
export function getScheduleDetail(id: string): Promise<ApiResponse<Schedule>> {
  if (USE_MOCK) {
    const s = mock.getScheduleById(id)
    return Promise.resolve({ code: 200, data: s })
  }
  return api.get('/api/schedules/' + id)
}

// 更新档期
export function updateSchedule(id: string, data: Record<string, any>): Promise<ApiResponse<Schedule>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: {} as Schedule })
  }
  return api.put('/api/schedules/' + id, data)
}

// 删除档期
export function deleteSchedule(id: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.delete('/api/schedules/' + id)
}

// 搜索档期（模糊匹配日期/备注/地点）
export function searchSchedules(keyword: string): Promise<ApiResponse<{ list: Schedule[] }>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: { list: mock.searchSchedules(keyword) } })
  }
  return api.get('/api/schedules/search', { keyword })
}

// 创建档期
export interface CreateScheduleParams {
  date: string
  start_time: string
  end_time: string
  source: string
  location: string
  contact_name: string
  contact_phone: string
  extra_contacts?: ExtraContact[]
  total_price: number
  paid_amount: number
  payment_status: string
  notes: string
  status: 'confirmed' | 'pending' | 'rest'
}

export function createSchedule(params: CreateScheduleParams): Promise<ApiResponse<Schedule>> {
  if (USE_MOCK) {
    const newSchedule: Schedule = {
      id: String(Date.now()),
      date: params.date,
      start_time: params.start_time,
      end_time: params.end_time,
      status: params.status,
      completion_status: '',
      source: params.source || '',
      location: params.location,
      contact_name: params.contact_name,
      contact_phone: params.contact_phone,
      extra_contacts: params.extra_contacts || [],
      total_price: params.total_price,
      paid_amount: params.paid_amount,
      payment_status: params.payment_status as any,
      notes: params.notes,
      created_at: new Date().toISOString()
    }
    return Promise.resolve({ code: 200, data: newSchedule })
  }
  return api.post('/api/schedules', params)
}

// 接受指派档期
export function acceptSchedule(id: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.post('/api/schedules/' + id + '/accept')
}

// 拒绝指派档期
export function rejectSchedule(id: string, data: { reason: string }): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.post('/api/schedules/' + id + '/reject', data)
}

// 批量指派档期给团队成员
export function assignSchedule(id: string, memberIds: string[]): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.post('/api/schedules/' + id + '/assign', { member_ids: memberIds })
}