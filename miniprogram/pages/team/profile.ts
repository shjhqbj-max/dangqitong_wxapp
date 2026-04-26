// 团队对外展示页
import * as profileApi from '../../apis/team-profile'
import { TeamProfile, TeamProfileMember, MemberWork } from '../../mock/types'

// 作品条目（扁平化，附加成员信息）
interface WorkItem {
  user_id: string
  nickname: string
  avatar_url: string
  image_url: string
  title?: string
}

Page({
  data: {
    teamId: '',
    team: null as TeamProfile | null,
    members: [] as TeamProfileMember[],
    worksList: [] as WorkItem[],
    activeTab: 'works',
    loading: true,
    backBtnTop: 0,
    headerHeight: 0
  },

  onLoad(options: any) {
    const teamId = options.teamId || ''
    if (!teamId) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    const windowInfo = wx.getWindowInfo()
    const capsule = wx.getMenuButtonBoundingClientRect()
    // 返回按钮与原生胶囊垂直居中对齐
    const backBtnTop = capsule.top + (capsule.height - 32) / 2
    this.setData({
      teamId,
      backBtnTop
    })
    this.loadData(teamId)
  },

  onReady() {
    this.calcHeaderHeight()
  },

  calcHeaderHeight() {
    const query = this.createSelectorQuery()
    query.select('.tp-header').boundingClientRect((rect: any) => {
      if (rect) {
        this.setData({ headerHeight: rect.height })
      }
    }).exec()
  },

  async loadData(teamId: string) {
    try {
      const [profileRes, membersRes] = await Promise.all([
        profileApi.getTeamProfile(teamId),
        profileApi.getTeamProfileMembers(teamId)
      ])
      let team = null
      let members: TeamProfileMember[] = []
      if (profileRes.code === 200 && profileRes.data) {
        team = profileRes.data
      }
      if (membersRes.code === 200 && membersRes.data) {
        members = membersRes.data
      }
      const worksList = this.flattenWorks(members)
      this.setData({ team, members, worksList, loading: false }, () => {
        this.calcHeaderHeight()
      })
    } catch (e) {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  flattenWorks(members: TeamProfileMember[]): WorkItem[] {
    const result: WorkItem[] = []
    for (const m of members) {
      for (const w of m.works) {
        result.push({
          user_id: m.user_id,
          nickname: m.nickname,
          avatar_url: m.avatar_url,
          image_url: w.image_url,
          title: w.title
        })
      }
    }
    return result
  },

  onBack() {
    wx.navigateBack()
  },

  onTabTap(e: any) {
    const tab = e.currentTarget.dataset.tab
    if (tab === this.data.activeTab) return
    this.setData({ activeTab: tab })
  },

  onMemberTap(e: any) {
    const userId = e.currentTarget.dataset.uid
    if (!userId) return
    wx.navigateTo({ url: '/pages/team/card?userId=' + userId })
  },

  onPhoneTap(e: any) {
    const phone = e.currentTarget.dataset.phone
    if (!phone) return
    wx.makePhoneCall({ phoneNumber: phone })
  },

  onShareAppMessage() {
    const team = this.data.team
    return {
      title: team ? team.name : '团队主页',
      path: '/pages/team/profile?teamId=' + (team ? team.team_id : '')
    }
  }
})
