import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhCnLocale from '@fullcalendar/core/locales/zh-cn';
import { Plus } from 'lucide-react';
import { useApp } from '../app/AppContext';
import { TaskDetail } from '../components/tasks/TaskDetail';
import { TaskForm } from '../components/tasks/TaskForm';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';

export function CalendarPage() {
  const { tasks, modules } = useApp();
  const [creatingDate, setCreatingDate] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const events = tasks.filter(task => task.plannedDate).map(task => ({ id: task.id, title: task.name, start: task.plannedTime ? `${task.plannedDate}T${task.plannedTime}` : task.plannedDate, backgroundColor: modules.find(module => module.id === task.moduleId)?.color ?? '#8791a3', borderColor: 'transparent', classNames: task.status === 'completed' ? ['calendar-completed'] : [] }));
  return <>
    <PageHeader eyebrow="MODULE PLANNING CALENDAR" title="把模块规划放进时间。" description="日、周、月视图共用任务数据；点击日期可新增，点击事项可查看任务。" actions={<Button onClick={() => setCreatingDate('2026-11-27')}><Plus size={16} />安排任务</Button>} />
    <section className="calendar-panel"><FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} locales={[zhCnLocale]} locale="zh-cn" initialView="dayGridMonth" initialDate="2026-11-27" firstDay={1} height="auto" headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }} buttonText={{ today: '今天', month: '月', week: '周', day: '日' }} events={events} dateClick={info => setCreatingDate(info.dateStr.slice(0, 10))} eventClick={info => setSelectedTask(info.event.id)} nowIndicator /></section>
    {creatingDate && <TaskForm initialDate={creatingDate} onClose={() => setCreatingDate(null)} />}{selectedTask && <TaskDetail taskId={selectedTask} onClose={() => setSelectedTask(null)} />}
  </>;
}
