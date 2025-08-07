'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AdminBooking {
  _id: string;
  userId: { name: string; email: string };
  slotId: { start_at: string };
}

export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/api/all-bookings')
            .then(res => setBookings(res.data))
            .catch(err => console.error("Failed to fetch all bookings", err))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <ProtectedRoute adminOnly={true}>
            <h1 className="text-3xl font-bold mb-6">All Bookings (Admin View)</h1>
            {isLoading ? <p>Loading...</p> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded-lg">
                        <thead>
                            <tr>
                                <th className="text-left p-3">Patient Name</th>
                                <th className="text-left p-3">Patient Email</th>
                                <th className="text-left p-3">Appointment Date</th>
                                <th className="text-left p-3">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking._id} className="border-t border-gray-700">
                                    <td className="p-3">{booking.userId.name}</td>
                                    <td className="p-3">{booking.userId.email}</td>
                                    <td className="p-3">{new Date(booking.slotId.start_at).toLocaleDateString()}</td>
                                    <td className="p-3">{new Date(booking.slotId.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </ProtectedRoute>
    );
}