import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Snap } from '@/models/Snap';
import { User } from '@/models/User';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }

  try {
    await dbConnect();

    // Query for snaps where recipient matches, excluding already opened ones
    const rawSnaps = await Snap.find({
      recipientId: userId,
      openedAt: { $exists: false },
    })
      .populate('senderId', 'name email')
      .sort({ createdAt: -1 });

    const formattedSnaps = rawSnaps.map((snap: any) => ({
      id: snap._id.toString(),
      senderName: snap.senderId?.name || snap.senderId?.email || 'Someone',
      duration: snap.duration,
      createdAt: snap.createdAt,
      opened: false,
    }));

    return NextResponse.json({ snaps: formattedSnaps });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}