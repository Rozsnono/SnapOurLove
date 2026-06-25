import mongoose, { Schema, Document, model, models, Types } from 'mongoose';

export interface IFriendship extends Document {
    requesterId: Types.ObjectId; // User who sent the request
    recipientId: Types.ObjectId; // User receiving the request
    status: 'pending' | 'accepted';
    createdAt: Date;
}

const FriendshipSchema = new Schema<IFriendship>({
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

// Ensure a user cannot send duplicate requests to the same person
FriendshipSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

export const Friendship = models.Friendship || model<IFriendship>('Friendship', FriendshipSchema);