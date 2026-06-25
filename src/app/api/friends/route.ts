import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';
import { Friendship } from '@/models/Friendship';

// 1. GET: Fetch dynamic friend list or search users
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const search = searchParams.get('search'); // query parameter to find other users

        if (!userId) {
            return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
        }

        // Scenario A: Search users by email or name to add them as a friend
        if (search) {
            const query = {
                _id: { $ne: userId }, // Don't show current user in search results
                $or: [
                    { email: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } }
                ]
            };
            const users = await User.find(query).limit(10).select('name email');
            return NextResponse.json({ users });
        }

        // Scenario B: Retrieve current list of accepted friends
        const friendships = await Friendship.find({
            $or: [{ requesterId: userId }, { recipientId: userId }],
            status: 'accepted'
        }).populate('requesterId recipientId', 'name email');

        const friends = friendships.map((f: any) => {
            // Return the other user in the relationship
            return f.requesterId._id.toString() === userId ? f.recipientId : f.requesterId;
        });

        return NextResponse.json({ friends });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// 2. POST: Send or accept a friend request
export async function POST(request: Request) {
    try {
        await dbConnect();
        const { currentUserId, targetUserId, action } = await request.json();

        if (!currentUserId || !targetUserId) {
            return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
        }

        if (action === 'request') {
            // Check if a relationship already exists
            const existing = await Friendship.findOne({
                $or: [
                    { requesterId: currentUserId, recipientId: targetUserId },
                    { requesterId: targetUserId, recipientId: currentUserId }
                ]
            });

            if (existing) {
                return NextResponse.json({ error: 'Relationship already exists' }, { status: 400 });
            }

            const request = await Friendship.create({
                requesterId: currentUserId,
                recipientId: targetUserId,
                status: 'pending'
            });
            return NextResponse.json({ success: true, request });
        }

        if (action === 'accept') {
            // Find the request and change status to 'accepted'
            const requestToAccept = await Friendship.findOneAndUpdate(
                { requesterId: targetUserId, recipientId: currentUserId, status: 'pending' },
                { status: 'accepted' },
                { new: true }
            );

            if (!requestToAccept) {
                return NextResponse.json({ error: 'No pending request found' }, { status: 404 });
            }

            return NextResponse.json({ success: true, friendship: requestToAccept });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}