import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    ownerClerkId: {
        type: String,
        required: true,
        index: true
    },
    members: [
        {
            clerkUserId: { type: String, required: true },
            email: { type: String, required: true },
            role: { type: String, enum: ['admin', 'developer'], default: 'developer' }
        }
    ],
    apiKey: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

export const Project = mongoose.model('Project', ProjectSchema);