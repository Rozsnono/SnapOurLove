'use client';

import React, { useState, useEffect } from 'react';
import SwipeLayout from '@/components/SwipeLayout';
import CameraView from '@/components/CameraView';
import ChatInbox from '@/components/ChatInbox';
import SnapViewer from '@/components/SnapViewer';

// Persistent Cookie Utilities
import { getCookie, deleteCookie } from '@/lib/cookies';

// Authentic Sub-views
import AuthScreens from '@/components/AuthScreens';
import SettingsScreen from '@/components/SettingsScreen';
import AddFriendsScreen from '@/components/AddFriendsScreen';

// Mock Screens [2]
import MapMock from '@/components/MapMock';
import StoriesMock from '@/components/StoriesMock';
import DiscoverMock from '@/components/DiscoverMock';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState(2); // Start on Camera (Index 2)
  const [viewingSnapId, setViewingSnapId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Overlays
  const [showSettings, setShowSettings] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);

  // Check for existing cookie session on mount
  useEffect(() => {
    const session = getCookie('user_session');
    if (session) {
      try {
        setCurrentUser(JSON.parse(session));
      } catch (err) {
        console.error('Session cookie read error:', err);
      }
    }
    setInitializing(false);
  }, []);

  const handleOpenSnap = (snapId: string) => {
    setViewingSnapId(snapId);
  };

  const handleCloseViewer = () => {
    setViewingSnapId(null);
  };

  const handleLogout = () => {
    deleteCookie('user_session');
    setCurrentUser(null);
    setShowSettings(false);
  };

  if (initializing) {
    return (
      <div className="w-screen h-screen bg-[#FFFC00] flex items-center justify-center">
        <span className="text-black font-black tracking-widest text-sm">INITIALIZING...</span>
      </div>
    );
  }

  // Force onboarding if unauthenticated [2]
  if (!currentUser) {
    return <AuthScreens onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  // Handlers to open overlay frames
  const openSettings = () => setShowSettings(true);
  const openAddFriends = () => setShowAddFriends(true);

  return (
    <main className="w-screen h-screen select-none bg-black overflow-hidden relative">
      <SwipeLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mapComponent={
          <MapMock
            onOpenSettings={openSettings}
            onOpenAddFriends={openAddFriends}
          />
        }
        chatComponent={
          <ChatInbox
            currentUserId={currentUser.id}
            onOpenSnap={handleOpenSnap}
            onOpenSettings={openSettings}
            onOpenAddFriends={openAddFriends}
          />
        }
        cameraComponent={
          <CameraView
            currentUserId={currentUser.id}
            onOpenSettings={openSettings}
            onOpenAddFriends={openAddFriends}
          />
        }
        storiesComponent={
          <StoriesMock
            onOpenSettings={openSettings}
            onOpenAddFriends={openAddFriends}
          />
        }
        discoverComponent={
          <DiscoverMock
            onOpenSettings={openSettings}
            onOpenAddFriends={openAddFriends}
          />
        }
      />

      {/* Ephemeral Image View Overlay */}
      {viewingSnapId && (
        <SnapViewer snapId={viewingSnapId} onClose={handleCloseViewer} />
      )}

      {/* Profile/Settings Settings overlay */}
      {showSettings && (
        <SettingsScreen
          user={currentUser}
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
        />
      )}

      {/* Add Friends Overlay Screen [2] */}
      {showAddFriends && (
        <AddFriendsScreen
          currentUserId={currentUser.id}
          onClose={() => setShowAddFriends(false)}
        />
      )}
    </main>
  );
}