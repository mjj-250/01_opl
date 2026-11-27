import { useState } from 'react';
import type { FormEvent } from 'react';
import { FilePlus2, Search } from 'lucide-react';
import { useApp } from '../app/AppContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import type { DocumentItem } from '../types';

const types: DocumentItem['type'][] = ['方法论', '正确做法', '错误记录', '攻略', '学习总结', '项目设计'];

export function DocumentsPage() {
  const { documents, modules, tasks, addDocument } = useApp();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('全部');
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<DocumentItem['type']>('方法论');
  const [moduleId, setModuleId] = useState('life');
  const [content, setContent] = useState('');
  const [linkedTaskId, setLinkedTaskId] = useState('');
  const filtered = documents.filter(document => (type === '全部' || document.type === type) && `${document.title}${document.content}`.toLowerCase().includes(query.toLowerCase()));
  const submit = (event: FormEvent) => { event.preventDefault(); if (!title.trim() || !content.trim()) return; addDocument({ title, type: documentType, moduleId, content, linkedTaskId: linkedTaskId || undefined }); setCreating(false); setTitle(''); setContent(''); };
  return <>
    <PageHeader eyebrow="CONNECTED KNOWLEDGE" title="让经验能够被再次找到。" description="统一文档库，关联模块、目标和任务；文档可以跨模块复用。" actions={<Button onClick={() => setCreating(true)}><FilePlus2 size={16} />新建文档</Button>} />
    <div className="document-toolbar"><label className="search-box"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索标题或内容" /></label><div className="filter-chips">{['全部', ...types].map(item => <button key={item} className={type === item ? 'active' : ''} onClick={() => setType(item)}>{item}</button>)}</div></div>
    <div className="document-grid">{filtered.map(document => { const module = modules.find(item => item.id === document.moduleId); const linkedTask = tasks.find(task => task.id === document.linkedTaskId); return <article className="document-card" key={document.id}><header><span className="document-type">{document.type}</span><time>{document.updatedAt}</time></header><h2>{document.title}</h2><p>{document.content}</p><footer><span>{module?.name}</span>{linkedTask && <small>关联：{linkedTask.name}</small>}</footer></article>; })}{filtered.length === 0 && <p className="empty-text">没有找到匹配文档。</p>}</div>
    {creating && <Modal title="新建文档" eyebrow="NEW DOCUMENT" onClose={() => setCreating(false)}><form onSubmit={submit}><label className="field"><span>文档标题</span><input autoFocus required value={title} onChange={event => setTitle(event.target.value)} /></label><div className="field-row"><label className="field"><span>文档类型</span><select value={documentType} onChange={event => setDocumentType(event.target.value as DocumentItem['type'])}>{types.map(item => <option key={item}>{item}</option>)}</select></label><label className="field"><span>所属模块</span><select value={moduleId} onChange={event => setModuleId(event.target.value)}>{modules.map(module => <option key={module.id} value={module.id}>{module.name}</option>)}</select></label></div><label className="field"><span>关联任务</span><select value={linkedTaskId} onChange={event => setLinkedTaskId(event.target.value)}><option value="">不关联</option>{tasks.map(task => <option key={task.id} value={task.id}>{task.name}</option>)}</select></label><label className="field"><span>正文</span><textarea className="document-editor" required value={content} onChange={event => setContent(event.target.value)} placeholder="记录方法、正确做法、错误或总结……" /></label><div className="modal-actions"><Button type="button" variant="secondary" onClick={() => setCreating(false)}>取消</Button><Button type="submit">保存文档</Button></div></form></Modal>}
  </>;
}
