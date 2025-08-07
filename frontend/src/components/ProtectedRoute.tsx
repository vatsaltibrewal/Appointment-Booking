'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.push('/login');
            return;
        }

        if (adminOnly && user.role !== 'admin') {
            router.push('/dashboard');
        }

    }, [user, isLoading, router, adminOnly]);

    if (isLoading || !user || (adminOnly && user.role !== 'admin')) {
         return <div className="text-center p-10">Loading...</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;