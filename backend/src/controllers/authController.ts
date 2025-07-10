import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;
            const newUser = await this.authService.registerUser(userData.email, userData.password);
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            res.status(400).json({ message: error || 'Registration failed' });
        }
    }

    public async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const token = await this.authService.loginUser(email, password);
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            res.status(401).json({ message: error || 'Login failed' });
        }
    }
}