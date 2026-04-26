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
    created_at: '2025-08-15T10:00:00'
  }
]

// 团队成员数据
export const mockTeamMembers: Record<string, TeamMember[]> = {
  't-001': [
    {
      user_id: 'u-001',
      nickname: '我自己',
      avatar_url: 'https://i.pravatar.cc/150?img=11',
      professions: ['摄影'],
      role: 'admin',
      can_dispatch: true,
      joined_at: '2025-06-01T10:00:00'
    },
    {
      user_id: 'u-002',
      nickname: '张三',
      avatar_url: 'https://i.pravatar.cc/150?img=12',
      professions: ['摄像'],
      role: 'member',
      can_dispatch: true,
      joined_at: '2025-06-15T10:00:00'
    },
    {
      user_id: 'u-003',
      nickname: '李四',
      avatar_url: 'https://i.pravatar.cc/150?img=13',
      professions: ['摄影', '摄像'],
      role: 'member',
      can_dispatch: true,
      joined_at: '2025-07-01T10:00:00'
    },
    {
      user_id: 'u-004',
      nickname: '王五',
      avatar_url: 'https://i.pravatar.cc/150?img=14',
      professions: ['化妆'],
      role: 'member',
      can_dispatch: false,
      joined_at: '2025-08-01T10:00:00'
    },
    {
      user_id: 'u-005',
      nickname: '赵六',
      avatar_url: 'https://i.pravatar.cc/150?img=15',
      professions: ['摄像', '航拍'],
      role: 'member',
      can_dispatch: true,
      joined_at: '2025-09-01T10:00:00'
    },
    {
      user_id: 'u-006',
      nickname: '孙七',
      avatar_url: 'https://i.pravatar.cc/150?img=16',
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
      avatar_url: 'https://i.pravatar.cc/150?img=20',
      professions: ['化妆'],
      role: 'admin',
      can_dispatch: true,
      joined_at: '2025-08-15T10:00:00'
    },
    {
      user_id: 'u-008',
      nickname: '吴九',
      avatar_url: 'https://i.pravatar.cc/150?img=21',
      professions: ['花艺'],
      role: 'member',
      can_dispatch: true,
      joined_at: '2025-09-01T10:00:00'
    },
    {
      user_id: 'u-009',
      nickname: '郑十',
      avatar_url: 'https://i.pravatar.cc/150?img=22',
      professions: ['摄影'],
      role: 'member',
      can_dispatch: true,
      joined_at: '2025-10-01T10:00:00'
    },
    {
      user_id: 'u-010',
      nickname: '冯十一',
      avatar_url: 'https://i.pravatar.cc/150?img=23',
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
  return me && me.can_dispatch === true
}

// 团队对外展示数据
export function getTeamProfile(teamId: string): TeamProfile {
  const team = mockTeams.find(t => t.team_id === teamId)
  return {
    team_id: teamId,
    name: team ? team.name : '未知团队',
    logo_url: team ? team.logo_url : 'https://i.pravatar.cc/150?img=60',
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
  const prices = ['', '', '1280元/场', '', '2880元/场', '']
  const phones = ['13800138001', '13800138002', '', '13800138004', '13800138005', '']
  const workSets = [
    [
      { image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', title: '西湖婚礼' },
      { image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', title: '草坪婚礼' },
      { image_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80', title: '室内婚礼' }
    ],
    [
      { image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', title: '婚礼航拍' },
      { image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', title: '年会拍摄' }
    ],
    [
      { image_url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&q=80', title: '新娘跟拍' },
      { image_url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80', title: '外景婚纱' },
      { image_url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80', title: '古镇婚纱' }
    ],
    [
      { image_url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80', title: '新娘妆容' },
      { image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80', title: '晚宴造型' }
    ],
    [
      { image_url: 'https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?w=600&q=80', title: '航拍作品' },
      { image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80', title: '电影感短片' },
      { image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80', title: '婚礼现场' }
    ],
    [
      { image_url: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80', title: '婚礼灯光' },
      { image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', title: '舞台灯光' }
    ]
  ]
  return members.map((m, i) => ({
    user_id: m.user_id,
    nickname: m.nickname,
    avatar_url: m.avatar_url,
    professions: m.professions,
    price_text: prices[i] || '暂未设置价格',
    phone: phones[i] || '',
    is_verified: i === 0 || i === 1,
    works: workSets[i] || [{ image_url: 'https://picsum.photos/600/400?random=' + i }]
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
