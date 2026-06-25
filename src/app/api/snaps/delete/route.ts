import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Snap } from '@/models/Snap';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { snapId } = await request.json();

        if (!snapId) {
            return NextResponse.json({ error: 'Snap ID is missing' }, { status: 400 });
        }

        const snap = await Snap.findById(snapId);
        if (!snap) {
            return NextResponse.json({ error: 'Snap file was not found' }, { status: 404 });
        }

        // 1. Remove Asset from Cloudinary
        if (snap.cloudinaryId) {
            await cloudinary.uploader.destroy(snap.cloudinaryId);
        }

        // 2. Clear Database Record
        await Snap.findByIdAndDelete(snapId);

        return NextResponse.json({ success: true, message: 'Snap securely deleted' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}