'use client';

import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm"
            >
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="mb-6 text-gray-300">{children}</div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;