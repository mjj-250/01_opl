import { useState } from 'react';
import type { FormEvent } from 'react';
import { Check, Plus, Target } from 'lucide-react';
import { useApp } from '../app/AppContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';

export function GoalsPage() {
  const { goals, modules, addGoal, completeGoal } = useApp();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [moduleId, setModuleId] = useState('fitness');
  const [submoduleId, setSubmoduleId] = useState('');
  const [period, setPeriod] = useState('2026.12.01 — 2026.12.31');
  const [description, setDescription] = useState('');
  const [completionStandard, setCompletionStandard] = useState('');
  const [target, setTarget] = useState(1);
  const [unit, setUnit] = useState('次');
  const module = modules.find(item => item.id === moduleId);
  const submit = (event: FormEvent) => { event.preventDefault(); if (!title.trim() || !completionStandard.trim()) return; addGoal({ id: `goal-${Date.now()}`, title, moduleId, submoduleId: submoduleId || undefined, period, description, completionStandard, current: 0, target, unit, status: 'active', milestones: [] }); setCreating(false); setTitle(''); setDescription(''); setCompletionStandard(''); };
  return <>
    <PageHeader eyebrow="ONE ACTIVE MILESTONE" title="一个阶段，一个主目标。" description="目标需要可观察的完成标准，最终由你验收，而不是打卡结束就自动完成。" actions={<Button onClick={() => setCreating(true)}><Plus size={16} />新建阶段目标</Button>} />
    <div className="goal-grid">{goals.map(goal => { const owner = modules.find(item => item.id === goal.moduleId); const submodule = owner?.submodules.find(item => item.id === goal.submoduleId); return <article className={`goal-card status-${goal.status}`} key={goal.id}><header><span className="soft-badge">{owner?.name}{submodule ? ` · ${submodule.name}` : ''}</span><span className="goal-status">{{ active: '进行中', queued: '排队中', paused: '已暂停', completed: '已验收' }[goal.status]}</span></header><h2>{goal.title}</h2><time>{goal.period}</time><p>{goal.description}</p><div className="completion-standard"><Target size={16} /><div><small>完成标准</small><strong>{goal.completionStandard}</strong></div></div><div className="progress-label"><span>当前进度</span><strong>{goal.current} / {goal.target} {goal.unit}</strong></div><div className="progress-track"><span style={{ width: `${Math.min(100, goal.current / goal.target * 100)}%` }} /></div>{goal.milestones.length > 0 && <ul className="milestone-list">{goal.milestones.map(milestone => <li key={milestone.id} className={milestone.done ? 'done' : ''}><Check size={13} />{milestone.title}</li>)}</ul>}{goal.status === 'active' && <Button size="sm" variant="secondary" onClick={() => completeGoal(goal.id)}>确认达到标准并验收</Button>}</article>; })}</div>
    {creating && <Modal title="新建阶段目标" eyebrow="NEW MILESTONE" onClose={() => setCreating(false)}><form onSubmit={submit}><label className="field"><span>目标名称</span><input autoFocus required value={title} onChange={event => setTitle(event.target.value)} placeholder="例如：完成三个实践案例" /></label><div className="field-row"><label className="field"><span>所属模块</span><select value={moduleId} onChange={event => { setModuleId(event.target.value); setSubmoduleId(''); }}>{modules.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="field"><span>子模块</span><select value={submoduleId} onChange={event => setSubmoduleId(event.target.value)}><option value="">模块主目标</option>{module?.submodules.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div><label className="field"><span>阶段周期</span><input value={period} onChange={event => setPeriod(event.target.value)} /></label><label className="field"><span>目标说明</span><textarea value={description} onChange={event => setDescription(event.target.value)} /></label><label className="field"><span>可观察的完成标准 <b>必填</b></span><textarea required value={completionStandard} onChange={event => setCompletionStandard(event.target.value)} placeholder="达到什么结果才算完成？" /></label><div className="field-row"><label className="field"><span>目标数量</span><input type="number" min="1" value={target} onChange={event => setTarget(Number(event.target.value))} /></label><label className="field"><span>单位</span><input value={unit} onChange={event => setUnit(event.target.value)} /></label></div><p className="field-help">新目标成为同一模块/子模块的主目标，原主目标自动转为排队。</p><div className="modal-actions"><Button type="button" variant="secondary" onClick={() => setCreating(false)}>取消</Button><Button type="submit">创建目标</Button></div></form></Modal>}
  </>;
}
