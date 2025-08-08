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