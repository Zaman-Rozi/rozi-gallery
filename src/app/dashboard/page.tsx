'use client';

import AdminDashboard from "@/components/dashboard/dashboard/admin";
import UserDashboard from "@/components/dashboard/dashboard/user";
import { useUser } from "@/hooks/use-user";

export default function Page() {
  const { admin } = useUser()
  console.log(process.env.REACT_APP_MYENV);
  console.log(process.env.ENV);
  
  return (
    { ...admin ? <AdminDashboard /> : <UserDashboard /> }
  );
}
