'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '@/components/ConfirmationModal';

interface Slot {
    id: string;
    start_at: string;
}

export default function DashboardPage() {
    const [allSlots, setAllSlots] = useState<Slot[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    useEffect(() => {
        const fetchSlots = async () => {
            setIsLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const response = await api.get(`/api/slots?from=${today}&to=${sevenDaysFromNow}`);
                setAllSlots(response.data);
                if (response.data.length > 0) {
                    setSelectedDate(response.data[0].start_at.split('T')[0]);
                }
            } catch (err) {
                setError('Failed to fetch available slots.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSlots();
    }, []);

    const availableDates = useMemo(() => {
        const dates = new Set(allSlots.map(slot => slot.start_at.split('T')[0]));
        return Array.from(dates).sort();
    }, [allSlots]);

    const slotsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return allSlots.filter(slot => slot.start_at.startsWith(selectedDate));
    }, [allSlots, selectedDate]);

    const handleSlotClick = (slot: Slot) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const handleConfirmBooking = async () => {
        if (!selectedSlot) return;

        setError('');
        setSuccess('');
        try {
            await api.post('/api/book', { slotId: selectedSlot.id });
            setSuccess(`Successfully booked appointment! Redirecting...`);
            setAllSlots(prevSlots => prevSlots.filter(slot => slot.id !== selectedSlot.id));
            setIsModalOpen(false);
            setTimeout(() => router.push('/my-bookings'), 2000);
        } catch (err: any) {
             setError(err.response?.data?.error?.message || 'Failed to book slot.');
             setIsModalOpen(false);
        }
    };
    
    return (
        <ProtectedRoute>
            <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
            <p className="text-gray-400 mb-6">Select a date to see available times.</p>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">1. Select Date</h2>
                <div className="flex space-x-3 pb-2 overflow-x-auto">
                    {isLoading && <p>Loading dates...</p>}
                    {availableDates.map(date => {
                        const isSelected = date === selectedDate;
                        const day = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
                        const dayOfMonth = date.split('-')[2];
                        
                        return (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`flex-shrink-0 text-center px-4 py-2 rounded-lg border-2 transition-colors ${
                                    isSelected
                                        ? 'bg-indigo-600 border-indigo-500 text-white'
                                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-500'
                                }`}
                            >
                                <span className="block font-bold">{day}</span>
                                <span className="block text-2xl">{dayOfMonth}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {slotsForSelectedDate.map(slot => (
                    <button
                        key={slot.id}
                        onClick={() => handleSlotClick(slot)} 
                        className="bg-gray-800 border border-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-indigo-600 hover:border-indigo-500"
                    >
                        {new Date(slot.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </button>
                ))}
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmBooking}
                title="Confirm Your Appointment"
            >
                {selectedSlot && (
                    <p>
                        Are you sure you want to book an appointment for{' '}
                        <span className="font-bold text-indigo-400">
                            {new Date(selectedSlot.start_at).toLocaleDateString()}
                        </span> at{' '}
                        <span className="font-bold text-indigo-400">
                            {new Date(selectedSlot.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>?
                    </p>
                )}
            </ConfirmationModal>
        </ProtectedRoute>
    );
}