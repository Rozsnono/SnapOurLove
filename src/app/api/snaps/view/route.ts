import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Snap } from '@/models/Snap';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const snapId = searchParams.get('id');

    if (!snapId) {
        return NextResponse.json({ error: 'Snap ID is missing' }, { status: 400 });
    }

    try {
        await dbConnect();

        // Mark as opened immediately on open call
        const snap = await Snap.findByIdAndUpdate(
            snapId,
            { openedAt: new Date() },
            { new: true }
        );

        if (!snap) {
            return NextResponse.json({ error: 'Snap not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: snap._id.toString(),
            imageUrl: snap.imageUrl,
            duration: snap.duration,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}   