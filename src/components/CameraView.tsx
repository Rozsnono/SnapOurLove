'use client';

import React, { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Send, X, RefreshCw, Zap, ZapOff, Clock, UserCheck } from 'lucide-react';
import HeaderBar from './HeaderBar';

interface CameraViewProps {
    currentUserId: string;
    onOpenSettings: () => void;
    onOpenAddFriends: () => void;
}

export default function CameraView({ currentUserId, onOpenSettings, onOpenAddFriends }: CameraViewProps) {
    const [photo, setPhoto] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [friends, setFriends] = useState<any[]>([]);
    const [showRecipientModal, setShowRecipientModal] = useState(false);
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await fetch(`/api/friends?userId=${currentUserId}`);
                if (res.ok) {
                    const data = await res.json();
                    setFriends(data.friends || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchFriends();
    }, [currentUserId]);

    const takePhoto = async () => {
        try {
            const image = await Camera.getPhoto({
                quality: 85,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: CameraSource.Camera,
            });

            if (image.base64String) {
                setPhoto(image.base64String);
            }
        } catch (err) {
            console.log('User closed camera interface', err);
        }
    };

    const sendSnapToRecipient = async (recipientId: string) => {
        if (!photo) return;
        setUploading(true);

        try {
            const res = await fetch('/api/snaps/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    base64Image: photo,
                    senderId: currentUserId,
                    recipientId,
                    duration: 10,
                }),
            });

            if (res.ok) {
                setPhoto(null);
                setShowRecipientModal(false);
                alert('Snap Sent!');
            } else {
                alert('Failed to send.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative h-full w-full bg-black">
            {!photo && (
                <HeaderBar
                    title=""
                    darkTheme
                    onSettingsClick={onOpenSettings}
                    onAddFriendClick={onOpenAddFriends}
                />
            )}

            {photo ? (
                <div className="absolute inset-0 flex flex-col justify-between p-4 z-40">
                    <img src={`data:image/jpeg;base64,${photo}`} alt="Captured" className="absolute inset-0 w-full h-full object-cover z-0" />

                    <div className="relative z-10 flex justify-between items-start pt-12">
                        <button onClick={() => setPhoto(null)} className="p-3 rounded-full bg-black/60 text-white backdrop-blur-md">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="relative z-10 flex justify-end pb-24">
                        <button
                            onClick={() => setShowRecipientModal(true)}
                            className="px-6 py-3.5 bg-[#FFFC00] text-black font-black rounded-full flex items-center gap-2 shadow-2xl scale-105 active:scale-95 transition"
                        >
                            <Send size={18} fill="#000" />
                            Send To
                        </button>
                    </div>
                </div>
            ) : (
                /* Native Camera Shutter trigger deck */
                <div className="absolute inset-0 flex flex-col justify-between pb-24 z-10">
                    {/* Floating Right Bar Options */}
                    <div className="flex flex-col items-end gap-4 absolute right-4 top-20">
                        <button onClick={() => setFlash(!flash)} className="p-3 rounded-full bg-black/55 text-white backdrop-blur-md">
                            {flash ? <Zap size={18} className="text-yellow-400" /> : <ZapOff size={18} />}
                        </button>
                        <button className="p-3 rounded-full bg-black/55 text-white backdrop-blur-md">
                            <RefreshCw size={18} />
                        </button>
                        <button className="p-3 rounded-full bg-black/55 text-white backdrop-blur-md">
                            <Clock size={18} />
                        </button>
                    </div>

                    <div className="flex-1 flex items-end justify-center pb-8">
                        <button
                            onClick={takePhoto}
                            className="w-20 h-20 bg-transparent border-4 border-white rounded-full flex items-center justify-center p-1 cursor-pointer scale-105 active:scale-95 transition"
                        >
                            <div className="w-full h-full bg-white rounded-full border border-black/40" />
                        </button>
                    </div>
                </div>
            )}

            {/* Recipient Modal */}
            {showRecipientModal && (
                <div className="fixed inset-0 bg-black/95 z-50 p-6 flex flex-col justify-end">
                    <div className="bg-neutral-900 rounded-3xl p-5 max-h-[80%] overflow-y-auto no-scrollbar">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-white">Send To</h3>
                            <button onClick={() => setShowRecipientModal(false)} className="p-1.5 rounded-full bg-neutral-800 text-white">
                                <X size={18} />
                            </button>
                        </div>

                        {friends.length === 0 ? (
                            <p className="text-neutral-500 text-center text-sm py-8">Add friends in Chat tab first.</p>
                        ) : (
                            <div className="space-y-3">
                                {friends.map((friend) => (
                                    <button
                                        key={friend._id}
                                        disabled={uploading}
                                        onClick={() => sendSnapToRecipient(friend._id)}
                                        className="flex items-center justify-between w-full p-4 bg-neutral-800/60 rounded-2xl text-left hover:bg-neutral-800 transition"
                                    >
                                        <div>
                                            <p className="font-bold text-white">{friend.name || 'Anonymous'}</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">{friend.email}</p>
                                        </div>
                                        <UserCheck className="text-[#FFFC00]" size={18} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}