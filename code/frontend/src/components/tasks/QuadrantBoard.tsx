import { DndContext, PointerSensor, rectIntersection, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useApp } from '../../app/AppContext';
import type { QuadrantId, Task } from '../../types';
import { getQuadrant, quadrantNames } from '../../utils/tasks';
import { TaskCard } from './TaskCard';

const quadrants: { id: QuadrantId; caption: string }[] = [
  { id: 'important-urgent', caption: '优先处理 · 立即行动' },
  { id: 'important-not', caption: '持续积累 · 主动规划' },
  { id: 'urgent-not', caption: '快速处理 · 减少打扰' },
  { id: 'neither', caption: '以后再说 · 控制投入' },
];

function Quadrant({ id, caption, tasks, onOpen }: { id: QuadrantId; caption: string; tasks: Task[]; onOpen: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return <section className={`quadrant q-${id} ${isOver ? 'is-over' : ''}`}><header><div><span className="quadrant-index">0{quadrants.findIndex(item => item.id === id) + 1}</span><h3>{quadrantNames[id]}</h3></div><span className="quadrant-count">{tasks.length}</span></header><p className="quadrant-caption">{caption}</p><div className="task-list" ref={setNodeRef}>{tasks.map(task => <TaskCard key={task.id} task={task} onOpen={onOpen} />)}{tasks.length === 0 && <div className="empty-list">把任务拖到这里</div>}</div></section>;
}

export function QuadrantBoard({ tasks, onOpen }: { tasks: Task[]; onOpen: (id: string) => void }) {
  const { moveTask } = useApp();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const onDragEnd = ({ active, over }: DragEndEvent) => { if (over) moveTask(String(active.id), String(over.id) as QuadrantId); };
  return <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={onDragEnd}><div className="quadrant-grid">{quadrants.map(quadrant => <Quadrant key={quadrant.id} {...quadrant} tasks={tasks.filter(task => getQuadrant(task) === quadrant.id)} onOpen={onOpen} />)}</div></DndContext>;
}
