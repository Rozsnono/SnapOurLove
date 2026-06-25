import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Message } from '@/models/Message';
import { pusherServer } from '@/lib/pusher-server';

// GET: Fetch message history between two users
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const friendId = searchParams.get('friendId');

        if (!userId || !friendId) {
            return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
        }

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: friendId },
                { senderId: friendId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        return NextResponse.json({ messages });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST: Send chat message and broadcast real-time
export async function POST(request: Request) {
    try {
        await dbConnect();
        const { senderId, receiverId, text } = await request.json();

        if (!senderId || !receiverId || !text) {
            return NextResponse.json({ error: 'Parameters missing' }, { status: 400 });
        }

        const newMessage = await Message.create({ senderId, receiverId, text });

        // Broadcast message over a unique dual-user chat channel
        const sortedIds = [senderId, receiverId].sort();
        const channelName = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;

        await pusherServer.trigger(channelName, 'message', {
            senderId,
            text,
            createdAt: newMessage.createdAt
        });

        return NextResponse.json({ success: true, message: newMessage });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}