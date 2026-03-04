import app from './app';
import connectDB from './config/db';
import { config } from './config/env';

// Connect to database
connectDB();

const PORT = config.port;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
    console.log(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});
