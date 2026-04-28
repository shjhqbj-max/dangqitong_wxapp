import { api, USE_MOCK, ApiResponse } from '../utils/request'
import { Order, ProfessionSlot } from '../mock/types'
import * as mock from '../mock/orders'

// 获取工单列表（广场）
export function getOrderList(filters?: {
  city?: string
  profession?: string
  sort?: string
  page?: number
  pageSize?: number
}): Promise<ApiResponse<{ list: Order[], total: number, hasMore: boolean }>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mock.getOrderList(filters) })
  }
  return api.get('/api/orders', filters || {})
}

// 获取工单详情
export function getOrderDetail(id: string): Promise<ApiResponse<Order>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mock.getOrderById(id) })
  }
  return api.get('/api/orders/' + id)
}

// 创建工单（发单）
export interface CreateOrderParams {
  title: string
  date: string
  start_time: string
  end_time: string
  location: string
  profession_slots: ProfessionSlot[]
  total_price: number
  description: string
  contact?: string
  deadline: string
}

export function createOrder(params: CreateOrderParams): Promise<ApiResponse<Order>> {
  if (USE_MOCK) {
    const newOrder: Order = {
      order_id: 'o-' + Date.now(),
      title: params.title,
      date: params.date,
      start_time: params.start_time,
      end_time: params.end_time,
      location: params.location,
      profession_slots: params.profession_slots,
      total_price: params.total_price,
      description: params.description,
      status: 'active',
      publisher: { user_id: 'u-001', nickname: '我自己', avatar_url: '' },
      grab_count: 0,
      deadline: params.deadline,
      created_at: new Date().toISOString(),
      contact: params.contact
    }
    return Promise.resolve({ code: 200, data: newOrder })
  }
  return api.post('/api/orders', params)
}

// 抢单
export function grabOrder(id: string, profession: string, quote_price?: number, intro?: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.post('/api/orders/' + id + '/grab', { profession: profession, quote_price: quote_price, intro: intro })
}

// 获取我抢单的工单
export function getMyGrabbedOrders(): Promise<ApiResponse<{ list: Order[] }>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: { list: mock.getMyGrabbedOrders() } })
  }
  return api.get('/api/orders', { my_grabbed: true })
}

// 获取我发布的工单
export function getMyPublishedOrders(page?: number, pageSize?: number): Promise<ApiResponse<{ list: Order[], total: number, hasMore: boolean }>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mock.getMyPublishedOrders(page, pageSize) })
  }
  return api.get('/api/orders', { my_published: true, page: page, pageSize: pageSize })
}

// 获取附近工单数
export function getNearbyOrderCount(): Promise<ApiResponse<{ count: number }>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: { count: mock.getOrderList().total } })
  }
  return api.get('/api/orders/nearby-count')
}
