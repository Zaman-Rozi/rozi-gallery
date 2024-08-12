'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { useUser } from '@/hooks/use-user';
import { logger } from '@/lib/default-logger';
import { paths } from '@/paths';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { token } = useUser();
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const gallaryId = searchParams.get("id");

  if (!token && !key && !gallaryId) {
    logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
    router.replace(paths.auth.signIn);
    return null
  }

  return <React.Fragment>{children}</React.Fragment>;
}
