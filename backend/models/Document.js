import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    kind: {
        type: String,
        required: true,
        enum: ['native', 'git', 'upload']
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    owner: {
        type: String,
        required: false
    },
    repo: {
        type: String,
        required: false
    },
    path: {
        type: String,
        required: false
    },
    branch: {
        type: String,
        default: 'main',
        required: false,
    },
    sha: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false
    },
    fileUrl: {
        type: String,
        required: false
    },
    mimeType: {
        type: String,
        required: false
    },
    fileSize: {
        type: Number,
        required: false
    }
}, { timestamps: true });

export default mongoose.model('Document', DocumentSchema);

