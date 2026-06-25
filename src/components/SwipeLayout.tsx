'use client';

import React, { useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';

// Custom bottom tab SVGs mimicking official icons
const MapIcon = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
            fill={active ? "#02E0A7" : "#FFFFFF"} stroke={active ? "#02E0A7" : "#FFFFFF"} strokeWidth="1"
        />
    </svg>
);

const ChatIcon = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.2L4 17.2V4H20V16Z"
            fill={active ? "#00B6FF" : "#FFFFFF"}
        />
    </svg>
);

const CameraShutterIcon = ({ active }: { active: boolean }) => (
    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-[#FFFC00]' : 'border-white'}`}>
        <div className={`w-6 h-6 rounded-full ${active ? 'bg-[#FFFC00]' : 'bg-white'}`} />
    </div>
);

const StoriesIcon = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
            fill={active ? "#A020F0" : "#FFFFFF"}
        />
    </svg>
);

const DiscoverIcon = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5V19L19 12L8 5Z" fill={active ? "#FF1E56" : "#FFFFFF"} stroke={active ? "#FF1E56" : "#FFFFFF"} strokeWidth="2" strokeLinejoin="round" />
    </svg>
);

interface SwipeLayoutProps {
    mapComponent: React.ReactNode;
    chatComponent: React.ReactNode;
    cameraComponent: React.ReactNode;
    storiesComponent: React.ReactNode;
    discoverComponent: React.ReactNode;
    activeTab: number;
    setActiveTab: (tab: number) => void;
}

export default function SwipeLayout({
    mapComponent,
    chatComponent,
    cameraComponent,
    storiesComponent,
    discoverComponent,
    activeTab,
    setActiveTab,
}: SwipeLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDragEnd = (event: any, info: PanInfo) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold && activeTab < 4) {
            setActiveTab(activeTab + 1);
        } else if (info.offset.x > swipeThreshold && activeTab > 0) {
            setActiveTab(activeTab - 1);
        }
    };

    const getThemeBackground = () => {
        // Camera and Map run deep layouts, Chat, Stories, and Discover have clean system base coats
        if (activeTab === 0 || activeTab === 2) return 'bg-black';
        return 'bg-white';
    };

    return (
        <div className={`relative w-screen h-screen overflow-hidden ${getThemeBackground()} transition-colors duration-300`}>
            {/* 5-Column Horizontal Viewport Container */}
            <motion.div
                ref={containerRef}
                className="flex h-full"
                animate={{ x: `-${activeTab * 100}vw` }}
                transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                style={{ width: '500vw' }}
            >
                <div className="w-screen h-full flex-shrink-0">{mapComponent}</div>
                <div className="w-screen h-full flex-shrink-0">{chatComponent}</div>
                <div className="w-screen h-full flex-shrink-0">{cameraComponent}</div>
                <div className="w-screen h-full flex-shrink-0">{storiesComponent}</div>
                <div className="w-screen h-full flex-shrink-0">{discoverComponent}</div>
            </motion.div>

            {/* Snapchat Utility Navigation Foot Deck */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-black/95 border-t border-neutral-900/60 flex items-center justify-around px-2 pb-4 z-40">
                <button onClick={() => setActiveTab(0)} className="w-12 h-12 flex items-center justify-center relative">
                    <MapIcon active={activeTab === 0} />
                    {activeTab === 0 && <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#02E0A7]" />}
                </button>
                <button onClick={() => setActiveTab(1)} className="w-12 h-12 flex items-center justify-center relative">
                    <ChatIcon active={activeTab === 1} />
                    {activeTab === 1 && <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#00B6FF]" />}
                </button>
                <button onClick={() => setActiveTab(2)} className="w-12 h-12 flex items-center justify-center relative">
                    <CameraShutterIcon active={activeTab === 2} />
                </button>
                <button onClick={() => setActiveTab(3)} className="w-12 h-12 flex items-center justify-center relative">
                    <StoriesIcon active={activeTab === 3} />
                    {activeTab === 3 && <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#A020F0]" />}
                </button>
                <button onClick={() => setActiveTab(4)} className="w-12 h-12 flex items-center justify-center relative">
                    <DiscoverIcon active={activeTab === 4} />
                    {activeTab === 4 && <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#FF1E56]" />}
                </button>
            </div>
        </div>
    );
}