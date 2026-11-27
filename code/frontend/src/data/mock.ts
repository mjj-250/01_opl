import type { Account, DailyRecord, DocumentItem, Goal, Module, Task } from '../types';

export const initialModules: Module[] = [
  { id: 'life', name: '日常生活', icon: 'Home', color: '#7a9c91', description: '用生活规则自动生成作息、健康提醒和家庭事项。', submodules: [{ id: 'routine', name: '健康作息', description: '起床、吃药、泡茶与睡眠时间窗口' }, { id: 'family', name: '家庭事项', description: '卫生、理发、生日与重要日期' }], methodology: ['按生活规则生成任务，不使用通用周期引擎', '周期事项支持时间窗口', '用低阻力启动动作减少拖延'] },
  { id: 'fitness', name: '健身', icon: 'Dumbbell', color: '#b87351', description: '以月度阶段计划推进家庭训练，执行与效果分开验收。', submodules: [{ id: 'home-training', name: '家庭训练', description: '哑铃与自重训练' }], methodology: ['默认采用一个月、三个月阶段计划', '训练次数和身体效果分开记录', '阶段目标由用户手动验收'] },
  { id: 'learning', name: '学习', icon: 'BookOpen', color: '#6687c9', description: '动态维护学习方向，在子模块内选择课程、案例或证书目标。', submodules: [{ id: 'ai-art', name: 'AI 绘画', description: '课程学习与案例实践' }, { id: 'agent-dev', name: 'Agent 开发', description: '案例、总结与项目实践' }], methodology: ['学习方向是可增删子模块', '课程、案例、证书是阶段目标模板', '学习成果关联统一文档库'] },
  { id: 'development', name: '开发', icon: 'Code2', color: '#7c72c9', description: '沉淀技术能力，把练习、案例和工具成果串成阶段目标。', submodules: [{ id: 'efficiency-tools', name: '效率工具', description: '快速开发工具与个人自动化' }, { id: 'skill-practice', name: '技能练习', description: '保持手感与新技术练习' }], methodology: ['技术方向和项目是动态子模块', '技能练习、案例、工具成果使用目标模板', '错误记录与设计文档可跨模块关联'] },
  { id: 'games', name: '游戏', icon: 'Gamepad2', color: '#b184a9', description: '每款游戏独立管理日常、成就、攻略和角色熟练度。', submodules: [{ id: 'honor-of-kings', name: '王者荣耀', description: '分路英雄、攻略与成就' }], methodology: ['每款游戏一个子模块', '成就目标与日常任务分开', '攻略记录版本，避免使用过期内容'] },
  { id: 'finance', name: '财务', icon: 'WalletCards', color: '#a18b52', description: '记录流水、账户、信用负债、总资产与净资产。', submodules: [{ id: 'accounts', name: '账户与平台', description: '现金、银行卡、信用支付平台' }], methodology: ['信用消费发生时记支出', '还贷减少负债，不重复记支出', '余额校准保留调整流水'] },
];

export const initialTasks: Task[] = [
  { id: 't1', name: '整理本周工单优先级', moduleId: 'development', submoduleId: 'efficiency-tools', startAction: '先打开工单列表', plannedDate: '2026-11-27', plannedTime: '09:30', important: true, urgent: true, manualLocked: false, status: 'doing', goalId: 'g3' },
  { id: 't2', name: '提交保险材料', moduleId: 'life', submoduleId: 'family', startAction: '先找出身份证', plannedDate: '2026-11-27', plannedTime: '11:00', important: true, urgent: true, manualLocked: false, status: 'pending' },
  { id: 't3', name: '完成哑铃训练 20 分钟', moduleId: 'fitness', submoduleId: 'home-training', startAction: '先换上运动服', plannedDate: '2026-11-27', plannedTime: '18:30', important: true, urgent: false, manualLocked: false, status: 'pending', goalId: 'g1' },
  { id: 't4', name: 'AI 绘画课程第 4 节', moduleId: 'learning', submoduleId: 'ai-art', startAction: '先打开课程页面', plannedDate: '2026-11-27', plannedTime: '20:00', important: true, urgent: false, manualLocked: false, status: 'pending', goalId: 'g2' },
  { id: 't5', name: '整理快速开发工具需求', moduleId: 'development', submoduleId: 'efficiency-tools', startAction: '先写下三个最烦的重复操作', plannedDate: '2026-11-28', plannedTime: '10:00', important: true, urgent: false, manualLocked: false, status: 'pending', goalId: 'g3' },
  { id: 't6', name: '回复物业停水通知', moduleId: 'life', submoduleId: 'family', startAction: '先打开物业消息', plannedDate: '2026-11-27', plannedTime: '12:00', important: false, urgent: true, manualLocked: false, status: 'pending' },
  { id: 't7', name: '缴纳本月花呗', moduleId: 'finance', submoduleId: 'accounts', startAction: '先打开支付宝账单', plannedDate: '2026-11-27', plannedTime: '21:00', important: false, urgent: true, manualLocked: true, status: 'pending' },
  { id: 't8', name: '整理王者荣耀中路攻略', moduleId: 'games', submoduleId: 'honor-of-kings', startAction: '先收藏一篇最新版攻略', plannedDate: '2026-11-29', plannedTime: '15:00', important: false, urgent: false, manualLocked: false, status: 'pending' },
  { id: 't9', name: '清理手机相册', moduleId: 'life', startAction: '', plannedDate: '', plannedTime: '', important: false, urgent: false, manualLocked: false, status: 'pending' },
];

export const initialGoals: Goal[] = [
  { id: 'g1', moduleId: 'fitness', submoduleId: 'home-training', title: '建立十一月家庭训练节奏', period: '2026.11.01 — 2026.11.30', description: '在家使用哑铃和自重动作，逐步建立稳定训练习惯。', completionStandard: '完成 12 次有效训练，并记录月末体型、力量与主观状态。', current: 7, target: 12, unit: '次', status: 'active', milestones: [{ id: 'm1', title: '完成训练环境准备', done: true }, { id: 'm2', title: '完成前 6 次训练', done: true }, { id: 'm3', title: '完成月末效果复盘', done: false }] },
  { id: 'g2', moduleId: 'learning', submoduleId: 'ai-art', title: '完成 AI 绘画基础课程与首个案例', period: '2026.11.15 — 2026.12.15', description: '课程学习和案例实践并行，但以一个阶段目标统筹。', completionStandard: '完成课程总结，并独立产出 1 个可展示案例。', current: 4, target: 10, unit: '节', status: 'active', milestones: [{ id: 'm1', title: '完成基础课程', done: false }, { id: 'm2', title: '整理提示词方法', done: false }, { id: 'm3', title: '完成案例复盘', done: false }] },
  { id: 'g3', moduleId: 'development', submoduleId: 'efficiency-tools', title: '完成个人快速开发工具需求稿', period: '2026.11.25 — 2026.12.05', description: '从真实重复工作出发，明确工具边界和三个核心案例。', completionStandard: '形成需求文档，并用三个真实案例验证流程。', current: 2, target: 3, unit: '案例', status: 'active', milestones: [{ id: 'm1', title: '收集重复工作', done: true }, { id: 'm2', title: '整理核心流程', done: false }, { id: 'm3', title: '完成案例验证', done: false }] },
  { id: 'g4', moduleId: 'games', submoduleId: 'honor-of-kings', title: '熟悉中路三个英雄', period: '2026.12 月', description: '结合最新版攻略和实战记录，建立三个英雄的基本熟练度。', completionStandard: '每个英雄完成攻略摘要与三场实战复盘。', current: 1, target: 3, unit: '英雄', status: 'active', milestones: [{ id: 'm1', title: '选择三个英雄', done: true }, { id: 'm2', title: '更新版本攻略', done: false }] },
];

export const initialDocuments: DocumentItem[] = [
  { id: 'd1', title: '低阻力启动动作', type: '方法论', moduleId: 'life', content: '把任务缩小为一个具体、立即可做的身体第一步。例如起床先坐起来，洗碗先走到洗碗池前。字段允许留空，不做强制校验。', updatedAt: '2026-11-27' },
  { id: 'd2', title: '信用消费与还贷统计口径', type: '正确做法', moduleId: 'finance', content: '信用平台消费发生时计入支出；还贷只减少负债，不重复计算消费。', updatedAt: '2026-11-27' },
  { id: 'd3', title: '学习方向与目标模板不要混用', type: '错误记录', moduleId: 'learning', content: 'AI 绘画是学习子模块；课程、案例、证书是子模块内部的阶段目标模板。', updatedAt: '2026-11-27' },
  { id: 'd4', title: '王者荣耀中路攻略版本记录', type: '攻略', moduleId: 'games', content: '攻略需要标注游戏版本和更新时间，旧版本内容只作为历史参考。', updatedAt: '2026-11-26', linkedTaskId: 't8' },
  { id: 'd5', title: '个人系统前端模块边界', type: '项目设计', moduleId: 'development', content: '页面负责组合，业务组件负责交互，utils 保存可独立测试的规则，AppContext 只协调原型状态。', updatedAt: '2026-11-27' },
];

export const initialRecords: DailyRecord[] = [
  { date: '2026-11-27', review: '', energy: 3, mood: '平静' },
  { date: '2026-11-26', review: '完成了模块设计的主要讨论，学习任务分类需要重新梳理。', energy: 4, mood: '充实' },
  { date: '2026-11-25', review: '确定今天页面和四象限作为产品重点。', energy: 3, mood: '平静' },
];

export const initialAccounts: Account[] = [
  { id: 'cash', name: '现金', kind: 'asset', initialBalance: 0 },
  { id: 'bank', name: '银行卡', kind: 'asset', initialBalance: 0 },
  { id: 'alipay', name: '支付宝余额', kind: 'asset', initialBalance: 0 },
  { id: 'huabei', name: '支付宝 · 花呗', kind: 'credit', initialBalance: 0 },
  { id: 'meituan', name: '美团 · 月付', kind: 'credit', initialBalance: 0 },
];

export const initialTransactions = [];
