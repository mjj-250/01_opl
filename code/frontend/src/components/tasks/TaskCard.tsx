import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { LockKeyhole, RotateCcw } from 'lucide-react';
import { useApp } from '../../app/AppContext';
import type { Task } from '../../types';
import { formatTaskTime } from '../../utils/format';

export function TaskCard({ task, onOpen }: { task: Task; onOpen: (id: string) => void }) {
  const { modules, restoreTask } = useApp();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task } });
  const module = modules.find(item => item.id === task.moduleId);
  const isToday = task.plannedDate === '2026-11-27';
  return <article ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform) }} className={`task-card ${isToday ? 'is-today' : ''} ${isDragging ? 'is-dragging' : ''} status-${task.status}`} {...listeners} {...attributes} onClick={() => onOpen(task.id)}>
    <div className="task-topline"><span className="module-tag" style={{ color: module?.color }}>{module?.name ?? '临时事务'}</span><div className="task-badges">{isToday && <span className="today-badge">今天</span>}{task.manualLocked && <button className="lock-button" title="恢复自动归类" aria-label={`恢复 ${task.name} 自动归类`} onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); restoreTask(task.id); }}><LockKeyhole size={12} /></button>}</div></div>
    <h3>{task.name}</h3>
    <p className={`start-action ${!task.startAction ? 'empty' : ''}`}><RotateCcw size={12} /><span>{task.startAction || '尚未设置启动动作'}</span></p>
    <footer><span>{formatTaskTime(task.plannedDate, task.plannedTime)}</span>{task.status === 'doing' && <b>进行中</b>}{task.status === 'completed' && <b>已完成</b>}</footer>
  </article>;
}
