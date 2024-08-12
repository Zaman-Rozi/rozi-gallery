
'use client'
import { db } from '@/confiq/firebase';
import { selectAdmin, selectToken, selectUser } from '@/store/selectors/aurh';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';

export function useUser() {
  const token = useSelector(selectToken)
  const user = useSelector(selectUser)
  const admin = useSelector(selectAdmin)

  const isAdmin = async (email: string): Promise<boolean> => {
    const q = await query(collection(db, "Admins"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    let res = false
    querySnapshot.forEach((doc) => {
      if (!doc.data()?.isBlocked) {
        res = true
      }
    });
    return res
  }

  return { token, isAdmin, user, admin };
}
