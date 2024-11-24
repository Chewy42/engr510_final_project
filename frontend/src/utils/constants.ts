// Application-wide constants

export const APP_NAME = 'ProjectFlow';

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  DASHBOARD: '/dashboard',
  TEAM: '/dashboard/team',
  SETTINGS: '/dashboard/settings',
} as const;

export const LOADING_STATES = {
  AUTH: 'auth',
  PROJECTS: 'projects',
  TEAM: 'team',
} as const;

export const ERROR_MESSAGES = {
  DEFAULT: 'An unexpected error occurred',
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already exists',
  },
} as const;
