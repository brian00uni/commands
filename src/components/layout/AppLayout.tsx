import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import { ChevronRight, Home } from 'lucide-react';
import { Sidebar } from './Sidebar';
import type { SidebarProps } from './Sidebar';
import { Header } from './Header';

type Props = Omit<SidebarProps, 'collapsed'> & {
  pageTitle: string;
  saved: string;
  children: ReactNode;
};
export function AppLayout({ children, pageTitle, saved, ...sidebar }: Props) {
  const desktop = useMediaQuery(useTheme().breakpoints.up('lg'));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const width = desktop ? (collapsed ? 76 : 260) : 0;
  function navigate(id: Parameters<Props['onNavigate']>[0]) {
    sidebar.onNavigate(id);
    setMobileOpen(false);
  }
  return (
    <div
      className={`app-shell ${desktop && collapsed ? 'is-collapsed' : ''}`}
      style={{ '--drawer-width': `${width}px` } as CSSProperties}
    >
      <a className="skip-link" href="#main-content">
        본문으로 이동
      </a>
      <Drawer
        variant={desktop ? 'permanent' : 'temporary'}
        open={desktop || mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: { width: desktop ? width : 260, overflowX: 'hidden' },
            id: 'workspace-navigation',
          },
        }}
      >
        <Sidebar {...sidebar} collapsed={desktop && collapsed} onNavigate={navigate} />
      </Drawer>
      <div className="main-shell">
        <Header
          title={pageTitle}
          saved={saved}
          expanded={desktop ? !collapsed : mobileOpen}
          onMenuToggle={() => (desktop ? setCollapsed(!collapsed) : setMobileOpen(!mobileOpen))}
          onHelp={() => navigate('documents')}
        />
        <main id="main-content" tabIndex={-1}>
          <nav className="breadcrumb" aria-label="현재 위치">
            <Home size={14} />
            <span>워크스페이스</span>
            <ChevronRight size={13} />
            <span>CQM</span>
            <ChevronRight size={13} />
            <strong>명령문 대시보드</strong>
          </nav>
          {children}
          <footer className="page-footer">
            <span>
              Prompt Studio <span className="footer-version">v1.0</span>
            </span>
            <span>로컬 워크스페이스 · 입력 데이터는 외부로 전송되지 않습니다.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
