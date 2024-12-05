import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue 600
      light: '#60a5fa', // Blue 400
      dark: '#1e40af', // Blue 800
    },
    secondary: {
      main: '#7c3aed', // Violet 600
      light: '#a78bfa', // Violet 400
      dark: '#5b21b6', // Violet 800
    },
    error: {
      main: '#dc2626', // Red 600
      light: '#f87171', // Red 400
      dark: '#991b1b', // Red 800
    },
    warning: {
      main: '#d97706', // Amber 600
      light: '#fbbf24', // Amber 400
      dark: '#92400e', // Amber 800
    },
    info: {
      main: '#0891b2', // Cyan 600
      light: '#22d3ee', // Cyan 400
      dark: '#155e75', // Cyan 800
    },
    success: {
      main: '#059669', // Emerald 600
      light: '#34d399', // Emerald 400
      dark: '#065f46', // Emerald 800
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "sans-serif"',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});
