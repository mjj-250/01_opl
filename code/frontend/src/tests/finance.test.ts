import { describe, expect, it } from 'vitest';
import type { Account, Transaction } from '../types';
import { calculateFinance } from '../utils/finance';

const accounts: Account[] = [
  { id: 'cash', name: '现金', kind: 'asset', initialBalance: 0 },
  { id: 'huabei', name: '花呗', kind: 'credit', initialBalance: 0 },
];

describe('财务统计', () => {
  it('所有账户可以从 0 开始', () => {
    expect(calculateFinance(accounts, [])).toMatchObject({ totalAssets: 0, totalLiabilities: 0, netAssets: 0, totalExpenses: 0 });
  });

  it('信用消费计一次支出并增加负债，还贷不重复计支出', () => {
    const transactions: Transaction[] = [
      { id: 'tx1', type: 'expense', amount: 100, date: '2026-11-27', category: '日常消费', accountId: 'huabei', note: '' },
      { id: 'tx2', type: 'repayment', amount: 40, date: '2026-11-28', category: '信用还款', accountId: 'cash', creditAccountId: 'huabei', note: '' },
    ];
    const result = calculateFinance(accounts, transactions);
    expect(result.totalExpenses).toBe(100);
    expect(result.totalLiabilities).toBe(60);
    expect(result.balances.cash).toBe(-40);
    expect(result.netAssets).toBe(-100);
  });

  it('收入与带符号的余额校准会进入账户和净资产', () => {
    const transactions: Transaction[] = [
      { id: 'tx1', type: 'income', amount: 200, date: '2026-11-27', category: '工资', accountId: 'cash', note: '' },
      { id: 'tx2', type: 'adjustment', amount: -30, date: '2026-11-28', category: '余额校准', accountId: 'cash', note: '' },
    ];
    const result = calculateFinance(accounts, transactions);
    expect(result.totalIncome).toBe(200);
    expect(result.balances.cash).toBe(170);
    expect(result.netAssets).toBe(170);
  });
});
