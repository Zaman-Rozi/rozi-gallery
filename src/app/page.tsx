'use client'
import { paths } from '@/paths';
import { redirect } from 'next/navigation';

export default function Page() {
  {redirect(paths.dashboard.overview ) }
}
