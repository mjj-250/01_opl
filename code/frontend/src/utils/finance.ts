import type { Account, Transaction } from '../types';

export interface FinanceSummary {
  balances: Record<string, number>;
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
  totalExpenses: number;
  totalIncome: number;
}

export function calculateFinance(accounts: Account[], transactions: Transaction[]): FinanceSummary {
  const balances = Object.fromEntries(accounts.map(account => [account.id, account.initialBalance]));
  let totalExpenses = 0;
  let totalIncome = 0;

  for (const transaction of transactions) {
    const account = accounts.find(item => item.id === transaction.accountId);
    if (transaction.type === 'adjustment') {
      balances[transaction.accountId] += transaction.amount;
      continue;
    }
    if (transaction.type === 'expense') {
      totalExpenses += transaction.amount;
      if (account?.kind === 'credit') balances[account.id] += transaction.amount;
      else balances[transaction.accountId] -= transaction.amount;
    }
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
      balances[transaction.accountId] += transaction.amount;
    }
    if (transaction.type === 'repayment') {
      balances[transaction.accountId] -= transaction.amount;
      if (transaction.creditAccountId) balances[transaction.creditAccountId] -= transaction.amount;
    }
  }

  const totalAssets = accounts.filter(account => account.kind === 'asset').reduce((sum, account) => sum + balances[account.id], 0);
  const totalLiabilities = accounts.filter(account => account.kind === 'credit').reduce((sum, account) => sum + balances[account.id], 0);
  return { balances, totalAssets, totalLiabilities, netAssets: totalAssets - totalLiabilities, totalExpenses, totalIncome };
}
