'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { authClient } from '@/lib/auth/client';
import { paths } from '@/paths';
import { addUser, updateAdmin, updateToken } from '@/store/reducers/auth';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/confiq/firebase';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '', password: '' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router: any = useRouter();
  const pathname: any = usePathname();
  const dispath = useDispatch()

  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: any): Promise<void> => {
      setIsPending(true);
      try {
        let blockedS = false
        let deletedS = false
        const res = await authClient.signInWithPassword({ ...values, isAdminLogin: pathname === '/auth/admin/sign-in' });
        const usersCollection = collection(db, 'allowedUsers');
        const qs = query(usersCollection, where('email', '==', values?.email));
        try {
          const querySnapshot = await getDocs(qs);
          if (querySnapshot.empty) {
            setError('root', {
              type: 'error',
              message: 'Please contact with admin.'
            });
            return
          }
        } catch (error) {
          console.error('Error checking value: ', error);
          return
        }
        const q = await query(collection(db, "Users"), where("email", "==", values?.email));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc: any) => {
          const { blocked, deleted } = doc?.data()
          
          if (blocked) {
            blockedS = true
          }
          if (deleted) {
            // deletedS = true
          }
          if (!deleted && !blocked) {
            dispath(addUser({ ...res?.data, ...doc.data() }))
          }
        });

        if (res?.type === 'success' && !blockedS && !deletedS) {
          dispath(updateToken(res?.data?.uid))
          dispath(updateAdmin(res?.admin))
        }

        if (blockedS && !deletedS) {
          setError('root', {
            type: 'error',
            message: 'You are blocked'
          });
          setIsPending(false);
        }
        if ((!blockedS && deletedS) || (blockedS && deletedS)) {
          setError('root', {
            type: 'error',
            message: 'User not exist'
          });
          setIsPending(false);
        }

        if (res?.type && res?.message && !blockedS && !deletedS) {
          
          setError('root', {
            type: res?.type,
            message: res?.message
          });
          setIsPending(false);
          return;
        }
        setIsPending(false)
      } catch (error) {
        setError('root', {
          type: 'error',
          message: 'Something went wrong'
        });
      } finally {
        setIsPending(false);
      }
    },
    [router, setError]
  );

  return (
    <Stack  padding={"50px"} paddingY={"100px"} position={"relative"} borderRadius={"10px"} spacing={4}>
      <div className='form-bg' />
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              Forgot password?
            </Link>
          </div>
          {
            // @ts-ignore
            errors.root ? <Alert color={errors.root.type}>{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
