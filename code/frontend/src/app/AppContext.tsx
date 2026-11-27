import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { initialAccounts, initialDocuments, initialGoals, initialModules, initialRecords, initialTasks, initialTransactions } from '../data/mock';
import type { Account, DailyRecord, DocumentItem, Goal, Module, NewTaskInput, QuadrantId, Task, ThemeName, Transaction } from '../types';
import { calculateFinance } from '../utils/finance';
import { createTask, moveTaskToQuadrant, restoreAutomaticQuadrant } from '../utils/tasks';

interface AppContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  tasks: Task[];
  modules: Module[];
  goals: Goal[];
  documents: DocumentItem[];
  records: DailyRecord[];
  accounts: Account[];
  transactions: Transaction[];
  notice: string;
  notify: (message: string) => void;
  addTask: (input: NewTaskInput) => Task;
  moveTask: (id: string, quadrant: QuadrantId) => void;
  restoreTask: (id: string) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  addSubmodule: (moduleId: string, name: string) => void;
  addGoal: (goal: Goal) => void;
  completeGoal: (id: string) => void;
  addDocument: (document: Omit<DocumentItem, 'id' | 'updatedAt'>) => void;
  updateRecord: (record: DailyRecord) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  calibrateAccount: (accountId: string, targetBalance: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => (localStorage.getItem('opl-theme') as ThemeName) || 'warm');
  const [tasks, setTasks] = useState(initialTasks);
  const [modules, setModules] = useState(initialModules);
  const [goals, setGoals] = useState(initialGoals);
  const [documents, setDocuments] = useState(initialDocuments);
  const [records, setRecords] = useState(initialRecords);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [notice, setNotice] = useState('');
  const toastTimer = useRef<number | undefined>(undefined);

  const notify = (message: string) => {
    setNotice(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setNotice(''), 2800);
  };

  const setTheme = (next: ThemeName) => {
    setThemeState(next);
    localStorage.setItem('opl-theme', next);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
  }, [theme]);

  const value = useMemo<AppContextValue>(() => ({
    theme, setTheme, tasks, modules, goals, documents, records, accounts: initialAccounts, transactions, notice, notify,
    addTask: input => {
      const task = createTask(input);
      setTasks(current => [...current, task]);
      notify('任务已加入四象限');
      return task;
    },
    moveTask: (id, quadrant) => {
      setTasks(current => current.map(task => task.id === id ? moveTaskToQuadrant(task, quadrant) : task));
      notify('已手动归类并锁定，可随时恢复自动规则');
    },
    restoreTask: id => {
      setTasks(current => current.map(task => task.id === id ? restoreAutomaticQuadrant(task) : task));
      notify('已恢复模块默认与时间自动归类');
    },
    updateTaskStatus: (id, status) => {
      setTasks(current => current.map(task => task.id === id ? { ...task, status } : task));
      notify(status === 'completed' ? '任务已完成' : status === 'doing' ? '任务已开始' : '任务状态已更新');
    },
    addSubmodule: (moduleId, name) => {
      setModules(current => current.map(module => module.id === moduleId ? { ...module, submodules: [...module.submodules, { id: `sub-${Date.now()}`, name, description: '由你新增的自定义方向' }] } : module));
      notify('子模块已添加');
    },
    addGoal: goal => {
      setGoals(current => [...current.map(item => item.moduleId === goal.moduleId && item.submoduleId === goal.submoduleId && item.status === 'active' ? { ...item, status: 'queued' as const } : item), goal]);
      notify('阶段目标已创建');
    },
    completeGoal: id => {
      setGoals(current => current.map(goal => goal.id === id ? { ...goal, status: 'completed' } : goal));
      notify('目标已由你手动验收');
    },
    addDocument: document => {
      setDocuments(current => [{ ...document, id: `doc-${Date.now()}`, updatedAt: '2026-11-27' }, ...current]);
      notify('文档已保存');
    },
    updateRecord: record => {
      setRecords(current => current.map(item => item.date === record.date ? record : item));
      notify('每日记录已保存');
    },
    addTransaction: transaction => {
      setTransactions(current => [{ ...transaction, id: `tx-${Date.now()}` }, ...current]);
      notify('流水已记录');
    },
    calibrateAccount: (accountId, targetBalance) => {
      const currentBalance = calculateFinance(initialAccounts, transactions).balances[accountId];
      const difference = targetBalance - currentBalance;
      setTransactions(current => [{ id: `tx-${Date.now()}`, type: 'adjustment', amount: difference, date: '2026-11-27', category: '余额校准', accountId, note: `校准至 ${targetBalance}` }, ...current]);
      notify('余额已校准，并保留调整流水');
    },
  }), [theme, tasks, modules, goals, documents, records, transactions, notice]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp 必须在 AppProvider 内使用');
  return context;
}
