import type { ReactNode } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

// Mantis-inspired palette with locally hosted SUIT Variable.
export const dashboardTheme = createTheme({
  palette: {
    primary: { main: '#1677ff', dark: '#0958d9', light: '#e6f4ff' },
    background: { default: '#fafafb', paper: '#ffffff' },
    text: { primary: '#262626', secondary: '#595959' },
    divider: '#e6ebf1',
    success: { main: '#389e0d' },
    warning: { main: '#d48806' },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: "'SUIT Variable', sans-serif",
    fontSize: 14,
    h1: { fontSize: '1.5rem', fontWeight: 600 },
    h2: { fontSize: '1rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { boxShadow: 'none', borderColor: '#e6ebf1' } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { background: '#fff', color: '#262626', borderBottom: '1px solid #e6ebf1' },
      },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiDrawer: { styleOverrides: { paper: { borderColor: '#e6ebf1' } } },
    MuiIconButton: { styleOverrides: { root: { borderRadius: 6 } } },
  },
});
export function DashboardTheme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
