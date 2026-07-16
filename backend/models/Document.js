import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    filename: {
        type: String  
    },
    filepath: {
        type: String  
    },
    size: {
        type: Number  
    }
}, {
    timestamps: true
});

export default mongoose.model("Document", documentSchema);