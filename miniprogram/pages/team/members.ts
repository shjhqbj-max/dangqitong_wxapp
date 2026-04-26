// 成员管理页
import authGuard from '../../behaviors/auth-guard'
import * as teamApi from '../../apis/team'
import { Team, TeamMember } from '../../mock/types'

Page({
  behaviors: [authGuard],
  data: {
    teamId: '',
    team: null as Team | null,
    members: [] as TeamMember[],
    isAdmin: false,
    inviteCode: 'DQTHGZ01',
    actionIdx: -1
  },

  onLoad(options: any) {
    const teamId = options.teamId || ''
    this.setData({ teamId })
    this.loadData()
  },

  async loadData() {
    const res = await teamApi.getMyTeams()
    if (res.code !== 200) return
    const team = res.data.find((t: Team) => t.team_id === this.data.teamId) || null
    if (!team) return
    const mRes = await teamApi.getTeamMembers(this.data.teamId)
    const members = mRes.code === 200 ? mRes.data : []
    this.setData({
      team,
      members,
      isAdmin: team.my_role === 'admin'
    })
  },

  onMemberAction(e: any) {
    const idx = e.currentTarget.dataset.idx
    const member = this.data.members[idx]
    if (member.user_id === 'u-001') return

    const items = member.role === 'admin'
      ? ['取消管理员', '移出团队']
      : ['设为管理员', '移出团队']

    wx.showActionSheet({
      itemList: items,
      success: async (res) => {
        if (res.tapIndex === 0) {
          const newRole = member.role === 'admin' ? 'member' : 'admin'
          await teamApi.updateMemberRole(this.data.teamId, member.user_id, newRole)
          wx.showToast({ title: '已更新', icon: 'none' })
          this.loadData()
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '确认移除',
            content: '确定将「' + member.nickname + '」移出团队？',
            success: async (modal) => {
              if (!modal.confirm) return
              await teamApi.removeMember(this.data.teamId, member.user_id)
              wx.showToast({ title: '已移除', icon: 'none' })
              this.loadData()
            }
          })
        }
      }
    })
  },

  onCopyInvite() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => wx.showToast({ title: '已复制', icon: 'none' })
    })
  },

  onMemberTap(e: any) {
    const userId = e.currentTarget.dataset.uid
    if (!userId) return
    wx.navigateTo({ url: '/pages/team/card?userId=' + userId })
  },

  onLeaveTeam() {
    wx.showModal({
      title: '退出团队',
      content: '确定退出「' + (this.data.team ? this.data.team.name : '') + '」？',
      success: async (res) => {
        if (!res.confirm) return
        await teamApi.leaveTeam(this.data.teamId)
        wx.showToast({ title: '已退出', icon: 'none' })
        wx.navigateBack()
      }
    })
  }
})
