const app = require('./app')
const connectDatabase = require('./config/database')
const cloudinary = require('cloudinary')

// Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1)
})

// Setting up config file
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

let server;

const startServer = async () => {
    try {
        // Connect to database first
        await connectDatabase();

        // Setting up cloudinary configuration
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })

        const PORT = process.env.PORT || 4000
        server = app.listen(PORT, () => {
            console.log(`Server started on PORT: ${PORT} in ${process.env.NODE_ENV} mode.`)
        })

        // Handle Unhandled Promise rejections
        process.on('unhandledRejection', err => {
            console.log(`ERROR: ${err.stack}`);
            console.log('Shutting down the server due to Unhandled Promise rejection');
            if (server) {
                server.close(() => process.exit(1));
            } else {
                process.exit(1);
            }
        })
    } catch (err) {
        console.error('Failed to start server:', err.message || err);
        process.exit(1);
    }
}

startServer();