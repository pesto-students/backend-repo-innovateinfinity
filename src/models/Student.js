import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({

    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required : false,
    },

    phoneNumber: {
        type: String,
        required: true,
        default: null,
        unique: true,
    },

    name: {
        type: String,
        required: true,
        default: "",
    },

    defaultTime: {
        type: String,
        required: false,
        default: null,
    },

    // ADMIN, ORGANIZATION, DRIVER, STUDENT
    profile : {
        type : String,
        required: true,
        default: "STUDENT",
    },

    // ONBOARDED, INPROGRESS, COMPLETED
    status: {
        type: String,
        required: true,
        default: "ONBOARDED",
    },

    disabled : {
        type: Boolean,
        required : true,
        default: false,
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleteAt: { type: Date, default: null },
});

export default mongoose.model('Student', StudentSchema);

