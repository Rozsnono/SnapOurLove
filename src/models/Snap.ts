import mongoose, { Schema, Document, model, models, Types } from 'mongoose';

export interface ISnap extends Document {
    senderId: Types.ObjectId;
    recipientId: Types.ObjectId;
    imageUrl: string;
    cloudinaryId: string;
    createdAt: Date;
    openedAt?: Date;
    duration: number;
}

const SnapSchema = new Schema<ISnap>({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    openedAt: { type: Date },
    duration: { type: Number, default: 10 },
});

export const Snap = models.Snap || model<ISnap>('Snap', SnapSchema);