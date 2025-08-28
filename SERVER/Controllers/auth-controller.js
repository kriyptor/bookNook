const mongoose = require('mongoose');
const { User } = require("../Models/user-schema");
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);


const generateAccessToken = (id, name) => {
    return jwt.sign({ userId: id, name }, process.env.JWT_SECRET_KEY);
}

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate inputs
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User({
            name: name,
            email: email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'Successfully created new user'
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: `User with this email already exists.`
            });
        }
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Invalid credentials!`
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: `Invalid credentials!`
            });
        }

        const token = generateAccessToken(user.id, user.name);
        
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// getUserProfile.js
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user ID format" });
    }

    const user = await User.findById(userId, 'email name profilePic').lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// updateUserProfile.js
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, profilePic } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user ID format" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (profilePic) updateData.profilePic = profilePic;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No updates provided' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, fields: 'name profilePic' }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
};