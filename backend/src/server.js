const mongoose = require('mongoose');
const setupTempDirectory = require('./utils/setupTemp');
const dockerRunner = require('./utils/dockerRunner');
const app = require('./app');
require('dotenv').config();

// Initialize Docker and temp directory
async function initialize() {
    try {
        if (process.env.NODE_ENV !== 'production') {
            await setupTempDirectory();
            await dockerRunner.initialize();
            console.log('Docker and temp directory initialization completed');
        } else {
            console.log('Skipping Docker initialization in production environment');
        }
    } catch (error) {
        console.error('Initialization error:', error);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/algoj', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    initialize();
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});

// Cleanup on server shutdown
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Cleaning up...');
    await dockerRunner.stopContainer();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT. Cleaning up...');
    await dockerRunner.stopContainer();
    process.exit(0);
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Frontend URL:', process.env.FRONTEND_URL);
    console.log('Registered routes:');
    console.log('- /health');
    console.log('- /api/auth/*');
    console.log('- /api/problems/*');
    console.log('- /api/submissions/*');
    console.log('- /api/code/*');
}); 