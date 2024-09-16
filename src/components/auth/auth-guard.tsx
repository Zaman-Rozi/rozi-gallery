'use client';

import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

import { useUser } from '@/hooks/use-user';
import { logger } from '@/lib/default-logger';
import { paths } from '@/paths';

export interface AuthGuardProps {
  children: React.ReactNode;
  params: any;
}

export function AuthGuard({ children, params }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { token } = useUser();
  const path = usePathname()


  if (!path.includes("/gallary/")) {   
    if (!token) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
      router.replace(paths.auth.signIn);
      return null
    }
  }


  return <React.Fragment>{children}</React.Fragment>;
}
