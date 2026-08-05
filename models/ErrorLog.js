import mongoose from 'mongoose';

const ErrorLogSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    loggedByClerkId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    errorCategory: {
        type: String,
        enum: ['Database Validation', 'CORS', 'Type Error', 'Auth', 'API Failure', 'Syntax Error', 'Unknown'],
        default: 'Unknown'
    },
    rawTrace: {
        type: String,
        required: true
    },
    remediation: {
        type: String
    },
    errorHash: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['unresolved', 'investigating', 'resolved'],
        default: 'unresolved'
    }
}, { timestamps: true });

export const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);