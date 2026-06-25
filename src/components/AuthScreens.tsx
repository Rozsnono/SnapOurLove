'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { setCookie } from '@/lib/cookies'; // Import our cookie utility

const GhostLogo = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15C33 15 25 25 25 38C25 41 26 44 28 47C26 48 24 50 24 53C24 56 27 57 29 56C29 64 34 71 42 73C40 75 37 76 34 76C32 76 30 75 28 74C30 79 35 81 40 81C37 83 32 85 26 85C34 88 44 86 50 81C56 86 66 88 74 85C68 85 63 83 60 81C65 81 70 79 72 74C70 75 68 76 66 76C63 76 60 75 58 73C66 71 71 64 71 56C73 57 76 56 76 53C76 50 74 48 72 47C74 44 75 41 75 38C75 25 67 15 50 15Z"
            fill="#FFFFFF" stroke="#000000" strokeWidth="4" strokeLinejoin="round"
        />
    </svg>
);

interface AuthScreensProps {
    onAuthSuccess: (user: any) => void;
}

export default function AuthScreens({ onAuthSuccess }: AuthScreensProps) {
    const [screen, setScreen] = useState<'splash' | 'login' | 'signup'>('splash');
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identity, password })
            });
            const data = await res.json();
            if (res.ok) {
                // Save to browser cookie (expires in 7 days)
                setCookie('user_session', JSON.stringify(data.user), 7);
                onAuthSuccess(data.user);
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('An error occurred. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password, name })
            });
            const data = await res.json();
            if (res.ok) {
                setIdentity(username);
                setScreen('login');
                alert('Account Created! Please log in.');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Try again.');
        } finally {
            setLoading(false);
        }
    };

    if (screen === 'splash') {
        return (
            <div className="w-screen h-screen bg-[#FFFC00] flex flex-col justify-between items-center px-8 pb-16 pt-32 z-50 relative">
                <GhostLogo />
                <div className="w-full space-y-4 max-w-sm">
                    <button
                        onClick={() => setScreen('login')}
                        className="w-full py-4 bg-white text-black font-black rounded-full tracking-wide text-md shadow-md active:scale-95 transition"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => setScreen('signup')}
                        className="w-full py-4 bg-[#00B6FF] text-white font-black rounded-full tracking-wide text-md shadow-md active:scale-95 transition"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen bg-white flex flex-col p-8 pt-16 z-50 relative">
            <button
                onClick={() => { setScreen('splash'); setError(''); }}
                className="absolute top-8 left-6 text-[#00B6FF] font-bold text-sm"
            >
                Back
            </button>

            {screen === 'login' ? (
                <form onSubmit={handleLogin} className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full pt-12 pb-8">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-black tracking-wide text-center">Log In</h2>
                            {error && <p className="text-xs text-red-500 font-semibold text-center mt-2">{error}</p>}
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black tracking-wider text-[#00B6FF]">USERNAME OR EMAIL</label>
                                <input
                                    type="text"
                                    value={identity}
                                    onChange={(e) => setIdentity(e.target.value)}
                                    required
                                    className="border-b border-neutral-300 py-2 outline-none focus:border-[#00B6FF] text-black text-sm transition"
                                />
                            </div>

                            <div className="flex flex-col relative">
                                <label className="text-[10px] font-black tracking-wider text-[#00B6FF]">PASSWORD</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="border-b border-neutral-300 py-2 pr-10 outline-none focus:border-[#00B6FF] text-black text-sm transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 bottom-2 text-neutral-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button className="text-xs text-[#00B6FF] font-bold text-center w-full block hover:underline">
                            Forgot Your Password?
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#00B6FF] text-white font-black rounded-full tracking-wide text-sm shadow-md active:scale-95 transition disabled:bg-neutral-300"
                        >
                            {loading ? 'Processing...' : 'Log In'}
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleSignup} className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full pt-12 pb-8">
                    <div className="space-y-8 overflow-y-auto no-scrollbar max-h-[80%] pr-1">
                        <div>
                            <h2 className="text-2xl font-black text-black tracking-wide text-center">Sign Up</h2>
                            {error && <p className="text-xs text-red-500 font-semibold text-center mt-2">{error}</p>}
                        </div>

                        <div className="space-y-5">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black tracking-wider text-[#00B6FF]">EMAIL</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border-b border-neutral-300 py-1.5 outline-none focus:border-[#00B6FF] text-black text-sm transition"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-black tracking-wider text-[#00B6FF]">USERNAME</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="border-b border-neutral-300 py-1.5 outline-none focus:border-[#00B6FF] text-black text-sm transition"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-black tracking-wider text-[#00B6FF]">DISPLAY NAME</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-b border-neutral-300 py-1.5 outline-none focus:border-[#00B6FF] text-black text-sm transition"
                                />
                            </div>

                            <div className="flex flex-col relative">
                                <label className="text-[10px] font-black tracking-wider text-[#00B6FF]">PASSWORD</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="border-b border-neutral-300 py-1.5 pr-10 outline-none focus:border-[#00B6FF] text-black text-sm transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 bottom-2 text-neutral-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#00B6FF] text-white font-black rounded-full tracking-wide text-sm shadow-md active:scale-95 transition disabled:bg-neutral-300"
                    >
                        {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>
            )}
        </div>
    );
}