'use client';

import AdminDashboard from "@/components/dashboard/dashboard/admin";
import UserDashboard from "@/components/dashboard/dashboard/user";
import { useUser } from "@/hooks/use-user";

export default function Page() {
  const { admin } = useUser()

  return (
    { ...admin ? <AdminDashboard /> : <UserDashboard /> }
  );
}
