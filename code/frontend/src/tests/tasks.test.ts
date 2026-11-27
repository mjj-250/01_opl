import { describe, expect, it } from 'vitest';
import type { Task } from '../types';
import { createTask, getQuadrant, moveTaskToQuadrant, restoreAutomaticQuadrant } from '../utils/tasks';

const baseTask: Task = {
  id: 'task-1', name: '测试任务', moduleId: 'fitness', startAction: '先换上运动服', plannedDate: '2026-11-28', plannedTime: '18:30', important: true, urgent: false, manualLocked: false, status: 'pending',
};

describe('四象限规则', () => {
  it.each([
    [true, true, 'important-urgent'],
    [true, false, 'important-not'],
    [false, true, 'urgent-not'],
    [false, false, 'neither'],
  ] as const)('重要=%s 紧急=%s 时进入 %s', (important, urgent, expected) => {
    expect(getQuadrant({ important, urgent })).toBe(expected);
  });

  it('手动移动会更新属性并锁定', () => {
    const moved = moveTaskToQuadrant(baseTask, 'urgent-not');
    expect(moved.important).toBe(false);
    expect(moved.urgent).toBe(true);
    expect(moved.manualLocked).toBe(true);
  });

  it('恢复自动归类会恢复模块默认和日期规则', () => {
    const moved = moveTaskToQuadrant(baseTask, 'neither');
    const restored = restoreAutomaticQuadrant(moved);
    expect(restored.important).toBe(true);
    expect(restored.urgent).toBe(false);
    expect(restored.manualLocked).toBe(false);
  });

  it('模块预填启动动作，今日任务自动判断为紧急', () => {
    const task = createTask({ name: '训练', moduleId: 'fitness', startAction: '', plannedDate: '2026-11-27', plannedTime: '18:30' }, 'task-2');
    expect(task.startAction).toBe('先换上运动服');
    expect(task.important).toBe(true);
    expect(task.urgent).toBe(true);
    expect(task.manualLocked).toBe(false);
  });
});
