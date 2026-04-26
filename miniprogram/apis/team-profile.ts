import { api, USE_MOCK, ApiResponse } from '../utils/request'
import { TeamProfile, TeamProfileMember } from '../mock/types'
import * as mockTeams from '../mock/teams'

// 获取团队对外展示信息
export function getTeamProfile(teamId: string): Promise<ApiResponse<TeamProfile>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockTeams.getTeamProfile(teamId) })
  }
  return api.get('/api/teams/' + teamId + '/profile')
}

// 获取团队成员列表（含作品、报价等对外信息）
export function getTeamProfileMembers(teamId: string): Promise<ApiResponse<TeamProfileMember[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockTeams.getTeamProfileMembers(teamId) })
  }
  return api.get('/api/teams/' + teamId + '/profile/members')
}
