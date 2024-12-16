import mongoose from 'mongoose';

const pointTableSchema = new mongoose.Schema(
    {
        house: {
            type: String,
            lowercase: true,
            enum: ["Dominator", "Terminator", "Avengers", "Challengers"],
        },
        gameName: {
            type: String,
        },
        points: {
            type: Number,
            min: 0,
        },
    },
    { timestamps: true }
);

export const PointTable = mongoose.model('PointTable', pointTableSchema);
