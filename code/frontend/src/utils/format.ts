export const APP_TODAY = '2026-11-27';

export function formatTaskTime(date: string, time: string) {
  if (!date) return '待定';
  if (date === APP_TODAY) return `今天 ${time || '未定时间'}`;
  if (date === '2026-11-28') return `明天 ${time || '未定时间'}`;
  return `${date.slice(5)} ${time}`.trim();
}

export function money(value: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(value);
}
