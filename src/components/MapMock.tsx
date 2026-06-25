'use client';

import React, { useState } from 'react';
import HeaderBar from './HeaderBar';
import { Globe, X } from 'lucide-react';

interface MapMockProps {
    onOpenSettings: () => void;
    onOpenAddFriends: () => void;
}

export default function MapMock({ onOpenSettings, onOpenAddFriends }: MapMockProps) {
    const [showExplore, setShowExplore] = useState(true);

    return (
        <div className="relative h-full w-full bg-[#1A365D] pt-16 flex flex-col overflow-hidden">
            <HeaderBar
                title="New Delhi"
                darkTheme
                onSettingsClick={onOpenSettings}
                onAddFriendClick={onOpenAddFriends}
            />

            <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#1E3A8A_15%,_transparent_15%),_radial-gradient(#0F172A_25%,_transparent_25%)] bg-[length:40px_40px]">
                <div className="absolute inset-x-0 top-1/3 h-1 bg-[#1E40AF]/30 rotate-12" />
                <div className="absolute inset-y-0 left-1/2 w-1.5 bg-[#1E40AF]/40 -rotate-45" />

                {/* Heatmap Overlays */}
                <div className="absolute top-[35%] left-[20%] flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full bg-cyan-400/10 border border-cyan-400/20 animate-ping" />
                    <div className="absolute w-16 h-16 rounded-full bg-yellow-400/20 border border-yellow-400/35" />
                    <div className="absolute w-8 h-8 rounded-full bg-red-500/35 flex items-center justify-center shadow-lg">
                        <span className="text-[10px] font-black text-white">Now</span>
                    </div>
                </div>

                <div className="absolute top-[55%] right-[25%] flex items-center justify-center">
                    <div className="absolute w-32 h-32 rounded-full bg-blue-500/10 border border-blue-500/25 animate-ping" />
                    <div className="absolute w-12 h-12 rounded-full bg-cyan-400/30 flex items-center justify-center shadow-lg">
                        <span className="text-[10px] font-black text-white">5m</span>
                    </div>
                </div>

                {/* Floating preview */}
                <div className="absolute top-[25%] right-[20%] w-20 h-32 rounded-2xl border-2 border-white/90 overflow-hidden shadow-2xl rotate-3">
                    <img
                        src="https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=150&h=250&q=80"
                        alt="Snap Preview"
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-2 text-[9px] font-black text-white drop-shadow-md">3m</span>
                </div>

                {/* Bitmoji Marker */}
                <div className="absolute bottom-[35%] left-[28%] bg-white/90 border border-neutral-100 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5">
                    <span className="text-base">🙋‍♀️</span>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-black leading-tight">My Bitmoji</span>
                        <span className="text-[8px] text-neutral-500 font-bold leading-none">Santa Monica</span>
                    </div>
                </div>

                {showExplore && (
                    <div className="absolute bottom-24 left-4 right-4 bg-white/95 rounded-3xl p-4 shadow-2xl flex items-center justify-between border border-neutral-200/50 backdrop-blur-md z-40 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#00B6FF]/15 flex items-center justify-center text-[#00B6FF]">
                                <Globe size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-black">Explore Snaps</h4>
                                <p className="text-[10px] text-neutral-500 font-bold mt-0.5">See what's happening around the world</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowExplore(false)}
                            className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 transition"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}