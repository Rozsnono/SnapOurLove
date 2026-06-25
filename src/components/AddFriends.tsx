'use client';

import React, { useState } from 'react';
import { Search, UserPlus, Check } from 'lucide-react';

interface AddFriendsProps {
    currentUserId: string;
}

export default function AddFriends({ currentUserId }: AddFriendsProps) {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [requestedId, setRequestedId] = useState<string[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/friends?userId=${currentUserId}&search=${query}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(usersExcludingPendingRequests(data.users));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const usersExcludingPendingRequests = (users: any[]) => {
        // Basic filter helper
        return users;
    };

    const sendFriendRequest = async (targetId: string) => {
        try {
            const res = await fetch('/api/friends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUserId, targetUserId: targetId, action: 'request' })
            });
            if (res.ok) {
                setRequestedId((prev) => [...prev, targetId]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-4 bg-neutral-900 rounded-3xl mt-4">
            <h3 className="font-bold text-white text-md mb-3">Add Friends</h3>
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-neutral-800 text-white rounded-xl px-4 py-2 w-full text-sm outline-none"
                />
                <button type="submit" className="bg-yellow-400 p-2 rounded-xl text-black">
                    <Search size={18} />
                </button>
            </form>

            {loading ? (
                <p className="text-xs text-neutral-400 mt-2 text-center">Searching...</p>
            ) : (
                <div className="space-y-2 mt-4 max-h-40 overflow-y-auto">
                    {searchResults.map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-2 bg-neutral-800/40 rounded-xl">
                            <div>
                                <p className="text-white text-sm font-semibold">{user.name || 'Anonymous'}</p>
                                <p className="text-xs text-neutral-400">{user.email}</p>
                            </div>
                            <button
                                onClick={() => sendFriendRequest(user._id)}
                                className="p-1.5 rounded-lg bg-yellow-400 text-black hover:bg-yellow-350 transition"
                            >
                                {requestedId.includes(user._id) ? <Check size={16} /> : <UserPlus size={16} />}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}