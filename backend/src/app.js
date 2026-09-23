import express from 'express';
import cors from 'cors';
import session from 'express-session';

import authRoutes
    from './routes/auth.routes.js';

import accountRoutes
    from './routes/account.routes.js';

import {
    errorMiddleware
} from './middleware/error.middleware.js';


const app =
    express();


/*
 * CORS
 *
 * credentials: true is required because
 * Salesforce tokens are stored in the
 * server-side session and the browser
 * sends the session cookie.
 */
app.use(
    cors({

        origin:
            'http://localhost:5173',

        credentials:
            true
    })
);


/*
 * JSON body parser.
 */
app.use(
    express.json()
);


/*
 * Session.
 */
app.use(
    session({

        secret:
            process.env.SESSION_SECRET,

        resave:
            false,

        saveUninitialized:
            false,

        cookie: {

            httpOnly:
                true,

            sameSite:
                'lax',

            secure:
                false,

            maxAge:
                1000 * 60 * 60 * 8
        }

    })
);


/*
 * Health check.
 */
app.get(
    '/api/health',
    (req, res) => {

        res.json({

            success: true,

            message:
                'Backend is running'
        });
    }
);


/*
 * Authentication routes.
 */
app.use(
    '/api/auth',
    authRoutes
);


/*
 * Account routes.
 */
app.use(
    '/api/accounts',
    accountRoutes
);


/*
 * 404.
 */
app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                'Route not found'
        });
    }
);


/*
 * Global error handler.
 */
app.use(
    errorMiddleware
);


export default app;