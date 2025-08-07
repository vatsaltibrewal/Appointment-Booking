'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="bg-gray-800 shadow-md">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-white">
                    Wundrsight Clinic
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link href="/admin/dashboard" className="text-gray-300 hover:text-white">Admin</Link>
                            )}
                            <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
                            <Link href="/my-bookings" className="text-gray-300 hover:text-white">My Bookings</Link>
                            <button onClick={handleLogout} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-gray-300 hover:text-white">Login</Link>
                            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;