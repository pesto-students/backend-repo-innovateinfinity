import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        default: "",
    },

    phoneNumber: {
        type: String,
        required: true,
        default: null,
        unique: true,
    },

    email: {
        type: String,
        required: false,
        default: null,
    },

    // basic status of organization
    active: {
        type: Boolean,
        required: true,
        default: false,
    },

    // if its approved or not
    approved: {
        type: Boolean,
        required: true,
        default: false,
    },

    otpVerified: {
        type: Boolean,
        required: true,
        default: false,
    },

    address: {
        type: String,
        required: true,
        default: "",
    },

    pincode: {
        type: Number,
        required: true,
        default: 0,
    },

    city: {
        type: String,
        required: true,
        default: null,
    },

    state: {
        type: String,
        required: true,
        default: null,
    },

    details: {
        type: String,
        required: false,
        default: null,
    },

    license: {
        type: String,
        required: false,
        default: null,
    },

    photos: {
        type: [String],
        required: false,
        default: [],
    },

    // place where organization joined.
    // SIGNUP // ADMIN_DASHBOARD etc
    joinedFrom: {
        type: String,
        required: false,
        default: null,
    },

    // ADMIN, ORGANIZATION, DRIVER, STUDENT
    profile: {
        type: String,
        required: true,
        default: "ORGANIZATION",
    },

    approvedById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: false,
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleteAt: { type: Date, default: null },
});

export default mongoose.model('Organization', OrganizationSchema);

