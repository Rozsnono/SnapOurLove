import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Snap } from '@/models/Snap';
import { User } from '@/models/User';
import cloudinary from '@/lib/cloudinary';
import { pusherServer } from '@/lib/pusher-server';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { base64Image, senderId, recipientId, duration } = await request.json();

        if (!base64Image || !senderId || !recipientId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Signed server-to-server secure upload
        const uploadResult = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${base64Image}`,
            {
                folder: 'snaps',
                transformation: [{ width: 1080, height: 1920, crop: 'fill' }],
            }
        );

        const newSnap = await Snap.create({
            senderId,
            recipientId,
            imageUrl: uploadResult.secure_url,
            cloudinaryId: uploadResult.public_id,
            duration: duration || 10,
        });

        const sender = await User.findById(senderId).select('name email');
        const senderName = sender ? (sender.name || sender.email) : 'Someone';

        // Notify recipient in real time through Pusher private channel
        await pusherServer.trigger(
            `private-user-${recipientId}`,
            'new-snap',
            {
                snapId: newSnap._id.toString(),
                senderName,
                duration: newSnap.duration,
                createdAt: newSnap.createdAt,
            }
        );

        return NextResponse.json({ success: true, snap: newSnap }, { status: 201 });
    } catch (err: any) {
        console.error('Upload Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}