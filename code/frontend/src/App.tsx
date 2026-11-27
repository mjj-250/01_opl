import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { TodayPage } from './pages/TodayPage';
import { ModulesPage } from './pages/ModulesPage';
import { GoalsPage } from './pages/GoalsPage';
const CalendarPage = lazy(() => import('./pages/CalendarPage').then(module => ({ default: module.CalendarPage })));
import { RecordsPage } from './pages/RecordsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { FinancePage } from './pages/FinancePage';
import { CredentialsPage } from './pages/CredentialsPage';

export default function App() {
  return <Suspense fallback={<div className="page-loading">正在加载页面…</div>}><Routes><Route element={<AppShell />}><Route index element={<TodayPage />} /><Route path="modules" element={<ModulesPage />} /><Route path="goals" element={<GoalsPage />} /><Route path="calendar" element={<CalendarPage />} /><Route path="records" element={<RecordsPage />} /><Route path="documents" element={<DocumentsPage />} /><Route path="finance" element={<FinancePage />} /><Route path="credentials" element={<CredentialsPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></Suspense>;
}
