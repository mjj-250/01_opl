import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock3, LockKeyhole, MoonStar, Plus, Sun, Target } from 'lucide-react';
import { useApp } from '../app/AppContext';
import { QuadrantBoard } from '../components/tasks/QuadrantBoard';
import { TaskDetail } from '../components/tasks/TaskDetail';
import { TaskForm } from '../components/tasks/TaskForm';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { APP_TODAY } from '../utils/format';

export function TodayPage() {
  const { tasks, goals, notify } = useApp();
  const [creating, setCreating] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const navigate = useNavigate();
  const todayTasks = tasks.filter(task => task.plannedDate === APP_TODAY);
  const currentGoal = goals.find(goal => goal.id === 'g1')!;
  return <>
    <PageHeader eyebrow="2026年11月27日 · 星期五" title="今天，从一个小动作开始。" description="不用等待状态，先完成启动动作。" actions={<><Button variant="secondary" onClick={() => notify('早间计划：可直接拖动任务或在详情中调整今天安排')}><Sun size={16} />早间计划</Button><Button onClick={() => setCreating(true)}><Plus size={16} />临时任务</Button></>} />
    <section className="day-summary"><div><Clock3 size={19} /><span><small>今日任务</small><strong>{todayTasks.length}</strong></span></div><i /><div><Target size={19} /><span><small>进行中</small><strong>{tasks.filter(task => task.status === 'doing').length}</strong></span></div><i /><div><LockKeyhole size={19} /><span><small>手动归类</small><strong>{tasks.filter(task => task.manualLocked).length}</strong></span></div><i /><div><CheckCircle2 size={19} /><span><small>今日完成</small><strong>{todayTasks.filter(task => task.status === 'completed').length}</strong></span></div><p>任务由模块规划生成，四象限按属性展示</p></section>
    <div className="today-workspace"><section><div className="section-heading"><div><h2>任务四象限</h2><p>拖动卡片可手动归类，恢复自动前不会被时间规则覆盖。</p></div><span className="legend">● 今天 &nbsp; ▣ 已锁定</span></div><QuadrantBoard tasks={tasks.filter(task => task.status !== 'abandoned')} onOpen={setSelectedTask} /></section><aside className="today-insights"><Panel className="goal-panel"><span className="eyebrow">CURRENT MILESTONE</span><h2>本月主阶段目标</h2><span className="soft-badge">健身 · 家庭训练</span><p>{currentGoal.description}</p><div className="progress-label"><span>执行进度</span><strong>{currentGoal.current} / {currentGoal.target} {currentGoal.unit}</strong></div><div className="progress-track"><span style={{ width: `${currentGoal.current / currentGoal.target * 100}%` }} /></div><small>执行数据与身体效果分开记录，月末手动验收。</small></Panel><Panel className="method-panel"><span className="method-symbol">↳</span><span className="eyebrow">LOW-FRICTION START</span><h2>启动动作</h2><p>把任务缩小为一个具体的身体第一步。</p><blockquote>“先换上运动服。”</blockquote><small>字段允许留空，模块可预填，你可以随时修改。</small></Panel><Panel className="review-panel"><MoonStar size={21} /><div><h2>晚间复盘</h2><p>处理延期与放弃，留下今天的记录。</p><button onClick={() => navigate('/records')}>进入复盘 →</button></div></Panel></aside></div>
    {creating && <TaskForm onClose={() => setCreating(false)} />}{selectedTask && <TaskDetail taskId={selectedTask} onClose={() => setSelectedTask(null)} />}
  </>;
}
