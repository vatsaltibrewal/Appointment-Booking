'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();
    
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/api/login', { email, password });
            login(response.data.token);
            
            const role = response.data.role;
            if (role === 'admin') {
              router.push('/admin/dashboard');
            } else {
              router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {registered && <p className="text-green-500 mb-4 animate-pulse">Registration successful! Please log in.</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                 <div className="mb-4">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}