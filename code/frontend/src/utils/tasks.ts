import type { NewTaskInput, QuadrantId, Task } from '../types';
import { APP_TODAY } from './format';

export const quadrantNames: Record<QuadrantId, string> = {
  'important-urgent': '重要且紧急',
  'important-not': '重要不紧急',
  'urgent-not': '紧急不重要',
  neither: '不重要不紧急',
};

export const moduleDefaults: Record<string, { important: boolean; startAction: string }> = {
  life: { important: false, startAction: '先站起来，准备开始' },
  fitness: { important: true, startAction: '先换上运动服' },
  learning: { important: true, startAction: '先打开学习资料' },
  development: { important: true, startAction: '先打开项目并找到入口' },
  games: { important: false, startAction: '先打开最新攻略' },
  finance: { important: false, startAction: '先打开对应平台账单' },
  temporary: { important: false, startAction: '' },
};

export function getQuadrant(task: Pick<Task, 'important' | 'urgent'>): QuadrantId {
  if (task.important && task.urgent) return 'important-urgent';
  if (task.important) return 'important-not';
  if (task.urgent) return 'urgent-not';
  return 'neither';
}

export function moveTaskToQuadrant(task: Task, quadrant: QuadrantId): Task {
  const attributes = {
    'important-urgent': { important: true, urgent: true },
    'important-not': { important: true, urgent: false },
    'urgent-not': { important: false, urgent: true },
    neither: { important: false, urgent: false },
  }[quadrant];
  return { ...task, ...attributes, manualLocked: true };
}

export function restoreAutomaticQuadrant(task: Task): Task {
  const defaults = moduleDefaults[task.moduleId] ?? moduleDefaults.temporary;
  return {
    ...task,
    important: defaults.important,
    urgent: task.plannedDate === APP_TODAY,
    manualLocked: false,
  };
}

export function createTask(input: NewTaskInput, id = `task-${Date.now()}`): Task {
  const defaults = moduleDefaults[input.moduleId] ?? moduleDefaults.temporary;
  return {
    ...input,
    id,
    startAction: input.startAction || defaults.startAction,
    important: input.important ?? defaults.important,
    urgent: input.urgent ?? input.plannedDate === APP_TODAY,
    manualLocked: input.manualLocked ?? false,
    status: 'pending',
  };
}
