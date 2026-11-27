import { useApp } from '../../app/AppContext';
import type { QuadrantId } from '../../types';
import { formatTaskTime } from '../../utils/format';
import { getQuadrant, quadrantNames } from '../../utils/tasks';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export function TaskDetail({ taskId, onClose }: { taskId: string; onClose: () => void }) {
  const { tasks, modules, goals, moveTask, restoreTask, updateTaskStatus } = useApp();
  const task = tasks.find(item => item.id === taskId);
  if (!task) return null;
  const module = modules.find(item => item.id === task.moduleId);
  const goal = goals.find(item => item.id === task.goalId);
  return <Modal title="任务详情" eyebrow="TASK DETAIL" onClose={onClose}><h3 className="detail-title">{task.name}</h3><p className="detail-meta">{module?.name ?? '临时事务'} · {formatTaskTime(task.plannedDate, task.plannedTime)}</p>{goal && <div className="linked-goal">关联目标：{goal.title}</div>}<div className="detail-action"><small>启动动作</small><strong>{task.startAction || '尚未设置，允许留空'}</strong></div><label className="field"><span>所在象限</span><select value={getQuadrant(task)} onChange={event => moveTask(task.id, event.target.value as QuadrantId)}>{Object.entries(quadrantNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label><p className="field-help">{task.manualLocked ? '当前为手动归类，时间变化不会覆盖此位置。' : '当前跟随任务属性自动归类；更改象限后会锁定。'}</p><div className="status-actions"><Button size="sm" variant="secondary" disabled={task.status === 'doing'} onClick={() => updateTaskStatus(task.id, 'doing')}>开始任务</Button><Button size="sm" variant="secondary" disabled={task.status === 'completed'} onClick={() => updateTaskStatus(task.id, 'completed')}>标记完成</Button><Button size="sm" variant="ghost" disabled={task.status === 'abandoned'} onClick={() => updateTaskStatus(task.id, 'abandoned')}>放弃</Button></div><div className="modal-actions"><Button variant="secondary" disabled={!task.manualLocked} onClick={() => restoreTask(task.id)}>恢复自动归类</Button><Button onClick={onClose}>完成</Button></div></Modal>;
}
