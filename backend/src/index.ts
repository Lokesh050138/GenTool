import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import winston from 'winston';
import routes from './routes/index.js';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000');

// Debugging logs for deployment
console.log(`Starting server with PORT: ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Frontend URL: ${process.env.FRONTEND_BASE_URL}`);

// CORS configuration to allow frontend requests
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_BASE_URL,
    })
);

// JSON and URL-encoded data parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management with secure settings for production
app.use(
    session({
        secret: process.env.COOKIE_SECRET || 'defaultSecret',
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Secure cookie only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Adjust for cross-site cookies in production
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiry
        },
        resave: false,
        saveUninitialized: false,
    })
);

// Initialize Passport for Google OAuth
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: '/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
});

// Logger setup using Winston
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' }),
    ],
});

// Log incoming requests
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Received a ${req.method} request for ${req.url}`);
    next();
});

// Health check route for Render's health monitoring
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Attach routes from routes folder
app.use(routes);

// Google OAuth routes
app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
    })
);

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: true }),
    (req, res) => {
        res.redirect(process.env.FRONTEND_BASE_URL || '/');
    }
);

// User logout route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.status(200).json({ message: 'Logged out successfully!' });
    });
});

// Route to get logged-in user's profile
app.get('/user', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    res.json(req.user);
});

// Serve static files for production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

// Start the server, binding to 0.0.0.0 for Render
const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server listening at http://localhost:${PORT}`);
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    res.status(err.status || 500).json({ error: err.message });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    server.close(() => process.exit(1));
});
