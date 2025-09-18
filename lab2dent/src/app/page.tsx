'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getRedirectPath } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(getRedirectPath(user.role));
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="text-center pt-24 pb-24">
        <Image
          src="/assets/Banner-Clear.png"
          alt="LAB2DENT Banner"
          width={400}
          height={133}
          className="object-contain mx-auto"
        />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl mt-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">LAB2DENT</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connecting dental clinics with trusted laboratories
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Welcome to LAB2DENT, your comprehensive dental lab management platform.
            </p>
            
            <Link
              href="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Demo accounts available on the login page</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clinics</h3>
              <p className="text-sm text-gray-600">
                Manage patient cases and orders with lab partners
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Labs</h3>
              <p className="text-sm text-gray-600">
                Track work queue and manage production workflow
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin</h3>
              <p className="text-sm text-gray-600">
                System oversight and performance monitoring
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
