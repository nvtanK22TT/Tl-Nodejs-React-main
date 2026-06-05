const mongoose = require('mongoose');


const connectDatabase = async () => {
    const primaryUri = process.env.DB_URI;
    const fallbackUri = process.env.DB_LOCAL_URI;

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    };

    if (primaryUri) {
        try {
            const con = await mongoose.connect(primaryUri, options);
            console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
            return;
        } catch (err) {
            console.error(`Primary DB connection failed: ${err.message}`);
        }
    }

    if (fallbackUri) {
        try {
            const con = await mongoose.connect(fallbackUri, options);
            console.log(`MongoDB connected to fallback DB HOST: ${con.connection.host}`);
            return;
        } catch (err) {
            console.error(`Fallback DB connection failed: ${err.message}`);
            throw err;
        }
    }

    throw new Error('No database URI configured. Set DB_URI or DB_LOCAL_URI in config.');
}

module.exports = connectDatabase