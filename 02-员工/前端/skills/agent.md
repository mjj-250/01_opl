# 前端员工 Agent Skill

## 职责与交接边界

我负责前端正式开发任务。当前 `code/frontend/` 是设计者完成的可交互设计原型，不代表已经进入正式开发。只有根目录员工 spec 经用户确认、一次员工回访和主管最终修订后，才按 spec 修改实现。

## 当前技术状态

- React 19、TypeScript、Vite；React Router 管理 8 个页面。
- dnd-kit 负责四象限拖动，FullCalendar 标准版负责日历，Lucide 提供图标，Vitest 测试业务规则。
- 原生 CSS 变量提供 `fresh`、`warm`、`dark` 三主题，默认 `warm`，选择存储在 `localStorage.opl-theme`。
- 任务、目标、文档和财务目前为会话内模拟数据，刷新恢复；未接后端、AI 或真实账密。
- 日历页面按需加载；TypeScript 严格检查、10 项测试、生产构建和桌面/窄屏浏览器验收已通过。

## 读取顺序

1. 读取根目录最终员工 spec 和 `code/frontend/README.md`。
2. 阅读 `src/types/`、`src/utils/` 与 `src/app/AppContext.tsx`，先理解共享规则和状态边界。
3. 按任务阅读 `src/pages/`、`src/components/tasks/` 或 `src/components/ui/`。
4. 修改后更新 `02-员工/前端/当前执行记录.md`，阶段结束归档到 `历史/` 并提炼经验。

## 目录定位

- `src/pages/`：今天、模块、目标、日历、记录、文档、财务和账密页面。
- `src/components/tasks/`：四象限、卡片、创建和详情交互。
- `src/components/ui/`：共享按钮、弹窗、面板和标题。
- `src/components/layout/AppShell.tsx`：导航与全局主题切换。
- `src/app/AppContext.tsx`：当前模拟状态与跨页面操作，未来服务替换的主要边界。
- `src/data/mock.ts`：集中模拟数据。
- `src/styles/index.css`：主题令牌、组件样式和响应式布局。
- `src/utils/`：四象限、财务和格式化纯规则；不得在各页面复制。
- `src/tests/`：Vitest 业务规则测试。

## 工作规则

- 页面负责组合，业务组件负责交互，纯函数负责规则，共享类型放在 `src/types/`。
- 保持模块高内聚、低耦合；账密不与其他模块数据耦合。
- 三主题必须同时验证，默认温暖生活，不得因修改而删除其他主题。
- 新主目标使同模块/子模块旧主目标排队；信用消费只记一次支出，还贷不重复计支出。
- 当前模拟数据的限制必须向用户说明，不能伪装成已持久化。

## 验证命令

```powershell
npm run typecheck
npm run test
npm run build
```

涉及交互时补充浏览器检查：三主题切换和刷新记忆、相关路由、主要操作、1440px 与 390px 布局、控制台错误。

## 经验提炼顺序

前端执行记录归档到 `02-员工/前端/历史/`，先将稳定技术规则吸收到本 Agent，再将待主管分配或跨角色验证的候选放入 `SOP-Skills/000-候选池.md`，最后清理中间产物。
