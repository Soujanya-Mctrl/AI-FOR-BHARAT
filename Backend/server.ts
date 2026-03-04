// Entry point: connects DB, starts server, registers cron jobs
import app from './src/app';
import { connectDB } from './src/config/db';
import './src/jobs'; // Registers all cron jobs on import

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('UNHANDLED REJECTION:', err.message);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    console.error('UNCAUGHT EXCEPTION:', err.message);
    process.exit(1);
});

startServer();
