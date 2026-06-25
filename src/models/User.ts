import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    password?: string;
    name?: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model<IUser>('User', UserSchema);