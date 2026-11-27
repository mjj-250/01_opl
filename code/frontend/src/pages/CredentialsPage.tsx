import { KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';

export function CredentialsPage() {
  return <><PageHeader eyebrow="DEFERRED MODULE" title="账密模块，先留一个安全的壳。" description="按照本轮流程，暂不保存完整密码，也不提前决定加密方案。" /><Panel className="credentials-placeholder"><div className="placeholder-illustration"><KeyRound size={42} /><span><LockKeyhole size={18} /></span></div><span className="soft-badge">占位页面</span><h2>在功能确认前，不收集真实账密。</h2><p>后续如果启用，会单独确认保存范围、主密码、加密、显示与复制验证、导入导出和本地安全边界。</p><div className="security-principles"><div><ShieldCheck size={19} /><span><strong>当前不保存密码</strong><small>避免在原型阶段引入敏感信息</small></span></div><div><ShieldCheck size={19} /><span><strong>独立模块边界</strong><small>不与任务、财务或文档数据耦合</small></span></div><div><ShieldCheck size={19} /><span><strong>实现前重新确认</strong><small>安全设计通过后再开放录入</small></span></div></div></Panel></>;
}
