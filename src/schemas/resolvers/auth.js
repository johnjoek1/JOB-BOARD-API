

const { User } = require('../../models');
const jwt = require('jsonwebtoken');

const authResolvers = {
    Mutation: {
        register: async (_, { input }, { models }) => {
            if (!models || !models.User) {
                throw new Error('User model is not available');
            }

            const { username, email, password, role } = input;

            // Check if user exists
            const existingUser = await models.User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                throw new Error('User with this email or username already exists');
            }

            // Create user (password hashing handled by pre-save hook)
            const user = new models.User({
                username,
                email,
                password,
                role
            });
            await user.save();

            // Generate JWT
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { algorithm: 'HS256', expiresIn: '1d' }
            );

            return { token, user };
        },

        login: async (_, { email, password }, { models }) => {
            if (!models || !models.User) {
                throw new Error('User model is not available');
            }

            // Find user
            const user = await models.User.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Validate password
            const isValid = await user.comparePassword(password);
            if (!isValid) {
                throw new Error('Invalid credentials');
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { algorithm: 'HS256', expiresIn: '1d' }
            );

            return { token, user };
        },
    },
};

module.exports = authResolvers;











































/** 
const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authResolvers = {
    Mutation: {
        register: async (_, { input }, { models }) => {
            if (!models || !models.User) {
                throw new Error('User model is not available');
            }

            const { username, email, password, role } = input;

            // Check if user exists
            const existingUser = await models.User.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = new models.User({
                username,
                email,
                password: hashedPassword,
                role
            });
            await user.save();

            // Generate JWT
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { algorithm: 'HS256', expiresIn: '1d' }
            );

            return { token, user };
        },

        login: async (_, { email, password }, { models }) => {
            if (!models || !models.User) {
                throw new Error('User model is not available');
            }

            // Find user
            const user = await models.User.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Validate password
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new Error('Invalid credentials');
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { algorithm: 'HS256', expiresIn: '1d' }
            );

            return { token, user };
        },
    },
};

module.exports = authResolvers;
*/