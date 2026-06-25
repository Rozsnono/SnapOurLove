import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { identity, password } = await request.json(); // identity can be email or username

        if (!identity || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const user = await User.findOne({
            $or: [{ email: identity }, { username: identity }]
        });

        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid username/email or password' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            user: { id: user._id.toString(), email: user.email, username: user.username, name: user.name }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}