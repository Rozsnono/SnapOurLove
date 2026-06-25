'use client';

import React from 'react';
import HeaderBar from './HeaderBar';

interface StoriesMockProps {
    onOpenSettings: () => void;
    onOpenAddFriends: () => void;
}

export default function StoriesMock({ onOpenSettings, onOpenAddFriends }: StoriesMockProps) {
    const horizontalFriends = [
        { name: 'Sheila P.', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80' },
        { name: 'Ashley A.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80' },
        { name: 'Tim W.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
        { name: 'Leo W.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80' }
    ];

    const forYouTiles = [
        { title: 'WAVE CHECK', sub: 'The Hype is Real', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&h=300&q=80' },
        { title: 'MAKEUP ARTISTRY', sub: 'This Might Be Bold', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&h=300&q=80' }
    ];

    return (
        <div className="relative h-full bg-white pt-16 flex flex-col">
            <HeaderBar
                title="Stories"
                onSettingsClick={onOpenSettings}
                onAddFriendClick={onOpenAddFriends}
            />
            <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
                <div className="mt-4">
                    <h3 className="text-xs font-black text-neutral-400 tracking-wider mb-3">FRIENDS</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
                        {horizontalFriends.map((f, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
                                <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-purple-600 to-pink-500">
                                    <img src={f.img} alt={f.name} className="w-full h-full rounded-full object-cover border-2 border-white" />
                                </div>
                                <span className="text-[10px] font-bold text-black">{f.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-xs font-black text-neutral-400 tracking-wider mb-3">FOR YOU</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {forYouTiles.map((tile, i) => (
                            <div key={i} className="relative h-60 rounded-2xl overflow-hidden shadow-md cursor-pointer group">
                                <img src={tile.img} alt={tile.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3">
                                    <h4 className="text-[10px] font-black text-yellow-400 tracking-wider">{tile.title}</h4>
                                    <p className="text-xs font-bold text-white leading-tight mt-0.5">{tile.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}