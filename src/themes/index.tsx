import type { ReactNode } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

// CoreUI 5 theme colors with locally hosted SUIT Variable.
// https://coreui.io/bootstrap/docs/utilities/colors/
export const dashboardTheme = createTheme({
  palette: {
    primary: { main: '#5856d6', dark: '#4645ab', light: '#eeeefa', contrastText: '#ffffff' },
    background: { default: '#f3f4f7', paper: '#ffffff' },
    text: { primary: '#212631', secondary: '#4a566d' },
    divider: '#dbdfe6',
    secondary: { main: '#6b7785' },
    success: { main: '#1b9e3e', dark: '#126b2a', contrastText: '#080a0c' },
    warning: { main: '#f9b115', dark: '#805600', contrastText: '#080a0c' },
    info: { main: '#3399ff', dark: '#143d66', contrastText: '#080a0c' },
    error: { main: '#e55353', dark: '#a32e2e', contrastText: '#080a0c' },
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
      styleOverrides: { root: { boxShadow: 'none', borderColor: '#dbdfe6' } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { background: '#fff', color: '#212631', borderBottom: '1px solid #dbdfe6' },
      },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiDrawer: { styleOverrides: { paper: { borderColor: '#dbdfe6' } } },
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
