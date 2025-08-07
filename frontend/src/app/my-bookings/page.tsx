'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Booking {
    _id: string;
    slotId: {
        start_at: string;
    };
}

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/api/my-bookings');
                setBookings(response.data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (isLoading) return <p>Loading your bookings...</p>;

    return (
        <ProtectedRoute>
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            {bookings.length > 0 ? (
                <ul className="space-y-4">
                    {bookings.map(booking => (
                        <li key={booking._id} className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-lg">
                                Date: {new Date(booking.slotId.start_at).toLocaleDateString()}
                            </p>
                            <p className="font-semibold">
                                Time: {new Date(booking.slotId.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no upcoming appointments.</p>
            )}
        </ProtectedRoute>
    );
}