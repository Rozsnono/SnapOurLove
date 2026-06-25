'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SettingsScreenProps {
    user: any;
    onClose: () => void;
    onLogout: () => void;
}

export default function SettingsScreen({ user, onClose, onLogout }: SettingsScreenProps) {
    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col pt-12 text-black">
            {/* Header bar matching layout [2] */}
            <div className="flex items-center gap-4 px-4 py-3 border-b border-neutral-100">
                <button onClick={onClose} className="text-[#13A25A] hover:scale-105 transition">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-[#13A25A]">Settings</h2>
            </div>

            {/* Settings list structure [2] */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-neutral-50 pb-12">

                {/* Category: MY ACCOUNT */}
                <div className="mt-4">
                    <span className="px-4 text-[11px] font-black text-[#13A25A] uppercase tracking-wider block mb-2">My Account</span>
                    <div className="bg-white border-y border-neutral-100 divide-y divide-neutral-100">
                        <div className="flex justify-between items-center px-4 py-3.5 text-sm">
                            <span className="text-neutral-500 font-medium">Name</span>
                            <span className="text-neutral-900 font-semibold">{user.name || user.username}</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3.5 text-sm">
                            <span className="text-neutral-500 font-medium">Username</span>
                            <span className="text-neutral-900 font-semibold">{user.username}</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3.5 text-sm">
                            <span className="text-neutral-500 font-medium">Email</span>
                            <span className="text-neutral-900 font-semibold">{user.email}</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3.5 text-sm">
                            <span className="text-neutral-500 font-medium">Password</span>
                            <span className="text-neutral-400">••••••••</span>
                        </div>
                    </div>
                </div>

                {/* Category: ADDITIONAL SERVICES */}
                <div className="mt-6">
                    <span className="px-4 text-[11px] font-black text-[#13A25A] uppercase tracking-wider block mb-2">Additional Services</span>
                    <div className="bg-white border-y border-neutral-100 divide-y divide-neutral-100">
                        <div className="flex justify-between items-center px-4 py-3.5 text-sm cursor-pointer">
                            <span className="text-neutral-800 font-medium">Manage Preferences</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3.5 text-sm cursor-pointer">
                            <span className="text-neutral-800 font-medium">Contacts Synced</span>
                        </div>
                    </div>
                </div>

                {/* Category: WHO CAN... */}
                <div className="mt-6">
                    <span className="px-4 text-[11px] font-black text-[#13A25A] uppercase tracking-wider block mb-2">Who Can...</span>
                    <div className="bg-white border-y border-neutral-100 divide-y divide-neutral-100">
                        <div className="flex justify-between items-center px-4 py-3.5 text-sm cursor-pointer">
                            <span className="text-neutral-800 font-medium">Contact Me</span>
                            <span className="text-neutral-400 text-xs">My Friends</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3.5 text-sm cursor-pointer">
                            <span className="text-neutral-800 font-medium">View My Story</span>
                            <span className="text-neutral-400 text-xs">Friends Only</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3.5 text-sm cursor-pointer">
                            <span className="text-neutral-800 font-medium">See Me in Quick Add</span>
                            <span className="text-neutral-400 text-xs">Enabled</span>
                        </div>
                    </div>
                </div>

                {/* Action: Log Out */}
                <div className="mt-8 px-4">
                    <button
                        onClick={onLogout}
                        className="w-full py-3.5 bg-red-500 text-white font-black rounded-xl text-sm shadow-md active:scale-95 transition"
                    >
                        Log Out
                    </button>
                </div>

            </div>
        </div>
    );
}