import { useState } from 'react';
import type { FormEvent } from 'react';
import { BookOpen, Code2, Dumbbell, Gamepad2, Home, Plus, WalletCards } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '../app/AppContext';
import { TaskDetail } from '../components/tasks/TaskDetail';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { formatTaskTime } from '../utils/format';

const icons: Record<string, LucideIcon> = { life: Home, fitness: Dumbbell, learning: BookOpen, development: Code2, games: Gamepad2, finance: WalletCards };

export function ModulesPage() {
  const { modules, tasks, goals, addSubmodule } = useApp();
  const [selectedId, setSelectedId] = useState('fitness');
  const [newSubmodule, setNewSubmodule] = useState('');
  const [adding, setAdding] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const selected = modules.find(module => module.id === selectedId)!;
  const selectedGoal = goals.find(goal => goal.moduleId === selectedId && goal.status === 'active');
  const moduleTasks = tasks.filter(task => task.moduleId === selectedId && task.status !== 'completed');
  const submitSubmodule = (event: FormEvent) => { event.preventDefault(); if (!newSubmodule.trim()) return; addSubmodule(selectedId, newSubmodule.trim()); setNewSubmodule(''); setAdding(false); };
  return <>
    <PageHeader eyebrow="MODULE-DRIVEN PLANNING" title="模块，不只是任务分类。" description="每个模块拥有自己的目标、规划、任务、记录、文档和方法论。" />
    <div className="module-layout"><section className="module-grid">{modules.map(module => { const Icon = icons[module.id]; const active = selectedId === module.id; return <button key={module.id} className={`module-card ${active ? 'active' : ''}`} onClick={() => setSelectedId(module.id)}><span className="module-icon" style={{ color: module.color }}><Icon size={21} /></span><div><h2>{module.name}</h2><p>{module.description}</p><small>{module.submodules.length} 个子模块 · {tasks.filter(task => task.moduleId === module.id).length} 个任务</small></div></button>; })}</section><Panel className="module-detail"><header className="module-detail-title"><div><span className="eyebrow">MODULE HOME</span><h2>{selected.name}</h2><p>{selected.description}</p></div><Button size="sm" variant="secondary" onClick={() => setAdding(value => !value)}><Plus size={14} />子模块</Button></header>{adding && <form className="inline-form" onSubmit={submitSubmodule}><input autoFocus value={newSubmodule} onChange={event => setNewSubmodule(event.target.value)} placeholder="子模块名称" /><Button size="sm" type="submit">添加</Button></form>}<div className="detail-section"><h3>子模块</h3><div className="chip-list">{selected.submodules.map(submodule => <span key={submodule.id} title={submodule.description}>{submodule.name}</span>)}</div></div>{selectedGoal && <div className="detail-section goal-callout"><h3>当前主阶段目标</h3><strong>{selectedGoal.title}</strong><p>{selectedGoal.completionStandard}</p><div className="progress-track"><span style={{ width: `${Math.min(100, selectedGoal.current / selectedGoal.target * 100)}%` }} /></div></div>}<div className="detail-section"><h3>模块方法论</h3><ol className="method-list">{selected.methodology.map((method, index) => <li key={method}><span>{index + 1}</span>{method}</li>)}</ol></div><div className="detail-section"><h3>模块任务</h3><div className="compact-task-list">{moduleTasks.map(task => <button key={task.id} onClick={() => setSelectedTask(task.id)}><span><strong>{task.name}</strong><small>{task.startAction || '未设置启动动作'}</small></span><time>{formatTaskTime(task.plannedDate, task.plannedTime)}</time></button>)}{moduleTasks.length === 0 && <p className="empty-text">当前没有待处理任务。</p>}</div></div></Panel></div>
    {selectedTask && <TaskDetail taskId={selectedTask} onClose={() => setSelectedTask(null)} />}
  </>;
}
