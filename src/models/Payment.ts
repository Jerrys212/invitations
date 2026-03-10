import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
    name: string;
    total: number;
    settled: boolean;
    img: string;
}

const PaymentSchema = new Schema<IPayment>(
    {
        name: { type: String, required: true },

        total: {
            type: Number,
        },
        settled: {
            type: Boolean,
            default: false,
        },
        img: {
            type: String,
            default: "",
        },
    },
    { timestamps: true, versionKey: false },
);

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;
