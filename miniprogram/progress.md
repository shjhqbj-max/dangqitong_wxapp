# 档期通小程序 — 进度日志

## Session: 2026-04-26 (上)

### Phase 1: 基础设施 + 档期模块
- **Status:** complete
- Actions taken:
  - 创建样式体系（variables/global/iconfont）
  - 实现 nav-bar 组件
  - 档期日历页：swiper 三面板滑动、档期点、筛选面板
  - 档期详情页：hero 区、信息卡片、操作栏
  - 档期编辑页：表单、时间选择器、地址选择
  - 档期搜索页
- Files created/modified:
  - styles/variables.wxss, global.wxss, iconfont.wxss
  - components/nav-bar/*
  - pages/schedule/index|detail|edit|search.*
  - behaviors/auth-guard.ts
  - utils/helpers.wxs, request.ts
  - mock/types.ts, schedules.ts
  - apis/schedule.ts, auth.ts

### Phase 2: 工单模块
- **Status:** complete
- Actions taken:
  - 创建职业常量模块 constants/professions.ts
  - 创建 mock/orders.ts（30+ 条工单数据）
  - 创建 apis/orders.ts
  - 工单广场页：城市/排序/职业筛选、"我的"抢单模式、分页加载
  - 订单详情页：抢单交互、职业匹配校验
  - 发单页：表单、职业底部弹出选择
  - 城市选择页
- Files created/modified:
  - constants/professions.ts
  - mock/orders.ts, apis/orders.ts
  - pages/orders/square|detail|publish|city.*
  - app.json

### Phase 3: Bug 修复 + 优化
- **Status:** complete
- Actions taken:
  - 修复 onDayTap 设置 listTab: '' 导致日期行位置偏移
  - 修改编辑保存跳转逻辑：编辑→navigateBack，新建→redirectTo 详情
  - 修复 onRemoveFilterTag 中 rebuildAllCal 在 setData 前执行导致取消选择不生效
  - c-body 高度改为 min-height: 100vh
  - c-body-header 挪出 c-body 同级，添加独立 padding
  - 清理 6 个页面重复的 global.wxss @import

### Phase 5: 团队模块
- **Status:** complete
- Actions taken:
  - 风暴设计：周日历 + 成员状态 + 独立管理页
  - 创建 TeamScheduleItem 类型 + getTeamSchedule mock
  - 扩展 API：getTeamSchedule/updateMemberRole/removeMember/leaveTeam
  - WXS 新增 getTeamStatusText 辅助函数
  - 团队主页：团队切换下拉、周日历、已排期/空闲成员分区
  - 成员管理页：成员列表、角色操作、邀请码、退出团队
- Files created/modified:
  - mock/types.ts, mock/teams.ts
  - apis/team.ts
  - utils/helpers.wxs
  - pages/team/list.*
  - pages/team/members.*
  - app.json

## Session: 2026-04-26 (下)

### Phase 6: 团队模块完善 + Bug 修复
- **Status:** complete
- Actions taken:
  - **团队名片页（team/card）**：固定 hero + 占位 div、作品全屏展示、分享档期卡图片、约档期跳转
  - **团队对外主页（team/profile）**：封面图 + info-bar、作品/成员双 Tab、返回按钮定位
  - **公共输入页（common/input）**：原生 nav、单行/多行/数字/手机号四种输入、eventChannel 回传
  - **team/list 空团队状态**：创建/加入团队入口按钮
  - **team/list 权限按钮**：管理员→团队管理(members)，成员→团队主页(profile)
  - **team/members 服务类型标签**：展示团队服务类型
  - **team/members 编辑改用公共输入页**：onEditName/onEditServiceTypes 跳转 input 页
  - **team/list 下拉定位修复**：dropTop 从 t-hero.bottom 改为 navBarHeight
  - **可选链语法修复**：mock/orders.ts、mock/teams.ts、pages/team/members.ts 共 13 处 `?.` 改为 `&&`/三元
  - **updateTeam 类型扩展**：参数类型增加 cover_url、service_types
  - **members.ts 全量错误处理**：所有 API 调用加 try/catch + res.code 判断
  - **创建模式空卡片修复**：设置卡片 wx:if 改为仅 isAdmin
  - **创建团队流程修复**：redirectTo 改为 navigateBack
  - **邀请码硬编码修复**：改为从 team.team_id 生成
- Files created/modified:
  - pages/team/card.wxml/.wxss/.ts/.json（新建）
  - pages/team/profile.wxml/.wxss/.ts/.json（重写）
  - pages/common/input.wxml/.wxss/.ts/.json（新建）
  - pages/team/list.wxml（空状态 + 权限按钮）
  - pages/team/list.ts（isAdmin + dropTop + joinTeam）
  - pages/team/list.wxss（空状态样式）
  - pages/team/members.ts（重写：错误处理 + 公共输入页）
  - pages/team/members.wxml（服务类型标签）
  - pages/team/members.wxss（标签样式）
  - apis/team.ts（updateTeam 类型扩展 + joinTeam）
  - mock/orders.ts（可选链修复）
  - mock/teams.ts（可选链修复）

## Session: 2026-04-27

### Phase 7: 消息模块
- **Status:** complete
- Actions taken:
  - 聊天测试数据扩充（ch-001 从 7 条增至 38 条，覆盖文字/图片/位置/系统消息）
  - Mock 数据 + API（mock/chat.ts, apis/chat.ts）
  - 消息列表页（chat/list）、聊天详情页（chat/detail）

### Phase 8: 个人中心模块
- **Status:** complete
- Actions taken:
  - 个人中心页（profile/index）、编辑资料页（profile/edit）
  - 抢单列表页（profile/grab）、抢单详情页（profile/grab-detail）
  - 抢单详情页重构：简化 header、去掉统计栏/邀请、价格+下拉 ActionSheet
  - 接受/回拒逻辑完善（接受后同职业满人自动回拒其余）
  - 工单详情页抢单流程：内联表单（报价+一句话介绍 textarea）、遮罩层
  - 全项目头像统一默认兜底（images/avatar.png，15 处 wxml + 6 个 mock 文件清空）

### Phase 9: 全局优化 + 联调
- **Status:** complete
- Actions taken:
  - **theme.json 修复**：bgColor 光暗值反转（light→#F8FAFC，dark→#0F172A）
  - **CSS 变量暗黑覆盖**：`--role-*` 10 个职业色提亮（video→#A78BFA、photo→#22D3EE 等）
  - **新增 CSS 变量**：`--color-warning-bg`、`--color-danger-bg`、`--color-success-bg`（含暗黑覆盖）
  - **页面 wxss 硬编码色替换**：orders/square（9处状态色）、orders/detail（badge + grab-form + 提交按钮）
  - **app.ts 加 wx.onThemeChange**：运行时主题检测，globalData.theme 持久化
  - **TabBar 暗黑适配**：wxss 补 tab-text/tab-item.active/tab-add-circle 暗黑覆盖
  - **TabBar bgColor 动态化**：4 个 tab 页 + tab-bar 组件 + attached 生命周期 themeChange 监听
  - **Mock 数据一致性**：
    - 6 个工单 grab_count 对齐 grabbers.length
    - 全部 grabber 统一添加 grab_status 字段
    - Schedule ID 全部加 's-' 前缀（30 条 + chat 13 处引用 + 5 处通知）
    - getTeamProfileMembers 改为 user_id 映射（消除位置数组交叉污染）
    - canAssignInTeam 返回值明确为 boolean（!!转译）
- Files created/modified:
  - theme.json（bgColor 修复）
  - styles/variables.wxss（role-* 暗黑 + 状态背景变量）
  - app.ts（onThemeChange 监听）
  - custom-tab-bar/index.wxss（暗黑覆盖补全）
  - custom-tab-bar/index.ts（bgColor 动态 + attached listener）
  - pages/schedule/index.ts（动态 bgColor）
  - pages/chat/list.ts（动态 bgColor）
  - pages/orders/square.ts（动态 bgColor）
  - pages/profile/index.ts（动态 bgColor）
  - pages/orders/square.wxss（状态色 CSS 变量）
  - pages/orders/detail.wxss（badge/grab-form CSS 变量）
  - mock/orders.ts（grab_count + grab_status）
  - mock/schedules.ts（s- 前缀）
  - mock/chat.ts（s- 前缀引用）
  - mock/teams.ts（getTeamProfileMembers 映射化 + canAssignInTeam）

## Test Results
| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| 日历取消选择 | 点击关闭图标后日历取消高亮 | 已修复 | ✓ |
| 编辑保存返回 | 编辑→返回详情，新建→跳详情 | 已修复 | ✓ |
| c-body 高度 | 有无内容高度一致 | 已修复 | ✓ |
| global.wxss 去重 | 只有 app.wxss 引入 | 已修复 | ✓ |
| theme.json bgColor | light=#F8FAFC, dark=#0F172A | 已修复 | ✓ |
| --role-* 暗黑对比度 | 提亮深色职业色 | 10 个变量覆盖 | ✓ |
| 订单状态色 CSS 变量 | warning/danger/success 用 var() | 9 处替换 | ✓ |
| TabBar 暗黑覆盖 | tab-text/active/add-circle | 补全 | ✓ |
| TabBar bgColor 动态 | 根据 theme 选择颜色 | 4 页 + 组件 | ✓ |
| grab_count 对齐 | 等于 grabbers.length | 6 订单修复 | ✓ |
| grab_status 统一 | 所有 grabber 有 grab_status | 全量补全 | ✓ |
| schedule ID 前缀 | 统一 's-' 前缀 | 30 条 + 18 处引用 | ✓ |
| getTeamProfileMembers | user_id 映射替代位置数组 | 消除交叉污染 | ✓ |
| 可选链编译 | 无 SyntaxError | 13 处全部替换 | ✓ |
| 创建模式 | 无空卡片 | settings 卡片隐藏 | ✓ |
| API 错误处理 | 失败有 toast 提示 | try/catch + code 判断 | ✓ |

## Error Log
| Timestamp | Error | Attempt | Resolution |
|-----------|-------|---------|------------|
| 2026-04-26 | 日历取消选择不生效 | 1 | rebuildAllCal 移到 setData 之后 |
| 2026-04-26 | c-body 高度跳变 | 2 | 先去 min-height 被拒，改 100vh |
| 2026-04-26 | 可选链 `?.` 编译报错 | 1 | 改为 `&&` 或三元表达式 |
| 2026-04-26 | updateTeam 类型过窄 | 1 | 扩展参数类型 |
| 2026-04-26 | 创建模式空卡片 | 1 | wx:if 改为仅 isAdmin |
| 2026-04-26 | 作品全屏关闭按钮被胶囊遮挡 | 2 | 先绝对定位不行，改 flex bar + title 后 |
| 2026-04-26 | card hero 背景色割裂 | 1 | 深色 immersive 改为渐变 + 白色内容 |
| 2026-04-27 | macOS sed 反向引用失败 | 2 | 改用 perl -pe 替代 sed -E |

## 5-Question Reboot Check
| Question | Answer |
|----------|--------|
| Where am I? | Phase 9 — 全局优化完成，仅剩跳转串联测试 |
| Where am I going? | 跳转串联测试，或新功能迭代 |
| What's the goal? | 完成所有页面联调 |
| What have I learned? | macOS sed 不支持 `\1` 反向引用，用 perl 替代；TabBar 独立样式域需自行处理暗黑；`wx.onThemeChange` 在组件内用 lifetimes.attached 注册 |
| What have I done? | 暗黑模式全适配 + TabBar 动态主题 + Mock 数据一致性修复 |
