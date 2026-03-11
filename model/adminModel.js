import mongoose from 'mongoose';


const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        default: 'admin'
    },
    by: {
        type: String,
        default: 'zapcore'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


export default mongoose.model('Admin', AdminSchema);