'use client';

import React, { useEffect, useState } from 'react';

interface SnapViewerProps {
    snapId: string;
    onClose: () => void;
}

export default function SnapViewer({ snapId, onClose }: SnapViewerProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getSnapData = async () => {
            try {
                const res = await fetch(`/api/snaps/view?id=${snapId}`);
                if (res.ok) {
                    const data = await res.json();
                    setImageUrl(data.imageUrl);
                    setTimeLeft(data.duration);
                } else {
                    onClose();
                }
            } catch (err) {
                console.error(err);
                onClose();
            } finally {
                setLoading(false);
            }
        };

        getSnapData();
    }, [snapId, onClose]);

    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft <= 0) {
            const purgeSnap = async () => {
                await fetch('/api/snaps/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ snapId }),
                });
                onClose();
            };

            purgeSnap();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev !== null ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, snapId, onClose]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <span className="text-sm tracking-widest text-neutral-400">LOADING SNAP...</span>
            </div>
        );
    }

    if (!imageUrl) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center">
            <div className="absolute top-10 right-10 bg-black/75 border border-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center font-black text-base shadow-lg">
                {timeLeft}
            </div>

            <img
                src={imageUrl}
                alt="Active Snap"
                className="w-full h-full object-cover"
            />
        </div>
    );
}