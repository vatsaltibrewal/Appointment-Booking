'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    role: 'patient' | 'admin';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedToken = jwtDecode<{ id: string, role: 'patient' | 'admin' }>(storedToken);
                setUser({ id: decodedToken.id, role: decodedToken.role });
                setToken(storedToken);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        try {
            const decodedToken = jwtDecode<{ id: string, role: 'patient' | 'admin' }>(newToken);
            localStorage.setItem('token', newToken);
            setUser({ id: decodedToken.id, role: decodedToken.role });
            setToken(newToken);
        } catch (error) {
             console.error("Failed to decode token on login:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};