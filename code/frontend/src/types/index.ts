export type ThemeName = 'fresh' | 'warm' | 'dark';
export type TaskStatus = 'pending' | 'doing' | 'completed' | 'abandoned';
export type QuadrantId = 'important-urgent' | 'important-not' | 'urgent-not' | 'neither';

export interface Task {
  id: string;
  name: string;
  moduleId: string;
  submoduleId?: string;
  startAction: string;
  plannedDate: string;
  plannedTime: string;
  important: boolean;
  urgent: boolean;
  manualLocked: boolean;
  status: TaskStatus;
  goalId?: string;
}

export interface Submodule {
  id: string;
  name: string;
  description: string;
}

export interface Module {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  submodules: Submodule[];
  methodology: string[];
}

export interface Milestone { id: string; title: string; done: boolean; }
export interface Goal {
  id: string;
  moduleId: string;
  submoduleId?: string;
  title: string;
  period: string;
  description: string;
  completionStandard: string;
  current: number;
  target: number;
  unit: string;
  status: 'active' | 'queued' | 'paused' | 'completed';
  milestones: Milestone[];
}

export interface DocumentItem {
  id: string;
  title: string;
  type: '方法论' | '正确做法' | '错误记录' | '攻略' | '学习总结' | '项目设计';
  moduleId: string;
  content: string;
  updatedAt: string;
  linkedTaskId?: string;
}

export interface DailyRecord {
  date: string;
  review: string;
  energy: number;
  mood: string;
}

export type AccountKind = 'asset' | 'credit';
export interface Account {
  id: string;
  name: string;
  kind: AccountKind;
  initialBalance: number;
}

export type TransactionType = 'expense' | 'income' | 'repayment' | 'adjustment';
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: string;
  accountId: string;
  creditAccountId?: string;
  note: string;
}

export interface NewTaskInput {
  name: string;
  moduleId: string;
  submoduleId?: string;
  startAction: string;
  plannedDate: string;
  plannedTime: string;
  important?: boolean;
  urgent?: boolean;
  manualLocked?: boolean;
}
