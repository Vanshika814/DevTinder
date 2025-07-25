const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    FirstName: {
        type: String,
        index: true,
        minlength: 4,
        maxlength: 50,
        required: true,
    },
    LastName: {
        type: String,
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address:" + value);
            }
        },
    },
    password: {
        type: String,
        required: false, // Not required for Clerk users can be ignored
    },
    age: {
        type: Number,
        min: 12,
        max:100
    }, 
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not Valid");
                
            }
        },
    },
    photoUrl:{
        type: String,
        default: "https://res.cloudinary.com/dgfirvf4b/image/upload/v1753101173/download_8_yi0fsk.jpg"
    },
    about:{
        type: String,
        default: "This is the default about me section!",
        maxlength: 500
    },
    skills:{
        type: [String]
    },
    techStack:{
        type: [String]
    },
    bioAnswers: {
        type: [
            {
                prompt: String,
                answer: String
            }
        ],
        default: []
    },
    socialLinks: {
        github: { type: String },
        linkedin: { type: String },
        portfolio: { type: String },
        twitter: { type: String }
    },
    projects: {
        type: [
            {
                title: String,
                description: String,
                techUsed: [String],
                githubLink: String,
                imageUrl: String
            }
        ],
        default: []
    },
    availability: {
        openTo: [String], // ["freelance", "hackathons", "internship"]
    },
    location: {
        city: String,
        country: String,
    }
    
},
{
    timestamps: true,
});

UserSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id : user._id}, process.env.JWT_SECRET, {
        expiresIn:"7d",
    });
    return token;
}

UserSchema.methods.validatePassword = async function(passwordInputbyuser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordVaild = await bcrypt.compare(
        passwordInputbyuser, 
        passwordHash
    );
    return isPasswordVaild;
}

module.exports = mongoose.model("User", UserSchema);