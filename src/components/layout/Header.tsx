import { AppBar, IconButton, Tooltip } from '@mui/material';
import { CircleHelp, Menu, PanelLeftClose, ShieldCheck } from 'lucide-react';
type Props = {
  title: string;
  saved: string;
  expanded: boolean;
  onMenuToggle: () => void;
  onHelp: () => void;
};
export function Header({ title, saved, expanded, onMenuToggle, onHelp }: Props) {
  return (
    <AppBar
      position="fixed"
      className="topbar"
      sx={{ width: 'calc(100% - var(--drawer-width))', left: 'var(--drawer-width)' }}
    >
      <div className="header-start">
        <Tooltip title={expanded ? '메뉴 접기' : '메뉴 펼치기'}>
          <IconButton
            onClick={onMenuToggle}
            aria-label={expanded ? '메뉴 접기' : '메뉴 펼치기'}
            aria-expanded={expanded}
            aria-controls="workspace-navigation"
          >
            {expanded ? <PanelLeftClose size={20} /> : <Menu size={20} />}
          </IconButton>
        </Tooltip>
        <span className="header-title">{title}</span>
        <span className="header-divider" />
        <span className="header-mode">Workspace</span>
      </div>
      <div className="header-actions">
        <div className="save-status" role="status">
          <span className="status-dot" />
          {saved}
        </div>
        <Tooltip title="원본 문서 안내">
          <IconButton onClick={onHelp} aria-label="원본 문서 안내">
            <CircleHelp size={20} />
          </IconButton>
        </Tooltip>
        <div className="local-account">
          <span className="local-avatar">
            <ShieldCheck size={20} />
          </span>
          <span>
            Local workspace<small>개인 작업 공간</small>
          </span>
        </div>
      </div>
    </AppBar>
  );
}
