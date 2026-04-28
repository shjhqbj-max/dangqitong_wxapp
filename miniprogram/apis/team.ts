import { api, USE_MOCK, ApiResponse } from '../utils/request'
import { Team, TeamMember, TeamScheduleItem } from '../mock/types'
import * as mockTeams from '../mock/teams'

// 获取我的团队列表
export function getMyTeams(): Promise<ApiResponse<Team[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockTeams.getMyTeams() })
  }
  return api.get('/api/teams/my')
}

// 获取团队成员列表
export function getTeamMembers(teamId: string): Promise<ApiResponse<TeamMember[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockTeams.getTeamMembers(teamId) })
  }
  return api.get('/api/teams/' + teamId + '/members')
}

// 获取所有团队成员（合并，用于指派面板）
export function getAllMembers(): Promise<ApiResponse<Array<TeamMember & { team_id: string, team_name: string }>>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockTeams.getAllMembers() })
  }
  return api.get('/api/teams/all-members')
}

// 按日期获取团队成员档期
export function getTeamSchedule(teamId: string, date: string): Promise<ApiResponse<TeamScheduleItem[]>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockTeams.getTeamSchedule(teamId, date) })
  }
  return api.get('/api/teams/' + teamId + '/schedule?date=' + date)
}

// 修改成员角色
export function updateMemberRole(teamId: string, userId: string, role: 'admin' | 'member'): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.put('/api/teams/' + teamId + '/members/' + userId, { role })
}

// 移除成员
export function removeMember(teamId: string, userId: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.delete('/api/teams/' + teamId + '/members/' + userId)
}

// 修改团队信息
export function updateTeam(teamId: string, data: { name?: string; cover_url?: string; service_types?: string[] }): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.put('/api/teams/' + teamId, data)
}

// 退出团队
export function leaveTeam(teamId: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.post('/api/teams/' + teamId + '/leave')
}

// 创建团队
function _genCode(len: number) {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  var code = ''
  for (var i = 0; i < len; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
  return code
}

export function createTeam(data: { name: string; service_types?: string[] }): Promise<ApiResponse<Team>> {
  if (USE_MOCK) {
    var newTeam: Team = {
      team_id: 't-new-' + Date.now(),
      name: data.name,
      logo_url: '',
      description: '',
      city: '',
      service_types: data.service_types || [],
      contact_phone: '',
      member_count: 1,
      my_role: 'admin',
      invite_code: _genCode(6),
      created_at: new Date().toISOString()
    }
    return Promise.resolve({ code: 200, data: newTeam })
  }
  return api.post('/api/teams', data)
}

// 通过邀请码加入团队
export function joinTeam(code: string): Promise<ApiResponse<Team>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: mockTeams.getMyTeams()[0] })
  }
  return api.post('/api/teams/join', { code })
}

// 解散团队
export function dissolveTeam(teamId: string): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return Promise.resolve({ code: 200, data: null })
  }
  return api.delete('/api/teams/' + teamId)
}
