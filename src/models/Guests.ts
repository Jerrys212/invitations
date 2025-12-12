import mongoose, { Schema, Document } from "mongoose";

export interface IGuestItem {
    id: number;
    name: string;
}

export interface IGuest extends Document {
    name: string;
    guests: IGuestItem[];
    phone: number;
    confirmed: boolean;
}

const GuestItemSchema = new Schema<IGuestItem>({
    name: { type: String, required: true },
});

const GuestSchema = new Schema<IGuest>(
    {
        name: { type: String, required: true },

        guests: {
            type: [GuestItemSchema],
            default: [],
        },
        phone: {
            type: Number,
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false }
);

const Guest = mongoose.model<IGuest>("Guest", GuestSchema);
export default Guest;
