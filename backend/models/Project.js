import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'Project name must be at least 3 characters long']
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Project description must be at least 10 characters long']
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'archived']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    requirements: {
        type: Mixed
    }
}, { timestamps: true });

export default mongoose.model('Project', projectShema);