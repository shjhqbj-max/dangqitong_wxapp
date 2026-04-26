// DQT Mock 数据 — 工单
import { Order } from './types'

export const mockOrders: Order[] = [
  // ===== 活跃工单 =====
  {
    order_id: 'o-001',
    title: '婚礼跟拍摄影师',
    date: '2026-05-02',
    start_time: '07:00', end_time: '20:00',
    location: '杭州西湖区XX大酒店',
    profession_slots: [{ profession: '摄影', price: 2500, need_count: 1, filled_count: 0 }],
    total_price: 2500,
    description: '需要一位婚礼跟拍摄影师，要求自带设备，擅长纪实风格，有3年以上婚礼拍摄经验。',
    status: 'active',
    publisher: { user_id: 'u-002', nickname: '张三', avatar_url: 'https://i.pravatar.cc/150?img=12' },
    grab_count: 4,
    deadline: '2026-04-30T18:00:00',
    created_at: '2026-04-25T10:00:00',
    from_team_name: '杭州光影工作室',
    my_grab_status: 'pending',
    grabbers: [
      { user_id: 'u-001', nickname: '我自己', avatar_url: 'https://i.pravatar.cc/150?img=11', professions: ['摄影'], grabbed_profession: '摄影', city: '杭州', grabbed_at: '2026-04-25T10:30:00' },
      { user_id: 'u-003', nickname: '李四', avatar_url: 'https://i.pravatar.cc/150?img=33', professions: ['摄影', '摄像'], grabbed_profession: '摄影', city: '杭州', grabbed_at: '2026-04-25T11:00:00' },
      { user_id: 'u-009', nickname: '郑十', avatar_url: 'https://i.pravatar.cc/150?img=52', professions: ['摄影'], grabbed_profession: '摄影', city: '上海', grabbed_at: '2026-04-25T14:00:00' }
    ]
  },
  {
    order_id: 'o-002',
    title: '化妆师跟妆全天',
    date: '2026-05-03',
    start_time: '06:00', end_time: '21:00',
    location: '上海浦东新区XX宴会厅',
    profession_slots: [{ profession: '化妆', price: 1800, need_count: 1, filled_count: 0 }],
    total_price: 1800,
    description: '新娘全天跟妆，需要轻复古风格，包含试妆。提供化妆间和餐饮。',
    status: 'active',
    publisher: { user_id: 'u-007', nickname: '周八', avatar_url: 'https://i.pravatar.cc/150?img=44' },
    grab_count: 1,
    deadline: '2026-05-01T12:00:00',
    created_at: '2026-04-24T09:00:00',
    contact: '13800138001'
  },
  {
    order_id: 'o-003',
    title: '摄像师双机位拍摄',
    date: '2026-05-05',
    start_time: '08:00', end_time: '18:00',
    location: '杭州拱墅区XX婚庆中心',
    profession_slots: [{ profession: '摄像', price: 3500, need_count: 1, filled_count: 0 }],
    total_price: 3500,
    description: '婚礼双机位拍摄，需要与另一位摄像师配合，要求有稳定器和航拍设备。',
    status: 'grabbed',
    publisher: { user_id: 'u-005', nickname: '赵六', avatar_url: 'https://i.pravatar.cc/150?img=36' },
    grab_count: 6,
    deadline: '2026-05-03T18:00:00',
    created_at: '2026-04-23T15:00:00',
    from_team_name: '杭州光影工作室',
    my_grab_status: 'rejected',
    grabbers: [
      { user_id: 'u-001', nickname: '我自己', avatar_url: 'https://i.pravatar.cc/150?img=11', professions: ['摄影', '摄像'], grabbed_profession: '摄像', city: '杭州', grabbed_at: '2026-04-23T16:00:00' },
      { user_id: 'u-004', nickname: '王五', avatar_url: 'https://i.pravatar.cc/150?img=57', professions: ['摄像'], grabbed_profession: '摄像', city: '杭州', grabbed_at: '2026-04-23T17:00:00' }
    ]
  },
  {
    order_id: 'o-004',
    title: '婚礼主持人',
    date: '2026-05-10',
    start_time: '10:00', end_time: '14:00',
    location: '上海静安区XX酒店',
    profession_slots: [{ profession: '主持', price: 2000, need_count: 1, filled_count: 0 }],
    total_price: 2000,
    description: '需要一位有经验的婚礼主持人，风格温馨浪漫，中英文双语优先。',
    status: 'active',
    publisher: { user_id: 'u-008', nickname: '吴九', avatar_url: 'https://i.pravatar.cc/150?img=48' },
    grab_count: 0,
    deadline: '2026-05-08T18:00:00',
    created_at: '2026-04-26T08:00:00'
  },
  {
    order_id: 'o-005',
    title: '灯光师布光',
    date: '2026-05-08',
    start_time: '06:00', end_time: '22:00',
    location: '杭州余杭区XX宴会中心',
    profession_slots: [{ profession: '灯光', price: 1500, need_count: 1, filled_count: 0 }],
    total_price: 1500,
    description: '大型婚宴灯光布置和现场调控，需要自带基础灯具，场地有部分设备。',
    status: 'active',
    publisher: { user_id: 'u-006', nickname: '孙七', avatar_url: 'https://i.pravatar.cc/150?img=39' },
    grab_count: 2,
    deadline: '2026-05-06T12:00:00',
    created_at: '2026-04-25T16:00:00',
    from_team_name: '杭州光影工作室'
  },
  {
    order_id: 'o-006',
    title: '花艺布置',
    date: '2026-05-12',
    start_time: '07:00', end_time: '12:00',
    location: '杭州滨江区XX花园',
    profession_slots: [{ profession: '花艺', price: 0, need_count: 1, filled_count: 0 }],
    total_price: 0,
    description: '户外婚礼花艺布置，包含拱门、路引、桌花。预算面议，看方案定价格。',
    status: 'active',
    publisher: { user_id: 'u-010', nickname: '冯十一', avatar_url: 'https://i.pravatar.cc/150?img=56' },
    grab_count: 4,
    deadline: '2026-05-09T18:00:00',
    created_at: '2026-04-26T10:00:00'
  },
  {
    order_id: 'o-007',
    title: '督导现场执行',
    date: '2026-05-15',
    start_time: '08:00', end_time: '20:00',
    location: '上海徐汇区XX会所',
    profession_slots: [{ profession: '督导', price: 800, need_count: 1, filled_count: 0 }],
    total_price: 800,
    description: '婚礼现场执行督导，负责流程把控和人员协调，需要有大型婚礼经验。',
    status: 'active',
    publisher: { user_id: 'u-004', nickname: '王五', avatar_url: 'https://i.pravatar.cc/150?img=57' },
    grab_count: 1,
    deadline: '2026-05-13T18:00:00',
    created_at: '2026-04-24T14:00:00',
    from_team_name: '上海璀璨婚礼团队'
  },
  {
    order_id: 'o-008',
    title: '场布搭建团队',
    date: '2026-05-18',
    start_time: '04:00', end_time: '10:00',
    location: '杭州萧山区XX度假酒店',
    profession_slots: [{ profession: '场布', price: 1200, need_count: 1, filled_count: 0 }],
    total_price: 1200,
    description: '凌晨进场搭建，包含舞台、背景板、桌椅布置。需要3-4人团队。',
    status: 'grabbed',
    publisher: { user_id: 'u-003', nickname: '李四', avatar_url: 'https://i.pravatar.cc/150?img=33' },
    grab_count: 6,
    deadline: '2026-05-15T18:00:00',
    created_at: '2026-04-23T11:00:00',
    my_grab_status: 'accepted',
    grabbers: [
      { user_id: 'u-001', nickname: '我自己', avatar_url: 'https://i.pravatar.cc/150?img=11', professions: ['场布'], grabbed_profession: '场布', city: '杭州', grabbed_at: '2026-04-23T12:00:00' }
    ]
  },
  // ===== 已被抢单的工单 =====
  {
    order_id: 'o-009',
    title: '婚礼摄影+摄像套餐',
    date: '2026-05-20',
    start_time: '07:00', end_time: '19:00',
    location: '杭州上城区XX大酒店',
    profession_slots: [
      { profession: '摄影', price: 3000, need_count: 1, filled_count: 1 },
      { profession: '摄像', price: 2000, need_count: 1, filled_count: 1 }
    ],
    total_price: 5000,
    description: '需要摄影+摄像套餐，双机位拍摄，含后期精修50张和3-5分钟短片。',
    status: 'grabbed',
    publisher: { user_id: 'u-001', nickname: '我自己', avatar_url: 'https://i.pravatar.cc/150?img=11' },
    grab_count: 8,
    deadline: '2026-05-17T18:00:00',
    created_at: '2026-04-22T09:00:00',
    from_team_name: '杭州光影工作室',
    grabbers: [
      { user_id: 'u-002', nickname: '张三', avatar_url: 'https://i.pravatar.cc/150?img=12', professions: ['摄像'], grabbed_profession: '摄像', city: '杭州', grabbed_at: '2026-04-22T10:00:00' },
      { user_id: 'u-005', nickname: '赵六', avatar_url: 'https://i.pravatar.cc/150?img=36', professions: ['摄像', '航拍'], grabbed_profession: '摄像', city: '杭州', grabbed_at: '2026-04-22T11:00:00' },
      { user_id: 'u-009', nickname: '郑十', avatar_url: 'https://i.pravatar.cc/150?img=52', professions: ['摄影'], grabbed_profession: '摄影', city: '上海', grabbed_at: '2026-04-22T15:00:00' }
    ]
  },
  {
    order_id: 'o-010',
    title: '航拍无人机拍摄',
    date: '2026-05-22',
    start_time: '09:00', end_time: '17:00',
    location: '上海黄浦区XX外滩',
    profession_slots: [{ profession: '摄像', price: 3000, need_count: 1, filled_count: 0 }],
    total_price: 3000,
    description: '外滩婚礼航拍，需要持证飞手，提前报备飞行。提供场地许可证。',
    status: 'grabbed',
    publisher: { user_id: 'u-005', nickname: '赵六', avatar_url: 'https://i.pravatar.cc/150?img=36' },
    grab_count: 3,
    deadline: '2026-05-19T18:00:00',
    created_at: '2026-04-25T08:00:00',
    from_team_name: '杭州光影工作室',
    my_grab_status: 'accepted',
    grabbers: [
      { user_id: 'u-001', nickname: '我自己', avatar_url: 'https://i.pravatar.cc/150?img=11', professions: ['摄像', '航拍'], grabbed_profession: '摄像', city: '杭州', grabbed_at: '2026-04-25T09:00:00' },
      { user_id: 'u-006', nickname: '孙七', avatar_url: 'https://i.pravatar.cc/150?img=39', professions: ['灯光'], grabbed_profession: '灯光', city: '杭州', grabbed_at: '2026-04-25T10:00:00' }
    ]
  },
  // ===== 已完成工单 =====
  {
    order_id: 'o-011',
    title: '婚礼跟拍',
    date: '2026-04-15',
    start_time: '08:00', end_time: '18:00',
    location: '杭州西湖区XX影楼',
    profession_slots: [{ profession: '摄影', price: 2000, need_count: 1, filled_count: 0 }],
    total_price: 2000,
    description: '室内婚纱照拍摄，三套服装换装，需要灯光师配合。',
    status: 'completed',
    publisher: { user_id: 'u-003', nickname: '李四', avatar_url: 'https://i.pravatar.cc/150?img=33' },
    grab_count: 4,
    deadline: '2026-04-13T18:00:00',
    created_at: '2026-04-10T09:00:00',
    my_grab_status: 'completed',
    grabbers: [
      { user_id: 'u-001', nickname: '我自己', avatar_url: 'https://i.pravatar.cc/150?img=11', professions: ['摄影'], grabbed_profession: '摄影', city: '杭州', grabbed_at: '2026-04-10T10:00:00' },
      { user_id: 'u-008', nickname: '吴九', avatar_url: 'https://i.pravatar.cc/150?img=48', professions: ['摄影'], grabbed_profession: '摄影', city: '上海', grabbed_at: '2026-04-10T15:00:00' }
    ]
  },
  {
    order_id: 'o-012',
    title: '化妆师半日跟妆',
    date: '2026-04-18',
    start_time: '10:00', end_time: '16:00',
    location: '上海长宁区XX酒店',
    profession_slots: [{ profession: '化妆', price: 1200, need_count: 1, filled_count: 0 }],
    total_price: 1200,
    description: '半日跟妆，清新自然风格，新娘+伴娘4人妆发。',
    status: 'completed',
    publisher: { user_id: 'u-007', nickname: '周八', avatar_url: 'https://i.pravatar.cc/150?img=44' },
    grab_count: 1,
    deadline: '2026-04-16T18:00:00',
    created_at: '2026-04-12T14:00:00'
  },
  // ===== 已关闭工单 =====
  {
    order_id: 'o-013',
    title: '车队（6辆白色奥迪）',
    date: '2026-05-25',
    start_time: '07:00', end_time: '12:00',
    location: '杭州江干区XX小区',
    profession_slots: [{ profession: '车队', price: 3600, need_count: 1, filled_count: 0 }],
    total_price: 3600,
    description: '婚礼车队需求，6辆白色奥迪A6L，含司机，路线：小区→酒店→外景→酒店。',
    status: 'closed',
    publisher: { user_id: 'u-010', nickname: '冯十一', avatar_url: 'https://i.pravatar.cc/150?img=56' },
    grab_count: 0,
    deadline: '2026-04-20T18:00:00',
    created_at: '2026-04-15T10:00:00'
  },
  // ===== 更多活跃工单 =====
  {
    order_id: 'o-014',
    title: '演出乐队暖场',
    date: '2026-05-28',
    start_time: '18:00', end_time: '21:00',
    location: '上海浦东新区XX宴会厅',
    profession_slots: [{ profession: '演出', price: 5000, need_count: 1, filled_count: 0 }],
    total_price: 5000,
    description: '晚宴暖场演出，需要3-5人小型乐队，风格流行/爵士，自带设备。',
    status: 'active',
    publisher: { user_id: 'u-008', nickname: '吴九', avatar_url: 'https://i.pravatar.cc/150?img=48' },
    grab_count: 2,
    deadline: '2026-05-25T18:00:00',
    created_at: '2026-04-26T12:00:00'
  },
  {
    order_id: 'o-015',
    title: '摄影修图师',
    date: '2026-05-30',
    start_time: '', end_time: '',
    location: '线上远程',
    profession_slots: [{ profession: '摄影', price: 0, need_count: 1, filled_count: 0 }],
    total_price: 0,
    description: '需要一位修图师处理200张婚礼照片，精修30张+基础调色170张，价格面议。',
    status: 'active',
    publisher: { user_id: 'u-009', nickname: '郑十', avatar_url: 'https://i.pravatar.cc/150?img=52' },
    grab_count: 7,
    deadline: '2026-05-27T18:00:00',
    created_at: '2026-04-26T14:00:00'
  },
  {
    order_id: 'o-016',
    title: '灯光+场布打包',
    date: '2026-06-01',
    start_time: '05:00', end_time: '23:00',
    location: '杭州富阳区XX生态园',
    profession_slots: [
      { profession: '灯光', price: 1500, need_count: 1, filled_count: 0 },
      { profession: '场布', price: 1300, need_count: 2, filled_count: 0 }
    ],
    total_price: 4100,
    description: '户外婚礼灯光+场布打包需求，含搭建和撤场。需要有户外经验。',
    status: 'active',
    publisher: { user_id: 'u-006', nickname: '孙七', avatar_url: 'https://i.pravatar.cc/150?img=39' },
    grab_count: 0,
    deadline: '2026-05-28T18:00:00',
    created_at: '2026-04-26T16:00:00',
    from_team_name: '杭州光影工作室'
  },
  // ===== 更多活跃工单（分页测试） =====
  {
    order_id: 'o-017', title: '婚礼快剪视频', date: '2026-05-06',
    start_time: '06:00', end_time: '15:00', location: '杭州西湖区XX庄园',
    profession_slots: [{ profession: '摄像', price: 2200, need_count: 1, filled_count: 0 }],
    total_price: 2200,
    description: '婚礼当天快剪，上午拍摄下午出片，要求有快剪经验。',
    status: 'active', publisher: { user_id: 'u-004', nickname: '王五', avatar_url: 'https://i.pravatar.cc/150?img=57' },
    grab_count: 3, deadline: '2026-05-04T18:00:00', created_at: '2026-04-26T09:00:00'
  },
  {
    order_id: 'o-018', title: '新娘跟妆+妈妈妆', date: '2026-05-09',
    start_time: '05:00', end_time: '18:00', location: '上海闵行区XX花园酒店',
    profession_slots: [{ profession: '化妆', price: 1500, need_count: 1, filled_count: 0 }],
    total_price: 1500,
    description: '新娘全天跟妆含妈妈妆，需要韩式清新风格，含试妆一次。',
    status: 'active', publisher: { user_id: 'u-010', nickname: '冯十一', avatar_url: 'https://i.pravatar.cc/150?img=56' },
    grab_count: 2, deadline: '2026-05-07T12:00:00', created_at: '2026-04-26T08:30:00'
  },
  {
    order_id: 'o-019', title: '宴会厅灯光秀', date: '2026-05-11',
    start_time: '14:00', end_time: '23:00', location: '杭州下城区XX大酒店',
    profession_slots: [{ profession: '灯光', price: 3200, need_count: 1, filled_count: 0 }],
    total_price: 3200,
    description: '大型婚宴灯光秀设计和执行，需要光束灯、LED帕灯等设备。',
    status: 'active', publisher: { user_id: 'u-002', nickname: '张三', avatar_url: 'https://i.pravatar.cc/150?img=12' },
    grab_count: 1, deadline: '2026-05-08T18:00:00', created_at: '2026-04-25T20:00:00'
  },
  {
    order_id: 'o-020', title: '户外婚礼花艺+甜品台', date: '2026-05-16',
    start_time: '06:00', end_time: '12:00', location: '上海松江区XX庄园',
    profession_slots: [{ profession: '花艺', price: 4500, need_count: 1, filled_count: 0 }],
    total_price: 4500,
    description: '户外草坪婚礼花艺布置含甜品台装饰，森系风格。',
    status: 'active', publisher: { user_id: 'u-007', nickname: '周八', avatar_url: 'https://i.pravatar.cc/150?img=44' },
    grab_count: 5, deadline: '2026-05-12T18:00:00', created_at: '2026-04-25T22:00:00'
  },
  {
    order_id: 'o-021', title: '婚礼主持+DJ', date: '2026-05-17',
    start_time: '11:00', end_time: '22:00', location: '杭州拱墅区XX宴会中心',
    profession_slots: [
      { profession: '主持', price: 2000, need_count: 1, filled_count: 0 },
      { profession: '演出', price: 800, need_count: 1, filled_count: 0 }
    ],
    total_price: 2800,
    description: '需要主持+DJ组合，现场氛围感强，互动游戏环节多。',
    status: 'active', publisher: { user_id: 'u-003', nickname: '李四', avatar_url: 'https://i.pravatar.cc/150?img=33' },
    grab_count: 0, deadline: '2026-05-14T18:00:00', created_at: '2026-04-26T11:00:00'
  },
  {
    order_id: 'o-022', title: '婚礼场布+撤场', date: '2026-05-19',
    start_time: '03:00', end_time: '14:00', location: '上海浦东新区XX会展中心',
    profession_slots: [{ profession: '场布', price: 1800, need_count: 1, filled_count: 0 }],
    total_price: 1800,
    description: '大型婚礼场布，凌晨3点进场，含舞台背景和花艺摆放。',
    status: 'active', publisher: { user_id: 'u-009', nickname: '郑十', avatar_url: 'https://i.pravatar.cc/150?img=52' },
    grab_count: 8, deadline: '2026-05-16T18:00:00', created_at: '2026-04-26T13:00:00'
  },
  {
    order_id: 'o-023', title: '无人机航拍+地面跟拍', date: '2026-05-21',
    start_time: '07:00', end_time: '19:00', location: '杭州临安区XX民宿',
    profession_slots: [
      { profession: '摄像', price: 2200, need_count: 1, filled_count: 0 },
      { profession: '摄影', price: 2000, need_count: 1, filled_count: 0 }
    ],
    total_price: 4200,
    description: '户外民宿婚礼，需无人机航拍+地面跟拍双机位。',
    status: 'active', publisher: { user_id: 'u-005', nickname: '赵六', avatar_url: 'https://i.pravatar.cc/150?img=36' },
    grab_count: 3, deadline: '2026-05-18T18:00:00', created_at: '2026-04-26T15:00:00'
  },
  {
    order_id: 'o-024', title: '婚礼纪实摄影', date: '2026-05-23',
    start_time: '06:00', end_time: '20:00', location: '上海黄浦区XX老洋房',
    profession_slots: [{ profession: '摄影', price: 3800, need_count: 1, filled_count: 0 }],
    total_price: 3800,
    description: '老洋房婚礼纪实摄影，要求擅长光影运用，交付300张底片+50张精修。',
    status: 'active', publisher: { user_id: 'u-008', nickname: '吴九', avatar_url: 'https://i.pravatar.cc/150?img=48' },
    grab_count: 6, deadline: '2026-05-20T18:00:00', created_at: '2026-04-26T17:00:00'
  },
  {
    order_id: 'o-025', title: '婚礼督导+秘书', date: '2026-05-24',
    start_time: '07:00', end_time: '21:00', location: '杭州余杭区XX大酒店',
    profession_slots: [
      { profession: '督导', price: 1000, need_count: 1, filled_count: 0 },
      { profession: '督导', price: 500, need_count: 1, filled_count: 0 }
    ],
    total_price: 1500,
    description: '婚礼全程督导，负责彩排、流程把控、人员调度。',
    status: 'active', publisher: { user_id: 'u-006', nickname: '孙七', avatar_url: 'https://i.pravatar.cc/150?img=39' },
    grab_count: 2, deadline: '2026-05-21T18:00:00', created_at: '2026-04-26T18:00:00'
  },
  {
    order_id: 'o-026', title: '车队头车装饰', date: '2026-05-26',
    start_time: '05:00', end_time: '08:00', location: '上海静安区XX小区',
    profession_slots: [{ profession: '花艺', price: 600, need_count: 1, filled_count: 0 }],
    total_price: 600,
    description: '婚车头车花艺装饰，红玫瑰+尤加利叶，需要提前一天准备。',
    status: 'active', publisher: { user_id: 'u-002', nickname: '张三', avatar_url: 'https://i.pravatar.cc/150?img=12' },
    grab_count: 1, deadline: '2026-05-23T18:00:00', created_at: '2026-04-26T19:00:00'
  },
  {
    order_id: 'o-027', title: '回门宴主持', date: '2026-05-27',
    start_time: '11:00', end_time: '14:00', location: '杭州萧山区XX酒楼',
    profession_slots: [{ profession: '主持', price: 1200, need_count: 1, filled_count: 0 }],
    total_price: 1200,
    description: '回门宴主持，简单温馨风格，流程约2小时。',
    status: 'active', publisher: { user_id: 'u-010', nickname: '冯十一', avatar_url: 'https://i.pravatar.cc/150?img=56' },
    grab_count: 0, deadline: '2026-05-24T18:00:00', created_at: '2026-04-26T20:00:00'
  },
  {
    order_id: 'o-028', title: '婚纱照外景拍摄', date: '2026-05-29',
    start_time: '08:00', end_time: '18:00', location: '上海崇明区XX湿地公园',
    profession_slots: [{ profession: '摄影', price: 2600, need_count: 1, filled_count: 0 }],
    total_price: 2600,
    description: '婚纱照外景拍摄，3套服装，需要自备反光板。',
    status: 'active', publisher: { user_id: 'u-004', nickname: '王五', avatar_url: 'https://i.pravatar.cc/150?img=57' },
    grab_count: 4, deadline: '2026-05-26T18:00:00', created_at: '2026-04-26T21:00:00'
  },
  {
    order_id: 'o-029', title: '订婚宴跟拍', date: '2026-05-31',
    start_time: '10:00', end_time: '15:00', location: '杭州江干区XX酒店',
    profession_slots: [{ profession: '摄影', price: 1500, need_count: 1, filled_count: 0 }],
    total_price: 1500,
    description: '订婚宴跟拍半天，需要抓拍能力强，交付150张底片。',
    status: 'active', publisher: { user_id: 'u-007', nickname: '周八', avatar_url: 'https://i.pravatar.cc/150?img=44' },
    grab_count: 2, deadline: '2026-05-28T18:00:00', created_at: '2026-04-26T22:00:00'
  },
  {
    order_id: 'o-030', title: '婚礼现场音响调试', date: '2026-06-02',
    start_time: '08:00', end_time: '12:00', location: '上海徐汇区XX宴会厅',
    profession_slots: [
      { profession: '灯光', price: 500, need_count: 1, filled_count: 0 },
      { profession: '灯光', price: 300, need_count: 1, filled_count: 0 }
    ],
    total_price: 800,
    description: '婚礼现场音响调试+灯光联动，需要有设备操作经验。',
    status: 'active', publisher: { user_id: 'u-009', nickname: '郑十', avatar_url: 'https://i.pravatar.cc/150?img=52' },
    grab_count: 1, deadline: '2026-05-30T18:00:00', created_at: '2026-04-26T23:00:00'
  }
]

// 获取工单列表（支持筛选 + 分页）
export function getOrderList(filters?: {
  city?: string
  profession?: string
  sort?: string
  page?: number
  pageSize?: number
}): { list: Order[], total: number, hasMore: boolean } {
  let list = mockOrders.filter(o => o.status === 'active')

  if (filters && filters.city) {
    list = list.filter(o => o.location.indexOf(filters.city!) >= 0)
  }
  if (filters && filters.profession) {
    list = list.filter(o => o.profession_slots.some(s => s.profession === filters.profession))
  }

  // 排序
  if (filters && filters.sort === 'price_asc') {
    list.sort((a, b) => a.total_price - b.total_price)
  } else if (filters && filters.sort === 'price_desc') {
    list.sort((a, b) => b.total_price - a.total_price)
  } else {
    // 默认按创建时间倒序
    list.sort((a, b) => b.created_at.localeCompare(a.created_at))
  }

  var total = list.length
  var page = (filters && filters.page) || 1
  var pageSize = (filters && filters.pageSize) || 10
  var start = (page - 1) * pageSize
  var paged = list.slice(start, start + pageSize)

  return { list: paged, total: total, hasMore: start + pageSize < total }
}

// 获取工单详情
export function getOrderById(id: string): Order {
  return mockOrders.find(o => o.order_id === id) || mockOrders[0]
}

// 获取我抢单的工单（我作为抢单人参与的）
export function getMyGrabbedOrders(): Order[] {
  return mockOrders.filter(o =>
    o.grabbers && o.grabbers.some(function (g) { return g.user_id === 'u-001' })
  )
}

// 模糊搜索工单
export function searchOrders(keyword: string): Order[] {
  const lower = keyword.toLowerCase()
  return mockOrders.filter(o =>
    (o.title && o.title.toLowerCase().indexOf(lower) >= 0) ||
    (o.description && o.description.toLowerCase().indexOf(lower) >= 0) ||
    (o.location && o.location.toLowerCase().indexOf(lower) >= 0) ||
    (o.profession_slots && o.profession_slots.some(s => s.profession.indexOf(keyword) >= 0))
  ).sort((a, b) => b.created_at.localeCompare(a.created_at))
}
