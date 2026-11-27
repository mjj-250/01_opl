import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, CalendarDays, ChevronDown, Home, KeyRound, Layers3, LibraryBig, Menu, NotebookPen, Palette, Target, WalletCards, X } from 'lucide-react';
import { useApp } from '../../app/AppContext';
import type { ThemeName } from '../../types';

const navigation = [
  { to: '/', label: '今天', icon: Home },
  { to: '/modules', label: '模块规划', icon: Layers3 },
  { to: '/goals', label: '阶段目标', icon: Target },
  { to: '/calendar', label: '日历', icon: CalendarDays },
  { to: '/records', label: '每日记录', icon: NotebookPen },
  { to: '/documents', label: '文档库', icon: LibraryBig },
  { to: '/finance', label: '财务', icon: WalletCards },
  { to: '/credentials', label: '账密', icon: KeyRound },
];
const pageNames: Record<string, string> = { '/': '今天', '/modules': '模块规划', '/goals': '阶段目标', '/calendar': '日历', '/records': '每日记录', '/documents': '文档库', '/finance': '财务', '/credentials': '账密' };
const themeLabels: Record<ThemeName, string> = { fresh: '清爽效率', warm: '温暖生活', dark: '深色控制台' };

export function AppShell() {
  const { theme, setTheme, notice } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <NavLink to="/" className="brand" onClick={() => setMobileOpen(false)}><span className="brand-mark">序</span><span><strong>个人系统</strong><small>PERSONAL OS</small></span></NavLink>
      <div className="prototype-badge"><span />可交互前端原型</div>
      <nav className="main-nav" aria-label="主导航">{navigation.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><item.icon size={17} /><span>{item.label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><BookOpen size={16} /><div><strong>模块方法论驱动</strong><small>无后端 · 无 AI · 模拟数据</small></div></div>
    </aside>
    {mobileOpen && <button className="mobile-overlay" aria-label="关闭导航" onClick={() => setMobileOpen(false)} />}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(open => !open)} aria-label="打开导航">{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button><span>工作台</span><b>/</b><strong>{pageNames[location.pathname] ?? '今天'}</strong></div><label className="theme-switcher"><Palette size={16} /><span className="theme-label">主题</span><select aria-label="主题切换" value={theme} onChange={event => setTheme(event.target.value as ThemeName)}>{Object.entries(themeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={14} /></label></header>
      <div className="page-container"><Outlet /></div>
      <footer className="app-footer">React + TypeScript · 本地模拟数据 · 三主题可切换</footer>
    </main>
    {notice && <div className="toast" role="status">{notice}</div>}
  </div>;
}
