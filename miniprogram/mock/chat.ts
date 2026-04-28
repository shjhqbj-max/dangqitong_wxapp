// DQT Mock 数据 — 聊天会话 + 系统通知
import { Chat, Message, Notification } from './types'

// ====== 聊天会话 ======
export const mockChats: Chat[] = [
  {
    chat_id: 'ch-001',
    chat_name: '5月3日·杭州西湖婚礼',
    chat_type: 'schedule_temp',
    schedule_id: 's-1',
    team_id: '',
    member_count: 4,
    expire_at: '2026-05-04T00:00:00',
    last_message: { sender_name: '张三', content: '收到，我会带设备过去', sent_at: '2026-04-26T09:30:00' },
    unread_count: 3,
    created_at: '2026-04-25T10:00:00'
  },
  {
    chat_id: 'ch-002',
    chat_name: '5月10日·草坪婚礼跟拍',
    chat_type: 'schedule_temp',
    schedule_id: 's-2',
    team_id: '',
    member_count: 3,
    expire_at: '2026-05-11T00:00:00',
    last_message: { sender_name: '李四', content: '航拍用大疆Mini可以吗？', sent_at: '2026-04-26T08:15:00' },
    unread_count: 1,
    created_at: '2026-04-24T14:00:00'
  },
  {
    chat_id: 'ch-003',
    chat_name: '5月18日·古镇婚纱照',
    chat_type: 'schedule_temp',
    schedule_id: 's-3',
    team_id: '',
    member_count: 5,
    expire_at: '2026-05-19T00:00:00',
    last_message: { sender_name: '王五', content: '化妆造型方案已发到群里', sent_at: '2026-04-25T22:00:00' },
    unread_count: 0,
    created_at: '2026-04-23T09:00:00'
  },
  {
    chat_id: 'ch-004',
    chat_name: '6月1日·年会拍摄',
    chat_type: 'schedule_temp',
    schedule_id: 's-5',
    team_id: '',
    member_count: 6,
    expire_at: '2026-06-02T00:00:00',
    last_message: { sender_name: '赵六', content: '场地确认了，3号厅', sent_at: '2026-04-25T16:30:00' },
    unread_count: 5,
    created_at: '2026-04-22T11:00:00'
  },
  {
    chat_id: 'ch-005',
    chat_name: '上海璀璨婚礼团队',
    chat_type: 'team',
    schedule_id: '',
    team_id: 't-002',
    member_count: 4,
    expire_at: '',
    last_message: { sender_name: '周八', content: '下周有人有空吗？有个急单', sent_at: '2026-04-24T20:00:00' },
    unread_count: 0,
    created_at: '2026-04-20T10:00:00'
  },
  {
    chat_id: 'ch-006',
    chat_name: '5月25日·室内婚礼',
    chat_type: 'schedule_temp',
    schedule_id: 's-7',
    team_id: '',
    member_count: 3,
    expire_at: '2026-05-26T00:00:00',
    last_message: null,
    unread_count: 0,
    created_at: '2026-04-26T10:00:00'
  },
  {
    chat_id: 'ch-007',
    chat_name: '新娘小美',
    chat_type: 'private',
    schedule_id: 's-1',
    team_id: '',
    member_count: 2,
    expire_at: '',
    last_message: { sender_name: '小美', content: '摄影师可以早点到吗？我想拍一些晨妆的照片', sent_at: '2026-04-26T10:20:00' },
    unread_count: 2,
    created_at: '2026-04-26T09:00:00'
  },
  {
    chat_id: 'ch-008',
    chat_name: '5月8日·户外毕业照',
    chat_type: 'schedule_temp',
    schedule_id: 's-8',
    team_id: '',
    member_count: 3,
    expire_at: '2026-05-09T00:00:00',
    last_message: { sender_name: '刘十二', content: '反光板我来带', sent_at: '2026-04-26T07:00:00' },
    unread_count: 0,
    created_at: '2026-04-25T15:00:00'
  },
  {
    chat_id: 'ch-009',
    chat_name: '杭州光影工作室',
    chat_type: 'team',
    schedule_id: '',
    team_id: 't-001',
    member_count: 6,
    expire_at: '',
    last_message: { sender_name: '我自己', content: '5月排期表已更新，大家确认', sent_at: '2026-04-25T23:00:00' },
    unread_count: 0,
    created_at: '2026-01-10T10:00:00'
  },
  {
    chat_id: 'ch-010',
    chat_name: '婚庆公司·陈经理',
    chat_type: 'private',
    schedule_id: '',
    team_id: '',
    member_count: 2,
    expire_at: '',
    last_message: { sender_name: '陈经理', content: '6月15日有个高端婚礼，你们团队接吗？报价多少？', sent_at: '2026-04-26T11:00:00' },
    unread_count: 1,
    created_at: '2026-04-20T08:00:00'
  },
  {
    chat_id: 'ch-011',
    chat_name: '5月30日·别墅派对',
    chat_type: 'schedule_temp',
    schedule_id: 's-11',
    team_id: '',
    member_count: 4,
    expire_at: '2026-05-31T00:00:00',
    last_message: { sender_name: '吴九', content: '花艺清单我明天发你', sent_at: '2026-04-25T19:45:00' },
    unread_count: 0,
    created_at: '2026-04-23T16:00:00'
  },
  {
    chat_id: 'ch-012',
    chat_name: '6月8日·酒店婚礼',
    chat_type: 'schedule_temp',
    schedule_id: 's-12',
    team_id: '',
    member_count: 5,
    expire_at: '2026-06-09T00:00:00',
    last_message: { sender_name: '郑十', content: '新娘是外国人，需要双语主持', sent_at: '2026-04-25T14:20:00' },
    unread_count: 8,
    created_at: '2026-04-22T09:00:00'
  },
  {
    chat_id: 'ch-013',
    chat_name: '5月3日婚礼拍摄全套·工单群',
    chat_type: 'schedule_temp',
    schedule_id: '',
    team_id: '',
    member_count: 3,
    expire_at: '2026-05-04T00:00:00',
    last_message: { sender_name: '李四', content: '摄影设备我来准备，摄像需要带稳定器', sent_at: '2026-04-26T12:00:00' },
    unread_count: 2,
    created_at: '2026-04-26T11:30:00'
  }
]

// ====== 消息数据（按 chat_id 分组）======
export const mockMessages: Record<string, Message[]> = {
  'ch-001': [
    { message_id: 'm-001-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '档期群已创建，档期结束后自动关闭', sent_at: '2026-04-25T10:00:00' },
    { message_id: 'm-001-1', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '5月3日杭州西湖婚礼，大家确认下档期', sent_at: '2026-04-26T08:00:00' },
    { message_id: 'm-001-2', sender_id: 'u-002', sender_name: '张三', sender_avatar: 'https://i.pravatar.cc/150?img=12', msg_type: 'text', content: '已确认，当天没问题', sent_at: '2026-04-26T08:05:00' },
    { message_id: 'm-001-3', sender_id: 'u-003', sender_name: '李四', sender_avatar: 'https://i.pravatar.cc/150?img=13', msg_type: 'text', content: '我也OK，摄像设备需要额外带稳定器吗？', sent_at: '2026-04-26T08:10:00' },
    { message_id: 'm-001-4', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '带上吧，户外拍摄稳一点好', sent_at: '2026-04-26T08:20:00' },
    { message_id: 'm-001-5', sender_id: 'u-002', sender_name: '张三', sender_avatar: 'https://i.pravatar.cc/150?img=12', msg_type: 'location', content: '杭州西湖区北山街38号', sent_at: '2026-04-26T09:00:00' },
    { message_id: 'm-001-6', sender_id: 'u-002', sender_name: '张三', sender_avatar: 'https://i.pravatar.cc/150?img=12', msg_type: 'text', content: '收到，我会带设备过去', sent_at: '2026-04-26T09:30:00' }
  ],
  'ch-002': [
    { message_id: 'm-002-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '档期群已创建，档期结束后自动关闭', sent_at: '2026-04-24T14:00:00' },
    { message_id: 'm-002-1', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '5月10日草坪婚礼，新人要求航拍', sent_at: '2026-04-26T07:00:00' },
    { message_id: 'm-002-2', sender_id: 'u-003', sender_name: '李四', sender_avatar: 'https://i.pravatar.cc/150?img=13', msg_type: 'text', content: '场地在哪里？需要确认下禁飞区', sent_at: '2026-04-26T07:30:00' },
    { message_id: 'm-002-3', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'location', content: '杭州余杭区良渚文化艺术中心', sent_at: '2026-04-26T07:45:00' },
    { message_id: 'm-002-4', sender_id: 'u-003', sender_name: '李四', sender_avatar: 'https://i.pravatar.cc/150?img=13', msg_type: 'text', content: '航拍用大疆Mini可以吗？', sent_at: '2026-04-26T08:15:00' }
  ],
  'ch-003': [
    { message_id: 'm-003-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '档期群已创建，档期结束后自动关闭', sent_at: '2026-04-23T09:00:00' },
    { message_id: 'm-003-1', sender_id: 'u-004', sender_name: '王五', sender_avatar: 'https://i.pravatar.cc/150?img=14', msg_type: 'text', content: '新人想在乌镇拍，风格偏中式', sent_at: '2026-04-25T18:00:00' },
    { message_id: 'm-003-2', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '了解，我准备几套中式礼服备选', sent_at: '2026-04-25T18:30:00' },
    { message_id: 'm-003-3', sender_id: 'u-005', sender_name: '赵六', sender_avatar: 'https://i.pravatar.cc/150?img=15', msg_type: 'image', content: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', sent_at: '2026-04-25T20:00:00' },
    { message_id: 'm-003-4', sender_id: 'u-004', sender_name: '王五', sender_avatar: 'https://i.pravatar.cc/150?img=14', msg_type: 'text', content: '化妆造型方案已发到群里', sent_at: '2026-04-25T22:00:00' }
  ],
  'ch-004': [
    { message_id: 'm-004-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '档期群已创建，档期结束后自动关闭', sent_at: '2026-04-22T11:00:00' },
    { message_id: 'm-004-1', sender_id: 'u-005', sender_name: '赵六', sender_avatar: 'https://i.pravatar.cc/150?img=15', msg_type: 'text', content: '年会拍摄需要几个机位？', sent_at: '2026-04-25T14:00:00' },
    { message_id: 'm-004-2', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '至少三个，主舞台+观众+游机', sent_at: '2026-04-25T14:30:00' },
    { message_id: 'm-004-3', sender_id: 'u-006', sender_name: '孙七', sender_avatar: 'https://i.pravatar.cc/150?img=16', msg_type: 'text', content: '灯光需要我准备什么？', sent_at: '2026-04-25T15:00:00' },
    { message_id: 'm-004-4', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: 'LED补光灯带两组，再加一个柔光箱', sent_at: '2026-04-25T15:30:00' },
    { message_id: 'm-004-5', sender_id: 'u-005', sender_name: '赵六', sender_avatar: 'https://i.pravatar.cc/150?img=15', msg_type: 'text', content: '场地确认了，3号厅', sent_at: '2026-04-25T16:30:00' }
  ],
  'ch-005': [
    { message_id: 'm-005-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '团队群已创建', sent_at: '2026-04-20T10:00:00' },
    { message_id: 'm-005-1', sender_id: 'u-007', sender_name: '周八', sender_avatar: 'https://i.pravatar.cc/150?img=20', msg_type: 'text', content: '团队月度总结：4月完成12场拍摄', sent_at: '2026-04-24T19:00:00' },
    { message_id: 'm-005-2', sender_id: 'u-008', sender_name: '吴九', sender_avatar: 'https://i.pravatar.cc/150?img=21', msg_type: 'text', content: '5月排期已经出来了，大家看看', sent_at: '2026-04-24T19:30:00' },
    { message_id: 'm-005-3', sender_id: 'u-007', sender_name: '周八', sender_avatar: 'https://i.pravatar.cc/150?img=20', msg_type: 'text', content: '下周有人有空吗？有个急单', sent_at: '2026-04-24T20:00:00' }
  ],
  'ch-006': [
    { message_id: 'm-006-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '档期群已创建，档期结束后自动关闭', sent_at: '2026-04-26T10:00:00' }
  ],
  'ch-007': [
    { message_id: 'm-007-1', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '小美你好，我是5月3日婚礼的摄影师', sent_at: '2026-04-26T09:00:00' },
    { message_id: 'm-007-2', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '想提前确认下当天的流程安排', sent_at: '2026-04-26T09:01:00' },
    { message_id: 'm-007-3', sender_id: 'u-011', sender_name: '小美', sender_avatar: 'https://i.pravatar.cc/150?img=25', msg_type: 'text', content: '好的！当天大概6点开始化妆，8点半接亲', sent_at: '2026-04-26T09:30:00' },
    { message_id: 'm-007-4', sender_id: 'u-011', sender_name: '小美', sender_avatar: 'https://i.pravatar.cc/150?img=25', msg_type: 'text', content: '摄影师可以早点到吗？我想拍一些晨妆的照片', sent_at: '2026-04-26T10:20:00' }
  ],
  'ch-008': [
    { message_id: 'm-008-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '档期群已创建，档期结束后自动关闭', sent_at: '2026-04-25T15:00:00' },
    { message_id: 'm-008-1', sender_id: 'u-012', sender_name: '刘十二', sender_avatar: 'https://i.pravatar.cc/150?img=30', msg_type: 'text', content: '毕业照约在5月8日下午3点，校园拍', sent_at: '2026-04-26T06:00:00' },
    { message_id: 'm-008-2', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '好的，需要带几套镜头？', sent_at: '2026-04-26T06:15:00' },
    { message_id: 'm-008-3', sender_id: 'u-012', sender_name: '刘十二', sender_avatar: 'https://i.pravatar.cc/150?img=30', msg_type: 'text', content: '标准变焦加一个定焦就够了', sent_at: '2026-04-26T06:30:00' },
    { message_id: 'm-008-4', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: 'OK，那我带24-70和50定焦', sent_at: '2026-04-26T06:45:00' },
    { message_id: 'm-008-5', sender_id: 'u-012', sender_name: '刘十二', sender_avatar: 'https://i.pravatar.cc/150?img=30', msg_type: 'text', content: '反光板我来带', sent_at: '2026-04-26T07:00:00' }
  ],
  'ch-009': [
    { message_id: 'm-009-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '团队群已创建', sent_at: '2026-01-10T10:00:00' },
    { message_id: 'm-009-1', sender_id: 'u-002', sender_name: '张三', sender_avatar: 'https://i.pravatar.cc/150?img=12', msg_type: 'text', content: '大家好，本月工作总结会明天下午2点', sent_at: '2026-04-25T20:00:00' },
    { message_id: 'm-009-2', sender_id: 'u-003', sender_name: '李四', sender_avatar: 'https://i.pravatar.cc/150?img=13', msg_type: 'text', content: '收到，我准备下4月的业绩数据', sent_at: '2026-04-25T20:30:00' },
    { message_id: 'm-009-3', sender_id: 'u-004', sender_name: '王五', sender_avatar: 'https://i.pravatar.cc/150?img=14', msg_type: 'text', content: '新买的化妆箱到了，很好用', sent_at: '2026-04-25T21:00:00' },
    { message_id: 'm-009-4', sender_id: 'u-005', sender_name: '赵六', sender_avatar: 'https://i.pravatar.cc/150?img=15', msg_type: 'image', content: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80', sent_at: '2026-04-25T22:00:00' },
    { message_id: 'm-009-5', sender_id: 'u-005', sender_name: '赵六', sender_avatar: 'https://i.pravatar.cc/150?img=15', msg_type: 'text', content: '上周末拍的年会，效果不错', sent_at: '2026-04-25T22:01:00' },
    { message_id: 'm-009-6', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '5月排期表已更新，大家确认', sent_at: '2026-04-25T23:00:00' }
  ],
  'ch-010': [
    { message_id: 'm-010-1', sender_id: 'u-020', sender_name: '陈经理', sender_avatar: 'https://i.pravatar.cc/150?img=50', msg_type: 'text', content: '王老师，好久不见', sent_at: '2026-04-26T10:00:00' },
    { message_id: 'm-010-2', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '陈经理好！最近忙吗', sent_at: '2026-04-26T10:10:00' },
    { message_id: 'm-010-3', sender_id: 'u-020', sender_name: '陈经理', sender_avatar: 'https://i.pravatar.cc/150?img=50', msg_type: 'text', content: '6月15日有个高端婚礼，你们团队接吗？报价多少？', sent_at: '2026-04-26T11:00:00' }
  ],
  'ch-011': [
    { message_id: 'm-011-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '档期群已创建，档期结束后自动关闭', sent_at: '2026-04-23T16:00:00' },
    { message_id: 'm-011-1', sender_id: 'u-008', sender_name: '吴九', sender_avatar: 'https://i.pravatar.cc/150?img=21', msg_type: 'text', content: '5月30日别墅派对的花艺方案我出了初稿', sent_at: '2026-04-25T18:00:00' },
    { message_id: 'm-011-2', sender_id: 'u-008', sender_name: '吴九', sender_avatar: 'https://i.pravatar.cc/150?img=21', msg_type: 'image', content: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&q=80', sent_at: '2026-04-25T18:01:00' },
    { message_id: 'm-011-3', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '很好看，场地是露天还是室内？', sent_at: '2026-04-25T18:30:00' },
    { message_id: 'm-011-4', sender_id: 'u-008', sender_name: '吴九', sender_avatar: 'https://i.pravatar.cc/150?img=21', msg_type: 'text', content: '露天草坪，有一个玻璃花房备用', sent_at: '2026-04-25T19:00:00' },
    { message_id: 'm-011-5', sender_id: 'u-008', sender_name: '吴九', sender_avatar: 'https://i.pravatar.cc/150?img=21', msg_type: 'text', content: '花艺清单我明天发你', sent_at: '2026-04-25T19:45:00' }
  ],
  'ch-012': [
    { message_id: 'm-012-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '档期群已创建，档期结束后自动关闭', sent_at: '2026-04-22T09:00:00' },
    { message_id: 'm-012-1', sender_id: 'u-009', sender_name: '郑十', sender_avatar: 'https://i.pravatar.cc/150?img=22', msg_type: 'text', content: '6月8日酒店婚礼，新人是跨国夫妻', sent_at: '2026-04-25T10:00:00' },
    { message_id: 'm-012-2', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '在哪个酒店？', sent_at: '2026-04-25T10:30:00' },
    { message_id: 'm-012-3', sender_id: 'u-009', sender_name: '郑十', sender_avatar: 'https://i.pravatar.cc/150?img=22', msg_type: 'location', content: '杭州西湖区湖滨路28号·西湖国宾馆', sent_at: '2026-04-25T11:00:00' },
    { message_id: 'm-012-4', sender_id: 'u-009', sender_name: '郑十', sender_avatar: 'https://i.pravatar.cc/150?img=22', msg_type: 'text', content: '新娘是外国人，需要双语主持', sent_at: '2026-04-25T14:20:00' }
  ],
  'ch-013': [
    { message_id: 'm-013-0', sender_id: 'system', sender_name: '系统', sender_avatar: '', msg_type: 'system', content: '工单群已创建（来自抢单），档期结束后自动关闭', sent_at: '2026-04-26T11:30:00' },
    { message_id: 'm-013-1', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'system', content: '张三 已抢单成功（摄影）', sent_at: '2026-04-26T11:30:01' },
    { message_id: 'm-013-2', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'system', content: '李四 已抢单成功（摄像）', sent_at: '2026-04-26T11:35:00' },
    { message_id: 'm-013-3', sender_id: 'u-001', sender_name: '我自己', sender_avatar: 'https://i.pravatar.cc/150?img=11', msg_type: 'text', content: '5月3日婚礼拍摄，摄影+摄像都到位了，大家沟通下设备', sent_at: '2026-04-26T11:40:00' },
    { message_id: 'm-013-4', sender_id: 'u-002', sender_name: '张三', sender_avatar: 'https://i.pravatar.cc/150?img=12', msg_type: 'text', content: '我带Sony A7M4 + 24-70 GM', sent_at: '2026-04-26T11:50:00' },
    { message_id: 'm-013-5', sender_id: 'u-003', sender_name: '李四', sender_avatar: 'https://i.pravatar.cc/150?img=13', msg_type: 'text', content: '摄影设备我来准备，摄像需要带稳定器', sent_at: '2026-04-26T12:00:00' }
  ]
}

// ====== 系统通知 ======
export const mockNotifications: Notification[] = [
  {
    notification_id: 'n-001',
    type: 'schedule_update',
    title: '档期确认',
    content: '您5月3日的杭州西湖婚礼档期已被确认',
    extra_data: { schedule_id: 's-1', date: '2026-05-03' },
    is_read: false,
    created_at: '2026-04-26T09:00:00'
  },
  {
    notification_id: 'n-002',
    type: 'order_grab',
    title: '抢单成功',
    content: '您已成功抢到「婚礼跟拍摄影师」工单，¥2,500/场',
    extra_data: { order_id: 'o-001' },
    is_read: false,
    created_at: '2026-04-26T07:30:00'
  },
  {
    notification_id: 'n-003',
    type: 'dispatch',
    title: '新档期指派',
    content: '管理员为您指派了5月18日的古镇婚纱照档期',
    extra_data: { schedule_id: 's-3', team_id: 't-001' },
    is_read: false,
    created_at: '2026-04-25T20:00:00'
  },
  {
    notification_id: 'n-004',
    type: 'order_grab',
    title: '有人抢单',
    content: '您的「婚礼摄像师」工单有3人抢单，请尽快确认',
    extra_data: { order_id: 'o-003' },
    is_read: true,
    created_at: '2026-04-25T15:00:00'
  },
  {
    notification_id: 'n-005',
    type: 'schedule_update',
    title: '档期变更',
    content: '5月10日草坪婚礼档期时间修改为 06:00-20:00',
    extra_data: { schedule_id: 's-2', date: '2026-05-10' },
    is_read: true,
    created_at: '2026-04-24T18:00:00'
  },
  {
    notification_id: 'n-006',
    type: 'system',
    title: '系统公告',
    content: '档期通v2.1已更新，新增工单广场功能，快去体验吧！',
    extra_data: {},
    is_read: true,
    created_at: '2026-04-24T10:00:00'
  },
  {
    notification_id: 'n-007',
    type: 'schedule_update',
    title: '档期取消',
    content: '您5月5日的档期已被客户取消，已自动释放档期',
    extra_data: { schedule_id: 's-4', date: '2026-05-05' },
    is_read: true,
    created_at: '2026-04-23T14:00:00'
  },
  {
    notification_id: 'n-008',
    type: 'dispatch',
    title: '派单提醒',
    content: '您有1个待确认的派单，请及时处理',
    extra_data: { schedule_id: 's-6', team_id: 't-001' },
    is_read: true,
    created_at: '2026-04-22T09:00:00'
  }
]

// ====== 内存中的可变数据（mock 模式用）======
var _chats: Chat[] = mockChats.slice()
var _messages: Record<string, Message[]> = {}
// 深拷贝消息
for (var k in mockMessages) {
  _messages[k] = mockMessages[k].slice()
}
var _nextChatNum = 14
var _nextMsgNum: Record<string, number> = {}

// ====== 导出函数 ======
export function getChats(): Chat[] {
  return _chats.slice()
}

export function getMessages(chatId: string): Message[] {
  return (_messages[chatId] || []).slice()
}

export function getNotifications(): Notification[] {
  return mockNotifications
}

// 创建聊天会话
export function createChat(params: {
  chat_type: 'team' | 'schedule_temp'
  chat_name: string
  schedule_id?: string
  team_id?: string
  member_ids: string[]
  expire_at?: string
}): Chat {
  var chatId = 'ch-' + String(_nextChatNum++).padStart(3, '0')
  var chat: Chat = {
    chat_id: chatId,
    chat_name: params.chat_name,
    chat_type: params.chat_type,
    schedule_id: params.schedule_id || '',
    team_id: params.team_id || '',
    member_count: params.member_ids.length,
    expire_at: params.expire_at || '',
    last_message: null,
    unread_count: 0,
    created_at: new Date().toISOString()
  }
  _chats.unshift(chat)

  // 创建系统消息
  var sysMsg: Message = {
    message_id: 'm-' + chatId + '-0',
    sender_id: 'system',
    sender_name: '系统',
    sender_avatar: '',
    msg_type: 'system',
    content: params.chat_type === 'team' ? '团队群已创建' : '档期群已创建，档期结束后自动关闭',
    sent_at: new Date().toISOString()
  }
  _messages[chatId] = [sysMsg]
  _nextMsgNum[chatId] = 1

  return chat
}

// 添加成员到群聊
export function addMemberToChat(chatId: string, userId: string): void {
  for (var i = 0; i < _chats.length; i++) {
    if (_chats[i].chat_id === chatId) {
      _chats[i].member_count++
      break
    }
  }
  // 插入系统消息
  var msgs = _messages[chatId]
  if (msgs) {
    var num = _nextMsgNum[chatId] || msgs.length
    msgs.push({
      message_id: 'm-' + chatId + '-' + num,
      sender_id: 'system',
      sender_name: '系统',
      sender_avatar: '',
      msg_type: 'system',
      content: '新成员加入了群聊',
      sent_at: new Date().toISOString()
    })
    _nextMsgNum[chatId] = num + 1
  }
}

// 从群聊移除成员
export function removeMemberFromChat(chatId: string, userId: string): void {
  for (var i = 0; i < _chats.length; i++) {
    if (_chats[i].chat_id === chatId) {
      _chats[i].member_count = Math.max(1, _chats[i].member_count - 1)
      break
    }
  }
  var msgs = _messages[chatId]
  if (msgs) {
    var num = _nextMsgNum[chatId] || msgs.length
    msgs.push({
      message_id: 'm-' + chatId + '-' + num,
      sender_id: 'system',
      sender_name: '系统',
      sender_avatar: '',
      msg_type: 'system',
      content: '有成员退出了群聊',
      sent_at: new Date().toISOString()
    })
    _nextMsgNum[chatId] = num + 1
  }
}

// 关闭聊天会话
export function closeChat(chatId: string): void {
  _chats = _chats.filter(function(c) { return c.chat_id !== chatId })
  delete _messages[chatId]
}

// 查找团队对应的群聊
export function findTeamChat(teamId: string): Chat | null {
  for (var i = 0; i < _chats.length; i++) {
    if (_chats[i].team_id === teamId && _chats[i].chat_type === 'team') {
      return _chats[i]
    }
  }
  return null
}
