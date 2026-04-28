# 档期通 — 后端 API 接口文档

## 通用约定

### 请求头
```
Authorization: Bearer {token}    // 登录后获取的 token
Content-Type: application/json
```

### 统一响应格式
```json
{
  "code": 200,
  "data": { ... },
  "message": "success"
}
```
- `code`: 业务状态码（200=成功，其他为错误）
- `data`: 返回数据（可能为 null）
- `message`: 错误信息（可选）

---

## 一、认证模块 `auth`

### 1.1 手机号登录
```
POST /api/auth/login/phone
```
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phoneCode | string | 是 | 微信手机号授权 code |

**响应 `data`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userInfo": {
    "id": "u-001",
    "nickName": "我自己",
    "avatarUrl": "https://...",
    "phoneNumber": "13800138001"
  }
}
```

### 1.2 获取用户信息
```
GET /api/auth/userinfo
```
无参数，基于 token 鉴权。

**响应 `data`**：同上 `userInfo`

---

## 二、用户资料模块 `profile`

### 2.1 获取个人资料
```
GET /api/profile
```

**响应 `data`：`UserProfile`**
```json
{
  "user_id": "u-001",
  "nickname": "我自己",
  "avatar_url": "https://...",
  "city": "杭州",
  "professions": ["摄影", "摄像"],
  "price_desc": "2500-5000元/场",
  "phone": "13800138001",
  "wechat_id": "my_wechat",
  "bio": "5年婚礼摄影经验",
  "created_at": "2025-01-01T10:00:00"
}
```

### 2.2 更新个人资料
```
PUT /api/profile
```
Body：`UserProfile` 的任意子集字段

| 字段 | 类型 | 说明 |
|------|------|------|
| nickname | string | 昵称 |
| avatar_url | string | 头像 URL |
| city | string | 城市 |
| professions | string[] | 职业列表 |
| price_desc | string | 价格描述 |
| phone | string | 手机号 |
| wechat_id | string | 微信号 |
| bio | string | 个人简介 |

---

## 三、档期模块 `schedule`

### 3.1 获取月日历数据
```
GET /api/schedules/calendar?year=2026&month=4
```
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 是 | 年份 |
| month | number | 是 | 月份 (1-12) |

**响应 `data`：`CalendarDayMap`**
```json
{
  "2026-04-01": { "statuses": ["rest"], "count": 1 },
  "2026-04-03": { "statuses": ["confirmed"], "count": 1 },
  "2026-04-05": { "statuses": ["confirmed", "pending"], "count": 2 }
}
```

### 3.2 获取档期列表（按月分页）
```
GET /api/schedules?year=2026&month=4&page=1&pageSize=20
```
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 是 | 年份 |
| month | number | 是 | 月份 |
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页条数，默认 20 |

**响应 `data`**
```json
{
  "list": [ Schedule, ... ],
  "total": 15,
  "hasMore": false
}
```

### 3.3 按日期获取档期
```
GET /api/schedules/by-date?date=2026-04-05
```

**响应 `data`**：`Schedule[]`

### 3.4 获取本周档期
```
GET /api/schedules/week
```
无参数，基于当前用户。

**响应 `data`**：`Schedule[]`（排除 rest）

### 3.5 获取档期详情
```
GET /api/schedules/{id}
```

**响应 `data`：`Schedule`**
```json
{
  "id": "s-1",
  "date": "2026-04-01",
  "start_time": "08:00",
  "end_time": "18:00",
  "status": "confirmed",
  "completion_status": "completed",
  "source": "self",
  "location": "杭州西湖区XX酒店",
  "contact_name": "张伟",
  "contact_phone": "13800138001",
  "extra_contacts": [
    { "role": "婚庆负责人", "name": "王婚庆", "phone": "13700137002" }
  ],
  "total_price": 5000,
  "paid_amount": 5000,
  "payment_status": "paid",
  "notes": "西湖边外景拍摄",
  "assigned_member_ids": ["u-003"],
  "photos": [],
  "created_at": "2026-03-25T10:00:00"
}
```

**Schedule 字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 档期 ID |
| date | string | 日期 YYYY-MM-DD |
| start_time | string | 开始时间 HH:MM，rest 时为空 |
| end_time | string | 结束时间 HH:MM，rest 时为空 |
| status | enum | confirmed / pending / rest |
| completion_status | enum | completed / uncompleted / delayed / 空串 |
| source | string | self / team_dispatch / platform |
| location | string | 地点 |
| contact_name | string | 联系人 |
| contact_phone | string | 联系电话 |
| extra_contacts | ExtraContact[] | 附加联系人 |
| total_price | number | 总价（元） |
| paid_amount | number | 已付金额 |
| payment_status | enum | paid / unpaid / partial / 空串 |
| notes | string | 备注 |
| assigned_member_ids | string[] | 指派的成员 user_id 列表 |
| photos | string[] | 照片 URL 列表 |
| created_at | string | ISO 8601 创建时间 |

**ExtraContact**
| 字段 | 类型 | 说明 |
|------|------|------|
| role | string | 角色（如"婚庆负责人"） |
| name | string | 姓名 |
| phone | string | 电话 |

### 3.6 创建档期
```
POST /api/schedules
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date | string | 是 | YYYY-MM-DD |
| start_time | string | 否 | HH:MM |
| end_time | string | 否 | HH:MM |
| source | string | 否 | self / team_dispatch / platform |
| location | string | 否 | 地点 |
| contact_name | string | 否 | 联系人 |
| contact_phone | string | 否 | 联系电话 |
| extra_contacts | ExtraContact[] | 否 | 附加联系人 |
| total_price | number | 否 | 总价 |
| paid_amount | number | 否 | 已付金额 |
| payment_status | string | 否 | paid / unpaid / partial |
| notes | string | 否 | 备注 |
| status | string | 否 | confirmed / pending / rest |

**响应 `data`**：创建后的 `Schedule`

### 3.7 更新档期
```
PUT /api/schedules/{id}
```
Body：Schedule 的任意子集字段

**响应 `data`**：更新后的 `Schedule`

### 3.8 删除档期
```
DELETE /api/schedules/{id}
```
**响应 `data`**：`null`

### 3.9 搜索档期
```
GET /api/schedules/search?keyword=西湖
```
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词（模糊匹配日期/备注/地点） |

**响应 `data`**：`{ list: Schedule[] }`

### 3.10 接受档期指派
```
POST /api/schedules/{id}/accept
```
**响应 `data`**：`null`

### 3.11 拒绝档期指派
```
POST /api/schedules/{id}/reject
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| reason | string | 是 | 拒绝原因 |

**响应 `data`**：`null`

### 3.12 指派档期给成员
```
POST /api/schedules/{id}/assign
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| member_ids | string[] | 是 | 要指派的成员 user_id 列表 |

**响应 `data`**：`null`

---

## 四、工单模块 `orders`

### 4.1 获取工单列表（广场）
```
GET /api/orders?city=杭州&profession=摄影&sort=price_asc&page=1&pageSize=10
```
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | string | 否 | 城市筛选 |
| profession | string | 否 | 职业筛选 |
| sort | string | 否 | price_asc / price_desc，默认按创建时间倒序 |
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页条数，默认 10 |
| my_grabbed | boolean | 否 | 仅返回我抢单的工单 |
| my_published | boolean | 否 | 仅返回我发布的工单 |

**响应 `data`**
```json
{
  "list": [ Order, ... ],
  "total": 30,
  "hasMore": true
}
```

### 4.2 获取工单详情
```
GET /api/orders/{id}
```

**响应 `data`：`Order`**
```json
{
  "order_id": "o-001",
  "title": "婚礼跟拍摄影师",
  "date": "2026-05-02",
  "start_time": "07:00",
  "end_time": "20:00",
  "location": "杭州西湖区XX大酒店",
  "profession_slots": [
    {
      "profession": "摄影",
      "price": 2500,
      "need_count": 1,
      "filled_count": 0
    }
  ],
  "total_price": 2500,
  "description": "需要一位婚礼跟拍摄影师...",
  "status": "active",
  "publisher": {
    "user_id": "u-002",
    "nickname": "张三",
    "avatar_url": "https://..."
  },
  "grab_count": 3,
  "deadline": "2026-04-30T18:00:00",
  "created_at": "2026-04-25T10:00:00",
  "contact": "13800138001",
  "photos": [],
  "from_team_name": "杭州光影工作室",
  "my_grab_status": "pending",
  "grabbers": [
    {
      "user_id": "u-001",
      "nickname": "我自己",
      "avatar_url": "https://...",
      "professions": ["摄影"],
      "grabbed_profession": "摄影",
      "city": "杭州",
      "grabbed_at": "2026-04-25T10:30:00",
      "grab_status": "pending",
      "quote_price": 2300,
      "intro": "5年婚礼摄影经验，擅长纪实抓拍"
    }
  ]
}
```

**Order 字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| order_id | string | 工单 ID |
| title | string | 标题 |
| date | string | 工作日期 YYYY-MM-DD |
| start_time | string | 开始时间 HH:MM |
| end_time | string | 结束时间 HH:MM |
| location | string | 地点 |
| profession_slots | ProfessionSlot[] | 职业需求列表 |
| total_price | number | 总价（元） |
| description | string | 需求描述 |
| status | enum | active / grabbed / closed / completed |
| publisher | object | 发布者信息 |
| grab_count | number | 抢单人数 |
| deadline | string | 截止时间 ISO 8601 |
| created_at | string | 创建时间 ISO 8601 |
| contact | string | 联系电话（可选） |
| photos | string[] | 照片 URL（可选） |
| from_team_name | string | 来源团队名（可选） |
| my_grab_status | enum | 当前用户抢单状态：pending / rejected / accepted / completed（可选） |
| grabbers | Grabber[] | 抢单人列表（仅发布者可见，可选） |

**ProfessionSlot**
| 字段 | 类型 | 说明 |
|------|------|------|
| profession | string | 职业名 |
| price | number | 单价（元） |
| need_count | number | 需要人数 |
| filled_count | number | 已满足人数 |

**Grabber**
| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | string | 抢单人 ID |
| nickname | string | 昵称 |
| avatar_url | string | 头像 |
| professions | string[] | 该人职业列表 |
| grabbed_profession | string | 抢单时选择的职业 |
| city | string | 城市 |
| grabbed_at | string | 抢单时间 |
| grab_status | enum | pending / accepted / rejected |
| quote_price | number | 报价（可选） |
| intro | string | 一句话介绍（可选） |

### 4.3 创建工单（发单）
```
POST /api/orders
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 标题 |
| date | string | 是 | 工作日期 |
| start_time | string | 否 | 开始时间 |
| end_time | string | 否 | 结束时间 |
| location | string | 否 | 地点 |
| profession_slots | ProfessionSlot[] | 是 | 职业需求 |
| total_price | number | 是 | 总价 |
| description | string | 否 | 描述 |
| contact | string | 否 | 联系电话 |
| deadline | string | 是 | 截止时间 ISO 8601 |

**响应 `data`**：创建后的 `Order`

### 4.4 抢单
```
POST /api/orders/{id}/grab
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| profession | string | 是 | 选择的职业 |
| quote_price | number | 否 | 报价 |
| intro | string | 否 | 一句话介绍 |

**响应 `data`**：`null`

### 4.5 附近工单数
```
GET /api/orders/nearby-count
```
无参数（基于用户位置或城市）。

**响应 `data`**：`{ count: number }`

---

## 五、团队模块 `team`

### 5.1 获取我的团队列表
```
GET /api/teams/my
```

**响应 `data`：`Team[]`**
```json
[
  {
    "team_id": "t-001",
    "name": "杭州光影工作室",
    "logo_url": "https://...",
    "description": "专注婚礼摄影摄像",
    "city": "杭州",
    "service_types": ["婚礼跟拍", "婚纱照"],
    "contact_phone": "13800138001",
    "member_count": 6,
    "my_role": "admin",
    "invite_code": "ABC123",
    "created_at": "2025-01-10T10:00:00"
  }
]
```

**Team 字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| team_id | string | 团队 ID |
| name | string | 团队名 |
| logo_url | string | Logo URL |
| description | string | 简介 |
| city | string | 城市 |
| service_types | string[] | 服务类型列表 |
| contact_phone | string | 联系电话 |
| member_count | number | 成员数 |
| my_role | enum | admin / member |
| invite_code | string | 邀请码 |
| created_at | string | 创建时间 |

### 5.2 获取团队成员
```
GET /api/teams/{teamId}/members
```

**响应 `data`：`TeamMember[]`**
```json
[
  {
    "user_id": "u-001",
    "nickname": "我自己",
    "avatar_url": "https://...",
    "professions": ["摄影", "摄像"],
    "role": "admin",
    "can_dispatch": true,
    "joined_at": "2025-01-10T10:00:00"
  }
]
```

### 5.3 获取所有团队成员（跨团队）
```
GET /api/teams/all-members
```

**响应 `data`**
```json
[
  {
    "user_id": "u-001",
    "nickname": "我自己",
    "team_id": "t-001",
    "team_name": "杭州光影工作室",
    "professions": ["摄影"],
    "role": "admin",
    "can_dispatch": true,
    "joined_at": "..."
  }
]
```

### 5.4 获取团队日档期概览
```
GET /api/teams/{teamId}/schedule?date=2026-04-25
```

**响应 `data`：`TeamScheduleItem[]`**
```json
[
  {
    "user_id": "u-001",
    "nickname": "我自己",
    "avatar_url": "https://...",
    "professions": ["摄影"],
    "status": "confirmed",
    "start_time": "08:00",
    "end_time": "18:00",
    "location": "杭州XX酒店"
  }
]
```

**TeamScheduleItem.status**：confirmed / pending / rest / free

### 5.5 更新成员角色
```
PUT /api/teams/{teamId}/members/{userId}
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| role | string | 是 | admin / member |

**响应 `data`**：`null`

### 5.6 移除成员
```
DELETE /api/teams/{teamId}/members/{userId}
```
**响应 `data`**：`null`

### 5.7 更新团队信息
```
PUT /api/teams/{teamId}
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 团队名 |
| cover_url | string | 否 | 封面图 URL |
| service_types | string[] | 否 | 服务类型 |

**响应 `data`**：`null`

### 5.8 退出团队
```
POST /api/teams/{teamId}/leave
```
**响应 `data`**：`null`

### 5.9 创建团队
```
POST /api/teams
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 团队名 |
| service_types | string[] | 否 | 服务类型 |

**响应 `data`**：创建后的 `Team`

### 5.10 加入团队
```
POST /api/teams/join
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 邀请码 |

**响应 `data`**：加入后的 `Team`

### 5.11 解散团队
```
DELETE /api/teams/{teamId}
```
**响应 `data`**：`null`

### 5.12 获取团队对外主页
```
GET /api/teams/{teamId}/profile
```

**响应 `data`：`TeamProfile`**
```json
{
  "team_id": "t-001",
  "name": "杭州光影工作室",
  "logo_url": "https://...",
  "cover_url": "https://...",
  "description": "专注婚礼摄影摄像",
  "city": "杭州",
  "service_types": ["婚礼跟拍", "婚纱照"],
  "contact_phone": "13800138001",
  "member_count": 6,
  "view_count": 13863,
  "created_at": "2025-01-10T10:00:00"
}
```

### 5.13 获取团队主页成员列表
```
GET /api/teams/{teamId}/profile/members
```

**响应 `data`：`TeamProfileMember[]`**
```json
[
  {
    "user_id": "u-001",
    "nickname": "我自己",
    "avatar_url": "https://...",
    "professions": ["摄影", "摄像"],
    "price_text": "2500元/场",
    "phone": "13800138001",
    "is_verified": true,
    "works": [
      {
        "image_url": "https://...",
        "title": "西湖婚礼"
      }
    ]
  }
]
```

---

## 六、名片/档期卡模块 `card`

### 6.1 获取档期卡
```
GET /api/cards/{userId}
```

**响应 `data`：`ScheduleCard`**
```json
{
  "card_id": "c-001",
  "user_id": "u-001",
  "nickname": "我自己",
  "avatar_url": "https://...",
  "profession": "摄影",
  "city": "杭州",
  "phone": "13800138001",
  "bio": "5年婚礼摄影经验",
  "price_text": "2500元/场",
  "background_url": "https://...",
  "schedules": [
    { "date": "2026-05-02", "title": "西湖婚礼", "location": "杭州西湖区" }
  ],
  "works": [
    { "image_url": "https://...", "title": "草坪婚礼" }
  ],
  "updated_at": "2026-04-25T10:00:00",
  "qr_code_url": "https://..."
}
```

### 6.2 获取档期卡图片
```
GET /api/cards/{userId}/image
```
**响应 `data`**：`{ image_url: string }`

### 6.3 发布作品
```
POST /api/works
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| image_url | string | 是 | 图片 URL |
| title | string | 否 | 作品标题 |

**响应 `data`**：`{ work_id: string }`

### 6.4 发布短视频
```
POST /api/posts
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| video_url | string | 是 | 视频 URL |

**响应 `data`**：`{ post_id: string }`

---

## 七、消息模块 `chat`

### 7.1 获取会话列表
```
GET /api/chats
```

**响应 `data`：`Chat[]`**
```json
[
  {
    "chat_id": "ch-001",
    "chat_name": "5月3日·杭州西湖婚礼",
    "chat_type": "schedule_temp",
    "schedule_id": "s-1",
    "team_id": "",
    "member_count": 4,
    "expire_at": "2026-05-04T00:00:00",
    "last_message": {
      "sender_name": "张三",
      "content": "收到，我会带设备过去",
      "sent_at": "2026-04-26T09:30:00"
    },
    "unread_count": 3,
    "created_at": "2026-04-25T10:00:00"
  }
]
```

**Chat.chat_type**：private / team / schedule_temp

### 7.2 获取消息列表
```
GET /api/chats/{chatId}/messages
```

**响应 `data`：`Message[]`**
```json
[
  {
    "message_id": "m-001-0",
    "sender_id": "system",
    "sender_name": "系统",
    "sender_avatar": "",
    "msg_type": "system",
    "content": "档期群已创建",
    "sent_at": "2026-04-25T10:00:00"
  },
  {
    "message_id": "m-001-1",
    "sender_id": "u-001",
    "sender_name": "我自己",
    "sender_avatar": "https://...",
    "msg_type": "text",
    "content": "大家确认下档期",
    "sent_at": "2026-04-26T08:00:00"
  }
]
```

**Message.msg_type**：text / image / location / system

### 7.3 发送消息
```
POST /api/chats/{chatId}/messages
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| msg_type | string | 是 | text / image / location |
| content | string | 是 | 文本内容 / 图片 URL / 位置描述 |

**响应 `data`**：发送后的 `Message`

### 7.4 创建会话
```
POST /api/chats
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| chat_type | string | 是 | team / schedule_temp |
| chat_name | string | 是 | 会话名称 |
| schedule_id | string | 否 | 关联档期 ID |
| team_id | string | 否 | 关联团队 ID |
| member_ids | string[] | 是 | 初始成员 user_id 列表 |
| expire_at | string | 否 | 过期时间（schedule_temp 用） |

**响应 `data`**：创建后的 `Chat`

### 7.5 添加会话成员
```
POST /api/chats/{chatId}/members
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 要添加的用户 ID |

**响应 `data`**：`null`

### 7.6 移除会话成员
```
DELETE /api/chats/{chatId}/members/{userId}
```
**响应 `data`**：`null`

### 7.7 关闭/删除会话
```
DELETE /api/chats/{chatId}
```
**响应 `data`**：`null`

### 7.8 获取会话成员
```
GET /api/chats/{chatId}/members
```

**响应 `data`**：`TeamMember[]`（复用团队成员结构）

---

## 八、通知模块 `notification`

### 8.1 获取通知列表
```
GET /api/notifications
```

**响应 `data`：`Notification[]`**
```json
[
  {
    "notification_id": "n-001",
    "type": "schedule_update",
    "title": "档期确认",
    "content": "您5月3日的杭州西湖婚礼档期已被确认",
    "extra_data": { "schedule_id": "s-1", "date": "2026-05-03" },
    "is_read": false,
    "created_at": "2026-04-26T09:00:00"
  }
]
```

**Notification.type**：schedule_update / order_grab / dispatch / system

### 8.2 标记通知已读
```
PUT /api/notifications/{notificationId}/read
```
**响应 `data`**：`null`

---

## 九、城市模块 `city`

### 9.1 获取热门城市
```
GET /api/cities/hot
```

**响应 `data`：`City[]`**
```json
[
  { "city_id": "1", "name": "杭州" },
  { "city_id": "2", "name": "上海" }
]
```

### 9.2 获取所有城市
```
GET /api/cities
```

**响应 `data`：`CityGroup[]`**
```json
[
  {
    "letter": "A",
    "cities": [
      { "city_id": "10", "name": "安庆", "letter": "A" }
    ]
  }
]
```

### 9.3 逆地理编码
```
GET /api/geo/reverse?lat=30.25&lng=120.17
```

**响应 `data`**：`{ city_id: string, name: string }`

---

## 附录：接口汇总表

| 模块 | 接口数 | 方法分布 |
|------|--------|----------|
| auth | 2 | GET 1, POST 1 |
| profile | 2 | GET 1, PUT 1 |
| schedule | 12 | GET 6, POST 3, PUT 1, DELETE 1, GET(search) 1 |
| order | 5 | GET 3, POST 2 |
| team | 14 | GET 5, POST 3, PUT 2, DELETE 2, GET(profile) 2 |
| card | 4 | GET 2, POST 2 |
| chat | 8 | GET 3, POST 2, PUT 0, DELETE 2, GET(members) 1 |
| notification | 2 | GET 1, PUT 1 |
| city | 3 | GET 3 |
| **合计** | **52** | GET 26, POST 11, PUT 4, DELETE 5, 其他 6 |
