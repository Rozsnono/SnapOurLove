import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher-server';

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const params = new URLSearchParams(body);
        const socketId = params.get('socket_id');
        const channelName = params.get('channel_name');

        if (!socketId || !channelName) {
            return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 });
        }

        // Authorization response for Pusher client handshake
        const authResponse = pusherServer.authorizeChannel(socketId, channelName);
        return NextResponse.json(authResponse);
    } catch (error) {
        console.error('Pusher authentication error:', error);
        return NextResponse.json({ error: 'Authorization failed' }, { status: 403 });
    }
}