import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    githubAccessToken: {
        type: String,
        required: false,
        default: null,
        select: false
    },
    githubUsername: {
        type: String,
        required: false,
        default: null
    }
},
    { timestamps: true }
);

export default mongoose.model('User', userSchema);

