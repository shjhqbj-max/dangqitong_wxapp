// DQT Mock 数据 — 团队与成员
import { Team, TeamMember, TeamScheduleItem, TeamProfile, TeamProfileMember } from './types'

// 当前用户所在团队
export const mockTeams: Team[] = [
  {
    team_id: 't-001',
    name: '杭州光影工作室',
    logo_url: '',
    description: '专注婚礼摄影摄像，服务杭州及周边地区',
    city: '杭州',
    service_types: ['婚礼摄影', '婚礼摄像', '航拍'],
    contact_phone: '13800138001',
    member_count: 6,
    my_role: 'admin',
    invite_code: 'A3K9F2',
    created_at: '2025-06-01T10:00:00'
  },
  {
    team_id: 't-002',
    name: '上海璀璨婚礼团队',
    logo_url: '',
    description: '一站式婚礼服务团队',
    city: '上海',
    service_types: ['婚礼摄影', '化妆造型', '花艺布置'],
    contact_phone: '13900139001',
    member_count: 4,
    my_role: 'member',
    invite_code: 'M7X4N8',
    created_at: '2025-08-15T10:00:00'
  }
]

// 团队成员数据
export const mockTeamMembers: Record<string, TeamMember[]> = {
  't-001': [
    {
      user_id: 'u-001',
      nickname: '我自己',
      avatar_url: '',
      professions: ['摄影'],
      role: 'admin',
      can_dispatch: true,
      joined_at: '2025-06-01T10:00:00'
    },
    {
      user_id: 'u-002',
      nickname: '张三',
      avatar_url: '',
      professions: ['摄像'],
      role: 'member',
      can_dispatch: true,
      joined_at: '2025-06-15T10:00:00'
    },
    {
      user_id: 'u-003',
      nickname: '李四',
      avatar_url: '',
      professions: ['摄影', '摄像'],
      role: 'member',
      can_dispatch: true,
      joined_at: '2025-07-01T10:00:00'
    },
    {
      user_id: 'u-004',
      nickname: '王五',
      avatar_url: '',
      professions: ['化妆'],
      role: 'member',
      can_dispatch: false,
      joined_at: '2025-08-01T10:00:00'
    },
    {
      user_id: 'u-005',
      nickname: '赵六',
      avatar_url: '',
      professions: ['摄像', '航拍'],
      role: 'member',
      can_dispatch: true,
      joined_at: '2025-09-01T10:00:00'
    },
    {
      user_id: 'u-006',
      nickname: '孙七',
      avatar_url: '',
      professions: ['灯光'],
      role: 'member',
      can_dispatch: false,
      joined_at: '2025-10-01T10:00:00'
    }
  ],
  't-002': [
    {
      user_id: 'u-007',
      nickname: '周八',
      avatar_url: '',
      professions: ['化妆'],
      role: 'admin',
      can_dispatch: true,
      joined_at: '2025-08-15T10:00:00'
    },
    {
      user_id: 'u-008',
      nickname: '吴九',
      avatar_url: '',
      professions: ['花艺'],
      role: 'member',
      can_dispatch: true,
      joined_at: '2025-09-01T10:00:00'
    },
    {
      user_id: 'u-009',
      nickname: '郑十',
      avatar_url: '',
      professions: ['摄影'],
      role: 'member',
      can_dispatch: true,
      joined_at: '2025-10-01T10:00:00'
    },
    {
      user_id: 'u-010',
      nickname: '冯十一',
      avatar_url: '',
      professions: ['主持'],
      role: 'member',
      can_dispatch: false,
      joined_at: '2025-11-01T10:00:00'
    }
  ]
}

// 获取用户所在的所有团队
export function getMyTeams(): Team[] {
  return mockTeams
}

// 获取指定团队的成员列表
export function getTeamMembers(teamId: string): TeamMember[] {
  return mockTeamMembers[teamId] || []
}

// 获取所有团队的成员（合并去重，排除自己）
export function getAllMembers(): Array<TeamMember & { team_id: string, team_name: string }> {
  const result: Array<TeamMember & { team_id: string, team_name: string }> = []
  const teamMap = new Map(mockTeams.map(t => [t.team_id, t.name]))

  for (const [teamId, members] of Object.entries(mockTeamMembers)) {
    const teamName = teamMap.get(teamId) || ''
    for (const m of members) {
      if (m.user_id !== 'u-001') { // 排除自己
        result.push({ ...m, team_id: teamId, team_name: teamName })
      }
    }
  }
  return result
}

// 判断当前用户是否有权限指派（某团队的 admin 或 can_dispatch）
export function canAssignInTeam(teamId: string): boolean {
  const team = mockTeams.find(t => t.team_id === teamId)
  if (!team) return false
  if (team.my_role === 'admin') return true
  const me = mockTeamMembers[teamId] && mockTeamMembers[teamId].find(m => m.user_id === 'u-001')
  return !!(me && me.can_dispatch === true)
}

// 团队对外展示数据
export function getTeamProfile(teamId: string): TeamProfile {
  const team = mockTeams.find(t => t.team_id === teamId)
  return {
    team_id: teamId,
    name: team ? team.name : '未知团队',
    logo_url: team ? team.logo_url : '',
    cover_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    description: team ? team.description : '',
    city: team ? team.city : '',
    service_types: team ? team.service_types : [],
    contact_phone: team ? team.contact_phone : '',
    member_count: team ? team.member_count : 0,
    view_count: 13863,
    created_at: team ? team.created_at : ''
  }
}

// 团队成员对外展示数据
export function getTeamProfileMembers(teamId: string): TeamProfileMember[] {
  const members = mockTeamMembers[teamId] || []
  // 按 user_id 映射，避免位置数组长度不匹配
  const priceMap: Record<string, string> = {
    'u-003': '1280元/场',
    'u-006': '2880元/场'
  }
  const phoneMap: Record<string, string> = {
    'u-001': '13800138001',
    'u-002': '13800138002',
    'u-004': '13800138004',
    'u-005': '13800138005',
    'u-007': '13900139001',
    'u-008': '13900139002'
  }
  const defaultWorks = [
    { image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', title: '婚礼作品1' },
    { image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', title: '婚礼作品2' }
  ]
  const verifiedIds: Record<string, boolean> = { 'u-001': true, 'u-002': true, 'u-007': true }
  return members.map((m) => ({
    user_id: m.user_id,
    nickname: m.nickname,
    avatar_url: m.avatar_url,
    professions: m.professions,
    price_text: priceMap[m.user_id] || '暂未设置价格',
    phone: phoneMap[m.user_id] || '',
    is_verified: !!verifiedIds[m.user_id],
    works: defaultWorks
  }))
}

// 获取团队某日的档期概览
export function getTeamSchedule(teamId: string, date: string): TeamScheduleItem[] {
  const members = mockTeamMembers[teamId] || []
  const dayHash = parseInt(date.replace(/-/g, ''), 10)
  return members.map((m, i) => {
    const seed = (dayHash + i * 7) % 10
    if (seed < 6) {
      const statuses: Array<'confirmed' | 'pending' | 'rest'> = ['confirmed', 'pending', 'rest']
      const status = statuses[seed % 3]
      return {
        user_id: m.user_id,
        nickname: m.nickname,
        avatar_url: m.avatar_url,
        professions: m.professions,
        status,
        start_time: status !== 'rest' ? '08:00' : undefined,
        end_time: status !== 'rest' ? '18:00' : undefined,
        location: status !== 'rest' ? '杭州西湖区' : undefined
      }
    }
    return {
      user_id: m.user_id,
      nickname: m.nickname,
      avatar_url: m.avatar_url,
      professions: m.professions,
      status: 'free' as const
    }
  })
}
