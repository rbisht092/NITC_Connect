import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate usernames
        trim: true,   // Removes leading and trailing whitespace
    },
    displayname: {
        type: String,
        required: true,
        trim: true,   // Ensures a clean display name
    },
    mail: {
        type: String,
        required: true,
        unique: true,  // Ensures no duplicate email addresses
        trim: true,
        lowercase: true, // Automatically converts email to lowercase
        validate: {
            validator: function(value) {
                // Regular expression to match email ending with @nitc.ac.in
                return /^[a-zA-Z0-9._%+-]+@nitc\.ac\.in$/.test(value);
            },
            message: 'Please provide a valid university email ending with @nitc.ac.in'
        }
    },
    password: {
        type: String,
        required: true, // Ensures a password is provided
        minlength: 3,   // Enforces a minimum length for security
    }
}, {
    timestamps: true // Adds `createdAt` and `updatedAt` fields automatically
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;
