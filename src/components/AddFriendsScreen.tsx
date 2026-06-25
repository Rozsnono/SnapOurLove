'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MoreHorizontal, MessageCircle, X, Users } from 'lucide-react';

interface AddFriendsScreenProps {
    currentUserId: string;
    onClose: () => void;
}

export default function AddFriendsScreen({ currentUserId, onClose }: AddFriendsScreenProps) {
    const [query, setQuery] = useState('');
    const [addedMeList, setAddedMeList] = useState<any[]>([]);
    const [findFriendsList, setFindFriendsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initial setup of mock lists matching the image names/aesthetic
        setAddedMeList([
            { id: 'mock1', name: 'ⒷⒶⓈⒾⓉ', username: 'bachaqaland7104', initials: 'B' },
            { id: 'mock2', name: 'rizwan waziri', username: 'rizwan_waziri1', initials: 'rw' },
            { id: 'mock3', name: 'Mr 🥷', username: 'raja25540', initials: 'M' }
        ]);

        setFindFriendsList([
            { id: 'mock4', name: '💉ー×ĆŮŤ€¬ ĐØĆŤØR🏥', username: 'its_mejan10', initials: 'CD' },
            { id: 'mock5', name: '👽', username: 'sarakhani7860', initials: 'S' },
            { id: 'mock6', name: '❤️ انت الحياة', username: 'warda_h1', initials: 'AH' }
        ]);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/friends?userId=${currentUserId}&search=${query}`);
            if (res.ok) {
                const data = await res.json();
                // Convert search results into Find Friends list format
                const formatted = data.users.map((u: any) => ({
                    id: u._id,
                    name: u.name || u.username,
                    username: u.username,
                    initials: u.username[0].toUpperCase()
                }));
                setFindFriendsList(formatted);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = async (targetId: string, isAccept: boolean) => {
        try {
            const action = isAccept ? 'accept' : 'request';
            const res = await fetch('/api/friends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUserId, targetUserId: targetId, action })
            });
            if (res.ok) {
                if (isAccept) {
                    setAddedMeList((prev) => prev.filter((item) => item.id !== targetId));
                } else {
                    setFindFriendsList((prev) => prev.filter((item) => item.id !== targetId));
                }
                alert('Friend status updated!');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDismiss = (id: string, listType: 'added' | 'find') => {
        if (listType === 'added') {
            setAddedMeList((prev) => prev.filter((item) => item.id !== id));
        } else {
            setFindFriendsList((prev) => prev.filter((item) => item.id !== id));
        }
    };

    return (
        <div className="fixed inset-0 bg-[#F6F6F6] z-50 flex flex-col pt-12 text-black">
            {/* 1. Header Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#F6F6F6]">
                <button onClick={onClose} className="p-1 rounded-full text-black hover:bg-neutral-200 transition">
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <h2 className="text-base font-black tracking-tight">Add friends</h2>
                <button className="p-1 rounded-full text-black hover:bg-neutral-200 transition">
                    <MoreHorizontal size={22} />
                </button>
            </div>

            {/* Search and List Areas */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-4 pb-12">
                {/* 2. Snapchat Styled Search Input */}
                <form onSubmit={handleSearch} className="relative mt-2">
                    <div className="absolute inset-y-0 left-3.5 flex items-center text-neutral-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-[#EAEAEA] text-black rounded-2xl pl-10 pr-12 py-3 text-sm font-semibold outline-none focus:bg-white border border-transparent focus:border-neutral-200"
                    />
                    <div className="absolute inset-y-0 right-3.5 flex items-center">
                        {/* Ghost Snap-Code Icon on search bar right */}
                        <Users size={18} className="text-neutral-500" />
                    </div>
                </form>

                {/* 3. Invite Friends Banner */}
                <button className="w-full bg-white hover:bg-neutral-50 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm border border-neutral-100 transition">
                    <MessageCircle size={18} className="text-black" />
                    <span className="text-xs font-black tracking-wide text-neutral-800">Invite your friends!</span>
                </button>

                {/* 4. Added Me Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-black">Added Me</h3>
                        <span className="bg-[#FF1E56] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full">
                            113 New
                        </span>
                    </div>

                    <div className="bg-white rounded-3xl divide-y divide-neutral-100 overflow-hidden shadow-sm border border-neutral-100">
                        {addedMeList.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-[#FFFEF4]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center font-bold text-xs uppercase text-neutral-700">
                                        {item.initials}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs text-black leading-tight">{item.name}</h4>
                                        <p className="text-[10px] text-neutral-400">{item.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAddFriend(item.id, true)}
                                        className="bg-[#FFFC00] text-black px-4 py-1.5 rounded-full font-black text-xs flex items-center gap-1 hover:brightness-95 active:scale-95 transition"
                                    >
                                        +👤 Accept
                                    </button>
                                    <button onClick={() => handleDismiss(item.id, 'added')} className="text-neutral-400 hover:text-black p-1">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="p-3 text-center bg-white text-xs font-bold text-neutral-500 cursor-pointer hover:bg-neutral-50">
                            <span className="bg-yellow-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded mr-1.5">New</span>
                            View 197 More
                        </div>
                    </div>
                </div>

                {/* 5. Find Friends Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-black">Find friends</h3>
                            <span className="bg-[#FF1E56] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full">
                                5 New
                            </span>
                        </div>
                        <span className="text-xs text-neutral-400 font-extrabold hover:underline cursor-pointer">All Contacts &gt;</span>
                    </div>

                    <div className="bg-white rounded-3xl divide-y divide-neutral-100 overflow-hidden shadow-sm border border-neutral-100">
                        {findFriendsList.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-[#FFFEF4]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center font-bold text-xs uppercase text-neutral-700">
                                        {item.initials}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs text-black leading-tight">{item.name}</h4>
                                        <p className="text-[10px] text-neutral-400">{item.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAddFriend(item.id, false)}
                                        className="bg-[#FFFC00] text-black px-4 py-1.5 rounded-full font-black text-xs flex items-center gap-1 hover:brightness-95 active:scale-95 transition"
                                    >
                                        +👤 Add
                                    </button>
                                    <button onClick={() => handleDismiss(item.id, 'find')} className="text-neutral-400 hover:text-black p-1">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}