'use client';

import React, { useEffect, useState } from 'react';
import PusherClient from 'pusher-js';
import { ArrowLeft, Send } from 'lucide-react';
import HeaderBar from './HeaderBar';
import AddFriends from './AddFriends';

interface SnapItem {
    id: string;
    senderName: string;
    duration: number;
    createdAt: string;
    opened: boolean;
}

interface ChatInboxProps {
    currentUserId: string;
    onOpenSnap: (snapId: string, duration: number) => void;
    onOpenSettings: () => void;
    onOpenAddFriends: () => void;
}

export default function ChatInbox({ currentUserId, onOpenSnap, onOpenSettings, onOpenAddFriends }: ChatInboxProps) {
    const [snaps, setSnaps] = useState<SnapItem[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [activeChatFriend, setActiveChatFriend] = useState<any | null>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [newMessageText, setNewMessageText] = useState('');
    const [showAddFriends, setShowAddFriends] = useState(false);

    useEffect(() => {
        const fetchInboxData = async () => {
            try {
                const snapRes = await fetch(`/api/snaps?userId=${currentUserId}`);
                const snapData = await snapRes.json();
                setSnaps(snapData.snaps || []);

                const friendRes = await fetch(`/api/friends?userId=${currentUserId}`);
                const friendData = await friendRes.json();
                setFriends(friendData.friends || []);
            } catch (err) {
                console.error('Data sync error: ', err);
            }
        };
        fetchInboxData();
    }, [currentUserId, activeChatFriend]);

    useEffect(() => {
        const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            authEndpoint: '/api/pusher/auth',
        });

        const snapChannelName = `private-user-${currentUserId}`;
        const snapChannel = pusher.subscribe(snapChannelName);
        snapChannel.bind('new-snap', (data: any) => {
            setSnaps((prev) => [
                {
                    id: data.snapId,
                    senderName: data.senderName,
                    duration: data.duration,
                    createdAt: data.createdAt,
                    opened: false,
                },
                ...prev,
            ]);
        });

        let chatChannel: any = null;
        if (activeChatFriend) {
            const sortedIds = [currentUserId, activeChatFriend._id].sort();
            const chatChannelName = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;
            chatChannel = pusher.subscribe(chatChannelName);
            chatChannel.bind('message', (message: any) => {
                setChatMessages((prev) => [...prev, message]);
            });
        }

        return () => {
            snapChannel.unbind_all();
            pusher.unsubscribe(snapChannelName);
            if (chatChannel) {
                chatChannel.unbind_all();
                pusher.unsubscribe(chatChannel.name);
            }
        };
    }, [currentUserId, activeChatFriend]);

    const openChatWithFriend = async (friend: any) => {
        setActiveChatFriend(friend);
        try {
            const res = await fetch(`/api/chat?userId=${currentUserId}&friendId=${friend._id}`);
            if (res.ok) {
                const data = await res.json();
                setChatMessages(data.messages || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendTextMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessageText.trim() || !activeChatFriend) return;

        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: currentUserId,
                    receiverId: activeChatFriend._id,
                    text: newMessageText,
                }),
            });
            setNewMessageText('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleSnapClick = (snap: SnapItem) => {
        if (snap.opened) return;
        onOpenSnap(snap.id, snap.duration);
        setSnaps((prev) =>
            prev.map((s) => (s.id === snap.id ? { ...s, opened: true } : s))
        );
    };

    if (activeChatFriend) {
        return (
            <div className="flex flex-col h-full bg-white text-black pt-2">
                <div className="flex items-center gap-3 p-4 border-b border-neutral-100">
                    <button onClick={() => setActiveChatFriend(null)} className="text-[#00B6FF]">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="relative w-8 h-8 rounded-full bg-neutral-200">
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-xs">
                            {activeChatFriend.name?.[0] || 'U'}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">{activeChatFriend.name || 'Anonymous'}</h3>
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</p>
                    </div>
                </div>

                {/* Message Bubble Layer */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50 no-scrollbar">
                    {chatMessages.map((msg, index) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 max-w-[75%] rounded-2xl text-sm ${isMe ? 'bg-[#00B6FF] text-white rounded-tr-none' : 'bg-neutral-200 text-black rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dynamic Chat Send Bar */}
                <form onSubmit={handleSendTextMessage} className="p-4 border-t border-neutral-100 flex gap-2 bg-white pb-6">
                    <input
                        type="text"
                        placeholder="Send a chat message..."
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        className="flex-grow bg-neutral-100 text-black text-sm px-5 py-3 rounded-full outline-none"
                    />
                    <button type="submit" className="bg-[#00B6FF] p-3 rounded-full text-white">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="relative h-full bg-white flex flex-col pt-16">
            <HeaderBar
                title="Chat"
                onSettingsClick={onOpenSettings}
                onAddFriendClick={onOpenAddFriends}
            />

            <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
                {showAddFriends && <AddFriends currentUserId={currentUserId} />}

                {/* Active Feeds Listing */}
                <div className="mt-4 space-y-1">
                    {/* Unopened Snaps */}
                    {snaps.map((snap) => (
                        <div
                            key={snap.id}
                            onClick={() => handleSnapClick(snap)}
                            className="flex items-center gap-3 py-3 border-b border-neutral-100 hover:bg-neutral-50 active:bg-neutral-100 transition duration-150 cursor-pointer"
                        >
                            {/* Profile Ring */}
                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 border border-neutral-200">
                                {snap.senderName[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-black">{snap.senderName}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    {/* Snapchat Red Square for Snap */}
                                    <div className="w-3.5 h-3.5 bg-[#FF1E56] rounded-sm" />
                                    <span className="text-xs font-semibold text-[#FF1E56]">New Snap</span>
                                    <span className="text-xs text-neutral-400">• Just now</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Regular Chats list */}
                    {friends.map((friend) => (
                        <div
                            key={friend._id}
                            onClick={() => openChatWithFriend(friend)}
                            className="flex items-center gap-3 py-3 border-b border-neutral-100 hover:bg-neutral-50 active:bg-neutral-100 transition duration-150 cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 border border-neutral-200">
                                {friend.name?.[0].toUpperCase() || 'F'}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-black">{friend.name || 'Anonymous'}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    {/* Snapchat Blue Arrow for Text */}
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 2L10 6L2 10V6L2 2Z" fill="#00B6FF" />
                                    </svg>
                                    <span className="text-xs text-neutral-400">Opened</span>
                                    <span className="text-xs text-neutral-400">• Tap to chat</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}