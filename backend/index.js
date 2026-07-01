import app from './app.js';
import env from './config/env.js';
import connectDB from './config/db.js';

app.listen(env.PORT, () => {
    connectDB();
    console.log(`Server is running on port ${env.PORT}`);
});


