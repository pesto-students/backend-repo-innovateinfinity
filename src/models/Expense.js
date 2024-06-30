import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({

    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required : true,
    },

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required : false,
    },

    amount: {
        type: Number,
        required: true,
        default: null,
    },

    type: {
        type: String,
        required: true,
        default: "",
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleteAt: { type: Date, default: null },
});

export default mongoose.model('Expense', ExpenseSchema);

