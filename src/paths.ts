export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    adminLogin: '/auth/admin/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password'
  },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/folders',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
