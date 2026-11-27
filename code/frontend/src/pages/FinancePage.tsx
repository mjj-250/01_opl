import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowDownLeft, ArrowUpRight, Landmark, Plus, Scale, WalletCards } from 'lucide-react';
import { useApp } from '../app/AppContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import type { TransactionType } from '../types';
import { calculateFinance } from '../utils/finance';
import { money } from '../utils/format';

export function FinancePage() {
  const { accounts, transactions, addTransaction, calibrateAccount } = useApp();
  const summary = calculateFinance(accounts, transactions);
  const [creating, setCreating] = useState(false);
  const [calibrating, setCalibrating] = useState<string | null>(null);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('2026-11-27');
  const [category, setCategory] = useState('日常消费');
  const [accountId, setAccountId] = useState('cash');
  const [creditAccountId, setCreditAccountId] = useState('huabei');
  const [note, setNote] = useState('');
  const [targetBalance, setTargetBalance] = useState(0);
  const assets = accounts.filter(account => account.kind === 'asset');
  const credits = accounts.filter(account => account.kind === 'credit');
  const submit = (event: FormEvent) => { event.preventDefault(); if (amount <= 0) return; addTransaction({ type, amount, date, category, accountId, creditAccountId: type === 'repayment' ? creditAccountId : undefined, note }); setCreating(false); setAmount(0); setNote(''); };
  const typeNames = { expense: '支出', income: '收入', repayment: '还贷', adjustment: '余额校准' };
  return <>
    <PageHeader eyebrow="PERSONAL FINANCE" title="看清流水，也看清净资产。" description="信用消费只记一次支出；还贷减少负债。所有账户从 0 开始，允许负数。" actions={<Button onClick={() => setCreating(true)}><Plus size={16} />记一笔</Button>} />
    <section className="finance-summary"><div><span><WalletCards size={18} />总资产</span><strong>{money(summary.totalAssets)}</strong><small>现金、银行卡与支付余额</small></div><div><span><Landmark size={18} />信用负债</span><strong>{money(summary.totalLiabilities)}</strong><small>花呗、美团月付等待还金额</small></div><div className="net-assets"><span><Scale size={18} />净资产</span><strong>{money(summary.netAssets)}</strong><small>总资产 − 信用负债</small></div><div><span><ArrowUpRight size={18} />累计支出</span><strong>{money(summary.totalExpenses)}</strong><small>还贷不重复计入支出</small></div></section>
    <div className="finance-layout"><Panel title="账户与平台" description="真实余额稳定后，可通过校准写入；校准会留下调整流水。"><div className="account-list">{accounts.map(account => <div key={account.id}><span className={`account-icon ${account.kind}`} >{account.kind === 'credit' ? <Landmark size={16} /> : <WalletCards size={16} />}</span><span><strong>{account.name}</strong><small>{account.kind === 'credit' ? '信用负债' : '资产账户'}</small></span><b className={summary.balances[account.id] < 0 ? 'negative' : ''}>{money(summary.balances[account.id])}</b><button onClick={() => { setCalibrating(account.id); setTargetBalance(summary.balances[account.id]); }}>校准</button></div>)}</div></Panel><Panel title="流水明细" description={`${transactions.length} 条记录`}><div className="transaction-list">{transactions.map(transaction => { const account = accounts.find(item => item.id === transaction.accountId); return <div key={transaction.id}><span className={`transaction-direction ${transaction.type}`}>{transaction.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}</span><span><strong>{transaction.category}</strong><small>{transaction.date} · {account?.name}{transaction.note ? ` · ${transaction.note}` : ''}</small></span><b>{transaction.type === 'income' ? '+' : transaction.type === 'adjustment' && transaction.amount > 0 ? '+' : '−'}{money(Math.abs(transaction.amount))}</b><em>{typeNames[transaction.type]}</em></div>; })}{transactions.length === 0 && <div className="finance-empty"><Scale size={30} /><h3>从第一笔流水开始</h3><p>当前所有账户均为 0。记录消费、收入或还贷后，这里会同步更新。</p></div>}</div></Panel></div>
    {creating && <Modal title="记录一笔流水" eyebrow="NEW TRANSACTION" onClose={() => setCreating(false)}><form onSubmit={submit}><div className="segmented-control">{(['expense', 'income', 'repayment'] as TransactionType[]).map(item => <button type="button" key={item} className={type === item ? 'active' : ''} onClick={() => { setType(item); if (item === 'repayment') { setAccountId('bank'); setCategory('信用还款'); } }}>{typeNames[item]}</button>)}</div><div className="field-row"><label className="field"><span>金额</span><input type="number" min="0.01" step="0.01" required value={amount || ''} onChange={event => setAmount(Number(event.target.value))} /></label><label className="field"><span>日期</span><input type="date" value={date} onChange={event => setDate(event.target.value)} /></label></div><label className="field"><span>分类</span><input value={category} onChange={event => setCategory(event.target.value)} /></label><label className="field"><span>{type === 'repayment' ? '还款来源账户' : type === 'income' ? '收入进入账户' : '支付账户 / 信用平台'}</span><select value={accountId} onChange={event => setAccountId(event.target.value)}>{(type === 'expense' ? accounts : assets).map(account => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>{type === 'repayment' && <label className="field"><span>还贷平台</span><select value={creditAccountId} onChange={event => setCreditAccountId(event.target.value)}>{credits.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>}<label className="field"><span>备注</span><input value={note} onChange={event => setNote(event.target.value)} placeholder="可留空" /></label>{type === 'expense' && accounts.find(account => account.id === accountId)?.kind === 'credit' && <p className="finance-note">这笔信用消费会计入支出并增加负债；以后还贷不会再次计入支出。</p>}<div className="modal-actions"><Button type="button" variant="secondary" onClick={() => setCreating(false)}>取消</Button><Button type="submit">保存流水</Button></div></form></Modal>}
    {calibrating && <Modal title="余额校准" eyebrow="BALANCE ADJUSTMENT" onClose={() => setCalibrating(null)}><p className="form-intro">为 {accounts.find(account => account.id === calibrating)?.name} 设置当前真实余额，系统自动生成差额调整流水。</p><label className="field"><span>真实余额（允许负数）</span><input autoFocus type="number" step="0.01" value={targetBalance} onChange={event => setTargetBalance(Number(event.target.value))} /></label><div className="modal-actions"><Button variant="secondary" onClick={() => setCalibrating(null)}>取消</Button><Button onClick={() => { calibrateAccount(calibrating, targetBalance); setCalibrating(null); }}>确认校准</Button></div></Modal>}
  </>;
}
