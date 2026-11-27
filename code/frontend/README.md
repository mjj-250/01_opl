# 序 · 个人系统前端原型

个人本地优先的任务、模块、目标与生活管理前端。当前为可交互原型，使用模拟数据，不接后端、不引入 AI、不保存真实账密。

## 技术栈

- React 19 + TypeScript + Vite
- React Router：页面路由
- dnd-kit：四象限拖动
- FullCalendar 标准版：日、周、月日历
- Lucide React：图标
- Vitest：业务规则单元测试
- 原生 CSS 变量：清爽效率、温暖生活、深色控制台三套主题

默认主题为 `warm`（温暖生活风），选择保存在 `localStorage.opl-theme`。任务、文档、目标、财务流水等仍是会话内模拟数据，刷新页面会恢复；只有主题选择会持久保留。

## 运行与检查

```powershell
npm install
npm run dev
npm run test
npm run typecheck
npm run build
npm run preview
```

开发地址默认为 `http://127.0.0.1:5173/`。

## 目录结构

```text
code/frontend/
├── public/
│   └── favicon.svg                 # 应用图标
├── src/
│   ├── app/
│   │   └── AppContext.tsx          # 原型全局状态与跨页面操作
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppShell.tsx        # 导航、顶部栏、主题切换、页面容器
│   │   ├── tasks/
│   │   │   ├── QuadrantBoard.tsx   # 四象限与拖放
│   │   │   ├── TaskCard.tsx        # 任务卡片
│   │   │   ├── TaskDetail.tsx      # 任务详情、状态与归类
│   │   │   └── TaskForm.tsx        # 简洁创建与高级选项
│   │   └── ui/                     # Button、Modal、Panel、PageHeader
│   ├── pages/
│   │   ├── TodayPage.tsx           # 今天与四象限
│   │   ├── ModulesPage.tsx         # 模块、子模块与方法论
│   │   ├── GoalsPage.tsx           # 阶段目标与手动验收
│   │   ├── CalendarPage.tsx        # 日/周/月规划日历（按需加载）
│   │   ├── RecordsPage.tsx         # 每日自动汇总与复盘
│   │   ├── DocumentsPage.tsx       # 文档分类、搜索与关联
│   │   ├── FinancePage.tsx         # 流水、账户、负债与净资产
│   │   └── CredentialsPage.tsx     # 账密占位，不收集密码
│   ├── data/
│   │   └── mock.ts                 # 集中管理的模拟数据
│   ├── styles/
│   │   └── index.css               # 设计令牌、三主题、组件与响应式样式
│   ├── tests/
│   │   ├── tasks.test.ts           # 四象限规则测试
│   │   └── finance.test.ts         # 财务计算测试
│   ├── types/
│   │   └── index.ts                # 跨模块公共类型
│   ├── utils/
│   │   ├── tasks.ts                # 归类、创建、锁定与恢复规则
│   │   ├── finance.ts              # 余额、负债与净资产计算
│   │   └── format.ts               # 日期与金额格式化
│   ├── App.tsx                     # 路由与页面懒加载
│   └── main.tsx                    # 应用入口
├── package.json                    # 依赖与命令
├── tsconfig.json                   # TypeScript 严格检查
└── vite.config.ts                  # Vite 配置
```

## 模块边界

- `pages` 负责页面组合和用户操作，不复制四象限或财务公式。
- `components/tasks` 只处理任务交互，可跨今天、日历和模块页复用。
- `utils` 保存纯业务规则，可脱离 React 独立测试。
- `AppContext` 目前协调模拟状态；接后端时应在操作层替换为服务调用，页面不应直接拼请求。
- `types` 只保存跨模块共享类型，单个页面的局部表单状态留在页面内。
- 账密保持独立占位，不与任务、财务或文档数据耦合。

## 页面

| 路由 | 能力 |
| --- | --- |
| `/` | 今日摘要、四象限、临时任务、拖动、锁定与恢复、任务状态 |
| `/modules` | 模块主页、动态子模块、方法论、目标任务 |
| `/goals` | 主阶段目标、完成标准、里程碑、手动验收 |
| `/calendar` | 日/周/月视图、日期新增、任务详情 |
| `/records` | 自动任务汇总、复盘、精力与心情 |
| `/documents` | 分类、搜索、新建、任务关联 |
| `/finance` | 支出/收入/还贷、负债、净资产、余额校准 |
| `/credentials` | 安全边界与占位说明 |

## 已验证

- TypeScript 严格类型检查通过。
- 2 个测试文件、10 项业务规则测试通过。
- 生产构建通过，日历独立分包。
- 浏览器验证三主题与主题记忆、8 个页面、主要交互及 1440px/390px 响应式布局。
