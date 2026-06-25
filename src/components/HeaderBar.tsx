'use client';

import React from 'react';
import { Search, UserPlus, MoreHorizontal, Settings } from 'lucide-react';

interface HeaderBarProps {
    title: string;
    darkTheme?: boolean;
    avatarUrl?: string;
    onAddFriendClick?: () => void;
    onSettingsClick?: () => void;
}

export default function HeaderBar({
    title,
    darkTheme = false,
    avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    onAddFriendClick,
    onSettingsClick,
}: HeaderBarProps) {
    const textClass = darkTheme ? 'text-white' : 'text-black';
    const iconBgClass = darkTheme ? 'bg-neutral-800/65' : 'bg-neutral-100';

    return (
        <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-40 pt-2">
            {/* 1. Avatar opens Settings */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onSettingsClick}
                    className="relative w-10 h-10 rounded-full p-[2px] bg-yellow-400 active:scale-95 transition"
                >
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover border border-black" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                </button>
                <button className={`p-2.5 rounded-full ${iconBgClass} transition active:scale-90`}>
                    <Search size={18} className={textClass} />
                </button>
            </div>

            {/* Page Title */}
            <h1 className={`font-black text-lg tracking-wide ${textClass}`}>{title}</h1>

            {/* 2. Add Friend and contextual utilities */}
            <div className="flex items-center gap-2">
                <button onClick={onAddFriendClick} className={`p-2.5 rounded-full ${iconBgClass} transition active:scale-90`}>
                    <UserPlus size={18} className={textClass} />
                </button>
                <button className={`p-2.5 rounded-full ${iconBgClass} transition active:scale-90`}>
                    {title === "Chat" ? (
                        <Settings size={18} className={textClass} />
                    ) : (
                        <MoreHorizontal size={18} className={textClass} />
                    )}
                </button>
            </div>
        </header>
    );
}