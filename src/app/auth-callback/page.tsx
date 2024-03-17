/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useRouter } from 'next/router'
import React, { Suspense } from 'react'
import { trpc } from '../_trpc/client';
import { Loader2 } from 'lucide-react';

const page = () => {
  const router = useRouter();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallback />
    </Suspense>
  );
};

const AuthCallback = () => {
  const router = useRouter();
  const origin = new URLSearchParams(router.asPath).get('origin');

  const { data, isLoading } = trpc.authCallBack.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        router.push(origin ? `/${origin}` : '/dashboard')
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push("/sign-in")
      }
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3 className='font-semibold text-xl'>
          Setting up your account...
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default page;
