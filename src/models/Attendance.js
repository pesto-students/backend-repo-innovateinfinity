import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
    },

    kmDriven: {
        type: Number,
        required: true,
        default: 0,
    },

    // STARTED, COMPLETED
    status : {
        type: String,
        required: true,
        default: "STARTED",
    },

    classType: {
        type: String,
        required: false,
        default: null,
    },

    startingMeter: {
        type: Number,
        required: true,
        default: 0,
    },

    endingMeter: {
        type: Number,
        required: true,
        default: 0,
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleteAt: { type: Date, default: null },
});

export default mongoose.model('Attendance', AttendanceSchema);

