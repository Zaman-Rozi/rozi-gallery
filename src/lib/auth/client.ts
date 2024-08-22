'use client';

import { auth, db } from '@/confiq/firebase';
import type { User } from '@/types/user';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';


export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
  isAdminLogin?: boolean;
  admin?: boolean
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(values: SignUpParams): Promise<any> {
    const { email, password } = values;
    try {
      const usersCollection = collection(db, 'allowedUsers');
      const q = query(usersCollection, where('email', '==', email));
      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          return {
            message: 'Please contact with admin.',
            type: 'error',
          }
        }
      } catch (error) {
        console.error('Error checking value: ', error);
        return
      }
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, "Users", user?.uid), {
        deleted:false,
        blocked:false,
        uid: user?.uid,
        gallariesLimit:20,
        ...values
      });
      return user
    } catch (error: any) {
      if (error?.message?.includes('email-already-in-use')) {
        return {
          message: 'User already exist',
          type: 'error',
        }
      } else {
        return {
          message: 'Something went wrong',
          type: 'error',
        }
      }
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }
  async doAuthenticate({ email, password, admin }: SignInWithPasswordParams): Promise<any> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      localStorage.setItem('custom-auth-token', user?.uid)
      return {
        message: 'Welcome back',
        type: 'success',
        data: user,
        admin: !!admin
      }
    } catch (error: any) {
      return {
        message: 'Something went wrong',
        type: 'error',
      }
    }
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<any> {
    const { email, password, isAdminLogin } = params;
    if (isAdminLogin) {
      const q = await query(collection(db, "Admins"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      let res = {}
      querySnapshot.forEach((doc) => {
        if (!doc.data()?.isBlocked) {
          res = this.doAuthenticate({ email, password, admin: true })
        } else {
          res = {
            message: 'You are blocked.',
            type: 'error',
          }
        }
      });
      return res
    }
    if (!isAdminLogin) {
      return this.doAuthenticate({ email, password })
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { };
  }
}

export const authClient = new AuthClient();
