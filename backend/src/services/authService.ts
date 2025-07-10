import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export class AuthService {
    private userModel: typeof User;

    constructor() {
        this.userModel = User;
    }

    async registerUser(email: string, password: string) {
        const hashedPassword = await this.hashPassword(password);
        const newUser = new this.userModel({ email, password: hashedPassword });
        return newUser.save();
    }

    async loginUser(email: string, password: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await this.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        return this.generateToken(Object(user._id).toString());
    }

    private async hashPassword(password: string) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    private async comparePassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    }

    private generateToken(userId: string) {
        const secretKey = process.env.JWT_SECRET || 'your_secret_key';
        return jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
    }
}