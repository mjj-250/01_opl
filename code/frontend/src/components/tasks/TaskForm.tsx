import { useState } from 'react';
import type { FormEvent } from 'react';
import { useApp } from '../../app/AppContext';
import { APP_TODAY } from '../../utils/format';
import { moduleDefaults } from '../../utils/tasks';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export function TaskForm({ initialDate = APP_TODAY, onClose }: { initialDate?: string; onClose: () => void }) {
  const { modules, addTask } = useApp();
  const [name, setName] = useState('');
  const [moduleId, setModuleId] = useState('temporary');
  const [submoduleId, setSubmoduleId] = useState('');
  const [plannedDate, setPlannedDate] = useState(initialDate);
  const [plannedTime, setPlannedTime] = useState('19:00');
  const [startAction, setStartAction] = useState('');
  const [important, setImportant] = useState(false);
  const [urgent, setUrgent] = useState(initialDate === APP_TODAY);
  const [advancedTouched, setAdvancedTouched] = useState(false);
  const selectedModule = modules.find(module => module.id === moduleId);

  const changeModule = (id: string) => {
    const defaults = moduleDefaults[id] ?? moduleDefaults.temporary;
    setModuleId(id); setSubmoduleId(''); setStartAction(defaults.startAction); setImportant(defaults.important);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    addTask({ name: name.trim(), moduleId, submoduleId: submoduleId || undefined, startAction, plannedDate, plannedTime, important, urgent, manualLocked: advancedTouched });
    onClose();
  };
  return <Modal title="新增临时任务" eyebrow="QUICK CAPTURE" onClose={onClose}><form onSubmit={submit}><p className="form-intro">先记录最少信息，高级规划属性可按需调整。</p><label className="field"><span>任务名称 <b>必填</b></span><input autoFocus required maxLength={60} value={name} onChange={event => setName(event.target.value)} placeholder="例如：整理桌面" /></label><div className="field-row"><label className="field"><span>所属模块</span><select value={moduleId} onChange={event => changeModule(event.target.value)}><option value="temporary">临时事务</option>{modules.map(module => <option key={module.id} value={module.id}>{module.name}</option>)}</select></label><label className="field"><span>子模块</span><select value={submoduleId} onChange={event => setSubmoduleId(event.target.value)} disabled={!selectedModule}><option value="">不指定</option>{selectedModule?.submodules.map(submodule => <option key={submodule.id} value={submodule.id}>{submodule.name}</option>)}</select></label></div><div className="field-row"><label className="field"><span>计划日期</span><input type="date" value={plannedDate} onChange={event => { setPlannedDate(event.target.value); if (!advancedTouched) setUrgent(event.target.value === APP_TODAY); }} /></label><label className="field"><span>计划时间</span><input type="time" value={plannedTime} onChange={event => setPlannedTime(event.target.value)} /></label></div><label className="field"><span>启动动作 <em>可留空</em></span><input value={startAction} onChange={event => setStartAction(event.target.value)} placeholder="例如：先走到书桌前" /></label><details className="advanced-fields"><summary>高级选项：重要与紧急程度</summary><div className="field-row"><label className="field"><span>重要程度</span><select value={String(important)} onChange={event => { setImportant(event.target.value === 'true'); setAdvancedTouched(true); }}><option value="true">重要</option><option value="false">不重要</option></select></label><label className="field"><span>紧急程度</span><select value={String(urgent)} onChange={event => { setUrgent(event.target.value === 'true'); setAdvancedTouched(true); }}><option value="true">紧急</option><option value="false">不紧急</option></select></label></div><p>只有实际修改高级属性才锁定象限。</p></details><div className="modal-actions"><Button type="button" variant="secondary" onClick={onClose}>取消</Button><Button type="submit">加入四象限</Button></div></form></Modal>;
}
