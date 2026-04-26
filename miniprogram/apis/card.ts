import { api, USE_MOCK, ApiResponse } from '../utils/request'
import { ScheduleCard } from '../mock/types'
import * as mockCards from '../mock/cards'

// 获取档期卡数据
export function getScheduleCard(userId: string): Promise<ApiResponse<ScheduleCard | null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockCards.getScheduleCard(userId) })
  }
  return api.get('/api/cards/' + userId)
}

// 获取档期卡图片 URL（后端生成，mock 返回空）
export function getCardImage(userId: string): Promise<ApiResponse<{ image_url: string }>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockCards.getCardImage(userId) })
  }
  return api.get('/api/cards/' + userId + '/image')
}
