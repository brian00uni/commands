import { Code2, ChevronRight, FolderClosed, HardDrive, BookOpen } from 'lucide-react';
import { Tooltip } from '@mui/material';
import { navigation } from '../../config/navigation';
import type { NavigationId } from '../../config/navigation';
export type SidebarProps = {
  title: string;
  subtitle: string;
  active: NavigationId;
  collapsed?: boolean;
  onNavigate: (id: NavigationId) => void;
};
export function Sidebar({ title, subtitle, active, collapsed = false, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="워크스페이스 메뉴">
      <button
        type="button"
        className="brand"
        onClick={() => onNavigate('builder')}
        aria-label="Prompt Studio 홈"
      >
        <span className="brand-icon">
          <Code2 size={25} />
        </span>
        <span className="brand-wordmark">
          Prompt<span>Studio</span>
        </span>
        <span className="brand-version">v1.0</span>
      </button>
      <div className="sidebar-scroll">
        <div className="nav-label">워크스페이스</div>
        <Tooltip title={collapsed ? title : ''} placement="right">
          <button
            type="button"
            className="workspace"
            onClick={() => onNavigate('builder')}
            aria-label={title}
          >
            <span className="workspace-icon">
              <FolderClosed size={20} />
            </span>
            <span className="workspace-copy">
              {title}
              <small>{subtitle}</small>
            </span>
            <ChevronRight size={15} />
          </button>
        </Tooltip>
        <div className="nav-label section-label">콘텐츠 제작</div>
        <nav>
          {navigation.map((item) => (
            <Tooltip key={item.id} title={collapsed ? item.label : ''} placement="right">
              <button
                type="button"
                className={`nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                aria-label={item.label}
                aria-current={active === item.id ? 'page' : undefined}
              >
                <item.icon size={19} />
                <span>{item.label}</span>
                {item.id === 'builder' && <span className="menu-badge">CQM</span>}
              </button>
            </Tooltip>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="note-icon">
            <BookOpen size={21} />
          </span>
          <h3>명령문 작성 가이드</h3>
          <p>
            입력부터 복사까지,
            <br />
            CQM 제작 규칙을 한곳에서.
          </p>
          <button type="button" onClick={() => onNavigate('documents')}>
            가이드 확인하기 <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="sidebar-bottom">
        <HardDrive size={18} />
        <span>
          브라우저에 안전하게 저장<small>외부 서버 전송 없음</small>
        </span>
        <span className="status-dot" />
      </div>
    </aside>
  );
}
