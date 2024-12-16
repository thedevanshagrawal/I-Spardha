import mongoose from 'mongoose';

const matchFixtureSchema = new mongoose.Schema(
    {
        matchNumber: {
            type: String
        },
        date: {
            type: String,
        },
        // game: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Game',
        // },
        gameName: {
            type: String,
            lowercase: true
        },
        teams: [
            {
                house: {
                    type: String,
                    lowercase: true,
                    enum: ['dominator', 'terminator', 'challengers', 'avengers'],

                },
                players: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Player',
                    },
                ],
            },
        ],
        gender: {
            type: String,
            enum: ['boy', 'girl'],
        },
    },
    {
        timestamps: true,
    }
);

matchFixtureSchema.pre('save', function (next) {
    if (this.date) {
        const originalDate = new Date(this.date);
        const formattedDate = originalDate
            .toLocaleDateString('en-GB') // Format as dd-mm-yyyy
            .split('/')
            .join('-'); // Replace "/" with "-"
        this.date = formattedDate;
    }
    next();
});

export const MatchFixture = mongoose.model('MatchFixture', matchFixtureSchema);
