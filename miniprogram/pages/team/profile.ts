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
    heroPaddingTop: '',
    heroHeight: 0
  },

  onLoad(options: any) {
    const teamId = options.teamId || ''
    if (!teamId) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    const windowInfo = wx.getWindowInfo()
    this.setData({
      teamId,
      heroPaddingTop: windowInfo.statusBarHeight + 'px'
    })
    this.loadData(teamId)
  },

  onReady() {
    this.calcHeroHeight()
  },

  calcHeroHeight() {
    const query = this.createSelectorQuery()
    query.select('.tp-hero').boundingClientRect((rect: any) => {
      if (rect) {
        this.setData({ heroHeight: rect.height })
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
        this.calcHeroHeight()
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
