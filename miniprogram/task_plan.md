# 档期通小程序 — 整体进度计划

## Goal
完成档期通小程序所有页面开发，包括已实现模块的优化和未实现模块（消息、个人中心）的开发。

## Current Phase
Phase 9

## Phases

### Phase 1: 基础设施 + 档期模块 ✅
- [x] 项目初始化、样式体系（variables/global/iconfont）
- [x] nav-bar 组件、auth-guard 行为
- [x] 档期日历页（index）— 日历滑动、档期列表、筛选
- [x] 档期详情页（detail）— hero 区、信息卡片、操作
- [x] 档期编辑页（edit）— 新建/编辑表单
- [x] 档期搜索页（search）
- **Status:** complete

### Phase 2: 工单模块 ✅
- [x] 职业常量（constants/professions.ts）
- [x] Mock 数据 + API（mock/orders.ts, apis/orders.ts）
- [x] 工单广场页（square）— 城市/排序/职业筛选、分页加载
- [x] 订单详情页（detail）— 抢单交互、职业匹配校验
- [x] 发单页（publish）— 表单、职业底部弹出选择
- [x] 城市选择页（city）
- **Status:** complete

### Phase 3: Bug 修复 + 优化 ✅
- [x] 档期日历页日期行位置偏移 bug
- [x] 编辑保存后跳转逻辑（编辑→返回，新建→跳详情）
- [x] 日历取消选择不生效 bug
- [x] c-body 高度不一致问题
- [x] c-body-header 挪出 c-body 同级
- [x] 重复引入 global.wxss 清理
- **Status:** complete

### Phase 4: 登录模块 ✅
- [x] 登录页（login/index）
- [x] auth-guard 行为
- **Status:** complete

### Phase 5: 团队模块 ✅
- [x] 团队主页（team/list）— 周日历 + 成员档期状态
- [x] 成员管理页（team/members）— 成员列表 + 权限操作
- [x] 团队名片页（team/card）— 个人档期卡展示
- [x] 团队对外主页（team/profile）— 封面图 + 作品/成员 Tab
- [x] 公共输入页（common/input）— 统一文本输入
- [x] Mock 数据 + API 扩展
- **Status:** complete

### Phase 6: 团队模块完善 + Bug 修复 ✅
- [x] team/list 空团队状态（创建/加入团队入口）
- [x] team/list 权限按钮（管理员→团队管理，成员→团队主页）
- [x] team/members 服务类型标签展示
- [x] team/members 编辑改用公共输入页（替代 wx.showModal）
- [x] team/list 下拉定位修复（dropTop 使用 navBarHeight）
- [x] 修复可选链语法 `?.` 不兼容微信小程序（orders.ts, teams.ts, members.ts）
- [x] updateTeam 类型定义扩展（支持 cover_url, service_types）
- [x] members.ts 全部 API 调用加错误处理
- [x] 创建模式空卡片修复
- [x] 创建团队流程跳转修复（navigateBack 替代 redirectTo）
- **Status:** complete

### Phase 7: 消息模块 ✅
- [x] 消息列表页（chat/list）— 会话列表
- [x] 聊天详情页（chat/detail）— 文字/图片/位置消息、发送
- [x] Mock 数据 + API（mock/chat.ts, apis/chat.ts）
- **Status:** complete

### Phase 8: 个人中心模块 ✅
- [x] 个人中心页（profile/index）— 头像、昵称、设置入口
- [x] 编辑资料页（profile/edit）
- [x] 抢单列表页（profile/grab）— 我发布的工单
- [x] 抢单详情页（profile/grab-detail）— 抢单人管理、接受/回拒
- [x] Mock 数据 + API
- **Status:** complete

### Phase 9: 全局优化 + 联调
- [x] 暗黑模式全面适配检查（theme.json 修复 + CSS 变量覆盖 + 页面硬编码色替换）
- [x] TabBar 暗黑适配（独立样式 + 动态 bgColor + runtime themeChange）
- [x] Mock 数据一致性检查（grab_count 对齐 + grab_status 统一 + schedule ID 前缀 + teams 映射化）
- [ ] 页面间跳转串联测试
- **Status:** complete（跳转串联留待下一阶段）

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 使用 WXS 做视图层函数 | 微信小程序要求，避免 setData 性能损耗 |
| Mock 数据 + USE_MOCK 开关 | 前后端并行开发，可随时切换 |
| card-top 模式 | nav-bar 与首张卡片无缝衔接的视觉方案 |
| 底部弹出选择器 | 职业选择等多选项用底部 sheet 而非原生 picker |
| c-body-header 同级拆分 | 独立 sticky 定位，不随列表内容滚动 |
| 公共输入页替代 wx.showModal | 更好的输入体验，支持多行/数字/手机号等类型 |
| 固定 hero + 占位 div | 详情页 hero 固定定位，内容不被遮挡 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| 日历取消选择不生效 | 1 | rebuildAllCal 在 setData 之前读了旧 selectedDate，移到 setData 之后 |
| 编辑保存后返回逻辑 | 1 | 编辑→navigateBack，新建→redirectTo 详情页 |
| 日历日期行位置偏移 | 1 | onDayTap 中不应设置 listTab: '' |
| c-body 高度跳变 | 2 | 先去 min-height（用户不同意），改 min-height: 100vh |
| global.wxss 重复引入 | 1 | 清理 6 个页面的 @import，只保留 app.wxss |
| 可选链 `?.` 编译报错 | 1 | 微信小程序不支持，改为 `&&` 或三元表达式 |
| updateTeam 类型过窄 | 1 | 扩展参数类型支持 cover_url/service_types |
| 创建模式显示空卡片 | 1 | 外层 wx:if 改为仅 isAdmin |
