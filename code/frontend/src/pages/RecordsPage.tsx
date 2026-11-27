import { useEffect, useState } from 'react';
import { BatteryMedium, CheckCircle2, Clock3, NotebookPen, Smile } from 'lucide-react';
import { useApp } from '../app/AppContext';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { APP_TODAY } from '../utils/format';

export function RecordsPage() {
  const { records, tasks, updateRecord } = useApp();
  const [selectedDate, setSelectedDate] = useState(APP_TODAY);
  const current = records.find(record => record.date === selectedDate) ?? records[0];
  const [review, setReview] = useState(current.review);
  const [energy, setEnergy] = useState(current.energy);
  const [mood, setMood] = useState(current.mood);
  useEffect(() => { setReview(current.review); setEnergy(current.energy); setMood(current.mood); }, [selectedDate]);
  const dayTasks = tasks.filter(task => task.plannedDate === selectedDate);
  return <>
    <PageHeader eyebrow="AUTOMATIC DAILY SUMMARY" title="每天留下一点线索。" description="系统汇总任务变化，你只需补充复盘、精力和心情。" />
    <div className="records-layout"><Panel title="日期" className="record-dates">{records.map(record => <button key={record.date} className={selectedDate === record.date ? 'active' : ''} onClick={() => setSelectedDate(record.date)}><NotebookPen size={15} /><span>{record.date}{record.date === APP_TODAY && ' · 今天'}</span></button>)}</Panel><div className="record-main"><section className="record-stats"><div><Clock3 size={18} /><span><small>计划任务</small><strong>{dayTasks.length}</strong></span></div><div><CheckCircle2 size={18} /><span><small>已完成</small><strong>{dayTasks.filter(task => task.status === 'completed').length}</strong></span></div><div><BatteryMedium size={18} /><span><small>进行中</small><strong>{dayTasks.filter(task => task.status === 'doing').length}</strong></span></div></section><Panel title={`${selectedDate} · 自动汇总`} description="任务状态来自当前原型数据，保存复盘不会修改任务。"><div className="auto-summary">{dayTasks.length ? dayTasks.map(task => <div key={task.id}><span className={`record-status status-${task.status}`} /> <strong>{task.name}</strong><small>{{ pending: '待开始', doing: '进行中', completed: '已完成', abandoned: '已放弃' }[task.status]}</small></div>) : <p className="empty-text">这一天没有计划任务。</p>}</div><label className="field review-field"><span>今日复盘</span><textarea value={review} onChange={event => setReview(event.target.value)} placeholder="今天哪些事情顺利？什么阻碍了行动？明天准备怎样调整？" /></label><div className="field-row"><label className="field"><span><BatteryMedium size={14} /> 精力指数（1～5）</span><input type="range" min="1" max="5" value={energy} onChange={event => setEnergy(Number(event.target.value))} /><small className="range-value">{energy} / 5</small></label><label className="field"><span><Smile size={14} /> 心情</span><select value={mood} onChange={event => setMood(event.target.value)}><option>平静</option><option>充实</option><option>开心</option><option>疲惫</option><option>焦虑</option></select></label></div><div className="modal-actions"><Button onClick={() => updateRecord({ date: selectedDate, review, energy, mood })}>保存每日记录</Button></div></Panel></div></div>
  </>;
}
