import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, username, password, name } = await request.json();

        if (!email || !username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json({ error: 'Username or Email already exists' }, { status: 409 });
        }

        const user = await User.create({
            email,
            username,
            password, // Note: For staging/production, hash passwords using bcrypt
            name: name || username
        });

        return NextResponse.json({ success: true, user: { id: user._id, email: user.email, username: user.username } }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}