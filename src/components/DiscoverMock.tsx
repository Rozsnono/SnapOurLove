'use client';

import React from 'react';
import HeaderBar from './HeaderBar';

interface DiscoverMockProps {
    onOpenSettings: () => void;
    onOpenAddFriends: () => void;
}

export default function DiscoverMock({ onOpenSettings, onOpenAddFriends }: DiscoverMockProps) {
    const discoverShows = [
        { show: 'Happening Now', desc: 'Weather: Cool Breeze', img: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=200&h=300&q=80', tag: 'News' },
        { show: 'Trending Tech', desc: 'Is AI evolving fast?', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=200&h=300&q=80', tag: 'Tech' },
        { show: 'Tasty Bites', desc: 'Try this easy recipes', img: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=200&h=300&q=80', tag: 'Food' },
        { show: 'Vander-wheels', desc: 'Ultimate Garage review', img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=200&h=300&q=80', tag: 'Cars' }
    ];

    return (
        <div className="relative h-full bg-white pt-16 flex flex-col">
            <HeaderBar
                title="Discover"
                onSettingsClick={onOpenSettings}
                onAddFriendClick={onOpenAddFriends}
            />
            <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
                <div className="mt-4">
                    <h3 className="text-xs font-black text-neutral-400 tracking-wider mb-3">POPULAR ON SNAPCHAT</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {discoverShows.map((show, i) => (
                            <div key={i} className="relative h-56 rounded-2xl overflow-hidden shadow-md cursor-pointer group">
                                <img src={show.img} alt={show.show} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3">
                                    <span className="bg-[#FF1E56] text-white text-[8px] font-black px-2 py-0.5 rounded-full w-max mb-1.5 uppercase">
                                        {show.tag}
                                    </span>
                                    <h4 className="text-xs font-black text-white leading-tight">{show.show}</h4>
                                    <p className="text-[10px] text-neutral-300 mt-0.5 leading-tight">{show.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}